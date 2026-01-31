import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Loader,
  ChevronLeft,
  Plus,
  CheckCircle2,
  Clock,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const TOPIC_OPTIONS = [
  "Sorting", "Searching", "Basic Math", "Array", "String", "Bit Manipulation",
  "Recursion", "Hashing", "Linked List", "Stack", "Queue", "Tree", "Graph",
  "Dynamic Programming", "Greedy", "Backtracking", "Two Pointers", "Sliding Window",
  "Heap", "Trie", "Others",
];

const Challenges = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("received"); // received | sent | create
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dropdownRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    difficulty: "Medium",
    topic: "",
    source: "LeetCode",
    problemLink: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [solutionLinks, setSolutionLinks] = useState({});

  const fetchChallenges = async () => {
    try {
      const res = await axiosInstance.get("/challenges");
      if (res.data?.success) {
        setChallenges(res.data.challenges || []);
        setReceived(res.data.received || []);
        setSent(res.data.sent || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const fetchAllUsers = async () => {
    if (allUsers.length > 0) return;
    setUsersLoading(true);
    try {
      const res = await axiosInstance.get("/users");
      if (res.data?.success) setAllUsers(res.data.users || []);
    } catch {
      setAllUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Select a user to challenge");
      return;
    }
    if (!form.name || !form.topic || !form.problemLink) {
      toast.error("Fill problem name, topic, and link");
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post("/challenges", {
        challengeeId: selectedUser.id,
        problem: {
          name: form.name,
          difficulty: form.difficulty,
          topic: form.topic,
          source: form.source,
          problemLink: form.problemLink,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        },
      });
      toast.success("Challenge sent!");
      setTab("sent");
      setSelectedUser(null);
      setForm({ name: "", difficulty: "Medium", topic: "", source: "LeetCode", problemLink: "", tags: "" });
      fetchChallenges();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send challenge");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (challengeId) => {
    setCompletingId(challengeId);
    try {
      await axiosInstance.patch(`/challenges/${challengeId}/complete`, {
        githubLink: solutionLinks[challengeId] || undefined,
      });
      toast.success("Challenge completed! Problem added to your account.");
      setSolutionLinks((prev) => ({ ...prev, [challengeId]: "" }));
      fetchChallenges();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete");
    } finally {
      setCompletingId(null);
    }
  };

  const getDifficultyColor = (d) => {
    if (d === "Easy") return "text-green-400 bg-green-500/20";
    if (d === "Medium") return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  const pendingReceived = received.filter((c) => c.status === "pending");

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
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <Target className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Challenges</h1>
            <p className="text-gray-400">Challenge others or complete pending challenges</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("received")}
            className={`px-4 py-2 rounded-lg font-medium ${tab === "received" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Received ({pendingReceived.length})
          </button>
          <button
            onClick={() => setTab("sent")}
            className={`px-4 py-2 rounded-lg font-medium ${tab === "sent" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Sent
          </button>
          <button
            onClick={() => setTab("create")}
            className={`px-4 py-2 rounded-lg font-medium ${tab === "create" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            <Plus className="w-4 h-4 inline mr-1" /> Create
          </button>
        </div>

        {tab === "received" && (
          <div className="space-y-4">
            {pendingReceived.length === 0 ? (
              <p className="text-gray-500 py-8">No pending challenges. Others can challenge you and they’ll appear here.</p>
            ) : (
              pendingReceived.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-400">
                        From <span className="text-white font-medium">@{c.challengerId?.username || c.challengerId?.name || "someone"}</span>
                      </p>
                      <h3 className="text-xl font-bold text-white mt-1">{c.problem?.name}</h3>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-sm ${getDifficultyColor(c.problem?.difficulty)}`}>
                        {c.problem?.difficulty}
                      </span>
                      <span className="ml-2 text-gray-400 text-sm">{c.problem?.topic}</span>
                    </div>
                    <span className="flex items-center gap-1 text-amber-400 text-sm">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  </div>
                  <a
                    href={c.problem?.problemLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mb-4"
                  >
                    <ExternalLink className="w-4 h-4" /> Open problem
                  </a>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      placeholder="Solution link (e.g. GitHub)"
                      value={solutionLinks[c._id] ?? ""}
                      onChange={(e) => setSolutionLinks((prev) => ({ ...prev, [c._id]: e.target.value }))}
                      className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => handleComplete(c._id)}
                      disabled={completingId === c._id}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      {completingId === c._id ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Mark solved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "sent" && (
          <div className="space-y-4">
            {sent.length === 0 ? (
              <p className="text-gray-500 py-8">You haven’t sent any challenges yet.</p>
            ) : (
              sent.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">To @{c.challengeeId?.username || c.challengeeId?.name || "user"}</p>
                    <p className="text-gray-400 text-sm">{c.problem?.name} · {c.problem?.difficulty}</p>
                  </div>
                  <span className={c.status === "completed" ? "text-green-400 flex items-center gap-1" : "text-amber-400 flex items-center gap-1"}>
                    {c.status === "completed" ? <><CheckCircle2 className="w-4 h-4" /> Done</> : <><Clock className="w-4 h-4" /> Pending</>}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "create" && (
          <form onSubmit={handleCreateChallenge} className="space-y-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Challenge whom?</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setDropdownOpen(!dropdownOpen); fetchAllUsers(); }}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-left"
                >
                  <span className={selectedUser ? "text-white" : "text-gray-500"}>
                    {selectedUser ? `@${selectedUser.username}` : "Select a user..."}
                  </span>
                  <span className="text-gray-500">{dropdownOpen ? "▲" : "▼"}</span>
                </button>
                {dropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-gray-600 rounded-lg bg-gray-900 shadow-xl">
                    {usersLoading ? (
                      <li className="px-4 py-3 text-gray-500">Loading users...</li>
                    ) : allUsers.length === 0 ? (
                      <li className="px-4 py-3 text-gray-500">No other users yet</li>
                    ) : (
                      allUsers.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => { setSelectedUser(u); setDropdownOpen(false); }}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-white"
                        >
                          <UserPlus className="w-4 h-4 text-purple-400" /> @{u.username}
                          {u.name && u.name !== u.username && <span className="text-gray-400 text-sm">({u.name})</span>}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
              {selectedUser && (
                <p className="mt-2 text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Challenging: @{selectedUser.username}
                  <button type="button" onClick={() => setSelectedUser(null)} className="text-red-400 text-sm ml-2">Change</button>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Problem name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic *</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                  required
                >
                  <option value="">Select</option>
                  {TOPIC_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
              <input
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="LeetCode / Codeforces / GFG"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Problem link *</label>
              <input
                type="url"
                value={form.problemLink}
                onChange={(e) => setForm((f) => ({ ...f, problemLink: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="array, dp"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !selectedUser}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
              Send Challenge
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Challenges;
