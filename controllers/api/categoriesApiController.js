const catalogService = require('../../services/catalogService');

function validateBody(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'El body debe ser un objeto JSON';
    }

    if (typeof body.name !== 'string' || !body.name.trim()) {
        return 'El campo name es obligatorio';
    }

    if (body.type !== undefined && !['main', 'other'].includes(body.type)) {
        return 'El campo type debe ser main u other';
    }

    if (body.icon !== undefined && body.icon !== null && typeof body.icon !== 'string') {
        return 'El campo icon debe ser texto';
    }

    return null;
}

function normalizeBody(body, defaultType = 'other') {
    return {
        name: body.name.trim(),
        icon: body.icon === undefined ? null : body.icon,
        type: body.type ?? defaultType
    };
}

function findCategory(req, res) {
    const normalized = catalogService.normalizeCategoryId(req.params.id);

    if (!normalized.ok) {
        res.status(normalized.statusCode).json({
            error: normalized.statusCode === 404 ? 'Categoría no encontrada' : 'ID de categoría inválido'
        });
        return null;
    }

    return normalized;
}

function getAll(req, res) {
    return res.json(catalogService.getCategories());
}

function getById(req, res) {
    const normalized = findCategory(req, res);
    return normalized ? res.json(normalized.category) : undefined;
}

function create(req, res) {
    const bodyError = validateBody(req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const value = normalizeBody(req.body);
    if (catalogService.getCategoryByName(value.name)) {
        return res.status(409).json({ error: 'La categoría ya existe' });
    }

    return res.status(201).json(catalogService.createCategory(value));
}

function update(req, res) {
    const category = findCategory(req, res);
    if (!category) return undefined;

    const bodyError = validateBody(req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const value = normalizeBody(req.body, category.category.type);
    const duplicate = catalogService.getCategoryByName(value.name);
    if (duplicate && duplicate.id !== category.id) {
        return res.status(409).json({ error: 'La categoría ya existe' });
    }

    return res.json(catalogService.updateCategory(category.id, value));
}

function remove(req, res) {
    const category = findCategory(req, res);
    if (!category) return undefined;

    const result = catalogService.deleteCategory(category.id);
    if (result.reason === 'in-use') {
        return res.status(409).json({ error: 'La categoría tiene productos asociados' });
    }

    return res.json({ message: 'Categoría eliminada' });
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
