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
 * GET /problems/:id - Get single problem (owner only)
 */
export const getProblemById = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "User ID missing" });

    const { id } = req.params;
    const problem = await Problem.findOne({ _id: id, userId });
    if (!problem)
      return res.status(404).json({ success: false, message: "Problem not found" });

    res.status(200).json({ success: true, problem });
  } catch (error) {
    console.error("Get problem error:", error);
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

    const { name, difficulty, topic, source, problemLink, githubLink, tags, timeSpent, attempts, language, notes } = req.body;

    if (!name || !difficulty || !topic || !source || !problemLink)
      return res.status(400).json({ success: false, message: "name, difficulty, topic, source, and problemLink are required" });

    const newProblem = await Problem.create({
      userId,
      name,
      difficulty,
      topic,
      source,
      problemLink,
      githubLink: githubLink || "",
      tags: Array.isArray(tags) ? tags : [],
      timeSpent: timeSpent || "",
      attempts: attempts != null ? Number(attempts) : null,
      language: language || "",
      notes: notes || "",
    });

    res.status(201).json({ success: true, message: "Problem added successfully", problem: newProblem });
  } catch (error) {
    console.error("Add problem error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /problems/:id - Update a problem (owner only)
 */
export const updateProblem = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "User ID missing" });

    const { id } = req.params;
    const { name, difficulty, topic, source, problemLink, githubLink, tags, timeSpent, attempts, language, notes, solvedAt } = req.body;

    const problem = await Problem.findOne({ _id: id, userId });
    if (!problem)
      return res.status(404).json({ success: false, message: "Problem not found or you don't have permission to edit it" });

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (difficulty !== undefined) updates.difficulty = difficulty;
    if (topic !== undefined) updates.topic = topic;
    if (source !== undefined) updates.source = source;
    if (problemLink !== undefined) updates.problemLink = problemLink;
    if (githubLink !== undefined) updates.githubLink = githubLink;
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];
    if (timeSpent !== undefined) updates.timeSpent = timeSpent;
    if (attempts !== undefined) updates.attempts = attempts != null ? Number(attempts) : null;
    if (language !== undefined) updates.language = language;
    if (notes !== undefined) updates.notes = notes;
    if (solvedAt !== undefined) updates.solvedAt = solvedAt;

    Object.assign(problem, updates);
    await problem.save();

    res.status(200).json({ success: true, message: "Problem updated successfully", problem });
  } catch (error) {
    console.error("Update problem error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
