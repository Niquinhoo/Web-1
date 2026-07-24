const express = require('express');

const router = express.Router();

// Las rutas de recursos se agregan en las User Stories siguientes.
router.use((req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

module.exports = router;
