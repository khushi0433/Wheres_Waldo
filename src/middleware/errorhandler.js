// Error handling middleware - no need for PrismaClient or COOKIE_NAME

function errorHandler(err,req,res,next) {
    console.error(err.stack);
    if (res.headerSent){
        return next(err);
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server error";

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...process.env.NODE_ENV === 'development' && { stack: err.stack }
        }
    });
}

module.exports = errorHandler;