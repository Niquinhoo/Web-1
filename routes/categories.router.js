const express = require('express');
const router = express.Router();
const { categorias } = require('../models/productModel');
const { getProductsByCategory } = require('../controllers/productController');

function getCartItemCount(session) {
    const cart = Array.isArray(session.cart) ? session.cart : [];

    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

function formatCategoryName(slug) {
    const decoded = decodeURIComponent(String(slug || ''));

    return decoded
        .replace(/[-_]+/g, ' ')
        .trim();
}

function normalizeCategoryValue(category) {
    return String(category || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

router.get('/:category', (req, res) => {
    const categoryParam = formatCategoryName(req.params.category);
    const products = getProductsByCategory(categoryParam);
    const matchedCategory = categorias.find(
        (item) => normalizeCategoryValue(item.name) === normalizeCategoryValue(categoryParam)
    );
    const displayCategoryName = matchedCategory ? matchedCategory.name : categoryParam;

    res.render('pages/category/category-products-page', {
        categoryName: displayCategoryName,
        products,
        categorias,
        cartItemCount: getCartItemCount(req.session)
    });
});

module.exports = router;
