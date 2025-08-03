const express = require("express");
const router = express.Router();
const { Book, Category, User } = require("../models");
const auth = require("../middleware/auth_mid");
const upload = require("../middleware/upload");
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Category, attributes: ["name"] },
        { model: User, attributes: ["name", "email"] }
      ]
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get books of logged-in seller
router.get("/my-books", auth, async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only sellers or admins can view this" });
    }

    const books = await Book.findAll({
      where: { seller_id: req.user.id }
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["name"] },
        { model: User, attributes: ["name", "email"] }
      ]
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only sellers can add books" });
    }

    // If a file is uploaded, store its public path
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    }

    const { title, author, price, category_id, description, stock } = req.body;

    const book = await Book.create({
      title,
      author,
      price,
      category_id,
      description,
      stock,
      imageUrl, // Now stores actual uploaded file path
      seller_id: req.user.id
    });

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (req.user.id !== book.seller_id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    let imageUrl = book.imageUrl;
    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    }

    await book.update({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      category_id: req.body.category_id,
      description: req.body.description,
      stock: req.body.stock,
      imageUrl
    });

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (req.user.id !== book.seller_id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    await book.destroy();
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
