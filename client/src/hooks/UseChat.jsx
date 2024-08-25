// src/hooks/useChat.js
import { useState, useEffect } from "react";
import { startChat as apiStartChat } from "../api/ChatApi";

export const useChat = (socket) => {
  const [chats, setChats] = useState({});

  useEffect(() => {
    if (!socket) return;

    socket.on("chatHistory", (chatId, history) => {
      setChats((prevChats) => ({
        ...prevChats,
        [chatId]: history,
      }));
    });

    socket.on("chatMessage", (chatId, messageData) => {
      setChats((prevChats) => ({
        ...prevChats,
        [chatId]: [...(prevChats[chatId] || []), messageData],
      }));
    });

    return () => {
      socket.off("chatHistory");
      socket.off("chatMessage");
    };
  }, [socket]);

  const sendMessage = (chatId, message) => {
    if (socket) {
      socket.emit("chatMessage", { chatId, message });
    }
  };

  const startChat = async (recipientId) => {
    try {
      const chat = await apiStartChat(recipientId);
      return chat;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error;
    }
  };

  return { chats, sendMessage, startChat };
};
