const express = require("express");
//const {chats}=require("./data");
const dotenv = require("dotenv");
const connectDB = require("./Config/Db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app=express()
dotenv.config();
connectDB();

app.use(express.json()); // to accept json data

app.get("/", (req,res)=>{
    res.send("API is running");
})

//api end point to get all the chats from dummy chat file
//app.get("/api/chats",(req,res)=>{
  //  res.send(chats);
//})
/*
//api endpoint for each id
app.get("/api/chats/:id",(req,res)=>{

    const singlechat = chats.find(c=>c._id === req.params.id);
    res.send(singlechat);
})
*/
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
});

socket.on("typing", (room) => socket.in(room).emit("typing"));
socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

socket.on("new message", (newMessageRecieved) => {
  var chat = newMessageRecieved.chat;

  if (!chat.users) return console.log("chat.users not defined");

  chat.users.forEach((user) => {
    if (user._id == newMessageRecieved.sender._id) return;

    socket.in(user._id).emit("message recieved", newMessageRecieved);
  });
});
});