import Problem from "../models/problems.model.js";

/**
 * helper to safely get userId
 */
const getUserId = (req) => req.user?.userId || req.user?._id;

/**
 * GET /problems
 * Get all problems of logged-in user
 */
export const getMyProblems = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const problems = await Problem.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /problems/:id
 * Get single problem (owner only)
 */
export const getProblemById = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const problem = await Problem.findOne({
      _id: req.params.id,
      userId,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({ success: true, problem });
  } catch (error) {
    console.error("Get problem error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /problems
 * Add new problem
 */
export const addProblem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      name,
      difficulty,
      topic,
      source,
      problemLink,
      githubLink,
      tags,
      language,
      notes,
    } = req.body;

    if (!name || !difficulty || !topic || !source || !problemLink) {
      return res.status(400).json({
        success: false,
        message:
          "name, difficulty, topic, source and problemLink are required",
      });
    }

    // ✅ SIMPLE DUPLICATE CHECK
    const existing = await Problem.findOne({
      userId,
      name: name.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already added this problem",
      });
    }

    const problem = await Problem.create({
      userId,
      name,
      difficulty,
      topic,
      source,
      problemLink,
      githubLink: githubLink || "",
      tags: Array.isArray(tags) ? tags : [],
      language: language || "",
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "Problem added successfully",
      problem,
    });
  } catch (error) {
    console.error("Add problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * PATCH /problems/:id
 * Update problem (owner only)
 */
export const updateProblem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const problem = await Problem.findOne({
      _id: req.params.id,
      userId,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found or no permission",
      });
    }

    const allowedFields = [
      "name",
      "difficulty",
      "topic",
      "source",
      "problemLink",
      "githubLink",
      "tags",
      "language",
      "notes",
      "solvedAt",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        problem[field] =
          field === "tags" && Array.isArray(req.body[field])
            ? req.body[field]
            : req.body[field];
      }
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    console.error("Update problem error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
