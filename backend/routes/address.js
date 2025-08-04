const express = require("express");
const { Address } = require("../models");
const auth = require("../middleware/auth_mid");

const router = express.Router();

// 📌 Get all addresses of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { user_id: req.user.id } });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Add a new address
router.post("/", auth, async (req, res) => {
  try {
    const address = await Address.create({
      user_id: req.user.id,
      ...req.body
    });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Update address
router.put("/:id", auth, async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address || address.user_id !== req.user.id) {
      return res.status(404).json({ error: "Address not found" });
    }
    await address.update(req.body);
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Delete address
router.delete("/:id", auth, async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address || address.user_id !== req.user.id) {
      return res.status(404).json({ error: "Address not found" });
    }
    await address.destroy();
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
