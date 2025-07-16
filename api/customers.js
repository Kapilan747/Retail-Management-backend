const Customer = require('../models/Customer');
const connectToDatabase = require('../utils/connectToDatabase');

module.exports = async (req, res) => {
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