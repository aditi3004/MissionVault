const express = require("express");
const db = require("../config/db");
const router = express.Router();

// === LOGIN FUNCTIONALITY ===
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.execute(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({ success: true, message: "Login successful", user: results[0] });
  });
});

// === CRUD: GET ALL PERSONNEL ===
router.get("/records", (req, res) => {
  const sql = "SELECT * FROM personnel";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === ADD NEW PERSONNEL ===
router.post("/records", (req, res) => {
  const {
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  } = req.body;

  if (
    [
      name,
      role,
      ranking,
      email,
      aadhaar_number,
      pan_number,
      dob,
      service_number,
    ].includes(undefined)
  ) {
    return res.status(400).json({
      error: "All fields must be provided. No undefined values allowed.",
    });
  }

  const sql = `
    INSERT INTO personnel (
      name, role, ranking, email,
      aadhaar_number, pan_number, dob, service_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  ];

  db.execute(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, personnel_id: result.insertId });
  });
});

// === UPDATE PERSONNEL ===
router.put("/records/:personnel_id", (req, res) => {
  const {
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  } = req.body;

  const sql = `
    UPDATE personnel SET
      name=?, role=?, ranking=?, email=?,
      aadhaar_number=?, pan_number=?, dob=?, service_number=?
    WHERE personnel_id=?
  `;

  const values = [
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
    req.params.personnel_id,
  ].map((val) => (val === undefined ? null : val));

  db.execute(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// === DELETE PERSONNEL ===
router.delete("/records/:personnel_id", (req, res) => {
  const sql = "DELETE FROM personnel WHERE personnel_id=?";
  db.execute(sql, [req.params.personnel_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
