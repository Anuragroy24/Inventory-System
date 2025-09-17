const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderDetails);
router.put('/:id/status', orderController.updateOrderStatus);
router.post('/:id/fulfill', orderController.fulfillOrder);

module.exports = router;
