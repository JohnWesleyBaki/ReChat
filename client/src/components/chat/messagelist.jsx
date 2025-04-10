import React from "react";

const MessageList = ({ messages = [], user = {}, messagesEndRef }) => {
  // Add null checks and default values
  const userEmail = user?.email || "";

  if (!messages || messages.length === 0) {
    return <div className="flex-1 p-4 text-gray-500">No messages yet</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender === userEmail;

        return (
          <div
            key={index}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
                isCurrentUser
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <div className="break-words">{msg.message}</div>
              <div
                className={`text-xs mt-1 ${
                  isCurrentUser ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
