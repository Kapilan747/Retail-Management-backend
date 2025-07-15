const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  ownerId: { type: Number },
});

module.exports = mongoose.model('Product', ProductSchema); 