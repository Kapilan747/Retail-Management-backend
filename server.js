require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const productsRouter = require('./routes/products');
const customersRouter = require('./routes/customers');
const salesRouter = require('./routes/sales');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

app.use('/products', productsRouter);
app.use('/customers', customersRouter);
app.use('/sales', salesRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 