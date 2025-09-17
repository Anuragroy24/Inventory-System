const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper: Calculate total with tax/fees (simple 10% tax for demo)
function calculateTotal(items) {
  let subtotal = items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
  let tax = subtotal * 0.10;
  return subtotal + tax;
}

exports.createOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body; // items: [{ product_id, quantity }]
    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'user_id and non-empty items array are required' });
    }
    for (const it of items) {
      if (!it.product_id || typeof it.quantity !== 'number' || it.quantity <= 0) {
        return res.status(400).json({ error: 'Each item requires product_id and positive quantity' });
      }
    }
    // Fetch products and check stock
    const productIds = items.map(i => i.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    let orderItems = [];
    for (let item of items) {
      const product = products.find(p => p._id.toString() === item.product_id);
      if (!product) return res.status(404).json({ error: `Product ${item.product_id} not found` });
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      orderItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price_at_time: product.price
      });
    }
    // Calculate total
    const total = calculateTotal(orderItems);
    // Create order
    const order = new Order({ user_id, total, status: 'pending' });
    await order.save();
    // Create order items
    for (let item of orderItems) {
      await new OrderItem({ ...item, order_id: order._id }).save();
    }
    res.status(201).json({ order_id: order._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const items = await OrderItem.find({ order_id: id }).populate('product_id');
    res.json({ order, items });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['pending', 'fulfilled', 'cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // If cancelling a fulfilled order, return stock to inventory
    if (status === 'cancelled' && order.status === 'fulfilled') {
      const items = await OrderItem.find({ order_id: id });
      for (let item of items) {
        await Product.findByIdAndUpdate(item.product_id, { $inc: { stock_quantity: item.quantity } });
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.fulfillOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ error: 'Order already processed' });

    const items = await OrderItem.find({ order_id: id });

    await session.withTransaction(async () => {
      // For each item, atomically decrement only if enough stock remains
      for (let item of items) {
        const result = await Product.updateOne(
          { _id: item.product_id, stock_quantity: { $gte: item.quantity } },
          { $inc: { stock_quantity: -item.quantity } },
          { session }
        );
        if (result.matchedCount === 0) {
          throw new Error('Insufficient stock for one or more items');
        }
      }
      order.status = 'fulfilled';
      await order.save({ session });
    });

    res.json({ message: 'Order fulfilled' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.params; // user_id
    const orders = await Order.find({ user_id: id });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
