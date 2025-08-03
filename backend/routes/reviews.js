// routes/reviews.js
const express = require("express");
const { Review, User } = require("../models");
const auth = require("../middleware/auth_mid");

const router = express.Router();

// Add a review (buyer only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can add reviews" });
    }

    const { book_id, rating, comment } = req.body;
    const review = await Review.create({
      user_id: req.user.id,
      book_id,
      rating,
      comment
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a book
router.get("/book/:book_id", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { book_id: req.params.book_id },
      include: [{ model: User, attributes: ["name"] }]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reply to a review (seller or admin)
router.post("/reply/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only sellers or admins can reply" });
    }

    const { reply } = req.body;
    if (!reply || reply.trim() === "") {
      return res.status(400).json({ error: "Reply cannot be empty" });
    }

    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Update reply in DB
    review.reply = reply;
    await review.save();

    res.json({ message: "Reply added successfully", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete review (buyer who wrote it or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (req.user.role !== "admin" && req.user.id !== review.user_id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
