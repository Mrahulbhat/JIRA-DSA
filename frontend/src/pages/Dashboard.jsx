import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Loader, 
  Flame, 
  Trophy, 
  Target, 
  TrendingUp,
  Users,
  Award,
  Zap,
  Clock,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronRight,
  Code,
  Brain,
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const timeAgo = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const sec = Math.floor((now - d) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
  return d.toLocaleDateString();
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [problemOfTheDay, setProblemOfTheDay] = useState(null);
  const [feedActivity, setFeedActivity] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    weeklyGoal: 10,
    weeklyProgress: 0,
    rank: 0,
    totalUsers: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setPageLoading(true);
      const [statsRes, feedRes, potdRes, myProblemsRes] = await Promise.all([
        axiosInstance.get("/dashboard/stats"),
        axiosInstance.get("/dashboard/feed?limit=15"),
        axiosInstance.get("/dashboard/problem-of-the-day"),
        axiosInstance.get("/problems"),
      ]);

      if (statsRes.data?.success && statsRes.data.stats) {
        const s = statsRes.data.stats;
        setCurrentStreak(s.currentStreak ?? 0);
        setLongestStreak(s.longestStreak ?? 0);
        setStats({
          totalSolved: s.totalSolved ?? 0,
          easyCount: s.easyCount ?? 0,
          mediumCount: s.mediumCount ?? 0,
          hardCount: s.hardCount ?? 0,
          weeklyGoal: s.weeklyGoal ?? 10,
          weeklyProgress: s.weeklyProgress ?? 0,
          rank: s.rank ?? 0,
          totalUsers: s.totalUsers ?? 0
        });
      }

      if (feedRes.data?.success && Array.isArray(feedRes.data.feed)) {
        setFeedActivity(
          feedRes.data.feed.map((item) => ({
            id: item._id,
            name: item.user?.username ? `@${item.user.username}` : (item.user?.name || "Anonymous"),
            avatar: getInitials(item.user?.name || item.user?.username),
            lastProblem: item.name,
            difficulty: item.difficulty,
            timeAgo: timeAgo(item.solvedAt),
          }))
        );
      }

      if (potdRes.data?.success && potdRes.data.problemOfTheDay) {
        const p = potdRes.data.problemOfTheDay;
        setProblemOfTheDay({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          solved: p.solved === true,
          category: p.category,
          timeLimit: "Solve today!",
          problemLink: p.problemLink,
          source: p.source
        });
      } else {
        setProblemOfTheDay(null);
      }

      if (myProblemsRes.data?.success && Array.isArray(myProblemsRes.data.problems)) {
        const problems = myProblemsRes.data.problems.slice(0, 5).map((p) => ({
          id: p._id,
          title: p.name,
          difficulty: p.difficulty,
          category: p.topic,
          solvedAt: p.solvedAt || p.createdAt,
          timeSpent: "-",
          likes: 0,
          comments: 0
        }));
        setRecentProblems(problems);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setPageLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (pageLoading) {
    return (
      <div data-test="loading-screen" className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex justify-center items-center">
        <Loader className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div data-test="dashboard-root" className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 data-test="header-title" className="text-4xl sm:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DSA Arena
            </h1>
            <p data-test="header-subtitle" className="text-gray-400 text-lg">Level up together, compete with friends 🚀</p>
          </div>

          {/* Streak & Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Current Streak */}
            <div data-test="current-streak" className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-400 font-semibold text-sm">CURRENT STREAK</h3>
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{currentStreak}</p>
                <p className="text-orange-300 text-xs">days on fire 🔥</p>
                <div className="mt-3 text-xs text-orange-200/60">
                  Best: {longestStreak} days
                </div>
              </div>
            </div>

            {/* Total Solved */}
            <div data-test="total-solved" className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-purple-400 font-semibold text-sm">TOTAL SOLVED</h3>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{stats.totalSolved}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    E: {stats.easyCount}
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                    M: {stats.mediumCount}
                  </span>
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                    H: {stats.hardCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Goal */}
            <div data-test="weekly-goal" className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-blue-400 font-semibold text-sm">WEEKLY GOAL</h3>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">
                  {stats.weeklyProgress}/{stats.weeklyGoal}
                </p>
                <div className="mt-3">
                  <div className="w-full bg-blue-900/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-300 text-xs mt-2">
                    {stats.weeklyProgress >= stats.weeklyGoal
                      ? "Goal reached! 🎉"
                      : `${stats.weeklyGoal - stats.weeklyProgress} more to go!`}
                  </p>
                </div>
              </div>
            </div>

            {/* Global Rank */}
            <div data-test="global-rank" className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-pink-400 font-semibold text-sm">GLOBAL RANK</h3>
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">#{stats.rank}</p>
                <p className="text-pink-300 text-xs">out of {stats.totalUsers.toLocaleString()} users</p>
                <div className="mt-3 flex items-center gap-1 text-green-400 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+5 this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Problem of the Day */}
          {problemOfTheDay && (
            <div data-test="problem-of-the-day" className="mb-8 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-2xl backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Star className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Problem of the Day</h2>
                      <p className="text-emerald-300 text-sm flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {problemOfTheDay.timeLimit}
                      </p>
                    </div>
                  </div>
                  {problemOfTheDay.solved ? (
                    <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Solved</span>
                    </div>
                  ) : (
                    <a 
                      data-test="solve-now-button"
                      href={problemOfTheDay.problemLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                    >
                      <Zap className="w-5 h-5" />
                      Solve Now
                    </a>
                  )}
                </div>
                
                <div className="bg-black/30 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{problemOfTheDay.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problemOfTheDay.difficulty)}`}>
                      {problemOfTheDay.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      {problemOfTheDay.category}
                    </span>
                    <span className="flex items-center gap-1">
                      Source: {problemOfTheDay.source || problemOfTheDay.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Friends Activity - Creates FOMO */}
            <div className="lg:col-span-2">
              <div data-test="community-activity" className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 px-6 py-5 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-purple-400" />
                      <h2 className="text-white text-xl font-bold">Community Activity</h2>
                    </div>
                    <button 
                      data-test="leaderboard-button"
                      onClick={() => navigate("/leaderboard")}
                      className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-1"
                    >
                      Leaderboard
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">See what others are solving</p>
                </div>

                <div className="p-6 space-y-4">
                  {feedActivity.map((item) => (
                    <div 
                      key={item.id}
                      data-test="feed-item"
                      className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-xl p-5 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                            {item.avatar}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{item.name}</h3>
                            <p className="text-gray-400 text-sm">solved a problem</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3 border border-gray-600/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium text-sm">{item.lastProblem}</p>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs">{item.timeAgo}</p>
                      </div>
                    </div>
                  ))}

                  {feedActivity.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No activity yet. Add a problem to get started!</p>
                  )}
                  <div className="text-center pt-4">
                    <button 
                      data-test="add-problem-button"
                      onClick={() => navigate("/problems/add")}
                      className="text-purple-400 hover:text-purple-300 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <Trophy className="w-4 h-4" />
                      View Leaderboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Problems */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div data-test="quick-actions" className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    data-test="add-problem-quick"
                    onClick={() => navigate('/problems/add')}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-4 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Add Problem Solved
                  </button>
                  <button 
                    data-test="view-leaderboard-quick"
                    onClick={() => navigate("/leaderboard")}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold px-4 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <Trophy className="w-5 h-5" />
                    View Leaderboard
                  </button>
                  <button 
                    data-test="my-challenges-quick"
                    onClick={() => navigate("/challenges")}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold px-4 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <Target className="w-5 h-5" />
                    My Challenges
                  </button>
                </div>
              </div>

              {/* Recent Problems */}
              <div data-test="recent-problems" className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 border-b border-gray-700/50">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-400" />
                    Your Recent Solves
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {recentProblems.map((problem) => (
                    <div 
                      key={problem.id}
                      data-test="recent-problem-item"
                      className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{problem.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{problem.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {problem.timeSpent}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-600/30">
                        <button data-test="like-button" className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors">
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-xs">{problem.likes}</span>
                        </button>
                        <button data-test="comment-button" className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-xs">{problem.comments}</span>
                        </button>
                        <button data-test="share-button" className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors ml-auto">
                          <Share2 className="w-3 h-3" />
                          <span className="text-xs">Share</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Preview */}
              <div data-test="latest-achievement" className="bg-gradient-to-br from-yellow-900/40 to-orange-800/20 border border-yellow-500/30 rounded-2xl backdrop-blur-sm overflow-hidden p-6">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Latest Achievement
                </h3>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h4 className="text-white font-bold mb-1">Week Warrior</h4>
                  <p className="text-yellow-300 text-sm">Solved 10 problems this week!</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
