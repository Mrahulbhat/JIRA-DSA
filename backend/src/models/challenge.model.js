import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    challengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      name: { type: String, required: true },
      difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
      topic: { type: String, required: true },
      source: { type: String, required: true },
      problemLink: { type: String, required: true },
      tags: { type: [String], default: [] },
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    completedAt: Date,
    // When challengee completes, we create a Problem with their userId and this solution link
    solutionLink: { type: String, default: "" },
  },
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
