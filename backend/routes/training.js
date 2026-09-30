import { Router } from "express";
import Certification from "../models/Certification.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/training — all certifications (training overview page)
router.get("/", async (req, res) => {
  const certs = await Certification.find().populate("teacher", "name department");
  res.json(certs);
});

// POST /api/training — teacher logs a new certification
router.post("/", async (req, res) => {
  const { name, completedDate, hours } = req.body;
  const cert = await Certification.create({
    teacher: req.user.id,
    name,
    completedDate,
    hours,
    verified: false,
  });
  res.status(201).json(cert);
});

// PATCH /api/training/:id/verify — admin verifies a certification
router.patch("/:id/verify", requireAdmin, async (req, res) => {
  const cert = await Certification.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  if (!cert) return res.status(404).json({ message: "Certification not found" });
  res.json(cert);
});

export default router;
