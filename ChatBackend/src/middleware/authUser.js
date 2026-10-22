const jwt = require('jsonwebtoken')

// import blocklistModel 

const blackListModel = require('../Models/BlackList')

/**
 * @description authUser middleware , user check karega whether it is authenticated 
 *  will use it in get-me router 
 */

async function authUser(req,res,next){
      const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");
   
       // check token hai ki nhi   

       if(!token){
         return res.status(400).json({
            message:"token is not provided"
         }) 
       }
      
       // blacklisted hai ya  nhi 

       const isBlackListed = await blackListModel.findOne({token})
      
       if(isBlackListed){
        return res.status(400).json({
            message:"token is blackListed"
        })
       }

       // after getting token have to verify it 
         
       try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
         next();
       }
       catch(err){
         return res.status(400).json({
            message:"Invalid Token !"
         })
       }
}
   
module.exports = {authUser} // esko aise { } kyon kiya ?