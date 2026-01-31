import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },
        topic: {
            enum: ["Sorting", "Searching", "Basic Math", "Array", "String", "Bit Manipulation", "Recursion", "Hashing", "Linked List", "Stack", "Queue", "Tree", "Graph", "Dynamic Programming", "Greedy", "Backtracking", "Two Pointers", "Sliding Window", "Heap", "Trie", "Others"],
            type: String,
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        problemLink: {
            type: String,
            required: true,
        },
        githubLink: {
            type: String,
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
        solvedAt: {
            type: Date,
            default: () => new Date(),
        },
        language: { type: String, default: "" },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
