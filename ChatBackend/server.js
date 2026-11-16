require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectionToMongoDB = require("./src/config/database");
const messageModel = require("./src/Models/message.model");

// create HTTP server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:82",
      "https://chat-application-8lccbmh4i-akash-47e7.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.set("io",io);
const onlineUsers = new Map();

/**
 * @description socket connection 
 */

io.on("connection", (socket) => {
 
   console.log("Socket connected:", socket.id);
  // user online 
  socket.on("userOnline",(userId)=>{
     console.log("USER ONLINE EVENT:", userId);
    onlineUsers.set(userId,socket.id);
    // console.log("Online user:", userId);

    console.log(
      "CURRENT ONLINE USERS:",
      Array.from(onlineUsers.keys())
    );
    // clients ko updated online user send karo
    io.emit("onlineUsers",Array.from(onlineUsers.keys()))

    socket.on("markAsSeen",async ({conversationId,userId})=>{
     try{
        await messageModel.updateMany(
          {conversationId: conversationId,sender:{ $ne:userId},status:{$ne:"seen"}},
          {$set:{status:"seen"}}
        );

        // notify sender message has been seen 
        io.to(conversationId).in(conversationId).emit("messageSeen",{conversationId});
     }catch(err){
       console.log("Error updating message status:",err);
     }
});

  });


/**
 * @description this is conversation room 
 */
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    // console.log(`User joined conversation: ${conversationId}`);
  });


/**
 * @description sending new message 
 */
socket.on("sendMessage", (data) => {
  // console.log("Message received:", data);
  socket.to(data.conversationId).emit( "newMessage", data);
});

// disconnecting users

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
    for(const [userId,socketId] of onlineUsers.entries()){
        if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    // Updated online users
    io.emit("onlineUsers",Array.from(onlineUsers.keys()));
    // console.log("User disconnected:",socket.id);
  });

});

/**
 *@seenMessage 
 */

/**
 * @error404
 */

app.use('/api',(req,res)=>{
   res.status(404).json({
    success: false,
    message:"API route not found",
   })
});

/**
 *@description mongoDB connection 
 */
connectionToMongoDB();

/**
 * @description  server connection 
 */
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
