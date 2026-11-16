const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileRouter = require("./Routers/file.route")
const app = express();
/**
 * @description setUp cors 
 */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:82",
    "https://chat-application-git-main-akash-47e7.vercel.app"
  ],
  credentials: true
}));
/**
 * @description parsing json 
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * @description set cookie parser 
 */
app.use(cookieParser());

// test route for verification purpose 

// app.get("/", (req, res) => {
//   res.send("Backend is running...");
// });


/**
 * @route /api/auth --- it is used to check whether user is auhthenticated or not 
 * @description authRouter connection 
 */

const authRouter = require('./Routers/auth.route');
app.use('/api/auth',authRouter);

/**   
 * @description /api/user -- frontend ko pta chalega ki user route alag hai.
 */

const userRouter = require('./Routers/user.route');
app.use('/api',userRouter);

/**
 * @description /api/message -- message router ke liye 
 */

const messageRouter = require('./Routers/message.route');
app.use('/api',messageRouter);

/**
 * @description /api/conversations -- conversations router ke liye
 */

const conversationRouter = require('./Routers/conversation.route');

app.use('/api',conversationRouter);

/**
 * @file upload 
 */
app.use("/api/files",fileRouter)

/**
 * uploading file in message format 
 */
 const path = require("path");

 app.use("/uploads",express.static(path.join(__dirname,"../uploads")))
module.exports = app;


