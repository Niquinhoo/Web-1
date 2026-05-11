const express = require('express');
const router = express.Router();
const { getSuggestedProducts, getTopOrderedProducts } = require('../controllers/productController');
const { getCategories, getHomeBanners } = require('../services/catalogService');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    const suggestedProducts = getSuggestedProducts(5);
    const topOrderedProducts = getTopOrderedProducts(10);
    const categorias = getCategories();
    const publicidades = getHomeBanners();

    res.render('pages/home/home-page', {
        suggestedProducts,
        topOrderedProducts,
        publicidades,
        categorias,
        cartItemCount: getCartItemCount(req.session)
    });
});

module.exports = router;
