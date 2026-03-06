const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/list', orderController.listOrders);
router.get('/:id', orderController.getOrderById);
router.put('/update/:id', orderController.updateOrder);
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;