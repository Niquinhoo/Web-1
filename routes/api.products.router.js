const express = require('express');
const router = express.Router();
const productsService = require('../services/productsService');

// ── GET /api/products ──────────────────────────────────────────────────────
// Lista todos los productos. Soporta ?sort=asc|desc y ?q=<busqueda>
router.get('/', (req, res) => {
    try {
        const { sort, q } = req.query;

        let products;
        if (q && String(q).trim()) {
            products = productsService.searchProductsByName(q);
        } else {
            products = productsService.getProductsSortedByPrice(sort);
        }

        res.json(products);
    } catch (error) {
        console.error('[API] GET /api/products error:', error.message);
        res.status(500).json({ error: 'Error interno al obtener los productos.' });
    }
});

// ── GET /api/products/:id ──────────────────────────────────────────────────
router.get('/:id', (req, res) => {
    try {
        const product = productsService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: `Producto con id ${req.params.id} no encontrado.` });
        }
        res.json(product);
    } catch (error) {
        console.error('[API] GET /api/products/:id error:', error.message);
        res.status(500).json({ error: 'Error interno al obtener el producto.' });
    }
});

// ── POST /api/products ─────────────────────────────────────────────────────
router.post('/', (req, res) => {
    try {
        const { title, price, description, src, image, category, isTopSeller, stock } = req.body;

        if (!title || price === undefined) {
            return res.status(400).json({ error: 'Los campos "title" y "price" son obligatorios.' });
        }

        const newProduct = productsService.createProduct({
            title: String(title).trim(),
            price: Number(price),
            description: description || null,
            src: src || image || null,       // acepta "src" o "image"
            category: category || null,
            isTopSeller: isTopSeller ? 1 : 0,
            stock: stock !== undefined ? Number(stock) : null,
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('[API] POST /api/products error:', error.message);
        res.status(500).json({ error: error.message || 'Error interno al crear el producto.' });
    }
});

// ── PUT /api/products/:id ──────────────────────────────────────────────────
router.put('/:id', (req, res) => {
    try {
        const updated = productsService.updateProduct(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: `Producto con id ${req.params.id} no encontrado.` });
        }
        res.json(updated);
    } catch (error) {
        console.error('[API] PUT /api/products/:id error:', error.message);
        res.status(500).json({ error: 'Error interno al actualizar el producto.' });
    }
});

// ── DELETE /api/products/:id ───────────────────────────────────────────────
router.delete('/:id', (req, res) => {
    try {
        const deleted = productsService.deleteProduct(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: `Producto con id ${req.params.id} no encontrado.` });
        }
        res.status(204).send();
    } catch (error) {
        console.error('[API] DELETE /api/products/:id error:', error.message);
        res.status(500).json({ error: 'Error interno al eliminar el producto.' });
    }
});

module.exports = router;
