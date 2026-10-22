const bcrypt = require("bcrypt");
const mongoose = require('mongoose')
const UserDataModel = require("./Models/UserData");
require("dotenv").config({ path: "../.env" });
async function generateUsers() {
    try{

      await mongoose.connect(process.env.MONGO_URI);
       const users = [];

       for(let i= 1;i<100;i++){
        const hash = await bcrypt.hash("Test@123",10);

        users.push({
            username:`user${String(i).padStart(3,"0")}`,
            email:`user${String(i).padStart(3,"0")}@example.com`,
            password:hash
        });
       }
       await UserDataModel.insertMany(users);
       console.log("100 users inserted successfully");
       await mongoose.disconnect();
    }
    catch(err){
   console.log("err while inserting 100 users:",err)
    }
       
}

generateUsers();