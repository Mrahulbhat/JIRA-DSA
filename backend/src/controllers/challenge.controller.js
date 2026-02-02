import Challenge from "../models/challenge.model.js";
import Problem from "../models/problems.model.js";

/**
 * Normalize problem name to avoid duplicates
 */
const normalizeName = (str = "") =>
  str.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * POST /challenges - Create a challenge (assign problem to another user)
 */
export const createChallenge = async (req, res) => {
  try {
    const challengerId = req.user?.userId;
    if (!challengerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { challengeeId, problem } = req.body;

    if (
      !challengeeId ||
      !problem?.name ||
      !problem?.difficulty ||
      !problem?.topic ||
      !problem?.source ||
      !problem?.problemLink
    ) {
      return res.status(400).json({
        success: false,
        message:
          "challengeeId and problem (name, difficulty, topic, source, problemLink) are required",
      });
    }

    if (challengeeId === challengerId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot challenge yourself" });
    }

    const normalizedName = normalizeName(problem.name);

    // ===== Duplicate check (FIXED) =====
    const existingChallenge = await Challenge.findOne({
      challengerId,
      challengeeId,
      "problem.normalizedName": normalizedName,
      status: { $in: ["pending", "completed"] },
    });

    if (existingChallenge) {
      return res.status(400).json({
        success: false,
        message: "This problem has already been challenged to this user",
      });
    }
    // ==================================

    const challenge = await Challenge.create({
      challengerId,
      challengeeId,
      problem: {
        name: problem.name,
        normalizedName,
        difficulty: problem.difficulty,
        topic: problem.topic,
        source: problem.source,
        problemLink: problem.problemLink,
        tags: Array.isArray(problem.tags) ? problem.tags : [],
      },
      status: "pending",
    });

    const populated = await Challenge.findById(challenge._id)
      .populate("challengerId", "name username")
      .populate("challengeeId", "name username")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Challenge sent!",
      challenge: populated,
    });
  } catch (error) {
    console.error("createChallenge error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

/**
 * GET /challenges/pending-count - Count of pending received challenges
 */
export const getPendingCount = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const count = await Challenge.countDocuments({
      challengeeId: userId,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      pendingReceived: count,
    });
  } catch (error) {
    console.error("getPendingCount error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

/**
 * GET /challenges - My challenges (sent + received)
 */
export const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const challenges = await Challenge.find({
      $or: [{ challengerId: userId }, { challengeeId: userId }],
    })
      .populate("challengerId", "name username")
      .populate("challengeeId", "name username")
      .sort({ createdAt: -1 })
      .lean();

    const sent = challenges.filter(
      (c) => c.challengerId?._id.toString() === userId
    );
    const received = challenges.filter(
      (c) => c.challengeeId?._id.toString() === userId
    );

    return res.status(200).json({
      success: true,
      challenges,
      sent,
      received,
    });
  } catch (error) {
    console.error("getMyChallenges error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

/**
 * PATCH /challenges/:id/complete - Challengee marks as solved
 */
export const completeChallenge = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { githubLink } = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    if (challenge.challengeeId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the challenged user can complete this",
      });
    }

    if (challenge.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Challenge already completed",
      });
    }

    await Problem.create({
      userId: challenge.challengeeId,
      name: challenge.problem.name,
      difficulty: challenge.problem.difficulty,
      topic: challenge.problem.topic,
      source: challenge.problem.source,
      problemLink: challenge.problem.problemLink,
      githubLink: githubLink || challenge.problem.problemLink,
      tags: challenge.problem.tags || [],
    });

    challenge.status = "completed";
    challenge.completedAt = new Date();
    if (githubLink) challenge.solutionLink = githubLink;

    await challenge.save();

    return res.status(200).json({
      success: true,
      message: "Challenge completed! Problem added to your account.",
      challenge: await Challenge.findById(id)
        .populate("challengerId", "name username")
        .populate("challengeeId", "name username")
        .lean(),
    });
  } catch (error) {
    console.error("completeChallenge error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};
export const deleteChallenge = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID in token" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Challenge ID is required" });
    }

    const challenge = await Challenge.findById(id).lean();
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    // Handle populated or raw ObjectId
    const challengerIdStr =
      typeof challenge.challengerId === "object" && challenge.challengerId?._id
        ? challenge.challengerId._id.toString()
        : challenge.challengerId?.toString();

    if (challengerIdStr !== userId) {
      return res.status(403).json({ success: false, message: "You are not allowed to delete this challenge" });
    }

    await Challenge.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Challenge deleted successfully" });
  } catch (error) {
    console.error("deleteChallenge error:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};
