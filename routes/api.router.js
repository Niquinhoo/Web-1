const express = require('express');
const productsApiController = require('../controllers/api/productsApiController');
const categoriesApiController = require('../controllers/api/categoriesApiController');
const statsApiController = require('../controllers/api/statsApiController');
const cartApiController = require('../controllers/api/cartApiController');
const ordersApiController = require('../controllers/api/ordersApiController');
const usersApiController = require('../controllers/api/usersApiController');
const authApiController = require('../controllers/api/authApiController');

const router = express.Router();

router.get('/products', productsApiController.getAll);
router.get('/products/:id', productsApiController.getById);
router.post('/products', productsApiController.create);
router.put('/products/:id', productsApiController.update);
router.delete('/products/:id', productsApiController.remove);

router.get('/categories', categoriesApiController.getAll);
router.get('/categories/:id', categoriesApiController.getById);
router.post('/categories', categoriesApiController.create);
router.put('/categories/:id', categoriesApiController.update);
router.delete('/categories/:id', categoriesApiController.remove);

router.get('/stats', statsApiController.getStats);

router.get('/cart', cartApiController.getCart);
router.post('/cart/items', cartApiController.add);
router.put('/cart/items/:productId', cartApiController.update);
router.delete('/cart/items/:productId', cartApiController.remove);
router.delete('/cart', cartApiController.clear);

router.get('/orders', ordersApiController.getAll);
router.post('/orders', ordersApiController.create);
router.put('/orders/:id', ordersApiController.update);

router.get('/users', usersApiController.getAll);
router.get('/users/:id', usersApiController.getById);
router.post('/users', usersApiController.create);
router.put('/users/:id', usersApiController.update);
router.delete('/users/:id', usersApiController.remove);

router.get('/auth/me', authApiController.me);
router.post('/auth/login', authApiController.login);
router.post('/auth/register', authApiController.register);
router.delete('/auth/session', authApiController.logout);

router.use((req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

module.exports = router;
