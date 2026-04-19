const express = require('express');
const router = express.Router();
const { publicidades, categorias } = require('../models/productModel');
const { getAllProducts } = require('../controllers/productController');

router.get('/', (req, res) => {
    const productos = getAllProducts();

    res.render('pages/home/home-page', { productos, publicidades, categorias });
});

module.exports = router;
