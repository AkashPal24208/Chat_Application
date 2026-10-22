const express = require('express')

const userRouter = express.Router();

const authMiddleware = require('../middleware/authUser')
  
const userController = require('../Controllers/user.controller')

userRouter.get('/users',authMiddleware.authUser,userController.UsersController)

userRouter.get('/users/:id',authMiddleware.authUser,userController.UsersControllerId)

userRouter.post('/add-user/',authMiddleware.authUser,userController.addContactController)

userRouter.get('/contacts',authMiddleware.authUser,userController.getContacts)
userRouter.delete('/contacts/delete/:contactId',authMiddleware.authUser,userController.deleteContactController)

module.exports = userRouter