const express = require('express');
const router = express.Router();
const { categorias } = require('../models/productModel');
const {
    getProductById,
    getRelatedProducts,
    getRandomProducts
} = require('../controllers/productController');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const producto = getProductById(id);
    const cartItemCount = getCartItemCount(req.session);

    if (producto) {
        const relatedProducts = getRelatedProducts(producto);
        res.render('pages/product/product-detail-page', {
            producto,
            relatedProducts,
            categorias,
            cartItemCount
        });
    } else {
        const randomProducts = getRandomProducts(4);
        res.render('pages/product/product-not-found-page', {
            randomProducts,
            categorias,
            cartItemCount
        });
    }
});

module.exports = router;
