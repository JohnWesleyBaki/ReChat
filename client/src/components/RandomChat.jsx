import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/UseSocket";
import { useChat } from "../hooks/UseChat";
import { getRandomUser } from "../api/UserApi";
import { Shuffle, Users, AlertCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";

const RandomChat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, sendMessage, startChat } = useChat(socket);
  const [randomContact, setRandomContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ensure user data is properly structured
  const currentUser = {
    email: user?.email || "",
    id: user?.id || "",
    name: user?.name || "",
  };

  const findRandomChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomUser = await getRandomUser();
      if (!randomUser) {
        setError("No one is available at the moment.");
        setRandomContact(null);
        return;
      }

      // Start a chat with the random user
      const chat = await startChat(randomUser._id);
      setRandomContact({ ...randomUser, chatId: chat._id });
    } catch (error) {
      console.error("Error finding random chat:", error);
      setError("Failed to find a random chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && randomContact) {
      sendMessage(randomContact.chatId, newMessage);
      setNewMessage("");
    }
  };

  const currentMessages = randomContact?.chatId
    ? chats[randomContact.chatId] || []
    : [];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-sm mb-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Random Chat</h1>
          <button
            onClick={findRandomChat}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? (
              "Finding..."
            ) : randomContact ? (
              <>
                <Shuffle className="h-5 w-5 mr-2" />
                Find Another
              </>
            ) : (
              <>
                <Shuffle className="h-5 w-5 mr-2" />
                Find Random Chat
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {randomContact && (
        <div className="flex-1">
          <ChatWindow
            selectedContact={randomContact}
            messages={currentMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            currentUser={currentUser}
          />
        </div>
      )}

      {!randomContact && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
            <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Start a Random Chat
            </h2>
            <p className="text-gray-600 mb-6">
              Click the "Find Random Chat" button to be matched with a random
              online user for a conversation.
            </p>
            <button
              onClick={findRandomChat}
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors mx-auto ${
                loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? (
                "Finding..."
              ) : (
                <>
                  <Shuffle className="h-5 w-5 mr-2" />
                  Find Random Chat
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomChat;
