const Customer = require('../models/Customer');
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

  // GET /api/customers or /api/customers?id=...
  if (method === 'GET') {
    if (query.id) {
      const customer = await Customer.findById(query.id);
      if (!customer) return res.status(404).json({ error: 'Not found' });
      return res.json(customer);
    }
    const customers = await Customer.find();
    return res.json(customers);
  }

  // POST /api/customers
  if (method === 'POST') {
    const customer = new Customer(body);
    await customer.save();
    return res.status(201).json(customer);
  }

  // PUT /api/customers?id=...
  if (method === 'PUT') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    const customer = await Customer.findByIdAndUpdate(query.id, body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Not found' });
    return res.json(customer);
  }

  // DELETE /api/customers?id=...
  if (method === 'DELETE') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    await Customer.findByIdAndDelete(query.id);
    return res.json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}; 