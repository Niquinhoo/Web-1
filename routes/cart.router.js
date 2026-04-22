const express = require('express');
const router = express.Router();
const {
    ensureCart,
    getCartDetailFromSession,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart
} = require('../controllers/cartController');

router.get('/', (req, res) => {
    const cart = ensureCart(req.session);
    const cartDetail = getCartDetailFromSession(cart);

    res.render('pages/cart/cart-page', {
        cartItems: cartDetail.items,
        cartSummary: cartDetail.summary,
        cartItemCount: cartDetail.summary.totalItems
    });
});

router.post('/items', (req, res) => {
    const { productId } = req.body;

    addProductToCart(req.session, productId);

    res.redirect('/cart');
});

router.post('/items/:productId/increase', (req, res) => {
    updateProductQuantity(req.session, req.params.productId, 1);
    res.redirect('/cart');
});

router.post('/items/:productId/decrease', (req, res) => {
    updateProductQuantity(req.session, req.params.productId, -1);
    res.redirect('/cart');
});

router.post('/items/:productId/remove', (req, res) => {
    removeProductFromCart(req.session, req.params.productId);
    res.redirect('/cart');
});

router.post('/clear', (req, res) => {
    clearCart(req.session);
    res.redirect('/cart');
});

module.exports = router;
