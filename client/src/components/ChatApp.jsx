import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/UseSocket";
import { useChat } from "../hooks/UseChat";
import { getContacts } from "../api/UserApi";

const ChatApp = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, sendMessage, startChat } = useChat(socket);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await getContacts();
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact, chats]);

  const handleStartChat = async (contact) => {
    const chat = await startChat(contact._id);
    setSelectedContact({ ...contact, chatId: chat._id });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      sendMessage(selectedContact.chatId, newMessage);
      setNewMessage("");
    }
  };

  const currentMessages = selectedContact
    ? chats[selectedContact.chatId] || []
    : [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Contacts sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
          Contacts
        </h2>
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedContact?._id === contact._id ? "bg-blue-100" : ""
            }`}
            onClick={() => handleStartChat(contact)}
          >
            {contact.name || contact.email}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="bg-white p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Chat with {selectedContact.name || selectedContact.email}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === user.email ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === user.email
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form
              onSubmit={handleSendMessage}
              className="bg-white p-4 border-t border-gray-200"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-gray-500">
              Select a contact to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
