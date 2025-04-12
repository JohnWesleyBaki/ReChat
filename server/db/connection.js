
const mongoose = require('mongoose');
const config = require('../config/config.js')

const { uri, options } = config.db;

// Connection function with retry logic
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  
  mongoose.connect(uri, options)
    .then(() => {
      console.log('Successfully connected to MongoDB.');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

// Handle reconnection
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

// Initial connection attempt
connectWithRetry();

module.exports = mongoose.connection;
