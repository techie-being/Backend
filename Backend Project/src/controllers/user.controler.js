import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js"; //imported here to standardized error format
import jwt from "jsonwebtoken";
import { json } from "express";
import mongoose from "mongoose";

const generateAccessandRefreshToken = async (userid) => {
  // console.log("SECRET CHECK:", process.env.ACCESS_TOKEN_SECRET);
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.error("ACTUAL ERROR:", error);
    throw new Apierror(500, "something went wrong while generating tokens");
  }
};

const registerUser = asynchandler(async (req, res) => {
  //here data is recived from user

  // req.body gives all data access
  const { username, email, fullname, password } = req.body;

  //data validation

  //some is a method that has callback which call amethod for eaCH ELEMENT until arrray end or it returns a boolean value
  if (
    [username, password, email, fullname].some((field) => field?.trim() === "")
  ) {
    throw new Apierror(400, "All Inputs field are necessary");
  }

  //check user exist or not user from models

  /*findOne returns the firat match variable
    $or acts as a operator compare all values inside it */

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new Apierror(409, "This username or email already existed");
  }

  /*console.log("files stored in multer",req.files)*/

  //req.files are given by multer to access files when its provided by user we are getting access due to multer middleware
  const avatarLocalPath = req.files?.avatar[0]?.path;

  /*console.log("avatarpath",avatarLocalPath)*/

  /*  const localcoverImagePath = req.files?.coverImage[0]?.path;
    because it is undefined whether user passed a coverimage or not we are not sure  */

  let localcoverImagePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    localcoverImagePath = req.files.coverImage[0].path;
  }

  /*console.log("coverimagepath",localcoverImagePath)*/

  if (!avatarLocalPath) {
    throw new Apierror(400, "Avatar not found");
  }

  //avatar and coverImage upload on cloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);

  /*console.log("avatar",avatar)*/

  const coverImage = await uploadCloudinary(localcoverImagePath);

  /*console.log("coverimage:",coverImage)*/

  //check avatar and coverImage uploaded o rnot
  if (!avatar) {
    throw new Apierror(400, "Avatar is not loaded");
  }

  //create a object to store these data in database

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
    coverImage: coverImage?.url || "",
  });

  //check user is created by using findbyid method ; but select method is used to avoid password and revresh token in response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // console.log("createduser:",createdUser)

  if (!createdUser) {
    throw new Apierror(500, "something went wrong while registering new user");
  }

  //return response in a standard format
  return res
    .status(201)
    .json(new Apiresponse(201, createdUser, "User registered successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  //it requires user credentials such as username/email(both are unique for an individual) ,password
  //validate data(empty)

  //check if user exist then match it with user stored data at time of registration
  //if matches then generate a access token through jwt for user allow him to web
  //then provide a refresh token for user so everytime he does not need to pass username and
  // password.
  //send cookies
  //response loggedin successfully
  //* additional upadate the state in front end that user is logged in so change interface and
  //provide functionality to user.

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new Apierror(400, "username or password is required");
  }

  // if(
  //     [username,password,email].some((field)=>{
  //         field?.trim() == ""
  //     }
  // )
  //  ){
  //     throw new Apierror(400,"all")
  // }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new Apierror(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new Apierror(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Apiresponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined, //refreshToken deleted from database
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new Apierror(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new Apierror(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new Apierror(401, "Refresh token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessandRefreshToken(user._id);
    return res
      .status(200)
      .coookie("accessToken", accessToken, options)
      .coookie("refreshToken", newRefreshToken, options)
      .json(
        new Apiresponse(
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "refresh token  generated successfully",
        ),
      );
  } 
  catch (error) {
    throw new Apierror(401,"invalid refresh token")
  }
});

const changePassword = asynchandler(async (req,res)=>{
  const {oldPassword,newPassword} = req.body

  //we get this user access from verifyjwt in authmiddleware passed in secured routes
  const user = await User.findById(req.user?._id)   //may throw an error due to _id so be careful

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new Apierror(400,"Invalid password")
  }

  user.password  = newPassword
  await user.save({validateBeforeSave:false})
  return res
  .status(200)
  .json(new Apiresponse(200,{},"Password changed Successfully"))

})

//passed jwt middleware in routes so we have user access
const currentUser = asynchandler(async (req,res)=>{
  return res
  .status(200)
  .json(200,req.user,"current user fetched successfully")

})

const updateAccountDetails = asynchandler((req,res)=>{
  const {fullname, email} = req.body

  if(!fullname || !email){
    throw new Apierror(400,"Empty fields")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
  {
    $set:{
      fullname,
      email
    }
  },
  {new:true}
).select("-password")

return res
.status(200)
.json(200, new Apiresponse(200,"Account details upadated Successfully"))
})

const avatarUpdate = asynchandler(async (req,res)=>{
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
    throw new Apierror(400,"Cover file is missing")
  }

  const avatar = uploadCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new Apierror(400,"error while uploading avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new Apiresponse(200,"Avatar uploaded successfully")
  )
})

const coverImageUpdate = asynchandler(async (req,res)=>{
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new Apierror(400,"coverimage file is missing")
  }

  const coverImage = uploadCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new Apierror(400,"error while uploading coverImage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new Apiresponse(200,"covrer image uploaded successfully")
  )
})

const channelProfileDetails = asynchandler(async (req,res)=>{
  const {username} = req.params
  
  if(!username?.trim()){
    throw new Apierror(400,"Username is missing")
  }

  const channel = await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      }
    },
    {
      $lookup:{
        from:"subscription",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
    },
    {
      $lookup:{
        from:"subscription",
        localField:"_id",
        foreignField:"subscribers",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        subscribersCount:{
          $size:"$subscribers"
        },
        subscribedToChannelCount:{
          $size:"$subscribedTo"
        },
        isSubscribed :{
          $cond:{
            if:{$in:[req.user?._id,"$subscribers.subscriber"]},
            then:true,
            else:false,
          }
        }
      }
    },
    {
      $project:{
        fullname:1,
        username:1,
        subscribersCount:1,
        subscribedToChannelCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1

      }

    }
  ])
  
  if(!channel?.length){
    throw new Apierror(404,"Channel does not exist")
  }

  return res
  .status(200)
  .json(
    new Apiresponse(200,"Channel profile fetched succcessfully")
  )
})

const userWatchHistory = asynchandler(async (req,res)=>{
  const user = User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"Video",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"User",
              localField:"owner",
              foreignField:"_id",
              as:"owner"
            },
            pipeline:[
              {
                $project:{
                  fullname:1,
                  username:1,
                  avatar:1,
                }
              }
            ]
          },

          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
    }
  ])

  return res
  .status(200)
  .json(
    new Apiresponse(200,
      user[0].watchHistory,
      "watchHistory fetched successfully"
    )
  )
})



export { 
    registerUser, 
    loginUser, 
    logoutUser,
    refreshAccessToken, 
    changePassword,
    currentUser,
    updateAccountDetails,
    avatarUpdate,
    coverImageUpdate,
    channelProfileDetails,
    userWatchHistory,
};
