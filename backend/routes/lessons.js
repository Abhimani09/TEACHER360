import { Router } from "express";
import LessonPlan from "../models/LessonPlan.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/lessons — all lesson plans (admin review table), newest first
router.get("/", async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const lessons = await LessonPlan.find(filter)
    .populate("teacher", "name department")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 });
  res.json(lessons);
});

// POST /api/lessons — teacher submits a new lesson plan
router.post("/", async (req, res) => {
  const { subject, week, fileUrl, notes } = req.body;
  if (req.user.userType !== "teacher") {
    return res.status(403).json({ message: "Only teachers can submit lesson plans" });
  }
  const lesson = await LessonPlan.create({
    teacher: req.user.id,
    subject,
    week,
    fileUrl,
    notes,
    status: "Pending",
  });
  res.status(201).json(lesson);
});

// PATCH /api/lessons/:id/review — admin approves or rejects
// body: { decision: "Approved" | "Rejected", reviewNote?: string }
router.patch("/:id/review", requireAdmin, async (req, res) => {
  const { decision, reviewNote } = req.body;
  if (!["Approved", "Rejected"].includes(decision)) {
    return res.status(400).json({ message: "decision must be 'Approved' or 'Rejected'" });
  }

  const lesson = await LessonPlan.findByIdAndUpdate(
    req.params.id,
    {
      status: decision,
      reviewedBy: req.user.id,
      reviewNote: reviewNote || "",
      reviewedAt: new Date(),
    },
    { new: true }
  ).populate("teacher", "name department");

  if (!lesson) return res.status(404).json({ message: "Lesson plan not found" });

  res.json(lesson);
});

// PATCH /api/lessons/:id/reset — admin sends it back to Pending (undo)
router.patch("/:id/reset", requireAdmin, async (req, res) => {
  const lesson = await LessonPlan.findByIdAndUpdate(
    req.params.id,
    { status: "Pending", reviewedBy: null, reviewNote: "", reviewedAt: null },
    { new: true }
  );
  if (!lesson) return res.status(404).json({ message: "Lesson plan not found" });
  res.json(lesson);
});

export default router;
