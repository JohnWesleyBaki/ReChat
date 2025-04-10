const { ObjectId } = require('mongodb');
const db = require('../db/connection.js');

const setupSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.user.id, socket.user.email);

    try {
      // Send chat history when a user connects
      const chatsCollection = db.collection('chats');
      const userChats = await chatsCollection.find({ 
        participants: new ObjectId(socket.user.id) 
      }).toArray();

      if (userChats) {
        socket.emit('chatHistory', userChats);
      }

      // Handle joining a chat room
      socket.on('joinRoom', ({ chatId }) => {
        socket.join(chatId);
        console.log(`User ${socket.user.email} joined room ${chatId}`);
        
        const room = io.sockets.adapter.rooms.get(chatId);
        if (room) {
          console.log(`Users in room ${chatId}:`, Array.from(room).length);
        }
      });

      // Handle leaving a chat room
      socket.on('leaveRoom', ({ chatId }) => {
        socket.leave(chatId);
        console.log(`User ${socket.user.email} left room ${chatId}`);
        
        const room = io.sockets.adapter.rooms.get(chatId);
        if (room) {
          console.log(`Remaining users in room ${chatId}:`, Array.from(room).length);
        }
      });

      // Handle chat messages
      socket.on('chatMessage', async (msg) => {
        const { chatId, message } = msg;
        console.log("Received message from client:", chatId, message);
        
        const room = io.sockets.adapter.rooms.get(chatId);
        if (room) {
          console.log(`Users in room ${chatId} when message sent:`, Array.from(room).length);
        }

        const messageData = {
          sender: socket.user.email,
          senderId: socket.user.id,
          message: message,
          timestamp: new Date(),
        };

        try {
          const result = await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: messageData } }
          );

          if (result.modifiedCount === 1) {
            const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });
            
            if (chat && chat.participants) {
              io.to(chatId).emit('chatMessage', {
                chatId,
                ...messageData
              });
              console.log(`Message delivered to room ${chatId}`);
            } else {
              console.error('Chat not found or no participants');
            }
          } else {
            console.error('Failed to save message to database');
          }
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.user.email);
      });
    } catch (error) {
      console.error('Error handling connection:', error);
    }
  });
};

module.exports = setupSocketHandlers;
