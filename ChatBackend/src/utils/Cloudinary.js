const cloudinary = require('cloudinary').v2;

const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * @uploadCloudinary 
 */

const uploadOnCloudinary = async (localFilePath) =>{
     try{
       if(!localFilePath) return null;

       // upload on cloudinary 
       const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto"
       });

       // after uploading file delete local temporary file 
       fs.unlinkSync(localFilePath);
       return response;

     }
     catch(err){
      // if upload file remove local file
      fs.unlinkSync(localFilePath);
      return null;
     }
}

module.exports = uploadOnCloudinary