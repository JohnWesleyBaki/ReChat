import React from "react";
import { Users, Video, Phone, Menu, Search } from "lucide-react";

const ContactsSidebar = ({ contacts, selectedContact, onStartChat }) => {
  return (
    <div className="w-80 bg-white shadow-sm flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3 ${
              selectedContact?._id === contact._id ? "bg-blue-50" : ""
            }`}
            onClick={() => onStartChat(contact)}
          >
            <div className="relative">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                  contact.online ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {contact.name || contact.email}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                Click to start chatting
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsSidebar;
