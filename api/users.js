const User = require('../models/User');
const connectToDatabase = require('../utils/connectToDatabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://retail-management-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  try {
    await connectToDatabase();
    const { method, query, body } = req;

    // GET /api/users or /api/users?id=...
    if (method === 'GET') {
      if (query.id) {
        const user = await User.findById(query.id);
        if (!user) return res.status(404).json({ error: 'Not found' });
        const userObj = user.toObject();
        userObj.id = userObj._id.toString();
        delete userObj.password;
        return res.json(userObj);
      }
      if (query.username && query.password) {
        const user = await User.findOne({ username: query.username, password: query.password });
        if (user) {
          const userObj = user.toObject();
          userObj.id = userObj._id.toString();
          delete userObj.password;
          return res.json([userObj]);
        }
        return res.json([]);
      }
      const users = await User.find();
      const usersWithId = users.map(u => {
        const obj = u.toObject();
        obj.id = obj._id.toString();
        delete obj.password;
        return obj;
      });
      return res.json(usersWithId);
    }

    // POST /api/users
    if (method === 'POST') {
      const user = new User(body);
      await user.save();
      const userObj = user.toObject();
      userObj.id = userObj._id.toString();
      delete userObj.password;
      return res.status(201).json(userObj);
    }

    // PUT or PATCH /api/users?id=...
    if (method === 'PUT' || method === 'PATCH') {
      if (!query.id) return res.status(400).json({ error: 'Missing id' });
      const user = await User.findByIdAndUpdate(query.id, body, { new: true });
      if (!user) return res.status(404).json({ error: 'Not found' });
      const userObj = user.toObject();
      userObj.id = userObj._id.toString();
      delete userObj.password;
      return res.json(userObj);
    }

    // DELETE /api/users?id=...
    if (method === 'DELETE') {
      if (!query.id) return res.status(400).json({ error: 'Missing id' });
      await User.findByIdAndDelete(query.id);
      return res.json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error('API /api/users error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}; 