// UserList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatApp.css"; // Ensure you import the CSS

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5050/users"); // Fetch users from API
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <h3>Select a user to chat with:</h3>
      {users.map((user) => (
        <div key={user._id} className="user" onClick={() => onSelectUser(user)}>
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default UserList;
