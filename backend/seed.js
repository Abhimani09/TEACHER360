// Seeds the database with sample teachers, an admin, lesson plans, certs and feedback.
// Run with: npm run seed
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Teacher from "./models/Teacher.js";
import LessonPlan from "./models/LessonPlan.js";
import Certification from "./models/Certification.js";
import Feedback from "./models/Feedback.js";

dotenv.config();
await connectDB();

await Promise.all([
  Teacher.deleteMany({}),
  LessonPlan.deleteMany({}),
  Certification.deleteMany({}),
  Feedback.deleteMany({}),
]);

const admin = await Teacher.create({
  name: "Admin",
  email: "admin@nexentia.lk",
  password: "admin123",
  department: "Management",
  role: "Senior Teacher",
  userType: "admin",
});

const teacherData = [
  { name: "Sarah Perera", email: "sarah.perera@nexentia.lk", department: "ICT", role: "Senior Teacher", attendance: 96, punctuality: 94, performance: 91, trainingHoursCompleted: 8, xp: 950 },
  { name: "Nadeesha Silva", email: "nadeesha.silva@nexentia.lk", department: "Mathematics", role: "Teacher", attendance: 98, punctuality: 97, performance: 88, trainingHoursCompleted: 9, xp: 870 },
  { name: "Amanda Fernando", email: "amanda.fernando@nexentia.lk", department: "Science", role: "Senior Teacher", attendance: 93, punctuality: 90, performance: 85, trainingHoursCompleted: 7, xp: 820 },
  { name: "Kasun Jayawardena", email: "kasun.jaya@nexentia.lk", department: "English", role: "Teacher", attendance: 89, punctuality: 85, performance: 78, trainingHoursCompleted: 5, xp: 640 },
];

// NOTE: insertMany() skips Mongoose's pre("save") hook, so it would store these
// passwords in plain text instead of hashed — create() each one so the hook runs.
const teachers = [];
for (const t of teacherData) {
  const doc = await Teacher.create({ ...t, password: "teacher123", userType: "teacher" });
  teachers.push(doc);
}

await LessonPlan.insertMany([
  { teacher: teachers[0]._id, subject: "Computer Science", week: "Week 03", status: "Approved", reviewedBy: admin._id, reviewedAt: new Date() },
  { teacher: teachers[0]._id, subject: "ICT Theory", week: "Week 04", status: "Pending" },
  { teacher: teachers[1]._id, subject: "Mathematics", week: "Week 03", status: "Approved", reviewedBy: admin._id, reviewedAt: new Date() },
  { teacher: teachers[3]._id, subject: "English Literature", week: "Week 04", status: "Rejected", reviewedBy: admin._id, reviewNote: "Needs more student engagement activities.", reviewedAt: new Date() },
]);

await Certification.insertMany([
  { teacher: teachers[0]._id, name: "Google Certified Educator", completedDate: new Date("2026-08-12"), verified: true, hours: 12 },
  { teacher: teachers[1]._id, name: "Advanced Pedagogy Cert", completedDate: new Date("2026-06-20"), verified: true, hours: 10 },
]);

await Feedback.insertMany([
  { teacher: teachers[0]._id, submittedBy: admin._id, categories: ["Teaching Quality"], rating: 5, comment: "Excellent use of interactive teaching methods." },
]);

console.log("Seed complete. Login as admin@nexentia.lk / admin123 or sarah.perera@nexentia.lk / teacher123");
process.exit(0);
