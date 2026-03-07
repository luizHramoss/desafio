const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'orders',
    timestamps: false
});

module.exports = Order;