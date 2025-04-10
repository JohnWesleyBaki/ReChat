import React from "react";
import { Users, Phone, Video, UserPlus, MoreVertical } from "lucide-react";

const ChatHeader = ({ selectedContact }) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                selectedContact.online ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">
              {selectedContact.name || selectedContact.email}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedContact.online ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <UserPlus className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
