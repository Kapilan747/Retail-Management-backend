const Sale = require('../models/Sale');
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
      const sale = await Sale.findById(query.id);
      if (!sale) return res.status(404).json({ error: 'Not found' });
      return res.json(sale);
    }
    const sales = await Sale.find();
    return res.json(sales);
  }

  if (method === 'POST') {
    const sale = new Sale(body);
    await sale.save();
    return res.status(201).json(sale);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}; 