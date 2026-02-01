import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Trash2,
  UserX,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();

  const [confirmType, setConfirmType] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete("/users/me");
      toast.success("Account deleted successfully");

      localStorage.clear();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setConfirmType(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl pt-10 font-bold">Settings</h1>
          <p className="text-gray-400 mt-1">
            Manage your account and data
          </p>
        </div>

        {/* Settings cards */}
        <div className="space-y-4">


          {/* Delete account */}
          <div className="border border-red-800/50 rounded-xl p-5 bg-red-950/30 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-600/20 rounded-xl">
                <UserX className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-red-400">
                  Delete my account
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  This will permanently delete your account and all associated data.
                </p>
                <button
                  onClick={() => setConfirmType("account")}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600/30"
                >
                  Delete my account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmType && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold">Are you sure?</h2>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              {confirmType === "account"
                ? "This will permanently delete your account and all your data. This action cannot be undone."
                : "This will permanently delete all your problems. This action cannot be undone."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmType(null)}
                className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={
                  confirmType === "account"
                    ? handleDeleteAccount
                    : handleDeleteAllProblems
                }
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
