const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

// Require models (which initializes db connection via index.js)
const db = require('./models');
const User = db.User; // Get User model from db object

// Require budget routes
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Test database connection (using imported sequelize instance)
db.sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Budget App API is running...");
});

// Mount Budget API Routes
app.use('/api/budgets', budgetRoutes);

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

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;


  // Regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores." });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long, include one uppercase letter and one number."
    });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });
    

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
// Use db.sequelize.sync() if you want to sync models on start (optional)
// db.sequelize.sync().then(() => { 
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });