const express = require('express');
const router = express.Router();
const { searchProductsByName } = require('../controllers/productController');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    const query = String(req.query.query || '').trim();
    const products = searchProductsByName(query);

    res.render('pages/search/search-results-page', {
        query,
        products,
        searchQuery: query,
        cartItemCount: getCartItemCount(req.session)
    });
});

module.exports = router;
