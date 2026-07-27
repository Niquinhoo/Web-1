const ordersService = require('../../services/ordersService');

function getAll(req, res) {
    return res.json(ordersService.getAllOrders());
}

function create(req, res) {
    const userId = req.session.userId || req.body.userId || null;
    return res.status(201).json(ordersService.createOrder(req.session, userId, req.body.discountCode));
}

function update(req, res) {
    const order = ordersService.updateOrderStatus(req.params.id, req.body.status);
    return order ? res.json(order) : res.status(404).json({ error: 'Pedido no encontrado' });
}

module.exports = { create, getAll, update };
