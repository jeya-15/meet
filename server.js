const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());

const pool = new Pool({
  connectionString:
    "postgres://neondb_owner:npg_zSZ9yMjr0XDk@ep-proud-queen-a4djo8qr-pooler.us-east-1.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.json());

app.get("/count", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM familymeeet");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/count", async (req, res) => {
  const data = req.body; // Assuming the body is an object with key-value pairs of events and stars

  if (typeof data !== "object" || Object.keys(data).length === 0) {
    return res
      .status(400)
      .send("Request body must be a non-empty object with event-star pairs");
  }

  const query = "INSERT INTO familymeeet (event, star) VALUES ($1, $2)";

  try {
    // Iterate through the keys (event names) and insert each pair into the database
    for (const [event, star] of Object.entries(data)) {
      if (!star) {
        return res.status(400).send(`Missing 'star' for ${event}`);
      }
      await pool.query(query, [event, star]); // Insert each event-star pair
    }

    res.json("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error" + error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
