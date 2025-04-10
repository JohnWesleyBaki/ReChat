const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../db/connection.js");

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const { userId, recipientId } = req.body;
    console.log(`Starting chat between ${userId} and ${recipientId}`);

    const chatsCollection = db.collection("chats");

    // First try to find an existing chat
    let chat = await chatsCollection.findOne({
      participants: { $all: [new ObjectId(userId), new ObjectId(recipientId)] },
    });

    if (!chat) {
      console.log(`No existing chat found, creating new chat`);
      const newChat = {
        participants: [new ObjectId(userId), new ObjectId(recipientId)],
        messages: [],
        createdAt: new Date(),
      };
      const result = await chatsCollection.insertOne(newChat);
      chat = await chatsCollection.findOne({ _id: result.insertedId });
      console.log(`Created new chat with ID: ${chat._id}`);
    } else {
      console.log(`Found existing chat with ID: ${chat._id}`);
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const chatsCollection = db.collection("chats");

    const chats = await chatsCollection
      .find({ participants: new ObjectId(userId) })
      .toArray();

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

