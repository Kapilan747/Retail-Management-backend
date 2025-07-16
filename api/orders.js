const Order = require('../models/Order');
const connectToDatabase = require('../utils/connectToDatabase');

module.exports = async (req, res) => {
  await connectToDatabase();
  const { method, query, body } = req;

  if (method === 'GET') {
    if (query.id) {
      const order = await Order.findById(query.id);
      if (!order) return res.status(404).json({ error: 'Not found' });
      return res.json(order);
    }
    const orders = await Order.find();
    return res.json(orders);
  }

  if (method === 'POST') {
    const order = new Order(body);
    await order.save();
    return res.status(201).json(order);
  }

  if (method === 'PUT') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    const order = await Order.findByIdAndUpdate(query.id, body, { new: true });
    if (!order) return res.status(404).json({ error: 'Not found' });
    return res.json(order);
  }

  if (method === 'DELETE') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    await Order.findByIdAndDelete(query.id);
    return res.json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}; 