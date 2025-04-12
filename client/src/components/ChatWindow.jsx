import React, { useRef } from "react";
import ChatHeader from "./chat/chatheader";
import MessageList from "./chat/messagelist";
import MessageInput from "./chat/messageinput";

const ChatWindow = ({
  selectedContact,
  messages = [],
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentUser,
}) => {
  const messagesEndRef = useRef(null);

  return (
    <div className="flex-1 flex flex-col bg-white shadow-sm rounded-l-2xl overflow-hidden">
      {selectedContact ? (
        <>
          <ChatHeader selectedContact={selectedContact} />
          <MessageList
            messages={messages}
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
            <p className="text-xl text-gray-500 font-medium">
              No chat selected
            </p>
            <p className="text-gray-400 mt-2">
              Select a contact or find a random chat to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
