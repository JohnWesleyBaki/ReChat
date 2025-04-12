import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/UseSocket";
import { useChat } from "../hooks/UseChat";
import { getContacts } from "../api/UserApi";
import { MessageCircle } from "lucide-react";
import ContactsSidebar from "./chat/ContactsSidebar";
import ChatHeader from "./chat/chatheader";
import MessageList from "./chat/messagelist";
import MessageInput from "./chat/messageinput";

const ChatApp = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, sendMessage, startChat } = useChat(socket);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Ensure user data is properly structured
  const currentUser = {
    email: user?.email || "",
    id: user?.id || "",
    name: user?.name || "",
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await getContacts(user.id);
        setContacts(fetchedContacts);
        console.log("Fetched contacts:", fetchedContacts);
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

  const currentMessages = selectedContact?.chatId
    ? chats[selectedContact.chatId] || []
    : [];

  return (
    <div className="flex h-screen bg-gray-100">
      <ContactsSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onStartChat={handleStartChat}
      />

      <div className="flex-1 flex flex-col bg-white shadow-sm ml-5 rounded-l-2xl overflow-hidden">
        {selectedContact ? (
          <>
            <ChatHeader selectedContact={selectedContact} />
            <MessageList
              messages={currentMessages}
              user={currentUser}
              messagesEndRef={messagesEndRef}
            />
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">
                Select a contact to start chatting
              </p>
              <p className="text-gray-400 mt-2">
                Choose from your contacts list or start a new conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
