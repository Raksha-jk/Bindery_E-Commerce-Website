const express = require("express");
const { Order, OrderItem, CartItem, Book } = require("../models");
const auth = require("../middleware/auth_mid");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can place orders" });
    }

    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [Book]
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock before creating order
    for (const item of cartItems) {
      if (item.Book.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.Book.title}` });
      }
    }

    // Calculate total
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.quantity * item.Book.price;
    });

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      totalAmount: totalPrice,
      status: "Processing"
    });

    // Create order items and reduce stock
    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.Book.price
      });

      // Reduce stock
      item.Book.stock -= item.quantity;
      await item.Book.save();
    }

    // Clear cart
    await CartItem.destroy({ where: { user_id: req.user.id } });

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get my orders (Buyer)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, include: [Book] }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Update order status (Seller/Admin)
router.put("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "seller") {
      return res.status(403).json({ error: "Only seller/admin can update status" });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = req.body.status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
