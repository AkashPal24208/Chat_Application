const uploadOnCloudinary = require('../utils/Cloudinary')
const fs  = require('fs')
const messageModel = require('../Models/message.model');

const uploadFile = async (req,res)=>{
    try{
      // multer received file or not 
      if(!req.file){
         return res.status(400).json({
            message:"No file uploaded"
         });
      }

      // taking local path from multer 
      const localFilePath = req.file.path;

      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      if(!cloudinaryResponse){
           return res.status(500).json({
            message:"Cloudinary upload failed"
           });
      }
    

      return res.status(200).json({
         message:"File uploaded successfully to cloudinary :",
         file:{
            fileUrl:cloudinaryResponse.secure_url,
            fileType:req.file.mimetype
         }
      })
    }
    catch(err){
      console.log("File upload error:",err);

      if(req.file && req.file.path){
         try{
        fs.unlinkSync(req.file.path);
         }catch(err){
           
         }
      }

      return res.status(500).json({
         message:"File upload failed"
      });
    }
}

module.exports = {uploadFile};
