import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/**
 *  Add Student with Image Upload
 */
app.post("/add-students", upload.single("photo"), (req, res) => {
  const { name, phone, email, gender, address, subject } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!name || !phone || !email || !gender || !address || !subject) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const courses = JSON.parse(subject).join(", ");

  const sql =
    "INSERT INTO students (name, phone, email, gender,  address, subject, photo, isDelete ) VALUES (?, ?,  ?, ?, ?, ?, ?, 0)";
  db.query(
    sql,
    [name, phone, email, gender, address, courses, photo],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Student added successfully!" });
    }
  );
});

/**
 * Get All Students 
 */
app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students WHERE isDelete = 0";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.get("/students/edit/:id", (req, res) => {
  const sql = "SELECT * FROM students WHERE id =?";
  const id = req.params.id;

  db.query(sql, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (data[0].photo) {
      data[0].photo = `http://localhost:5001${data[0].photo}`;
    }
    return res.json(data[0]);
  });
});






app.put("/students/edit/:id", upload.single("photo"), (req, res) => {
    const { id } = req.params;
    const { name, phone, email, gender, address } = req.body;

    // Check if photo was uploaded
    const photo = req.file ? req.file.filename : null;
    
    // Handle subject properly
    let course;
    if (req.body.subject) {
        try {
            course = Array.isArray(req.body.subject) 
                ? req.body.subject.join(",") 
                : JSON.parse(req.body.subject).join(",");
        } catch (error) {
            course = req.body.subject; // Fallback to string if JSON parse fails
        }
    }

    // First, fetch the existing subject value from the database
    const getSubjectQuery = "SELECT subject FROM students WHERE id = ?";
    db.query(getSubjectQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                details: err,
            });
        }

        // Use the existing subject if none is provided in the request
        if (!course) {
            course = results[0]?.subject || "";
        }

        // Construct the update query and values
        let query = "UPDATE students SET name=?, phone=?, email=?, gender=?, address=?, subject=?";
        let values = [name, phone, email, gender, address, course];

        // If a new photo is uploaded, include the photo in the update
        if (photo) {
            query += ", photo=?";
            values.push(photo);
        }

        // Add the condition for the student ID
        query += " WHERE id=?";
        values.push(id);

        // Execute the update query
        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Internal Server Error",
                    details: err,
                });
            }
            res.json({ message: "Student updated successfully!" });
        });
    });
});




app.put("/students/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE students SET isDelete = 1 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error updating isDelete column:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({ message: "Student marked as deleted" });
  });
});

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students WHERE isDelete = 0"; // Only fetch active students
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(results);
  });
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
