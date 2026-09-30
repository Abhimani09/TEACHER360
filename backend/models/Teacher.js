import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    department: { type: String, required: true },
    role: { type: String, enum: ["Teacher", "Senior Teacher"], default: "Teacher" },
    userType: { type: String, enum: ["admin", "teacher"], default: "teacher" },
    attendance: { type: Number, default: 0 }, // %
    punctuality: { type: Number, default: 0 }, // %
    performance: { type: Number, default: 0 }, // %
    trainingHoursCompleted: { type: Number, default: 0 },
    trainingHoursTarget: { type: Number, default: 10 },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

teacherSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Teacher", teacherSchema);
