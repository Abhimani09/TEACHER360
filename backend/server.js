import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import teacherRoutes from "./routes/teachers.js";
import lessonRoutes from "./routes/lessons.js";
import attendanceRoutes from "./routes/attendance.js";
import trainingRoutes from "./routes/training.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();
await connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => res.send("NEXENTIA API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`NEXENTIA API listening on port ${PORT}`));
