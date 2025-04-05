// routes/user.js
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const Order = require("../models/Order");
const Address = require("../models/Address");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("orders")
      .populate("addresses");
    res.json({
      profile: user,
      addresses: user.addresses,
      orders: user.orders,
    });
  } catch (err) {
    console.error("Profile fetch error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/address", authMiddleware, async (req, res) => {
  try {
    const address = new Address({
      user: req.user.id,
      ...req.body,
    });
    await address.save();

    const user = await User.findById(req.user.id);
    user.addresses.push(address._id);
    await user.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/address/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address || address.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ msg: "Address not found or not authorized" });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/address/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address || address.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ msg: "Address not found or not authorized" });
    }

    await Address.findByIdAndDelete(req.params.id);
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(
      (addr) => addr.toString() !== req.params.id,
    );
    await user.save();

    res.json({ msg: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Operations for Orders

// Create Order
router.post("/order", authMiddleware, async (req, res) => {
  const { items, total, address, payment } = req.body;

  try {
    // Validate address
    if (!mongoose.Types.ObjectId.isValid(address)) {
      return res.status(400).json({ error: "Invalid address ID" });
    }
    const addressDoc = await Address.findOne({
      _id: address,
      user: req.user.id,
    });
    if (!addressDoc) {
      return res
        .status(400)
        .json({ error: "Address not found or not owned by user" });
    }

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required" });
    }
    if (!total || typeof total !== "number") {
      return res.status(400).json({ error: "Valid total is required" });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total,
      address,
      payment,
    });

    await order.save();

    // Update user's orders
    const user = await User.findById(req.user.id);
    user.orders.push(order._id);
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

// Read All Orders
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("address")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

// Read Single Order
router.get("/order/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("address");
    if (!order || order.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Order not found or not authorized" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Order (e.g., modify status)
router.put("/order/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Order not found or not authorized" });
    }

    const { status } = req.body;
    if (status) {
      order.status = status;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel Order
router.put("/order/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel this order" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }
    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();
    res.json({ msg: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Order cancellation error:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Order
router.delete("/order/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Order not found or not authorized" });
    }

    await Order.findByIdAndDelete(req.params.id);
    const user = await User.findById(req.user.id);
    user.orders = user.orders.filter(
      (orderId) => orderId.toString() !== req.params.id,
    );
    await user.save();

    res.json({ msg: "Order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
