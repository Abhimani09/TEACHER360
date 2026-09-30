import { Router } from "express";
import Teacher from "../models/Teacher.js";
import LessonPlan from "../models/LessonPlan.js";
import Certification from "../models/Certification.js";
import Feedback from "../models/Feedback.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/teachers  — list all (for teacher grid + leaderboard)
router.get("/", async (req, res) => {
  const teachers = await Teacher.find().select("-password").sort({ xp: -1 });
  res.json(teachers);
});

// GET /api/teachers/dashboard-stats — admin dashboard cards
router.get("/dashboard-stats", async (req, res) => {
  const teachers = await Teacher.find();
  const avgAttendance = teachers.length
    ? Math.round(teachers.reduce((a, t) => a + t.attendance, 0) / teachers.length)
    : 0;
  const totalCerts = await Certification.countDocuments();
  const pendingLessons = await LessonPlan.countDocuments({ status: "Pending" });

  res.json({
    teacherCount: teachers.length,
    avgAttendance,
    totalCerts,
    pendingLessons,
  });
});

// GET /api/teachers/:id — full profile (certs, lessons, feedback)
router.get("/:id", async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).select("-password");
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const [certs, lessons, feedback] = await Promise.all([
    Certification.find({ teacher: teacher._id }),
    LessonPlan.find({ teacher: teacher._id }).sort({ createdAt: -1 }),
    Feedback.find({ teacher: teacher._id }).sort({ createdAt: -1 }),
  ]);

  res.json({ teacher, certs, lessons, feedback });
});

export default router;
