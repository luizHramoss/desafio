require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const Order = require('./models/Order');
const Item = require('./models/Item');

const app = express();

app.use(cors());
app.use(express.json());

Order.hasMany(Item, {
    foreignKey: 'orderId',
    sourceKey: 'orderId',
    as: 'items'
});
Item.belongsTo(Order, {
    foreignKey: 'orderId',
    targetKey: 'orderId'
});

app.use('/order', orderRoutes);

app.get('/', (req, res) => {
    res.status(200).json({message: 'API about orders is working.'});
});

sequelize. authenticate().then(() =>{
    console.log('Connection to database successful.');
    return sequelize.sync();
})
.then(() => {
    console.log('Tables synchronized successfully.');
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
})
.catch((error) => {
    console.log('Error starting the application: ', error);
});