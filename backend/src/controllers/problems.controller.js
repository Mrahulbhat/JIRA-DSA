import Problem from "../models/problems.model.js";

/**
 * GET /problems
 */
export const getMyProblems = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId; // <-- safe check
    if (!userId)
      return res.status(401).json({ success: false, message: "User ID missing" });

    const problems = await Problem.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: problems.length, problems });
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /problems
 */
export const addProblem = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId; // <-- safe check
    if (!userId)
      return res.status(401).json({ success: false, message: "User ID missing" });

    const { name, difficulty, topic, source, problemLink, githubLink, tags } = req.body;

    if (!name || !difficulty || !topic || !source || !problemLink || !githubLink || !tags)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const newProblem = await Problem.create({
      userId,
      name,
      difficulty,
      topic,
      source,
      problemLink,
      githubLink,
      tags,
    });

    res.status(201).json({ success: true, message: "Problem added successfully", problem: newProblem });
  } catch (error) {
    console.error("Add problem error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
