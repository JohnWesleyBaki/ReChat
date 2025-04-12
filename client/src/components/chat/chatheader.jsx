import React, { useState } from "react";
import {
  Users,
  Phone,
  Video,
  UserPlus,
  MoreVertical,
  Loader2,
  Check,
} from "lucide-react";
import { addFriend } from "../../api/UserApi";
import { useAuth } from "../../context/AuthContext";

const ChatHeader = ({ selectedContact }) => {
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [addFriendSuccess, setAddFriendSuccess] = useState(false);
  const { user } = useAuth();

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
                selectedContact.status === "online"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">
              {selectedContact.name || selectedContact.email}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedContact.status === "online" ? "Active now" : "Offline"}
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
          <button
            onClick={async () => {
              if (!selectedContact.isFriend) {
                try {
                  setIsAddingFriend(true);
                  await addFriend(user.id, selectedContact._id);
                  selectedContact.isFriend = true;
                  setAddFriendSuccess(true);
                  setTimeout(() => setAddFriendSuccess(false), 2000);
                } catch (error) {
                  console.error("Error adding friend:", error);
                } finally {
                  console.log("Friend added successfully");
                  setIsAddingFriend(false);
                }
              }
            }}
            disabled={selectedContact.isFriend || isAddingFriend}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
              selectedContact.isFriend ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isAddingFriend ? (
              <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
            ) : addFriendSuccess ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <UserPlus className="h-5 w-5 text-gray-500" />
            )}
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
