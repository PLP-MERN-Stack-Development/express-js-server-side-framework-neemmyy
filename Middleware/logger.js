// middleware/logger.js
function logger(req, res, next) {
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
  next(); // move to the next middleware or route
}

module.exports = logger;
