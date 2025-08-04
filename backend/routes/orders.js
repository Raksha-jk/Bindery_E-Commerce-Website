// routes/orders.js
const express = require("express");
const { Order, OrderItem, Book, User, Address, CartItem } = require("../models");
const auth = require("../middleware/auth_mid");

const router = express.Router();

// 📌 Buyer: View My Orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can view their orders" });
    }

    const orders = await Order.findAll({
      where: { user_id: req.user.id }, // ✅ correct column
      include: [
        { model: OrderItem, include: [Book] },
        { model: Address }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Place Order (with existing or new address)
router.post("/", auth, async (req, res) => {
  try {
    const { addressId, newAddress, paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }

    let finalAddressId = addressId;

    // If new address provided, create it
    if (newAddress) {
      const createdAddress = await Address.create({
        user_id: req.user.id, // ✅ match DB
        ...newAddress
      });
      finalAddressId = createdAddress.id;
    }

    if (!finalAddressId) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [Book]
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + (item.Book.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      user_id: req.user.id,      // ✅ match DB
      address_id: finalAddressId, // ✅ match DB
      totalAmount,
      status: "Pending",
      paymentMethod
    });

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,        // ✅ match DB
      book_id: item.book_id,     // ✅ match DB
      quantity: item.quantity,
      price: item.Book.price
    }));
    await OrderItem.bulkCreate(orderItems);

    // Clear cart
    await CartItem.destroy({ where: { user_id: req.user.id } });

    res.json({ message: "Order placed successfully", orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 📌 Seller/Admin: Manage Orders
router.get("/manage", auth, async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only sellers or admins can manage orders" });
    }

    let orders;

    if (req.user.role === "admin") {
      // ✅ Admin sees ALL orders
      orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            include: [{ model: Book, include: [User] }] // Book + Seller info
          },
          { model: User, attributes: ["id", "name", "email"] }, // Buyer info
          { model: Address } // Shipping address
        ],
        order: [["createdAt", "DESC"]]
      });
    } else {
      // ✅ Seller sees only orders containing their books
      orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Book,
                where: { seller_id: req.user.id }, // Only books sold by this seller
                include: [User] // Seller info
              }
            ]
          },
          { model: User, attributes: ["id", "name", "email"] }, // Buyer info
          { model: Address } // Shipping address
        ],
        order: [["createdAt", "DESC"]]
      });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByPk(req.params.id);

  if (!order) return res.status(404).json({ error: "Order not found" });

  await order.update({ status });
  res.json({ message: "Order status updated", order });
});

module.exports = router;
