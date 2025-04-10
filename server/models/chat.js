
const { ObjectId } = require('mongodb');
const db = require('../db/connection');

const collection = 'chats';

const findById = async (id) => {
  try {
    return await db.collection(collection).findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error finding chat by id:', error);
    throw error;
  }
};

const findByUserId = async (userId) => {
  try {
    return await db.collection(collection)
      .find({ participants: new ObjectId(userId) })
      .toArray();
  } catch (error) {
    console.error('Error finding chats for user:', error);
    throw error;
  }
};

const findOrCreateChat = async (userId, recipientId) => {
  try {
    let chat = await db.collection(collection).findOne({
      participants: { $all: [new ObjectId(userId), new ObjectId(recipientId)] },
    });

    if (!chat) {
      const newChat = {
        participants: [new ObjectId(userId), new ObjectId(recipientId)],
        messages: [],
        createdAt: new Date(),
      };
      const result = await db.collection(collection).insertOne(newChat);
      chat = await db.collection(collection).findOne({ _id: result.insertedId });
    }

    return chat;
  } catch (error) {
    console.error('Error finding or creating chat:', error);
    throw error;
  }
};

const addMessage = async (chatId, messageData) => {
  try {
    return await db.collection(collection).updateOne(
      { _id: new ObjectId(chatId) },
      { $push: { messages: messageData } }
    );
  } catch (error) {
    console.error('Error adding message to chat:', error);
    throw error;
  }
};

module.exports = {
  findById,
  findByUserId,
  findOrCreateChat,
  addMessage
};