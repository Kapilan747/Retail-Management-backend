const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.query.username && req.query.password) {
    
    const user = await User.findOne({ username: req.query.username, password: req.query.password });
    if (user) {
      const userObj = user.toObject();
      userObj.id = userObj._id.toString();
      return res.json([userObj]);
    }
    return res.json([]);
  }
  const users = await User.find();
  const usersWithId = users.map(u => {
    const obj = u.toObject();
    obj.id = obj._id.toString();
    return obj;
  });
  res.json(usersWithId);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const userObj = user.toObject();
  userObj.id = userObj._id.toString();
  res.json(userObj);
});

router.post('/', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  const userObj = user.toObject();
  userObj.id = userObj._id.toString();
  res.status(201).json(userObj);
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const userObj = user.toObject();
  userObj.id = userObj._id.toString();
  res.json(userObj);
});

router.patch('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const userObj = user.toObject();
  userObj.id = userObj._id.toString();
  res.json(userObj);
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 