import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    categories: [{ type: String }], // e.g. ["Teaching Quality", "Classroom Management"]
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
