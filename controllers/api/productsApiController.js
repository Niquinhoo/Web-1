const productsService = require('../../services/productsService');
const catalogService = require('../../services/catalogService');

function invalidBody(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'El body debe ser un objeto JSON';
    }

    if (typeof body.title !== 'string' || !body.title.trim()) {
        return 'El campo title es obligatorio';
    }

    if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
        return 'El campo price debe ser un número mayor o igual a cero';
    }

    if (typeof body.category !== 'string' || !body.category.trim()) {
        return 'El campo category es obligatorio';
    }

    if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
        return 'El campo description debe ser texto';
    }

    if (body.src !== undefined && body.src !== null && typeof body.src !== 'string') {
        return 'El campo src debe ser texto';
    }

    if (body.isTopSeller !== undefined && typeof body.isTopSeller !== 'boolean') {
        return 'El campo isTopSeller debe ser booleano';
    }

    return null;
}

function normalizeProductBody(body) {
    const category = catalogService.getCategoryByName(body.category.trim());

    if (!category) {
        return { error: 'La categoría indicada no existe' };
    }

    return {
        value: {
            title: body.title.trim(),
            description: body.description === undefined ? null : body.description,
            price: body.price,
            src: body.src === undefined ? null : body.src,
            category: category.name,
            isTopSeller: body.isTopSeller === true
        }
    };
}

function findProduct(req, res) {
    const normalized = productsService.normalizeId(req.params.id);

    if (!normalized.ok) {
        res.status(normalized.statusCode).json({
            error: normalized.statusCode === 404 ? 'Producto no encontrado' : 'ID de producto inválido'
        });
        return null;
    }

    return normalized;
}

function getAll(req, res) {
    return res.json(productsService.getAllProducts());
}

function getById(req, res) {
    const normalized = findProduct(req, res);
    return normalized ? res.json(normalized.product) : undefined;
}

function create(req, res) {
    const bodyError = invalidBody(req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const normalized = normalizeProductBody(req.body);
    if (normalized.error) return res.status(400).json({ error: normalized.error });

    return res.status(201).json(productsService.createProduct(normalized.value));
}

function update(req, res) {
    const product = findProduct(req, res);
    if (!product) return undefined;

    const bodyError = invalidBody(req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const normalized = normalizeProductBody(req.body);
    if (normalized.error) return res.status(400).json({ error: normalized.error });

    return res.json(productsService.updateProduct(product.id, normalized.value));
}

function remove(req, res) {
    const product = findProduct(req, res);
    if (!product) return undefined;

    productsService.deleteProduct(product.id);
    return res.json({ message: 'Producto eliminado' });
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
