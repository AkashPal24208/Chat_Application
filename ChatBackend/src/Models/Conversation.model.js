const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    participants:[
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",  
      required: true
     }  
    ],

    // last message reference for quick review 
    lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "message"
  }

},{timestamps:true});   

const conversationModel = mongoose.model("Conversation",conversationSchema)

module.exports = conversationModel;