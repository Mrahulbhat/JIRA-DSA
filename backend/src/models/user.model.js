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
      sparse: true 
    },
    password: {
      type: String,
      select: false
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
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20) || "user";
}

/** Generate unique username: base + random suffix */
export async function ensureUsername(user) {
  if (user.username) return user;
  const base = slugify(user.name) || "user";
  let username = `${base}_${Math.random().toString(36).slice(2, 8)}`;
  let exists = await mongoose.model("User").findOne({ username });
  while (exists) {
    username = `${base}_${Math.random().toString(36).slice(2, 8)}`;
    exists = await mongoose.model("User").findOne({ username });
  }
  user.username = username;
  await user.save();
  return user;
}


// Hash password before saving
userSchema.pre("save", async function () {
  // Skip if password is not modified or doesn't exist (e.g., Google OAuth)
  if (!this.isModified("password") || !this.password) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
