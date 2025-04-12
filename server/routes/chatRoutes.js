const express = require("express");
const mongoose = require('mongoose');
const { Chat } = require('../models/chat');

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const { userId, recipientId } = req.body;
    console.log(`Starting chat between ${userId} and ${recipientId}`);

    // First try to find an existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!chat) {
      console.log(`No existing chat found, creating new chat`);
      chat = new Chat({
        participants: [userId, recipientId],
        messages: [],
        createdAt: new Date(),
      });
      await chat.save();
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

    const chats = await Chat.find({ participants: userId });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

