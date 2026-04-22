const express = require('express');
const router = express.Router();

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

router.get('/', (req, res) => {
    res.render('pages/account/account-page', {
        cartItemCount: getCartItemCount(req.session)
    });
});

module.exports = router;
