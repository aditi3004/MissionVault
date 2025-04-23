const express = require("express");
const path = require("path");
const open = require("open"); // Import the open package
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/CRUD_api");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files (like login.html, signup.html, users.html)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", authRoutes);
app.use("/api", apiRoutes); // Optional if you use CRUD API

// Start Server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
  open("http://localhost:3000/login.html"); // Automatically open the login page
});
