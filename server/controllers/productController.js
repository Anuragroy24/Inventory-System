const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, price, stock_quantity, category_id } = req.body;
    const product = new Product({ name, sku, price, stock_quantity, category_id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock_quantity: { $lt: 10 } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    const product = await Product.findByIdAndUpdate(id, { stock_quantity }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
