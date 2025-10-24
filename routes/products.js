// routes/productRoutes.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
const validateProduct = require("../middleware/validateProduct");

const router = express.Router();

// In-memory data store (for now)
let products = [];

// GET all products
router.get("/", (req, res) => {
  const { category, page = 1, limit = 5, search } = req.query;

  let filtered = [...products];

  // Filter by category
  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search by name
  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + Number(limit));

  res.json({
    total: filtered.length,
    page: Number(page),
    limit: Number(limit),
    products: paginated,
  });
});

// GET single product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// POST create product
router.post("/", auth, validateProduct, (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
router.put("/:id", auth, validateProduct, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE product
router.delete("/:id", auth, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});

module.exports = router;
