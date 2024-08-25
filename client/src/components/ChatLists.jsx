import React, { useState } from "react";

function ChatLists({ friends }) {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format as needed
  };

  return (
    <div>
      <div>
        <h2>Friends</h2>
        {friends.map((friend, index) => (
          <div
            key={index}
            onClick={() => handleFriendClick(friend)}
            style={{
              cursor: "pointer",
              padding: "5px",
              borderBottom: "1px solid #ddd",
              backgroundColor:
                selectedFriend === friend ? "#f0f0f0" : "transparent",
            }}
          >
            {friend.username}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        {selectedFriend && (
          <>
            <h3>Messages with {selectedFriend.username}</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {selectedFriend.messages
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort messages by timestamp
                .map((message, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "5px",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      backgroundColor:
                        message.sender === selectedFriend.username
                          ? "#e1f5fe"
                          : "#fff",
                      textAlign:
                        message.sender === selectedFriend.username
                          ? "right"
                          : "left",
                    }}
                  >
                    <div>{message.text}</div>
                    <div style={{ fontSize: "small", color: "#888" }}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatLists;
