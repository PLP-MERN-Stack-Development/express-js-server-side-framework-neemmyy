// middleware/validateProduct.js
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ message: "Missing required product fields" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }

  if (typeof inStock !== "boolean") {
    return res.status(400).json({ message: "inStock must be a boolean" });
  }

  next();
};

module.exports = validateProduct;
