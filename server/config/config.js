
const dotenv = require('dotenv');

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

module.exports = {
  // Server configuration
  port: process.env.PORT || 5050,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/users',
    options: {
      // Removed deprecated options that are no longer needed in MongoDB Driver 4.0.0+
    }
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  
  // Client configuration
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173'
  },
  
  // Cors configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
};