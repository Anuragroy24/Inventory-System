const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.get('/low-stock', productController.getLowStockProducts);
router.put('/:id/stock', productController.updateStock);

module.exports = router;
