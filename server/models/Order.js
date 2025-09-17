const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
