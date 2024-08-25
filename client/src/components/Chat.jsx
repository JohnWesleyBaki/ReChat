import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const socket = io("http://localhost:5050", {
      auth: {
        token,
      },
    });

    socket.on("chatMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const sendMessage = () => {
    if (message.trim()) {
      const socket = io("http://localhost:5050", { auth: { token } });
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}: </strong>
            {msg.msg}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
