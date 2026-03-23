const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { v4: uuidv4 } = require('uuid');
const { link } = require("fs");

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

app.put('/cards/:cardId', async (req, res) => {
  const cardId = req.params.cardId;
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cards 
       SET title = $1, card_content = $2 
       WHERE card_id = $3 
       RETURNING *`,
      [title, content, cardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    res.json({
      success: true,
      message: "Card saved successfully",
      card: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/cards/createcard", async (req, res) => {
  const { user_id, source_card_id } = req.body; // source_card_id = current card where link is created

  try {
    // 1️⃣ Create the new card
    const cardResult = await pool.query(
      `INSERT INTO cards (user_id, title, card_content)
       VALUES ($1, $2, $3)
       RETURNING card_id`,
      [user_id, "Untitled", "Start writing..."]
    );

    const newCardId = cardResult.rows[0].card_id;

    let linkId = uuidv4();

    // 2️⃣ Create link tuple if source_card_id is provided
    if (source_card_id) {
      const linkResult = await pool.query(
        `INSERT INTO link_cards (link_id, card_id, ref_card_id)
         VALUES ($3, $1, $2)
         RETURNING link_id`,
        [source_card_id, newCardId, linkId]
      );
    }

    // 3️⃣ Return both card_id and link_id
    res.json({
      success: true,
      card_id: newCardId,
      link_id: linkId, // null if no source_card_id provided
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create card and link"
    });
  }
});

app.get("/cards/parent/:cardId", async (req, res) => {
  const { cardId } = req.params;

  try {
    const result = await pool.query(
      `SELECT card_id 
       FROM link_cards 
       WHERE ref_card_id = $1`,
      [cardId]
    );

    // If no linked card found → return same cardId
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        card_id: cardId
      });
    }

    res.json({
      success: true,
      card_id: result.rows[0].card_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.listen(5000, () => {
    console.log('server is running...');
});