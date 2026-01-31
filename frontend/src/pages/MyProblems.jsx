import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import {
  Eye,
  Edit,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";

const MyProblems = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [expandedProblem, setExpandedProblem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch problems from backend
  const fetchProblems = async () => {
    try {
      const res = await axiosInstance.get("/problems");
      if (res.data.success) {
        setProblems(res.data.problems);
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const getDifficultyStyle = (d) => {
    if (d === "Easy") return "text-green-400 bg-green-500/20 border-green-500/40";
    if (d === "Medium")
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/40";
    return "text-red-400 bg-red-500/20 border-red-500/40";
  };

  const filteredProblems = problems.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDiff =
      selectedDifficulty === "all" || p.difficulty.toLowerCase() === selectedDifficulty;

    const matchCat =
      selectedCategory === "all" || p.topic === selectedCategory;

    return matchSearch && matchDiff && matchCat;
  });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My DSA Problems</h1>
        <button
          onClick={() => navigate("/problems/add")}
          className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500"
        >
          Add Problem
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg p-2"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg p-2"
            >
              <option value="all">All Topics</option>
              {[...new Set(problems.map((p) => p.topic))].map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-slate-700 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 sticky top-0">
            <tr className="text-gray-400 border-b border-slate-700">
              <th className="p-3 text-left">Difficulty</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Topic</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Tags</th>
              <th className="p-3 text-center">Solved</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProblems.map((p) => (
              <React.Fragment key={p._id}>
                <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs ${getDifficultyStyle(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.topic}</td>
                  <td className="p-3 text-slate-300">{p.source || "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      {(p.tags || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          {t}
                        </span>
                      ))}
                      {(p.tags || []).length === 0 && <span className="text-slate-500">-</span>}
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-400">
                    {p.solvedAt ? formatDate(p.solvedAt) : "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedProblem(expandedProblem === p._id ? null : p._id)
                        }
                        className="p-2 bg-purple-600/20 rounded hover:bg-purple-600/30"
                        title="Notes & solution"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={p.problemLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-orange-600/20 rounded hover:bg-orange-600/30"
                        title="Open problem"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>

                {expandedProblem === p._id && (
                  <tr className="bg-slate-800/80">
                    <td colSpan={7} className="p-4">
                      {p.notes && <p className="text-slate-300 mb-2 whitespace-pre-wrap">{p.notes}</p>}
                      {p.githubLink ? (
                        <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" /> View solution
                        </a>
                      ) : !p.notes && (
                        <p className="text-slate-500 text-sm">No notes or solution link.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyProblems;
