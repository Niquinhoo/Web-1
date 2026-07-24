const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'web1-api-test-'));
process.env.DATABASE_PATH = path.join(tempDir, 'database.db');

const app = require('../app');
const db = require('../db/database');

let server;
let baseUrl;

test.before(async () => {
    server = await new Promise((resolve) => {
        const instance = app.listen(0, () => resolve(instance));
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
    server.close();
    db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
});

async function request(url, options = {}) {
    const headers = {
        Origin: 'http://localhost:5173',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
    };
    const response = await fetch(`${baseUrl}${url}`, { ...options, headers });
    const text = await response.text();

    return {
        response,
        body: text ? JSON.parse(text) : null
    };
}

test('API REST soporta CORS, CRUD, integridad y estadísticas', async () => {
    const preflight = await request('/api/products', {
        method: 'OPTIONS',
        headers: {
            'Access-Control-Request-Method': 'POST'
        }
    });
    assert.equal(preflight.response.status, 204);
    assert.equal(preflight.response.headers.get('access-control-allow-origin'), '*');

    const products = await request('/api/products');
    assert.equal(products.response.status, 200);
    assert.equal(products.body.length, 5);

    const categories = await request('/api/categories');
    assert.equal(categories.response.status, 200);
    assert.equal(categories.body.length, 9);
    assert.ok(categories.body[0].id);

    const invalidJson = await request('/api/products', {
        method: 'POST',
        body: '{'
    });
    assert.equal(invalidJson.response.status, 400);
    assert.equal(invalidJson.body.error, 'JSON inválido');

    const invalidProduct = await request('/api/products', {
        method: 'POST',
        body: JSON.stringify({ title: 'Sin categoría', price: 10 })
    });
    assert.equal(invalidProduct.response.status, 400);

    const createdProduct = await request('/api/products', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Producto API',
            description: 'Creado desde test',
            price: 99,
            category: 'Alimentos'
        })
    });
    assert.equal(createdProduct.response.status, 201);
    assert.equal(createdProduct.body.isTopSeller, false);

    const productId = createdProduct.body.id;
    const updatedProduct = await request(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: 'Producto API actualizado',
            description: 'Actualizado desde test',
            price: 100,
            category: 'Alimentos',
            isTopSeller: true
        })
    });
    assert.equal(updatedProduct.response.status, 200);
    assert.equal(updatedProduct.body.isTopSeller, true);

    const invalidId = await request('/api/products/no-es-un-id');
    assert.equal(invalidId.response.status, 400);
    const missingProduct = await request('/api/products/99999');
    assert.equal(missingProduct.response.status, 404);

    const createdCategory = await request('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'Temporal', icon: 'x', type: 'other' })
    });
    assert.equal(createdCategory.response.status, 201);
    const categoryId = createdCategory.body.id;

    const duplicateCategory = await request('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'temporal', type: 'other' })
    });
    assert.equal(duplicateCategory.response.status, 409);

    const categoryProduct = await request('/api/products', {
        method: 'POST',
        body: JSON.stringify({ title: 'Producto temporal', price: 10, category: 'Temporal' })
    });
    assert.equal(categoryProduct.response.status, 201);

    const renamedCategory = await request(`/api/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: 'Temporal 2', icon: 'y', type: 'other' })
    });
    assert.equal(renamedCategory.response.status, 200);

    const renamedProduct = await request(`/api/products/${categoryProduct.body.id}`);
    assert.equal(renamedProduct.body.category, 'Temporal 2');

    const blockedCategory = await request(`/api/categories/${categoryId}`, { method: 'DELETE' });
    assert.equal(blockedCategory.response.status, 409);

    const deletedCategoryProduct = await request(`/api/products/${categoryProduct.body.id}`, { method: 'DELETE' });
    assert.equal(deletedCategoryProduct.response.status, 200);
    const deletedCategory = await request(`/api/categories/${categoryId}`, { method: 'DELETE' });
    assert.equal(deletedCategory.response.status, 200);

    const deletedProduct = await request(`/api/products/${productId}`, { method: 'DELETE' });
    assert.equal(deletedProduct.response.status, 200);

    const stats = await request('/api/stats');
    assert.deepEqual(stats.body, { totalProducts: 5, totalCategories: 9 });

    const unknownApiRoute = await request('/api/no-existe');
    assert.equal(unknownApiRoute.response.status, 404);
    assert.equal(unknownApiRoute.body.error, 'Ruta API no encontrada');

    const ssr = await fetch(`${baseUrl}/products`);
    assert.equal(ssr.status, 200);
});
