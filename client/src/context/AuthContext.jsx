// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5050/users/login", {
        email,
        password,
      });
      console.log("Login response:", res.data);
      const token = res.data.token;
      const decoded = jwtDecode(token);
      setUser(decoded.username);
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};
