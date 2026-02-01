import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
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

  // Sidebar only after login pages
  const showSidebar =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup";

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

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
