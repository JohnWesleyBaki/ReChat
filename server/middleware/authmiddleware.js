
 //Verifies JWT tokens and attaches user data to request object
 
const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

/**
 * Middleware to verify JWT token in Authorization header
 * Attaches decoded user data to req.user if token is valid
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw ApiError.unauthorized('Invalid or expired token');
      }
      
      // Attach user data to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
  
};

/**
 * Socket.io authentication middleware
 * Verifies JWT token in socket handshake auth
 */
const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    
    // Attach user data to socket
    socket.user = decoded;
    next();
  });
};

module.exports = { authenticate, socketAuth };