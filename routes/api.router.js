const express = require('express');
const productsApiController = require('../controllers/api/productsApiController');

const router = express.Router();

router.get('/products', productsApiController.getAll);
router.get('/products/:id', productsApiController.getById);
router.post('/products', productsApiController.create);
router.put('/products/:id', productsApiController.update);
router.delete('/products/:id', productsApiController.remove);

router.use((req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

module.exports = router;
