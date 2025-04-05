const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let products;

    if (search) {
      products = await Product.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isVendor) {
    return res.status(403).json({ msg: "Only vendors can add products" });
  }

  try {
    const product = new Product({
      ...req.body,
      vendor: {
        id: req.user.id,
        name: req.body.vendor.name,
      },
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.vendor.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.vendor.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
