const cartService = require('../../services/cartService');

function detail(req) {
    return cartService.getCartDetailFromSession(cartService.ensureCart(req.session));
}

function getCart(req, res) {
    return res.json(detail(req));
}

function add(req, res) {
    if (!cartService.addProductToCart(req.session, req.body.productId)) {
        return res.status(409).json({ error: 'No se pudo agregar el producto' });
    }
    return res.status(201).json(detail(req));
}

function update(req, res) {
    const delta = Number(req.body.delta);
    if (!Number.isInteger(delta) || delta === 0) {
        return res.status(400).json({ error: 'delta debe ser un entero distinto de cero' });
    }
    if (!cartService.updateProductQuantity(req.session, req.params.productId, delta)) {
        return res.status(409).json({ error: 'No se pudo actualizar el producto' });
    }
    return res.json(detail(req));
}

function remove(req, res) {
    cartService.removeProductFromCart(req.session, req.params.productId);
    return res.json(detail(req));
}

function clear(req, res) {
    cartService.clearCart(req.session);
    return res.json(detail(req));
}

module.exports = { add, clear, getCart, remove, update };
