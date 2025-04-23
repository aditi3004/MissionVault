const express = require("express");
const path = require("path");
const db = require("../config/db");
const router = express.Router();

// Serve Signup Page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

// Serve Login Page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Handle Signup - Insert into personnel then users
router.post("/signup", (req, res) => {
  const {
    username,
    password,
    role,
    name,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  } = req.body;

  const insertPersonnel = `
    INSERT INTO personnel (name, ranking, email, aadhaar_number, pan_number, dob, service_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    insertPersonnel,
    [name, ranking, email, aadhaar_number, pan_number, dob, service_number],
    (err, result) => {
      if (err) {
        console.error("Error inserting into personnel:", err);
        return res.send("Signup failed.");
      }

      const personnel_id = result.insertId;

      const insertUser = `
        INSERT INTO users (username, password, role, personnel_id)
        VALUES (?, ?, ?, ?)
      `;

      db.execute(
        insertUser,
        [username, password, role, personnel_id],
        (err2) => {
          if (err2) {
            console.error("Error inserting into users:", err2);
            return res.send("Signup failed.");
          }

          res.redirect("/login");
        }
      );
    }
  );
});

// Handle Login
// Handle Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Insecure query concatenation - vulnerable to SQL injection
  const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'";

  db.execute(query, (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.send("Login failed.");
    }

    if (results.length === 0) {
      return res.send("Invalid username or password.");
    }

    return res.redirect("/dashboard.html");
  });
});

module.exports = router;
