const Product = require('../models/Product');
const connectToDatabase = require('../utils/connectToDatabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://retail-management-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  await connectToDatabase();
  const { method, query, body } = req;

  if (method === 'GET') {
    if (query.id) {
      const product = await Product.findById(query.id);
      if (!product) return res.status(404).json({ error: 'Not found' });
      return res.json(product);
    }
    const products = await Product.find();
    return res.json(products);
  }

  if (method === 'POST') {
    const product = new Product(body);
    await product.save();
    return res.status(201).json(product);
  }

  if (method === 'PUT') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    const product = await Product.findByIdAndUpdate(query.id, body, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    return res.json(product);
  }

  if (method === 'DELETE') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    await Product.findByIdAndDelete(query.id);
    return res.json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}; 