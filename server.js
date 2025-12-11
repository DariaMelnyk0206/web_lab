import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/data", express.static(path.join(process.cwd(), "views/data")));

const dbPath = path.join(process.cwd(), "views/data/db.json");

function readDB() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

app.get("/", (req, res) => res.render("index"));

app.get("/courses", (req, res) => {
  const db = readDB();
  res.render("courses", { courses: db.courses });
});

app.get("/courses/:id", (req, res) => {
  const db = readDB();
  const course = db.courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.render("courseDetails", { course });
});

app.get("/api/courses", (req, res) => {
  const db = readDB();
  res.json(db.courses);
});

app.get("/api/courses/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const course = db.courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

app.patch("/api/courses/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const course = db.courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  course.likes = (course.likes || 0) + 1;

  writeDB(db);
  res.json(course);
});

app.get("/enroll/:id", (req, res) => {
  const db = readDB();
  const course = db.courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.render("enroll", { course });
});

app.post("/enroll/:id", (req, res) => {
  const db = readDB();
  if (!db.enrollments) db.enrollments = [];
  db.enrollments.push({
    id: Date.now(),
    courseId: parseInt(req.params.id),
    ...req.body
  });
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);