import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

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

    try {
        const {email,password}=req.body
        if(!email){
            return res.status(400).json(new ApiResponse(400,{},"email is required"));
        }
        const user=await User.findOne({
            // $or: [{username},{email}]
            email
        })
        if(!user){
            return res.status(404).json(new ApiResponse(404,{},"user does not exist"));
        }
        const isPasswordValid=await user.isPasswordCorrect(password)
    
        if(!isPasswordValid){
            return res.status(404).json(new ApiResponse(404,{},"Password incorrect"));
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
    } catch (error) {
        res.status(401).json({msg:"some other error"});
    }


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

const refreshAccessTocken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new apiError(401,"Unauthorised request")
    }
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id)
    
        if(!user){
            throw new apiError(401,"Invalid RefreshToken")
        }
    
        if(incomingRefreshToken!==user.refreshToken){
            throw new apiError(401,"Refresh Token is expired")
        }
    
        const options= { //can not modify by user , only modified by user
            httpOnly: true,
            secure: true
        }
        const {accessToken,newRefreshToken}=await generateRefreshAndAccessTocken(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new apiError(401,"Invalid refreshToken")
    }

})

export {registerUser,loginUser,logoutUser,refreshAccessTocken}