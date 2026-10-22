const mongoose = require("mongoose");

// make userdata schema  .....
const UserDataSchema = new mongoose.Schema({
     username:{
        type:String,
        unique:[true,"username already taken"],
        required:true
     },
     email:{
        type:String,
        unique:[true,"Account already exist with this email"],
        required:true
     },
     contacts: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserData",
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }
],
     password:{
        type:String,
        required:true
     },
     isOnline:{
      type:Boolean,
      default:false
     },
     lastSeen:{
      type:Date
     }
}) ;

const UserDataModel = mongoose.model("UserData",UserDataSchema)

module.exports = UserDataModel