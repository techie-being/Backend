import {asynchandler} from "../utils/asynchandler.js"
import {Apierror} from "../utils/Apierror.js"
import {Apiresponse} from "../utils/Apiresponse.js"
import {uploadCloudinary } from "../utils/cloudinary.js"
import {User} from "../models/user.models.js"       //imported here to standardized error format


const registerUser = asynchandler(async (req,res)=>{
    //here data is recived from user

    // req.body gives all data access
    const {username,email,fullname,password} = req.body
    

    //data validation

    //some is a method that has callback which call amethod for eaCH ELEMENT until arrray end or it returns a boolean value
    if(
        [username,password,email,fullname].some((field)=>
        field?.trim() === "")
    ){
        throw new Apierror(400,"All Inputs field are necessary")
    }
     
    //check user exist or not user from models

    /*findOne returns the firat match variable
    $or acts as a operator compare all values inside it */

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new Apierror(409,"This username or email already existed")
    }
    
    /*console.log("files stored in multer",req.files)*/
 
    //req.files are given by multer to access files when its provided by user we are getting access due to multer middleware
    const avatarLocalPath = req.files?.avatar[0]?.path;

    /*console.log("avatarpath",avatarLocalPath)*/

    /*  const localcoverImagePath = req.files?.coverImage[0]?.path;
    because it is undefined whether user passed a coverimage or not we are not sure  */

    let localcoverImagePath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        localcoverImagePath = req.files.coverImage[0].path
    }


    /*console.log("coverimagepath",localcoverImagePath)*/
    

    if(!avatarLocalPath){
        throw new Apierror(400,"Avatar not found");
    }

    //avatar and coverImage upload on cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath)

    /*console.log("avatar",avatar)*/

    const coverImage = await uploadCloudinary(localcoverImagePath)

    /*console.log("coverimage:",coverImage)*/
    
    //check avatar and coverImage uploaded o rnot
    if(!avatar){
        throw new Apierror(400,"Avatar is not loaded");
    }

    //create a object to store these data in database

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        email,
        password,
        username:username.toLowerCase(),
        coverImage: coverImage?.url || ""
    })

    //check user is created by using findbyid method ; but select method is used to avoid password and revresh token in response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // console.log("createduser:",createdUser)

    if(!createdUser){
        throw new Apierror(500,"something went wrong while registering new user")
    }
    
    //return response in a standard format
    return res.status(201).json(
    new Apiresponse(201, createdUser, "User registered successfully")
)
    

})
export {registerUser}