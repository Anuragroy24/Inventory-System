const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/:id/orders', orderController.getUserOrders);

module.exports = router;
