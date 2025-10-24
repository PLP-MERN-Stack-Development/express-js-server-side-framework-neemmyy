// middleware/auth.js
function auth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  
  if (apiKey === "mysecretkey123") {
    next(); // allow access
  } else {
    res.status(401).json({ message: "Unauthorized: Invalid or missing API key" });
  }
}

module.exports = auth;
