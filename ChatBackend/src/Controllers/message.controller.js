const messageModel = require('../Models/message.model')
const conversationModel = require('../Models/Conversation.model')

/**
 * 
 * @description send new message 
 */
async function sendMessage(req,res){
    try{
        console.log("REQ BODY:", req.body);
    const { conversationId, text , attachments} = req.body;
    const senderId = req.user.id; // JWT se mila id
      console.log("conversationId:", conversationId);
       console.log("text:", text);
    console.log("attachments:", attachments);
    // validation text message 
  if ((!text || text.trim() === "") && !attachments?.length) {
    return res.status(400).json({
        message: "message cannot be empty.."
    });
}

    //validating conversionId 
    const converation = await conversationModel.findById(conversationId)

    if(!converation){
      return res.status(404).json({
        message:"Conversation not found.."
      });
    }

    // create new message
    const newMessage = new messageModel({
      conversationId,
      sender: senderId,
      text:text || "",
      attachments
    });


        await newMessage.save();

    // update lastMessage in conversation for quick preview
    await conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage
    });
    }
    catch(err){
     console.error(err);
    return res.status(500).json({ message: "Error sending message" });
    }
}

/**
 * 
 * @description get all message of conversation 
 */

async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;

    const messages = await messageModel
      .find({ conversationId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error fetching messages"
    });
  }
}

/**
 * 
 * @description delete controller 
 */

// Delete a message by ID
async function deleteMessage(req, res) {
  try {
    const io = req.app.get("io");
    const { id } = req.params; // message id from URL
    const loggedInUserId = req.user.id; // JWT se mila id

    // find message
    const message = await messageModel.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete their message (optional rule)
    if (message.sender.toString() !== loggedInUserId) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    // delete message
    await messageModel.findByIdAndDelete(id);

    // optional: update conversation lastMessage if deleted message was last
    const conversation = await conversationModel.findById(message.conversationId);

    if (conversation && conversation.lastMessage?.toString() === id) {
      // find new last message
      const latestMessage = await messageModel.findOne({ conversationId: conversation._id })
        .sort({ createdAt: -1 });
      conversation.lastMessage = latestMessage ? latestMessage._id : null;
      await conversation.save();
    }


    io.to(message.conversationId.toString()).emit("messageDeleted",{
      messageId:id,
      conversationId:message.conversationId.toString(),
       })

    return res.status(200).json({
      message: "Message deleted successfully",
    });

    //  emit messageDelted event 
    

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting message" });
  }
}

/**
 * @forwardMessageController 
 */

async function forwardMessageController(req,res){
  try{
    console.log("from forwardMessageController:");
   const {OriginalMessageId,targetConversationIds} = req.body;
   console.log("id:",OriginalMessageId);
   if(!OriginalMessageId){
    return res.status(400).json({
      message:"Message you are going to forward does not exist:"
    })
   }

   const message = await messageModel.findById(OriginalMessageId);

   if(!message){
     return res.status(404).json({
      message:"message cannot be forwarded as it does not exist in database:"
     })
   }
     
   if(!Array.isArray(targetConversationIds) || targetConversationIds.length === 0){
     return res.status(400).json({
       message:"Conversations are required to send message :"
     })
   }

   const forwardMessage = [];

   const loggedInUserId = req.user.id;
  
    if(targetConversationIds.length > 5){
       return res.status(400).json({
         message:"Message can be forward only to 5 people at a time."
       })
    }
   const OriginalSenderId = message.isForwarded ? message.OriginalSender : message.sender;
   
   const io = req.app.get("io");

   // loop to each target conversation 

   for(const conversationId of targetConversationIds){
      
    // create duplicate message 
    const newForwardMessage = await messageModel.create({
        sender: loggedInUserId,
        conversationId: conversationId,
        text: message.text,
        attachments: message.attachments,
        isForwarded: true,
        OriginalMessageId: message._id,
        OriginalSender: OriginalSenderId
    });
     
    const populateMsg = await newForwardMessage.populate("sender","name avatar");

    // update the lastMessage in Conversational Model 
    await conversationModel.findByIdAndUpdate(conversationId,{
         lastMessage: populateMsg._id,
         updatedAt: new Date()
    });
   
      forwardMessage.push(populateMsg);

    // Emit real time socker event 
    if(io){
      io.to(conversationId).emit("receive_message",populateMsg);
    }
   }
    
   // send success response back to the client 
   return res.status(200).json({
    success: true,
    messages: forwardMessage
   })

  }catch(err){
    console.log("Error in forward Message controller:",err);
    return res.status(500).json({
      message:"Internal server Error"
    });
  }
}

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
  forwardMessageController
};