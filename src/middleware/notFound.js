// middleware/notFound.js
function notFound(req, res, next) {
    res.status(404).json({
      success: false,
      error: {
        message: `Not Found - ${req.originalUrl}`
      }
    });
  }
  
  module.exports = notFound;
  