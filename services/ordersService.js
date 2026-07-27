const db = require('../db/database');
const cartService = require('./cartService');

const STATUSES = ['Recibido', 'En proceso', 'Listo para entregar'];

function orderItems(orderId) {
    return db.prepare(`
        SELECT product_id AS productId, quantity, price
        FROM order_items
        WHERE order_id = ?
        ORDER BY id
    `).all(orderId);
}

function toOrder(row) {
    return row && {
        id: row.id,
        userId: row.user_id,
        status: row.status,
        subtotal: row.subtotal,
        discountCode: row.discount_code || undefined,
        discountPercent: row.discount_percent,
        discountAmount: row.discount_amount,
        total: row.total,
        createdAt: row.created_at,
        items: orderItems(row.id)
    };
}

function getAllOrders() {
    return db.prepare('SELECT * FROM orders ORDER BY id DESC').all().map(toOrder);
}

function getOrderById(id) {
    const value = Number(id);
    if (!Number.isInteger(value) || value <= 0) return undefined;
    return toOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(value));
}

function createOrder(session, userId, discountCode) {
    const cart = cartService.ensureCart(session);
    const detail = cartService.getCartDetailFromSession(cart);
    if (!detail.items.length) throw Object.assign(new Error('El carrito está vacío'), { statusCode: 400 });

    const normalizedUserId = userId == null ? null : Number(userId);
    if (normalizedUserId && !db.prepare('SELECT id FROM users WHERE id = ?').get(normalizedUserId)) {
        throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }

    const code = String(discountCode || '').trim().toUpperCase();
    const discountPercent = code === 'DESCUENTO10' ? 10 : 0;
    const discountAmount = detail.summary.subtotal * discountPercent / 100;
    const total = detail.summary.subtotal - discountAmount;

    const create = db.transaction(() => {
        const result = db.prepare(`
            INSERT INTO orders (
                user_id, status, subtotal, discount_code,
                discount_percent, discount_amount, total
            ) VALUES (?, 'Recibido', ?, ?, ?, ?, ?)
        `).run(
            normalizedUserId,
            detail.summary.subtotal,
            discountPercent ? code : null,
            discountPercent,
            discountAmount,
            total
        );
        const insertItem = db.prepare(`
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `);
        const reduceStock = db.prepare(`
            UPDATE products SET stock = stock - ?
            WHERE id = ? AND stock >= ?
        `);

        for (const item of detail.items) {
            const stockResult = reduceStock.run(item.quantity, item.productId, item.quantity);
            if (stockResult.changes !== 1) {
                throw Object.assign(new Error(`Stock insuficiente para ${item.title}`), { statusCode: 409 });
            }
            insertItem.run(result.lastInsertRowid, item.productId, item.quantity, item.unitPrice);
        }
        return result.lastInsertRowid;
    });

    const orderId = create();
    cartService.clearCart(session);
    return getOrderById(orderId);
}

function updateOrderStatus(id, status) {
    if (!STATUSES.includes(status)) {
        throw Object.assign(new Error('Estado de pedido inválido'), { statusCode: 400 });
    }
    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, Number(id));
    return result.changes ? getOrderById(id) : undefined;
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};
