const productsService = require('../../services/productsService');
const catalogService = require('../../services/catalogService');
const usersService = require('../../services/usersService');
const ordersService = require('../../services/ordersService');

function getStats(req, res) {
    const orders = ordersService.getAllOrders();
    return res.json({
        totalProducts: productsService.countProducts(),
        totalCategories: catalogService.countCategories(),
        totalUsers: usersService.getAllUsers().length,
        totalOrders: orders.length,
        totalSales: orders.reduce((total, order) => total + order.total, 0)
    });
}

module.exports = { getStats };
