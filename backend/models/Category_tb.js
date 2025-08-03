const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
module.exports = category;