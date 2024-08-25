import { useState } from "react";

import Signup from "./Signup";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import ChatApp from "./components/ChatApp";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signup></Signup>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route
            path="/chat"
            element={isAuthenticated ? <ChatApp /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
