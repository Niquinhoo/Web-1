const express = require('express');
const router = express.Router();
const { categorias } = require('../models/productModel');
const {
    getProductById,
    getRelatedProducts,
    getRandomProducts,
    normalizeId,
    getProductsSortedByPrice
} = require('../controllers/productController');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    const { sort } = req.query;
    const products = getProductsSortedByPrice(sort);
    const normalizedSort = String(sort || '').toLowerCase();

    res.render('pages/product/products-list-page', {
        products,
        sort: normalizedSort === 'asc' || normalizedSort === 'desc' ? normalizedSort : '',
        cartItemCount: getCartItemCount(req.session)
    });
});

router.get('/:id', (req, res) => {
    const normalizedId = normalizeId(req.params.id);
    const cartItemCount = getCartItemCount(req.session);

    if (!normalizedId) {
        return res.status(400).render('pages/400/400-page', {
            cartItemCount
        });
    }

    const producto = getProductById(normalizedId);

    if (producto) {
        const relatedProducts = getRelatedProducts(producto);
        return res.render('pages/product/product-detail-page', {
            producto,
            relatedProducts,
            categorias,
            cartItemCount
        });
    }

    const randomProducts = getRandomProducts(4);
    return res.status(404).render('pages/product/product-not-found-page', {
        randomProducts,
        categorias,
        cartItemCount
    });
});

module.exports = router;
