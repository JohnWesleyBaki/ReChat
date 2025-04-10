import React from "react";
import { Paperclip, Image as ImageIcon, Smile, Send } from "lucide-react";

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="input-container flex items-center gap-2 bg-white p-4 border-t border-gray-200">
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
        <Paperclip className="h-5 w-5" />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
        <ImageIcon className="h-5 w-5" />
      </button>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        placeholder="Type your message..."
      />
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
        <Smile className="h-5 w-5" />
      </button>
      <button
        onClick={handleSendMessage}
        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MessageInput;
