import React from "react";
import { useNavigate } from "react-router-dom";
import ChatApp from "./components/ChatApp";
import RandomChat from "./components/RandomChat";
import { Users, Shuffle } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = React.useState("chat"); // "chat" or "random"

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveView("chat")}
          className={`cursor-pointer p-6 rounded-lg shadow-sm transition-all ${
            activeView === "chat"
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-blue-50"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                activeView === "chat" ? "bg-blue-400" : "bg-blue-100"
              } mr-4`}
            >
              <Users
                className={`h-6 w-6 ${
                  activeView === "chat" ? "text-white" : "text-blue-500"
                }`}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Chat with Friends</h2>
              <p
                className={`text-sm ${
                  activeView === "chat" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                Connect with your friends
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            setActiveView("random");
            navigate("/random/chat");
          }}
          className={`cursor-pointer p-6 rounded-lg shadow-sm transition-all ${
            activeView === "random"
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-blue-50"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                activeView === "random" ? "bg-blue-400" : "bg-blue-100"
              } mr-4`}
            >
              <Shuffle
                className={`h-6 w-6 ${
                  activeView === "random" ? "text-white" : "text-blue-500"
                }`}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Random Chat</h2>
              <p
                className={`text-sm ${
                  activeView === "random" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                Chat with random online users
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">{activeView === "chat" ? <ChatApp /> : null}</div>
    </div>
  );
}

export default Home;
