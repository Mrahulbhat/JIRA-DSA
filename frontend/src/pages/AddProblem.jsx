import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Loader, BookOpen } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const TOPIC_OPTIONS = [
  "Sorting",
  "Searching",
  "Basic Math",
  "Array",
  "String",
  "Bit Manipulation",
  "Recursion",
  "Hashing",
  "Linked List",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Two Pointers",
  "Sliding Window",
  "Heap",
  "Trie",
  "Others",
];

const AddProblem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: "",
    difficulty: "Easy",
    topic: "",
    source: "",
    problemLink: "",
    githubLink: "",
    tags: "",
    notes: "",
  });

  // ================= FETCH PROBLEM (EDIT MODE) =================
  useEffect(() => {
    if (!isEdit) return;

    const fetchProblem = async () => {
      try {
        const res = await axiosInstance.get(`/problems/${id}`);
        if (res.data?.success && res.data.problem) {
          const p = res.data.problem;
          setFormData({
            name: p.name || "",
            difficulty: p.difficulty || "Easy",
            topic: p.topic || "",
            source: p.source || "",
            problemLink: p.problemLink || "",
            githubLink: p.githubLink || "",
            tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
            notes: p.notes || "",
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load problem");
        navigate("/myProblems");
      } finally {
        setFetching(false);
      }
    };

    fetchProblem();
  }, [id, isEdit, navigate]);

  // ================= INPUT HANDLER =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      difficulty,
      topic,
      source,
      problemLink,
      githubLink,
      tags,
      notes,
    } = formData;

    if (!name || !difficulty || !topic || !source || !problemLink) {
      toast.error("Please fill all required fields");
      return;
    }

    const tagsArray = (tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);

    try {
      if (isEdit) {
        await axiosInstance.patch(`/problems/${id}`, {
          name,
          difficulty,
          topic,
          source,
          problemLink,
          githubLink: githubLink || "",
          tags: tagsArray,
          notes: notes || "",
        });
        toast.success("Problem updated successfully");
      } else {
        await axiosInstance.post("/problems", {
          name,
          difficulty,
          topic,
          source,
          problemLink,
          githubLink: githubLink || "",
          tags: tagsArray,
          notes: notes || "",
        });
        toast.success("Problem added successfully");
      }

      navigate("/myProblems");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING SCREEN =================
  if (fetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-black p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-white"
      >
        <ArrowLeft /> Back
      </button>

      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <BookOpen /> {isEdit ? "Edit Problem" : "Add Problem"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Problem name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
              required
            >
              <option value="">Select topic</option>
              {TOPIC_OPTIONS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            name="source"
            placeholder="LeetCode / Codeforces / GFG"
            value={formData.source}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
            required
          />

          <input
            type="url"
            name="problemLink"
            placeholder="Problem link"
            value={formData.problemLink}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
            required
          />

          <input
            type="url"
            name="githubLink"
            placeholder="GitHub / solution link (optional)"
            value={formData.githubLink}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags: array, dp, graph"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg"
          />

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg min-h-[80px]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" /> : <Plus />}
            {isEdit ? "Update Problem" : "Add Problem"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
