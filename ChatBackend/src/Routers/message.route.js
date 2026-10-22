const express = require('express')

// import controller 
const messageRouter = express.Router();



const authMiddleware = require('../middleware/authUser')

const messageController = require('../Controllers/message.controller')

messageRouter.post('/messages',authMiddleware.authUser,messageController.sendMessage)
messageRouter.get('/messages/:conversationId',authMiddleware.authUser,messageController.getMessages)
messageRouter.delete('/messages/:id',authMiddleware.authUser,messageController.deleteMessage)
messageRouter.post('/messages/forward',authMiddleware.authUser,messageController.forwardMessageController)
module.exports = messageRouter   