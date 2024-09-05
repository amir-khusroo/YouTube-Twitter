import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const generateRefreshAndAccessTocken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError(500,"something went to wrong while genereting token")
    }
}


const registerUser=asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     message: "ok"
    // })

    /*
    get user detail from frontent
    validation
    check if user already exist- email, usename
    check for image
    upload avatar in cloudinary
    create user object-create entry in db
    remove passport and refresh token field from response
    check for user creation
    return response
     */
    const {fullname,username, email,password}=req.body
    // console.log("email :", email)
    if([fullname,username, email,password].some((field)=>
        field?.trim()===""
    )){
        throw new apiError(400,"All field are required")
    }

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(409,"username or password alraedy exisxt")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path
    // const coverImageLocalPath=req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.field && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files?.coverImage[0]?.path
    }

    if(!avatarLocalPath){
        throw new apiError(400,"avatar is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    
    if(!avatar){
        throw new apiError(400,"")
    }
    
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new apiError(500,"something went to wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Register successfully")
    )
})

const loginUser=asyncHandler(async (req,res)=>{
    // get data from req.body
    //username or email
    //find the user
    //password check
    //generate access token and refresh token
    //send cookies to user

    const {username,email,password}=req.body
    if(!username && !email){
        throw new apiError(400,"usename or email required")
    }
    const user=await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new apiError(404,"user does not exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401,"Password incorrect")
    }

    const {accessToken,refreshToken}=await generateRefreshAndAccessTocken(user._id)

    const logedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options= { //can not modify by user , only modified by user
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: logedInUser, accessToken,refreshToken
            },
            "user loged in successfully"
        )
    )


})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.body._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new: true // when send the response to the user then user get updated value
        }
    )
    const options= { //can not modify by user , only modified by user
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User loged Out"))


})

export {registerUser,loginUser,logoutUser}