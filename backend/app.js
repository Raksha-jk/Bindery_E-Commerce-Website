const { sequelize } = require("./models");
const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const cors = require('cors');
app.use(cors({ origin: "http://localhost:5173" }));
const port = 3000;
//Routes
const bookRoutes = require("./routes/book");
app.use("/book", bookRoutes);
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const categoryRoutes = require("./routes/categories");
app.use("/categories", categoryRoutes);
const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);
const orderRoutes = require("./routes/orders");
app.use("/orders", orderRoutes);
const reviewRoutes = require("./routes/reviews");
app.use("/reviews", reviewRoutes);


sequelize.authenticate()
    .then(() => {
        console.log(`${process.env.DB_NAME} database connected`);
    })
    .catch(err => {
        console.error("❌ DB connection error:", err);
    });

sequelize.sync()
    .then(() => {
        console.log('Database is synchronized');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
