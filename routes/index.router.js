const express = require('express');
const router = express.Router();
const { publicidades, categorias } = require('../models/productModel');
const { getAllProducts } = require('../controllers/productController');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    const productos = getAllProducts();

    res.render('pages/home/home-page', {
        productos,
        publicidades,
        categorias,
        cartItemCount: getCartItemCount(req.session)
    });
});

module.exports = router;
