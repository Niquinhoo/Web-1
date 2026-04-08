const express = require('express');
const router = express.Router();
const { publicidades, categorias } = require('../data/db');
const { getAllProducts } = require('../services/product.service');

router.get('/', (req, res) => {
    const productos = getAllProducts();

    res.render('pages/home/home-page', { productos, publicidades, categorias });
});

module.exports = router;
