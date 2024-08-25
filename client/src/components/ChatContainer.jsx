import React from "react";
import ChatLists from "./ChatLists";

function ChatContainer({ user, onLogout }) {
  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}
    >
      <h1>{user.username}</h1>
      <button
        onClick={onLogout}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <div style={{ marginTop: "20px" }}>
        <ChatLists friends={user.friends} />
      </div>
    </div>
  );
}

export default ChatContainer;
