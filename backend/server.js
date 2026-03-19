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
  const { username, password } = req.body; // keep "username" for frontend compatibility

  try {
    const result = await pool.query(
      "SELECT user_id, name, root_card_id FROM users WHERE name=$1 AND password=$2",
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Return user info including root_card_id
      res.json({
        success: true,
        message: "Login successful",
        user_id: user.user_id,
        name: user.name,
        root_card_id: user.root_card_id
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Express.js example
app.get('/cards/:cardId', async (req, res) => {
  const cardId = req.params.cardId;

  const card = await pool.query(
    `SELECT title, card_content FROM cards WHERE card_id = $1`,
    [cardId]
  );

  if (!card.rows.length) {
    return res.status(404).json({ error: 'Card not found' });
  }
  
  res.json({
    title: card.rows[0].title,
    content: card.rows[0].card_content
  });
});

app.listen(5000, () => {
    console.log('server is running...');
});