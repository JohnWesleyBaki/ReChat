// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "../hooks/UseSocket";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      setUser(decoded);
      localStorage.setItem("userId", decoded.id);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5050/login", {
        email,
        password,
      });
      console.log("Login response:", res.data);
      const token = res.data.token;
      const decoded = jwtDecode(token);
      setUser(decoded);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", decoded.id);
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Force socket to disconnect by removing token
    if (socket) {
      socket.disconnect();
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};
