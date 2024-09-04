import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

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

export default registerUser