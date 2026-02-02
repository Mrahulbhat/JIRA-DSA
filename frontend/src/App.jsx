import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Loader, X, Sparkles } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import AddProblem from "./pages/AddProblem";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyProblems from "./pages/MyProblems";
import Leaderboard from "./pages/Leaderboard";
import Challenges from "./pages/Challenges";
import Settings from "./pages/Settings";

import { AuthProvider, useAuth } from "./context/AuthContext";

/* ---------- Update Modal Component ---------- */
const UpdateModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Version identifier - change this when you have a new update
  const CURRENT_VERSION = "v1.2.0";
  
  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("lastSeenVersion");
    
    // Show modal if user hasn't seen this version
    if (lastSeenVersion !== CURRENT_VERSION) {
      // Add a 1.5 second delay before showing the modal
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // 1500ms = 1.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("lastSeenVersion", CURRENT_VERSION);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-1 max-w-md w-full mx-4 animate-scale-in">
        <div className="bg-gray-900 rounded-xl p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-6 text-yellow-400" />
              <h3 className="text-white font-bold text-2xl">What's New!</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1.5 transition"
            >
              <X className="size-5" />
            </button>
          </div>
          
          {/* Version Badge */}
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {CURRENT_VERSION}
          </div>
          
          {/* Content */}
          <div className="text-gray-300 space-y-4">
            <div>
              <p className="font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-green-400">✓</span> Bug Fixes & Improvements
              </p>
              <ul className="space-y-2.5 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Fixed authentication redirect issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Improved sidebar navigation performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Resolved problem submission errors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Enhanced leaderboard loading speed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Fixed dark mode display issues</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Footer */}
          <button
            onClick={handleClose}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Got it, thanks! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
/* ---------- Protected Route ---------- */
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Show sidebar only after login pages
  const showSidebar =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup";

  // Show modal only when user is logged in and not on auth pages
  const showUpdateModal = user && showSidebar;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      {/* Update Modal */}
      {showUpdateModal && <UpdateModal />}

      <div className="flex h-[90vh] bg-black">
        {showSidebar && <Sidebar />}

        <div className="flex-1 overflow-auto">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/myProblems"
              element={
                <ProtectedRoute>
                  <MyProblems />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />

            <Route
              path="/problems/add"
              element={
                <ProtectedRoute>
                  <AddProblem />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/problems/edit/:id"
              element={
                <ProtectedRoute>
                  <AddProblem />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Toaster />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;