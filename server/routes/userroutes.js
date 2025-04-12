const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");  // Import the User model with its methods

const router = express.Router();

// Get all users
// router.get('/users', async (req, res) => {
//   try {
//     const users = await UserModel.findAll('name email preferences.onlineStatus'); // Using findAll method from user.js
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Get a random online user (for random chat feature)
router.get('/random/user', async (req, res) => {
  try {
    const { userId } = req.query; // Current user ID to exclude
    
    // Get all users
    const users = await UserModel.findAll('name email status');
    
    // Get the current user's friends list
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out the current user and their friends
    const filteredUsers = users.filter(user => {
      // Exclude the current user
      if (user._id.toString() === userId) return false;
      
      // Exclude users who are already friends
      if (currentUser.friends.includes(user._id.toString()) || 
          currentUser.friends.some(friendId => friendId.toString() === user._id.toString())) {
        return false;
      }
      
      return true;
    });
    
    if (filteredUsers.length === 0) {
      return res.status(404).json({ message: 'No users available for random chat' });
    }
    
    // Select a random user from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredUsers.length);
    const randomUser = filteredUsers[randomIndex];
    
    res.status(200).json(randomUser);
  } catch (error) {
    console.error('Error finding random user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Received registration:", req.body);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if email is already registered
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user using the create method
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Remove the password field from the response for security reasons
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password; // Explicitly remove the password field

    // Respond with the created user without the password
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user: ' + error.message });
  }
});


// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", req.body);

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Import config to get JWT secret
    const config = require('../config/config.js');
    
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, status: user.status },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add friend
router.post('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or Friend not found' });
    }

    // Add friend using the addFriend method
    await UserModel.addFriend(userId, friendId);

    res.status(200).json(user); // Return updated user with friends
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove friend
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    // Use the removeFriend method
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.friends.includes(friendId)) {
      return res.status(404).json({ message: 'Friend not found in user\'s friend list' });
    }

    // Remove friend using the removeFriend method
    await UserModel.removeFriend(userId, friendId);

    res.status(200).json(user); // Return updated user with friends
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all friends for a user
router.get('/users/:userId/friends', async (req, res) => {
  try {
    const { userId } = req.params;

    // Use the populateFriends method
    const friends = await UserModel.populateFriends(userId);
    res.status(200).json(friends);  // Return populated friends
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
