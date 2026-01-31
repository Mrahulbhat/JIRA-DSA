import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Loader, Medal, ChevronLeft } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axiosInstance.get("/leaderboard?limit=50");
        if (res.data?.success && Array.isArray(res.data.leaderboard)) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-amber-500/30 text-amber-400 border-amber-500/50";
    if (rank === 2) return "bg-slate-400/30 text-slate-300 border-slate-400/50";
    if (rank === 3) return "bg-amber-700/30 text-amber-200 border-amber-700/50";
    return "bg-gray-700/30 text-gray-300 border-gray-600/50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-gray-400">Top solvers by total problems</p>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No entries yet. Add problems to appear here!</p>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(entry.rank)} backdrop-blur-sm`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg">
                  {entry.rank === 1 ? <Medal className="w-6 h-6 text-amber-400" /> : entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">@{entry.username || entry.name || "user"}</p>
                  <p className="text-sm opacity-80">
                    E: {entry.easyCount} · M: {entry.mediumCount} · H: {entry.hardCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{entry.totalSolved}</p>
                  <p className="text-xs opacity-80">solved</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
