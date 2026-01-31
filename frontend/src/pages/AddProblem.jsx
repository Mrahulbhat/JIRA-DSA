import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Loader,
  BookOpen,
  Link as LinkIcon,
  Github,
  Tags,
} from "lucide-react";
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
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      toast.error("Please fill name, difficulty, topic, source, and problem link");
      return;
    }

    const tagsArray = (tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setLoading(true);

    try {
      await axiosInstance.post("/problems/add", {
        name,
        difficulty,
        topic,
        source,
        problemLink,
        githubLink: githubLink || undefined,
        tags: tagsArray,
        notes: notes || undefined,
      });

      toast.success("Problem added successfully!");
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-white"
      >
        <ArrowLeft /> Back
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen /> Add Problem
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Problem name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border px-4 py-3 rounded-lg"
            required
          />

          {/* Difficulty + Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="border px-4 py-3 rounded-lg"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            {/* ✅ TOPIC DROPDOWN */}
            <select
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="border px-4 py-3 rounded-lg"
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

          {/* Source */}
          <input
            type="text"
            name="source"
            placeholder="LeetCode / Codeforces / GFG"
            value={formData.source}
            onChange={handleInputChange}
            className="w-full border px-4 py-3 rounded-lg"
            required
          />

          {/* Links */}
          <input
            type="url"
            name="problemLink"
            placeholder="Problem link"
            value={formData.problemLink}
            onChange={handleInputChange}
            className="w-full border px-4 py-3 rounded-lg"
            required
          />

          <input
            type="url"
            name="githubLink"
            placeholder="GitHub / solution link (optional)"
            value={formData.githubLink}
            onChange={handleInputChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          {/* Tags */}
          <input
            type="text"
            name="tags"
            placeholder="Tags: array, dp, graph (optional)"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full border px-4 py-3 rounded-lg min-h-[80px]"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" /> : <Plus />}
            Add Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
