import Problem from "../models/problems.model.js";
import User from "../models/user.model.js";

/**
 * GET /dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId.toString();

    // 1️⃣ Fetch all users
    const users = await User.find()
      .select("_id weeklyGoal")
      .lean();

    // 2️⃣ Aggregate problems per user
    const problemStats = await Problem.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSolved: { $sum: 1 },
          easyCount: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0] },
          },
          mediumCount: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0] },
          },
          hardCount: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0] },
          },
        },
      },
    ]);

    const statsMap = Object.fromEntries(
      problemStats.map((p) => [
        p._id.toString(),
        {
          totalSolved: p.totalSolved,
          easyCount: p.easyCount,
          mediumCount: p.mediumCount,
          hardCount: p.hardCount,
        },
      ])
    );

    // 3️⃣ Build full leaderboard (NO pagination)
    const leaderboard = users
      .map((u) => ({
        userId: u._id.toString(),
        totalSolved: statsMap[u._id.toString()]?.totalSolved || 0,
      }))
      .sort((a, b) => b.totalSolved - a.totalSolved);

    // 4️⃣ Rank + totalUsers (same dataset ✅)
    const totalUsers = leaderboard.length;

    const rankIndex = leaderboard.findIndex(
      (u) => u.userId === userId
    );

    const rank = rankIndex === -1 ? totalUsers : rankIndex + 1;

    // 5️⃣ Current user's stats
    const myStats = statsMap[userId] || {
      totalSolved: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
    };

    const me = users.find((u) => u._id.toString() === userId);

    res.status(200).json({
      success: true,
      stats: {
        totalSolved: myStats.totalSolved,
        easyCount: myStats.easyCount,
        mediumCount: myStats.mediumCount,
        hardCount: myStats.hardCount,
        weeklyGoal: me?.weeklyGoal || 10,
        weeklyProgress: myStats.totalSolved, // adjust if you track weekly separately
        rank,
        totalUsers,
        currentStreak: 0,   // plug in if you track streaks
        longestStreak: 0,   // plug in if you track streaks
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
