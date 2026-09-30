import mongoose from "mongoose";

const lessonPlanSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    subject: { type: String, required: true },
    week: { type: String, required: true },
    fileUrl: { type: String }, // optional uploaded file link
    notes: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    reviewNote: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("LessonPlan", lessonPlanSchema);
