const express = require('express');
const Product = require('./../models/products.model');
const employeeModel = require('../models/employee.model');
const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    res.json(await Product.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(rand);
    if(product) res.json(product);
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) res.json(product);
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.json({message: 'OK' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { name, client } = req.body;
    const product = await Product.findById(req.params.id);
    if(product) {
      await Product.updateOne({ _id: req.params.id }, {$set: {name, client}});
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product){
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
