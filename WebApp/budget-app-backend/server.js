const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const dbConfig = require("./config/config.json"); // Import Sequelize config

const app = express();
app.use(cors());
app.use(express.json());

// Get database credentials from config.json
const { username, password, database, host, dialect } = dbConfig.development;

// Initialize Sequelize connection
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: console.log, // Logs SQL queries (optional)
});

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

app.get("/", (req, res) => {
  res.send("Budget App API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
