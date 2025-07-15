const express = require('express');
const Sale = require('../models/Sale');
const router = express.Router();

router.get('/', async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

router.get('/:id', async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) return res.status(404).json({ error: 'Not found' });
  res.json(sale);
});

router.post('/', async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.status(201).json(sale);
});

module.exports = router; 