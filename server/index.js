const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config({ path: "./config.env" });

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization","Content-Type"],
    credentials: true,
  },
});

// Import routes and middleware
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { socketAuth,authenticate } = require("./middleware/authmiddleware");
const setupSocketHandlers = require("./socket/sockethandler");

// Middleware
app.use(cors());
app.use(express.json());

// Routes


app.use("/", userRoutes);
app.use("/chats", authenticate,chatRoutes);


// Socket.io authentication
io.use(socketAuth);

// Setup socket handlers
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
