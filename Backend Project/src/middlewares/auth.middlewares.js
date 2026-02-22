import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

//if res/req/next any of them is not used then we can replace that with undersore
export const verifyJWT = asynchandler(async (req,_,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new Apierror(401,"Unauthorized request");
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
     
        if(!user){
            throw new Apierror(401,"INAVLID ACCESS TOKEN");
        }

        req.user = user;
        next()
    }
    catch(error){
        throw new Apierror(401,error?.message || "Invalid Access Token")
    }
    


})