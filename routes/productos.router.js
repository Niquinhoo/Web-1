const express = require('express');
const router = express.Router();
const { categorias } = require('../models/productModel');
const {
    getProductById,
    getRelatedProducts,
    getRandomProducts
} = require('../controllers/productController');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const producto = getProductById(id);

    if (producto) {
        const relatedProducts = getRelatedProducts(producto);
        res.render('pages/product/product-detail-page', { producto, relatedProducts, categorias });
    } else {
        const randomProducts = getRandomProducts(4);
        res.render('pages/product/product-not-found-page', { randomProducts, categorias });
    }
});

module.exports = router;
