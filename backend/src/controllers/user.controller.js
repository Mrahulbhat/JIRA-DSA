import User from "../models/user.model.js";

/**
 * GET /users - List all users (for challenge dropdown). Returns id, name, username. Excludes current user.
 */
export const listAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?.userId;
    const users = await User.find(currentUserId ? { _id: { $ne: currentUserId } } : {})
      .select("_id name username")
      .sort({ username: 1 })
      .lean();

    const list = users.map((u) => ({
      id: u._id,
      name: u.name || "Anonymous",
      username: u.username || (u.name ? u.name.toLowerCase().replace(/\s+/g, "_").slice(0, 20) : "user"),
    }));

    res.status(200).json({ success: true, users: list });
  } catch (error) {
    console.error("listAllUsers error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /users/search?q= - Search users by name or username. Returns id, name, username.
 */
export const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    if (!q) {
      return res.status(200).json({ success: true, users: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q.replace(/\s+/g, "_"), $options: "i" } },
      ],
    })
      .select("_id name username")
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      users: users.map((u) => ({
        id: u._id,
        name: u.name || "Anonymous",
        username: u.username || (u.name ? u.name.toLowerCase().replace(/\s+/g, "_").slice(0, 20) : "user"),
      })),
    });
  } catch (error) {
    console.error("searchUsers error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE MY ACCOUNT
export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account and all related data deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete account",
    });
  }
};


