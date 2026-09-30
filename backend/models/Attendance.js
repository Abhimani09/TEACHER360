import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Late", "Absent"], required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
