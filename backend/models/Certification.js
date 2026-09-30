import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    name: { type: String, required: true },
    completedDate: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    hours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Certification", certificationSchema);
