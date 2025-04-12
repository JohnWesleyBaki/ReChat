const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to other users (friends)
  status: { type: String, enum: ['online', 'offline'], default: 'offline' }, // User's online status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a model for the User
const User = mongoose.model('User', userSchema);

// Create a new user
const create = async (userData) => {
  try {
    const newUser = new User({
      ...userData,
      friends: [], // Initialize friends as an empty array
      status: 'offline', // Initialize status as offline
    });

    await newUser.save(); // Save the new user to the database
    return newUser; // Return the created user
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Find all users
const findAll = async (options = {}) => {
  try {
    return await User.find({}, options); // Find all users with optional query options
  } catch (error) {
    console.error('Error finding all users:', error);
    throw error;
  }
};

// Find a user by ID
const findById = async (id) => {
  try {
    return await User.findById(id).exec(); // Find user by ID
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

// Find a user by email
const findByEmail = async (email) => {
  try {
    return await User.findOne({ email }).exec(); // Find user by email
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

// Add a friend to the user's friends list
const addFriend = async (userId, friendId) => {
  try {
    // Find the user and friend by their IDs
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      throw new Error('User or friend not found');
    }

    // Add the friend to the user's friends array if not already added
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save(); // Save the updated user document
    }

    return user; // Return the updated user with the new friend added
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

// Remove a friend from the user's friends list
const removeFriend = async (userId, friendId) => {
  try {
    // Find the user and remove the friend from their friends array
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Remove the friend from the user's friends array
    user.friends = user.friends.filter(friend => friend.toString() !== friendId.toString());
    await user.save(); // Save the updated user document

    return user; // Return the updated user with the removed friend
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

// Populate friends' data (e.g., name, email) when fetching the user's friends
const populateFriends = async (userId) => {
  try {
    const user = await User.findById(userId).populate('friends', 'name email status'); // Populate friends with their name and email
    if (!user) {
      throw new Error('User not found');
    }
    return user.friends; // Return populated friends array
  } catch (error) {
    console.error('Error populating friends:', error);
    throw error;
  }
};

// Update a user's information
const updateById = async (id, updateData) => {
  console.log(id,updateData);
  try {
    const result = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true } // Return the updated document
    );
    return result; // Return the updated user
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = {
  create,
  findAll,
  findById,
  findByEmail,
  addFriend,
  removeFriend,
  populateFriends,
  updateById
};
