import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false,
    },
    googleId: String,
    weeklyGoal: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

/** Generate a URL-safe slug from a string */
function slugify(str) {
  if (!str || typeof str !== "string") return "";
  return (
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20) || "user"
  );
}

/**
 * Ensure user has a username
 * Strategy:
 * 1. Try clean usernames (rahul_bhat, rahulbhat, rahul_bhat1...)
 * 2. Fallback to funky/random
 */
export async function ensureUsername(user) {
  if (user.username) return user;

  const User = mongoose.model("User");
  const base = slugify(user.name) || "user";

  const candidates = [
    base,                   // rahul_bhat
    base.replace(/_/g, ""), // rahulbhat
  ];

  for (let i = 1; i <= 5; i++) {
    candidates.push(`${base}${i}`);
  }

  // Try clean usernames first
  for (const username of candidates) {
    try {
      user.username = username;
      await user.save();
      return user;
    } catch (err) {
      if (err.code !== 11000) throw err; // not duplicate key
    }
  }

  // Fallback: funky usernames
  for (let i = 0; i < 5; i++) {
    const funky = `${base}_${Math.random().toString(36).slice(2, 8)}`;
    try {
      user.username = funky;
      await user.save();
      return user;
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
  }

  throw new Error("Could not generate unique username");
}

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
