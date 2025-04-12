
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Chat schema
const chatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a model for the Chat
const Chat = mongoose.model('Chat', chatSchema);

// Find a chat by ID
const findById = async (id) => {
  try {
    return await Chat.findById(id).populate('participants', 'name email');
  } catch (error) {
    console.error('Error finding chat by id:', error);
    throw error;
  }
};

// Find chats for a user
const findByUserId = async (userId) => {
  try {
    return await Chat.find({ participants: userId })
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });
  } catch (error) {
    console.error('Error finding chats for user:', error);
    throw error;
  }
};

// Find or create a chat between two users
const findOrCreateChat = async (userId, recipientId) => {
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] }
    }).populate('participants', 'name email');

    if (!chat) {
      chat = new Chat({
        participants: [userId, recipientId],
        messages: [],
      });
      await chat.save();
    }

    return chat;
  } catch (error) {
    console.error('Error finding or creating chat:', error);
    throw error;
  }
};

// Add a message to a chat
const addMessage = async (chatId, messageData) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.messages.push(messageData);
    chat.updatedAt = new Date();
    await chat.save();

    return chat;
  } catch (error) {
    console.error('Error adding message to chat:', error);
    throw error;
  }
};

module.exports = {
  Chat,
  findById,
  findByUserId,
  findOrCreateChat,
  addMessage
};