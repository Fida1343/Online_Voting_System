const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // change if you have a password
  password: "",
  database: "voting_system"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// Register user
app.post("/register", async (req, res) => {
  const { voter_id, name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (voter_id, name, email, password) VALUES (?, ?, ?, ?)",
    [voter_id, name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "User registered successfully!" });
    }
  );
});

// Login user
app.post("/login", (req, res) => {
  const { voter_id, password } = req.body;

  db.query("SELECT * FROM users WHERE voter_id = ?", [voter_id], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send({ message: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).send({ message: "Invalid credentials" });

    res.send({ message: "Login successful", user });
  });
});

// Fetch candidates
app.get("/candidates", (req, res) => {
  db.query("SELECT * FROM candidates", (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Cast vote
app.post("/vote", (req, res) => {
  const { user_id, candidate_id } = req.body;

  // Check if user already voted
  db.query("SELECT * FROM votes WHERE user_id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).send({ message: "User has already voted" });

    db.query("INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)", [user_id, candidate_id], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.send({ message: "Vote cast successfully!" });
    });
  });
});

// Get results
app.get("/results", (req, res) => {
  db.query(
    `SELECT c.name, COUNT(v.id) as vote_count 
     FROM candidates c 
     LEFT JOIN votes v ON c.id = v.candidate_id 
     GROUP BY c.id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
