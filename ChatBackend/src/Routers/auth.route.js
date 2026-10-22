const express = require("express");
const authRouter = express.Router();
const authController = require('../Controllers/auth.controller')
const authMiddleware = require('../middleware/authUser')


authRouter.post("/register",authController.registerUserController);
authRouter.post("/login",authController.getLoginUserController);
authRouter.post("/logout",authController.logoutController);
authRouter.get("/get-me",authMiddleware.authUser,authController.getmeController)


module.exports = authRouter;  