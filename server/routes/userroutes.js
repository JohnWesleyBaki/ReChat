const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/connection.js");
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}, {
      projection: {
        _id: 1,
        name: 1,
        'preferences.onlineStatus': 1
      }
    }).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Received registration:", req.body);

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne({ 
      name, 
      email, 
      password: hashedPassword,
      createdAt: new Date()
    });

    if (result.insertedId) {
      const insertedDocument = await usersCollection.findOne({ _id: result.insertedId });
      // Remove password from the response
      const { password, ...userWithoutPassword } = insertedDocument;
      res.status(201).json(userWithoutPassword);
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", req.body);

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;