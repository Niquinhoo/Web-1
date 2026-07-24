const express = require('express');
const productsApiController = require('../controllers/api/productsApiController');
const categoriesApiController = require('../controllers/api/categoriesApiController');

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

router.use((req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

module.exports = router;
