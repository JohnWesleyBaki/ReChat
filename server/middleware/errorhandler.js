/**
 * Global error handling middleware
 * Provides consistent error responses across the application
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Set default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Structure the error response
  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Custom error class for API errors
 * Allows setting specific status codes and messages
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  
  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }
  
  static badRequest(message = 'Bad request') {
    return new ApiError(message, 400);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }
  
  static internal(message = 'Internal server error') {
    return new ApiError(message, 500);
  }
}

module.exports = { errorHandler, ApiError };