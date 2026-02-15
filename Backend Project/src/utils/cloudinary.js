import { v2 as cloudinary } from "cloudinary";
import fs from "fs";



//configuration code to connect project with cloudINARY SERVICES
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Method to upload file in cloudinary
const uploadCloudinary = async (localfilePath) => {
  
  try {
    //file uploading
    if(!localfilePath) return null;
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    // file uploaded successfully
    //console.log("file is successfully uploaded to cloudinary", response.url);
    fs.unlinkSync(localfilePath);
    return response;
  } 
  
  catch (error) {
    // THIS LINE IS KEY: It will print the real reason in your terminal
    console.error("CLOUDINARY UPLOAD ERROR:", error.message); 
    
    if (fs.existsSync(localfilePath)) {
        fs.unlinkSync(localfilePath);
    }
    return null;
  }
};

export {uploadCloudinary}