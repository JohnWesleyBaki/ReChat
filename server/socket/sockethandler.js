const { Chat, findByUserId, addMessage } = require('../models/chat');
const User = require('../models/user');

const setupSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.user.id, socket.user.email);
    
    // Update user status to online when they connect
    try {
      await User.updateById(socket.user.id, { status: 'online' });
      // Broadcast to all clients that this user is now online
      socket.user.status = 'online';
      io.emit('userStatusChange', { userId: socket.user.id, status: 'online' });
      console.log(`${socket.user.email} is now ${socket.user.status}`);
    } catch (error) {
      console.error('Error updating user status to online:', error);
    }

    try {
      // Send chat history when a user connects
      const userChats = await findByUserId(socket.user.id)
        .catch(error => {
          console.error('Error fetching chat history:', error);
          socket.emit('error', { message: 'Failed to load chat history' });
          return null;
        });

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
          sender: socket.user.id,
          content: message,
          timestamp: new Date()
        };

        try {
          const updatedChat = await addMessage(chatId, messageData)
            .catch(error => {
              console.error('Error saving message:', error);
              socket.emit('error', { message: 'Failed to save message' });
              return null;
            });
          
          if (updatedChat) {
            io.to(chatId).emit('chatMessage', {
              chatId,
              ...messageData
            });
            console.log(`Message delivered to room ${chatId}`);
          } else {
            socket.emit('error', { message: 'Failed to process message' });
          }
        } catch (error) {
          console.error('Error handling message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.user.email);
        
        // Update user status to offline when they disconnect
        try {
          await User.updateById(socket.user.id, { status: 'offline' });
          // Broadcast to all clients that this user is now offline
          io.emit('userStatusChange', { userId: socket.user.id, status: 'offline' });
        } catch (error) {
          console.error('Error updating user status to offline:', error);
        }
      });
    } catch (error) {
      console.error('Error handling connection:', error);
    }
  });
};

module.exports = setupSocketHandlers;
