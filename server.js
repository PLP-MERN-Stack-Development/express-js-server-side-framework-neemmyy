// server.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const productRoutes = require("./Routes/products");
const logger = require("./Middleware/logger");
const errorHandler = require("./Middleware/errorHandler");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use("/api/products", productRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Express.js RESTful API Assignment 🚀");
});

// Error Handling Middleware (must be last)
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
