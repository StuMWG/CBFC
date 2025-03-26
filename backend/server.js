const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes, Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const dbConfig = require("./config/config.json");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Get database credentials from config.json
const { username, password, database, host, dialect } = dbConfig.development;

// Initialize Sequelize connection
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: console.log,
});

// Define User model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "users",
  timestamps: false,
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Budget App API is running...");
});

// Login route (email or username)
app.post("/api/auth/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));