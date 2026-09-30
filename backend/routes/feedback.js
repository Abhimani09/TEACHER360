import { Router } from "express";
import Feedback from "../models/Feedback.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/feedback — recent feedback (optionally ?teacher=<id>)
router.get("/", async (req, res) => {
  const filter = req.query.teacher ? { teacher: req.query.teacher } : {};
  const feedback = await Feedback.find(filter)
    .populate("teacher", "name")
    .populate("submittedBy", "name")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(feedback);
});

// POST /api/feedback — admin/management submits feedback for a teacher
router.post("/", requireAdmin, async (req, res) => {
  const { teacher, categories, rating, comment } = req.body;
  const entry = await Feedback.create({
    teacher,
    submittedBy: req.user.id,
    categories,
    rating,
    comment,
  });
  res.status(201).json(entry);
});

export default router;
