const express = require('express')

const conversationRouter = express.Router();

const authMiddleware = require('../middleware/authUser')

const converationController = require('../Controllers/conversation.controller')

conversationRouter.post('/conversations',authMiddleware.authUser,converationController.createConversations)
/**
 * @description this router is used to get all conversation of loggedIn user 
 */
conversationRouter.get('/conversations',authMiddleware.authUser,converationController.getConversations)

conversationRouter.get('/conversations/:conversationId',authMiddleware.authUser,converationController.getConversationById);



module.exports = conversationRouter;
