// src/hooks/useChat.js
import { useState, useEffect } from "react";
import { startChat as apiStartChat } from "../api/ChatApi";

export const useChat = (socket) => {
  const [chats, setChats] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);

  // Handle joining and leaving chat rooms
  const joinChatRoom = (chatId) => {
    if (socket) {
      console.log(`Joining room ${chatId}`);
      socket.emit("joinRoom", { chatId });
      setCurrentChatId(chatId);
    }
  };

  const leaveChatRoom = (chatId) => {
    if (socket) {
      console.log(`Leaving room ${chatId}`);
      socket.emit("leaveRoom", { chatId });
      setCurrentChatId(null);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for chat history
    socket.on("chatHistory", (history) => {
      console.log("Received chat history:", history);
      setChats((prevChats) => ({
        ...prevChats,
        ...history.reduce((acc, chat) => {
          acc[chat._id] = chat.messages || [];
          return acc;
        }, {}),
      }));
    });

    // Listen for new messages
    socket.on("chatMessage", (messageData) => {
      const { chatId, ...message } = messageData;
      console.log("Received new message:", message, "for chat:", chatId);

      setChats((prevChats) => {
        const currentMessages = prevChats[chatId] || [];
        return {
          ...prevChats,
          [chatId]: [...currentMessages, message],
        };
      });
    });

    // Cleanup on unmount
    return () => {
      if (currentChatId) {
        leaveChatRoom(currentChatId);
      }
      socket.off("chatHistory");
      socket.off("chatMessage");
    };
  }, [socket, currentChatId]);

  const sendMessage = (chatId, message) => {
    if (socket) {
      console.log("Sending message:", message, "to chat:", chatId);
      socket.emit("chatMessage", { chatId, message });
    }
  };

  const startChat = async (recipientId) => {
    try {
      const chat = await apiStartChat(recipientId);
      if (chat && chat._id) {
        joinChatRoom(chat._id);
      }
      return chat;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error;
    }
  };

  return {
    chats,
    sendMessage,
    startChat,
    joinChatRoom,
    leaveChatRoom,
    currentChatId,
  };
};
