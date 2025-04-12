import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./Home";
import RandomChat from "./components/RandomChat";

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center space-x-3 cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/")}
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                ChatApp
              </span>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 pr-4 border-r border-gray-200">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* Public routes */}
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
          />
          <Route path="*" element={<p>404 Not Found or Unauthenticated</p>} />

          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/random/chat"
            element={
              isAuthenticated ? <RandomChat /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
