const express = require('express');
const router = express.Router();
const { getCartDetail } = require('../controllers/cartController');

router.get('/', (req, res) => {
    const cartDetail = getCartDetail();

    res.render('pages/cart/cart-page', {
        cartItems: cartDetail.items,
        cartSummary: cartDetail.summary
    });
});

module.exports = router;
