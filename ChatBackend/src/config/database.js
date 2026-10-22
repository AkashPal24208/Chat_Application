const mongoose = require('mongoose')

async function connectionToMongoDB(){
     try{
       await  mongoose.connect(process.env.MONGO_URI)
       console.log("connected to Database..")
     }catch(err){
        console.log("error while connecting to mongodb",err);
     }
}

module.exports = connectionToMongoDB