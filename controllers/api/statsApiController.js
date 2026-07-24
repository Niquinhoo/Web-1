const productsService = require('../../services/productsService');
const catalogService = require('../../services/catalogService');

function getStats(req, res) {
    return res.json({
        totalProducts: productsService.countProducts(),
        totalCategories: catalogService.countCategories()
    });
}

module.exports = { getStats };
