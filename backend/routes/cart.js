const express = require("express");
const { CartItem, Book } = require("../models");
const auth = require("../middleware/auth_mid");

const router = express.Router();

// 📌 Add to cart (Buyer only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can add to cart" });
    }

    const { book_id, quantity } = req.body;

    // Validate book and stock
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.stock <= 0) {
      return res.status(400).json({ error: "Book is out of stock" });
    }
    if (quantity > book.stock) {
      return res.status(400).json({ error: `Only ${book.stock} in stock` });
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      where: { user_id: req.user.id, book_id }
    });

    if (existingItem) {
      // Make sure new total does not exceed stock
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > book.stock) {
        return res.status(400).json({ error: `Only ${book.stock} in stock` });
      }
      existingItem.quantity = newQuantity;
      await existingItem.save();
      return res.json(existingItem);
    }

    const cartItem = await CartItem.create({
      user_id: req.user.id,
      book_id,
      quantity
    });

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 View cart
router.get("/", auth, async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Book }]
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Update quantity
router.put("/:id", auth, async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id, { include: [Book] });
    if (!cartItem) return res.status(404).json({ error: "Item not found" });

    if (cartItem.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // Check stock before updating
    if (req.body.quantity > cartItem.Book.stock) {
      return res.status(400).json({ error: `Only ${cartItem.Book.stock} in stock` });
    }

    cartItem.quantity = req.body.quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Remove from cart
router.delete("/:id", auth, async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (!cartItem) return res.status(404).json({ error: "Item not found" });

    if (cartItem.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await cartItem.destroy();
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
