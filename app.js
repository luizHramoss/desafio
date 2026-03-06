require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
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
    res.status(200).json({message: 'API de pedidos está funcionando.'});
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

sequelize. authenticate().then(() =>{
    console.log('Conectado com sucesso ao banco de dados.');
    return sequelize.sync();
})
.then(() => {
    console.log('Tables synchronized successfully.');
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Servidor está na porta ${process.env.PORT || 3000}`);
    });
})
.catch((error) => {
    console.log('Erro ao iniciar a API: ', error);
});

