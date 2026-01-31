import Problem from "../models/problems.model.js";
import User from "../models/user.model.js";

/**
 * GET /leaderboard - Users sorted by total problems solved (with streak info)
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = parseInt(req.query.skip, 10) || 0;

    const counts = await Problem.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 }, easy: { $sum: { $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0] } }, medium: { $sum: { $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0] } }, hard: { $sum: { $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0] } } } },
      { $sort: { count: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const userIds = counts.map((c) => c._id);
    const users = await User.find({ _id: { $in: userIds } }).select("name username").lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), { name: u.name || "Anonymous", username: u.username || u.name?.toLowerCase().replace(/\s+/g, "_") || "user" }]));

    const leaderboard = counts.map((c, i) => ({
      rank: skip + i + 1,
      userId: c._id,
      name: userMap[c._id.toString()]?.name || "Anonymous",
      username: userMap[c._id.toString()]?.username || "user",
      totalSolved: c.count,
      easyCount: c.easy,
      mediumCount: c.medium,
      hardCount: c.hard,
    }));

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("getLeaderboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
