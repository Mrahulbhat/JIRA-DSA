import Problem from "../models/problems.model.js";
import User from "../models/user.model.js";

/**
 * GET /leaderboard - All users sorted by total problems solved (includes users with 0)
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = parseInt(req.query.skip, 10) || 0;

    // Get problem counts per user
    const counts = await Problem.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 }, easy: { $sum: { $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0] } }, medium: { $sum: { $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0] } }, hard: { $sum: { $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0] } } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), { count: c.count, easy: c.easy, medium: c.medium, hard: c.hard }]));

    // Get all users and merge with counts
    const users = await User.find().select("name username").lean();
    const leaderboardRaw = users.map((u) => {
      const c = countMap[u._id.toString()] || { count: 0, easy: 0, medium: 0, hard: 0 };
      return {
        userId: u._id,
        name: u.name || "Anonymous",
        username: u.username || u.name?.toLowerCase()?.replace(/\s+/g, "_") || "user",
        totalSolved: c.count,
        easyCount: c.easy,
        mediumCount: c.medium,
        hardCount: c.hard,
      };
    });

    // Sort by totalSolved desc, then apply pagination
    leaderboardRaw.sort((a, b) => b.totalSolved - a.totalSolved);
    const leaderboard = leaderboardRaw.slice(skip, skip + limit).map((entry, i) => ({
      ...entry,
      rank: skip + i + 1,
    }));

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("getLeaderboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
