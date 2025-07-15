const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Sale', SaleSchema); 