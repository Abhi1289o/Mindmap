const express = require("express");
const cors = require("cors");
const pool = require("./db");

app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("MindMap is running...");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE name=$1 AND password=$2",
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => {
    console.log('server is running...');
});