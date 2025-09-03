function notFound(req, res, next) {
    console.log(`Not Found Middleware Triggered: ${req.originalUrl}`);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

module.exports = notFound;