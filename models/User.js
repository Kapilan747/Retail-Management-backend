const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'user' },
  lastActive: { type: Date },
});

module.exports = mongoose.model('User', UserSchema); 