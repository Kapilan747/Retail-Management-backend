const Sale = require('../models/Sale');
const connectToDatabase = require('../utils/connectToDatabase');

module.exports = async (req, res) => {
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