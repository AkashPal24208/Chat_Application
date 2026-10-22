const mongoose  = require('mongoose')

const messageSchema = new mongoose.Schema({

  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",   // jis conversation me ye message belong karta hai
    required: true
  },
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"UserData",  // kis user ne message bheja 
    required:true
  },
  text: {
    type: String,// actual message content 
     default:""
  },
  // optional: file/image support
  attachments:[
    {
     fileUrl:String, // image ,doc,video ka url
     fileType:String  // type:"image","pdf","video"
    }
  ],
  status:{
    type:String,
    enum:["sent","delivered","seen"], // message lifecycle 
    default:"sent"
  },
  // forward message : Data Duplication Approach 
  isForwarded:{
    type:Boolean,
    default:false
  },
  OriginalMessageId:{
     type:mongoose.Schema.Types.ObjectId,
     ref: "message",
     default: null
  },
  OriginalSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"UserData",
    default: null
  }
}, 

{ timestamps: true });

const messageModel = mongoose.model("message",messageSchema)

module.exports = messageModel;

