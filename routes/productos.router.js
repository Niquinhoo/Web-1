const express = require('express');
const router = express.Router();
const {
    getRelatedProducts,
    getRandomProducts,
    normalizeId,
    getProductsSortedByPrice
} = require('../controllers/productController');
const { getCategories } = require('../services/catalogService');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    const { sort } = req.query;
    const products = getProductsSortedByPrice(sort);
    const normalizedSort = String(sort || '').toLowerCase();
    const categorias = getCategories();

    res.render('pages/product/products-list-page', {
        products,
        sort: normalizedSort === 'asc' || normalizedSort === 'desc' ? normalizedSort : '',
        categorias,
        cartItemCount: getCartItemCount(req.session)
    });
});

router.get('/:id', (req, res) => {
    const normalizedId = normalizeId(req.params.id);
    const cartItemCount = getCartItemCount(req.session);
    const categorias = getCategories();

    if (!normalizedId.ok && normalizedId.statusCode === 400) {
        return res.status(400).render('pages/400/400-page', {
            cartItemCount
        });
    }

    if (!normalizedId.ok && normalizedId.statusCode === 404) {
        const randomProducts = getRandomProducts(4);
        return res.status(404).render('pages/product/product-not-found-page', {
            randomProducts,
            categorias,
            cartItemCount
        });
    }

    if (normalizedId.ok) {
        const producto = normalizedId.product;
        const relatedProducts = getRelatedProducts(producto);
        return res.render('pages/product/product-detail-page', {
            producto,
            relatedProducts,
            categorias,
            cartItemCount
        });
    }
});

module.exports = router;
