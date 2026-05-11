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
const { normalizeId } = require('../controllers/productController');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

function renderInvalidProductId(res, cartItemCount, statusCode) {
    if (statusCode === 404) {
        return res.status(404).render('pages/404/404-page', {
            cartItemCount
        });
    }

    return res.status(400).render('pages/400/400-page', {
        cartItemCount
    });
}

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
    const normalizedId = normalizeId(productId);

    if (!normalizedId.ok) {
        return renderInvalidProductId(res, getCartItemCount(req.session), normalizedId.statusCode);
    }

    const wasAdded = addProductToCart(req.session, normalizedId.id);

    if (!wasAdded) {
        return res.redirect('/cart');
    }

    res.redirect('/cart');
});

router.post('/items/:productId/increase', (req, res) => {
    const normalizedId = normalizeId(req.params.productId);

    if (!normalizedId.ok) {
        return renderInvalidProductId(res, getCartItemCount(req.session), normalizedId.statusCode);
    }

    updateProductQuantity(req.session, normalizedId.id, 1);
    res.redirect('/cart');
});

router.post('/items/:productId/decrease', (req, res) => {
    const normalizedId = normalizeId(req.params.productId);

    if (!normalizedId.ok) {
        return renderInvalidProductId(res, getCartItemCount(req.session), normalizedId.statusCode);
    }

    updateProductQuantity(req.session, normalizedId.id, -1);
    res.redirect('/cart');
});

router.post('/items/:productId/remove', (req, res) => {
    const normalizedId = normalizeId(req.params.productId);

    if (!normalizedId.ok) {
        return renderInvalidProductId(res, getCartItemCount(req.session), normalizedId.statusCode);
    }

    removeProductFromCart(req.session, normalizedId.id);
    res.redirect('/cart');
});

router.post('/clear', (req, res) => {
    clearCart(req.session);
    res.redirect('/cart');
});

module.exports = router;
