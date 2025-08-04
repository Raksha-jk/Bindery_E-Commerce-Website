const express = require("express");
const { Order, OrderItem, Address, CartItem, Book } = require("../models");
const auth = require("../middleware/auth_mid");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can checkout" });
    }

    const { address, paymentMethod } = req.body;

    // ✅ Save address linked to user
    const savedAddress = await Address.create({
      userId: req.user.id,
      ...address
    });

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [Book]
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.Book.price * item.quantity;
    }, 0);

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      status: "Pending",
      paymentMethod
    });

    // Create order items
    await Promise.all(
      cartItems.map(item =>
        OrderItem.create({
          order_id: order.id,
          book_id: item.book_id,
          quantity: item.quantity,
          price: item.Book.price
        })
      )
    );

    // Clear cart
    await CartItem.destroy({ where: { user_id: req.user.id } });

    res.json({ message: "Order placed successfully", order, savedAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
