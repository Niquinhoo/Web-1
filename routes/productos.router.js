const express = require('express');
const router = express.Router();

router.get('/chocotorta', (req, res) => {
    res.render('pages/product-chocotorta-page');
});

router.get('/coca', (req, res) => {
    res.render('pages/product-coca-page');
});

router.get('/hamburguesa', (req, res) => {
    res.render('pages/product-hamburguesa-page');
});

router.get('/pizza', (req, res) => {
    res.render('pages/product-pizza-page');
});

router.get('/whisky', (req, res) => {
    res.render('pages/product-whisky-page');
});

module.exports = router;