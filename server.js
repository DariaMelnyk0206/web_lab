const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

const courses = [
    {
        id: 1,
        topic: "Web Development",
        title: "Introduction to Web Development",
        description: "Learn the basics of HTML, CSS, and JavaScript to start building modern websites at your own pace.",
        price: "Free course",
        level: "Beginner",
        duration: "24 hours",
        technology: ["HTML & CSS", "JavaScript"],
        exercises: 20,
        videos: 35,
        lessons: 12,
        rating: 4.8,
        whatLearn: [
            "Understand how the web works and how browsers display web pages.",
            "Write clean and structured HTML code.",
            "Style and format pages using CSS.",
            "Use JavaScript to add interactivity and dynamic behavior.",
            "Create a simple but functional web project (personal page or landing page)."
        ]
    },
    {
        id: 2,
        topic: "Artificial Intelligence",
        title: "Introduction to Artificial Intelligence",
        description: "Learn the fundamentals of AI, from logic-based models to neural networks, and how they drive intelligent systems.",
        price: "Free course",
        level: "Beginner",
        duration: "15 hours",
        technology: ["Python", "MATLAB"],
        exercises: 15,
        videos: 25,
        lessons: 10,
        rating: 4.7,
        whatLearn: [
            "Understand the basic concepts of AI and intelligent agents.",
            "Learn about search algorithms and problem-solving techniques.",
            "Get introduced to neural networks and machine learning basics.",
            "Explore real-world applications of AI in different domains."
        ]
    },
    {
        id: 3,
        topic: "Machine Learning",
        title: "Applied Machine Learning with Python",
        description: "Build predictive models using Python libraries and apply ML techniques to solve real-world problems.",
        price: "",
        level: "Intermediate",
        duration: "52 hours",
        technology: ["Python", "R", "SQL"],
        exercises: 30,
        videos: 42,
        lessons: 16,
        rating: 4.9,
        whatLearn: [
            "Prepare and process datasets for ML tasks.",
            "Build and evaluate supervised and unsupervised models.",
            "Use Python libraries for data analysis and modeling.",
            "Apply ML techniques to real-world scenarios."
        ]
    },
    {
        id: 4,
        topic: "Cloud & DevOps",
        title: "Cloud Computing with AWS",
        description: "Understand the fundamentals of cloud infrastructure, automation, and scalable deployment pipelines.",
        price: "",
        level: "Intermediate",
        duration: "18 hours",
        technology: ["Go", "Bash", "Java"],
        exercises: 18,
        videos: 30,
        lessons: 11,
        rating: 4.6,
        whatLearn: [
            "Understand cloud computing concepts and AWS services.",
            "Learn deployment automation and CI/CD pipelines.",
            "Manage scalable cloud infrastructure.",
            "Explore DevOps best practices."
        ]
    },
    {
        id: 5,
        topic: "Data Engineering",
        title: "Data Engineering with SQL and Python",
        description: "Learn how to design, build, and maintain scalable data pipelines using SQL and Python.",
        price: "",
        level: "Intermediate",
        duration: "28 hours",
        technology: ["SQL", "Python"],
        exercises: 22,
        videos: 33,
        lessons: 13,
        rating: 4.8,
        whatLearn: [
            "Design and implement data pipelines.",
            "Use SQL for data extraction and transformation.",
            "Process data using Python for analysis and reporting.",
            "Maintain and optimize ETL workflows."
        ]
    },
    {
        id: 6,
        topic: "Software Development",
        title: "Object-Oriented Programming in C++",
        description: "Dive into classes, inheritance, and polymorphism to master OOP principles with C++.",
        price: "",
        level: "Advanced",
        duration: "65 hours",
        technology: ["C / C++", "Rust"],
        exercises: 28,
        videos: 45,
        lessons: 18,
        rating: 4.9,
        whatLearn: [
            "Understand object-oriented programming principles.",
            "Implement classes, inheritance, and polymorphism in C++.",
            "Work on real-world programming projects.",
            "Learn best practices for software development and design patterns."
        ]
    }
];
  

app.get('/courses', (req, res) => {
    res.render('courses', { courses });
});
  
app.get("/courses/:id", (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
  
    if (!course) {
        return res.status(404).send("Course not found");
    }
  
    res.render("courseDetails", { course });
});

app.get("/enroll/:id", (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
  
    if (!course) return res.status(404).send("Course not found");
    res.render("enroll", { course });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

