const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// PostgreSQL connection

const pool = new Pool({
  connectionString:
    "postgres://neondb_owner:npg_zSZ9yMjr0XDk@ep-proud-queen-a4djo8qr-pooler.us-east-1.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.json());

app.post("/count", async (req, res) => {
  const data = req.body;
  const query = `Insert into familymeet Values($1,$2)`;
  try {
    for (let [key, value] of Object.entries(data)) {
      await pool.query(query, [key, value]);
    }
    res.json("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
