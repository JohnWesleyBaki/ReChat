const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const userRoutes = require("./routes/userRoutes");
const db = require("./db/connection.js");

dotenv.config({ path: "./config.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Client origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,

  },
});

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/users", userRoutes);

const chatRoutes = require("./routes/chatRoutes");

app.use("/chats", chatRoutes);


// JWT authentication middleware for Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.user = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

io.on('connection', async (socket) => {
  console.log('New client connected:', socket.user.email);

  try {
    // Send chat history when a user connects
    const chatsCollection = db.collection('chats');
    const userChats = await chatsCollection.find({ participants: new ObjectId(socket.user.id) }).toArray();

    if (userChats) {
      socket.emit('chatHistory', userChats);
    }

    // Handle chat messages
    socket.on('chatMessage', async (msg) => {
      const { chatId, message } = msg;
      const messageData = {
        sender: socket.user.email,
        message: message,
        timestamp: new Date(),
      };

      // Save the message to the chat's history in the chats collection
      await chatsCollection.updateOne(
        { _id: new ObjectId(chatId) },
        { $push: { messages: messageData } }
      );

      // Emit message to all connected clients
      io.emit('chatMessage', messageData);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.user.email);
    });
  } catch (error) {
    console.error('Error handling connection:', error);
  }
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
