import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//configuration code to connect project with cloudINARY SERVICES
cloudinary.config({
  cloud_name: "process.env.CLOUDINARY_CLOUD_NAME",
  api_key: "process.env.CLOUDINARY_API_KEY",
  api_secret: "process.env.CLOUDINARY_API_SECRET",
});

//Method to upload file in cloudinary
const uoloadCloudinary = async (localfilePath) => {
  
  try {
    //file uploading
    if(!localfilePath) return null;
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    // file uploaded successfully
    console.log("file is successfully uploaded to cloudinary", response.url);
    return response;
  } 
  
  catch (error) {
    //fs is filesystem in node js that is used to remove temporarily stored file on server because file 
    //uploading operatiom got failed
    fs.unlinkSync(localfilePath)

  }
};

export {uoloadCloudinary}