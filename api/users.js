const User = require('../models/User');
const connectToDatabase = require('../utils/connectToDatabase');

module.exports = async (req, res) => {
  await connectToDatabase();
  const { method, query, body } = req;

  // GET /api/users or /api/users?id=...
  if (method === 'GET') {
    if (query.id) {
      const user = await User.findById(query.id);
      if (!user) return res.status(404).json({ error: 'Not found' });
      const userObj = user.toObject();
      userObj.id = userObj._id.toString();
      return res.json(userObj);
    }
    if (query.username && query.password) {
      const user = await User.findOne({ username: query.username, password: query.password });
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
    return res.json(usersWithId);
  }

  // POST /api/users
  if (method === 'POST') {
    const user = new User(body);
    await user.save();
    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
    return res.status(201).json(userObj);
  }

  // PUT or PATCH /api/users?id=...
  if (method === 'PUT' || method === 'PATCH') {
    if (!query.id) return res.status(400).json({ error: 'Missing id' });
    const user = await User.findByIdAndUpdate(query.id, body, { new: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
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
}; 