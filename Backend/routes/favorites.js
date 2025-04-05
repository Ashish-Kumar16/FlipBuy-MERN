const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Favorite = require("../models/Favorite");

router.get("/", authMiddleware, async (req, res) => {
  console.log("[GET /favorites] Request received for user:", req.user.id);
  try {
    const favorites = await Favorite.find({ user: req.user.id });
    console.log("[GET /favorites] Found favorites:", favorites);
    const response = favorites.map((fav) => ({ id: fav.productId }));
    console.log("[GET /favorites] Sending response:", response);
    res.json(response);
  } catch (err) {
    console.error("[GET /favorites] Error:", {
      message: err.message,
      stack: err.stack,
      userId: req.user.id,
    });
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
router.post("/toggle", authMiddleware, async (req, res) => {
  console.log("[POST /favorites/toggle] Request received:", {
    userId: req.user.id,
    body: req.body,
  });

  try {
    const { id, name, price, description, image, category, rating } = req.body;

    if (!id) {
      return res.status(400).json({ error: "productId is required" });
    }

    const parsedProductId = Number(id);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({ error: "productId must be a number" });
    }

    // Check if this product is already in favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      "product.id": parsedProductId, // ✅ correct path
    });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return res.json({ msg: "Removed from favorites" });
    }

    // Add full product info under `product` key
    const favorite = new Favorite({
      user: req.user.id,
      product: {
        id: parsedProductId,
        name,
        price,
        description,
        image,
        category,
        rating,
      },
    });

    const savedFavorite = await favorite.save();
    res.json({ msg: "Added to favorites", favorite: savedFavorite });
  } catch (err) {
    console.error("[POST /favorites/toggle] Error occurred:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  console.log("[DELETE /favorites] Request received for user:", req.user.id);
  try {
    const result = await Favorite.deleteMany({ user: req.user.id });
    console.log("[DELETE /favorites] Delete result:", result);
    res.json({ msg: "Favorites cleared" });
  } catch (err) {
    console.error("[DELETE /favorites] Error:", {
      message: err.message,
      stack: err.stack,
      userId: req.user.id,
    });
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
