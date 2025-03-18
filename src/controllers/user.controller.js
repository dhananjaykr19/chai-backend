import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";


const registerUser = asyncHandler( async (req, res) => {
    // step-1. get user details from fronted
    // step-2. validation - not empty
    // step-3. check if user already exists :(username, email)
    // step-4. check for images, check for avatar
    // step-5. upload on cloudinary
    // step-6. create user object - create entry in db
    // step-7. remove password and refresh token field from response
    // step-8. check for user creation
    // step-9. if created then return if not return error

    // data comes from form or json
    const {fullname, email, username, password}= req.body
    console.log("email :", email);
    // console.log("username :", username);
    // console.log("fullname : ", fullname);
    // if(fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }
    if(
        [fullname, email, username, password].some( (field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or : [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // upload cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImagePath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage :coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register Successfully")
    )
})

export { registerUser, }