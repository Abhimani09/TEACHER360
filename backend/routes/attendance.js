import { Router } from "express";
import Attendance from "../models/Attendance.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/attendance/:teacherId — monthly calendar for one teacher
router.get("/:teacherId", async (req, res) => {
  const records = await Attendance.find({ teacher: req.params.teacherId }).sort({ date: 1 });
  res.json(records);
});

// POST /api/attendance — admin marks a day's attendance
router.post("/", requireAdmin, async (req, res) => {
  const { teacher, date, status } = req.body;
  const record = await Attendance.findOneAndUpdate(
    { teacher, date },
    { status },
    { upsert: true, new: true }
  );
  res.status(201).json(record);
});

export default router;
