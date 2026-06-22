const express = require('express');
const router = express.Router();
const categoriesService = require('../services/categoriesService');

// ── GET /api/categories ────────────────────────────────────────────────────
router.get('/', (req, res) => {
    try {
        const categories = categoriesService.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error('[API] GET /api/categories error:', error.message);
        res.status(500).json({ error: 'Error interno al obtener las categorías.' });
    }
});

// ── GET /api/categories/:id ────────────────────────────────────────────────
router.get('/:id', (req, res) => {
    try {
        const category = categoriesService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: `Categoría con id ${req.params.id} no encontrada.` });
        }
        res.json(category);
    } catch (error) {
        console.error('[API] GET /api/categories/:id error:', error.message);
        res.status(500).json({ error: 'Error interno al obtener la categoría.' });
    }
});

// ── POST /api/categories ───────────────────────────────────────────────────
router.post('/', (req, res) => {
    try {
        const newCategory = categoriesService.createCategory(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('[API] POST /api/categories error:', error.message);
        res.status(400).json({ error: error.message || 'Error interno al crear la categoría.' });
    }
});

// ── PUT /api/categories/:id ────────────────────────────────────────────────
router.put('/:id', (req, res) => {
    try {
        const updated = categoriesService.updateCategory(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: `Categoría con id ${req.params.id} no encontrada.` });
        }
        res.json(updated);
    } catch (error) {
        console.error('[API] PUT /api/categories/:id error:', error.message);
        res.status(500).json({ error: 'Error interno al actualizar la categoría.' });
    }
});

// ── DELETE /api/categories/:id ─────────────────────────────────────────────
router.delete('/:id', (req, res) => {
    try {
        const deleted = categoriesService.deleteCategory(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: `Categoría con id ${req.params.id} no encontrada.` });
        }
        res.status(204).send();
    } catch (error) {
        console.error('[API] DELETE /api/categories/:id error:', error.message);
        res.status(500).json({ error: 'Error interno al eliminar la categoría.' });
    }
});

module.exports = router;
