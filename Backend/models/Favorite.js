const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        rating: { type: Number, required: true },
      },
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Favorite", favoriteSchema);
