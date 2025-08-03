const sequelize = require('../config/db');
const User = require("./Users_tb");
const Book = require("./Books_tb");
const Category = require("./Category_tb");
const CartItem = require("./cartItem_tb");
const Order = require("./Orders_tb");
const OrderItem = require("./orderItems_tb");
const Review = require("./Reviews_tb");

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Book.hasMany(Review, { foreignKey: "book_id" });
Review.belongsTo(Book, { foreignKey: "book_id" });

User.hasMany(Book, { foreignKey: "seller_id" });
Book.belongsTo(User, { foreignKey: "seller_id" });

Category.hasMany(Book, { foreignKey: "category_id" });
Book.belongsTo(Category, { foreignKey: "category_id" });

User.hasMany(CartItem, { foreignKey: "user_id" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

Book.hasMany(CartItem, { foreignKey: "book_id" });
CartItem.belongsTo(Book, { foreignKey: "book_id" });

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Book.hasMany(OrderItem, { foreignKey: "book_id" });
OrderItem.belongsTo(Book, { foreignKey: "book_id" });

module.exports = {
  sequelize, User, Book, Category, CartItem, Order, OrderItem, Review
};
