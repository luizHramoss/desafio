const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'API de pedidos funcionando.' });
});

app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;