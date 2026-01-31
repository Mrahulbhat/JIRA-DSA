import Problem from "../models/problems.model.js";
import User from "../models/user.model.js";

/**
 * Compute current and longest streak from problem solvedAt dates (by unique day).
 * Current streak = consecutive days ending with today or yesterday.
 */
function computeStreaks(solvedDates) {
  if (!solvedDates || solvedDates.length === 0) return { current: 0, longest: 0 };

  const dayMs = 24 * 60 * 60 * 1000;
  const sorted = [...new Set(solvedDates.map((d) => new Date(d).toDateString()))]
    .map((s) => new Date(s).getTime())
    .sort((a, b) => b - a);

  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - dayMs;

  let longest = 0;
  let run = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const diffDays = Math.round((sorted[i - 1] - sorted[i]) / dayMs);
      if (diffDays === 1) run++;
      else run = 1;
    }
    longest = Math.max(longest, run);
  }

  const mostRecent = sorted[0];
  const daysSinceMostRecent = Math.round((todayStart - mostRecent) / dayMs);
  let current = 0;
  if (daysSinceMostRecent === 0 || daysSinceMostRecent === 1) {
    current = 1;
    for (let i = 1; i < sorted.length; i++) {
      if (Math.round((sorted[i - 1] - sorted[i]) / dayMs) === 1) current++;
      else break;
    }
  }

  return { current, longest };
}

/**
 * GET /dashboard/stats - User's stats, streak, rank, weekly progress
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId).select("weeklyGoal");
    const weeklyGoal = user?.weeklyGoal ?? 10;

    const problems = await Problem.find({ userId }).select("difficulty solvedAt createdAt");
    const solvedDates = problems.map((p) => (p.solvedAt || p.createdAt).toISOString());

    const { current: currentStreak, longest: longestStreak } = computeStreaks(solvedDates);

    const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
    const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
    const hardCount = problems.filter((p) => p.difficulty === "Hard").length;
    const totalSolved = problems.length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyProgress = problems.filter(
      (p) => new Date(p.solvedAt || p.createdAt) >= weekAgo
    ).length;

    // Rank: users with more total problems solved are higher
    const allCounts = await Problem.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const totalUsers = await User.countDocuments();
    const rankIndex = allCounts.findIndex((c) => c._id.toString() === userId.toString());
    const rank = rankIndex === -1 ? totalUsers + 1 : rankIndex + 1;

    res.status(200).json({
      success: true,
      stats: {
        totalSolved,
        easyCount,
        mediumCount,
        hardCount,
        weeklyGoal,
        weeklyProgress,
        rank,
        totalUsers,
        currentStreak,
        longestStreak,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /dashboard/feed - Recent problems from all users (for FOMO)
 */
export const getFeed = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const problems = await Problem.find()
      .populate("userId", "name username")
      .sort({ solvedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    const feed = problems.map((p) => ({
      _id: p._id,
      name: p.name,
      difficulty: p.difficulty,
      topic: p.topic,
      solvedAt: p.solvedAt || p.createdAt,
      user: p.userId
        ? { id: p.userId._id, name: p.userId.name || "Anonymous", username: p.userId.username || p.userId.name?.toLowerCase().replace(/\s+/g, "_") || "user" }
        : { id: null, name: "Anonymous", username: "anonymous" },
    }));

    res.status(200).json({ success: true, feed });
  } catch (error) {
    console.error("getFeed error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /dashboard/problem-of-the-day - One problem user hasn't solved (or random)
 */
export const getProblemOfTheDay = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const mySolvedNames = userId ? await Problem.find({ userId }).distinct("name") : [];

    const all = await Problem.aggregate([
      { $group: { _id: "$name", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
      ...(mySolvedNames.length ? [{ $match: { name: { $nin: mySolvedNames } } }] : []),
      { $sample: { size: 1 } },
    ]);

    if (all.length === 0) {
      return res.status(200).json({
        success: true,
        problemOfTheDay: null,
        message: "You've solved everything in the pool! Add more problems.",
      });
    }

    const p = all[0];
    res.status(200).json({
      success: true,
      problemOfTheDay: {
        id: p._id,
        title: p.name,
        difficulty: p.difficulty,
        category: p.topic,
        source: p.source,
        problemLink: p.problemLink,
        solved: false,
      },
    });
  } catch (error) {
    console.error("getProblemOfTheDay error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
