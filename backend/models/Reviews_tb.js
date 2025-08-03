const sequelize=require('../config/db');
const { DataTypes } = require('sequelize');
// models/Review.js
  const Review = sequelize.define("Review", {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reply: {
      type: DataTypes.TEXT,  // ✅ Added for seller/admin replies
      allowNull: true
    }
  }, {
    tableName: "Reviews"
  });

module.exports=Review;
