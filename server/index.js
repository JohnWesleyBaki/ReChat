const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongooseConnection = require("./db/connection.js");

// Import configuration
const config = require('./config/config.js')

// Get configuration values
const corsOptions = config.cors

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: 
    corsOptions,
  
});

// Import routes and middleware
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { socketAuth,authenticate } = require("./middleware/authmiddleware");
const setupSocketHandlers = require("./socket/socketHandler");

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes


app.use("/", userRoutes);
app.use("/chats", authenticate,chatRoutes);


// Socket.io authentication
io.use(socketAuth);

// Setup socket handlers
setupSocketHandlers(io);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});
