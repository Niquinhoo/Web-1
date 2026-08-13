const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'web1-api-test-'));
process.env.DATABASE_PATH = path.join(tempDir, 'database.db');

const LegacyDatabase = require('better-sqlite3');
const legacyDb = new LegacyDatabase(process.env.DATABASE_PATH);
legacyDb.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
    CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    );
`);
legacyDb.close();

let app = require('../app');
const db = require('../db/database');

let server;
let baseUrl;
const cookies = new Map();

test.before(async () => {
    server = await listen(app);
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
    server.close();
    db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
});

function listen(application) {
    return new Promise((resolve) => {
        const instance = application.listen(0, () => resolve(instance));
    });
}

async function restartApi() {
    await new Promise((resolve) => server.close(resolve));
    delete require.cache[require.resolve('../app')];
    app = require('../app');
    server = await listen(app);
    baseUrl = `http://127.0.0.1:${server.address().port}`;
}

async function request(url, options = {}) {
    const cookieHeader = [...cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
    const headers = {
        Origin: 'http://localhost:5173',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(options.headers || {})
    };
    const response = await fetch(`${baseUrl}${url}`, { ...options, headers });
    const setCookies = typeof response.headers.getSetCookie === 'function'
        ? response.headers.getSetCookie()
        : [response.headers.get('set-cookie')].filter(Boolean);
    for (const setCookie of setCookies) {
        const [pair] = setCookie.split(';');
        const separator = pair.indexOf('=');
        const name = pair.slice(0, separator);
        const value = pair.slice(separator + 1);
        if (value) cookies.set(name, value);
        else cookies.delete(name);
    }
    const text = await response.text();

    return {
        response,
        body: text ? JSON.parse(text) : null
    };
}

test('API REST integra catálogo, usuarios, carrito, pedidos y estadísticas', async () => {
    const orderUserForeignKey = db.prepare('PRAGMA foreign_key_list(orders)').all()
        .find((foreignKey) => foreignKey.from === 'user_id');
    assert.equal(orderUserForeignKey.table, 'users');

    const preflight = await request('/api/products', {
        method: 'OPTIONS',
        headers: { 'Access-Control-Request-Method': 'POST' }
    });
    assert.equal(preflight.response.status, 204);
    assert.equal(preflight.response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.equal(preflight.response.headers.get('access-control-allow-credentials'), 'true');

    const products = await request('/api/products');
    assert.equal(products.response.status, 200);
    assert.equal(products.body.length, 30);
    assert.equal(products.body[0].stock, 50);
    assert.equal(products.body[0].status, 'Activo');

    const search = await request('/api/products?q=veggie');
    assert.equal(search.body.length, 1);
    const sorted = await request('/api/products?sort=desc');
    assert.ok(sorted.body[0].price >= sorted.body[1].price);

    const categories = await request('/api/categories');
    assert.equal(categories.body.length, 5);

    const invalidJson = await request('/api/products', { method: 'POST', body: '{' });
    assert.equal(invalidJson.response.status, 400);
    assert.equal(invalidJson.body.error, 'JSON inválido');

    const createdCategory = await request('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'Temporal', icon: 'x', type: 'other' })
    });
    assert.equal(createdCategory.response.status, 201);

    const createdProduct = await request('/api/products', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Producto API',
            description: 'Creado desde test',
            price: 99,
            category: 'Temporal',
            stock: 3
        })
    });
    assert.equal(createdProduct.response.status, 201);
    assert.equal(createdProduct.body.status, 'Stock Bajo');

    const updatedProduct = await request(`/api/products/${createdProduct.body.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: 'Producto API actualizado',
            description: 'Actualizado desde test',
            price: 100,
            category: 'Temporal',
            isTopSeller: true,
            stock: 2
        })
    });
    assert.equal(updatedProduct.body.stock, 2);
    assert.equal(updatedProduct.body.isTopSeller, true);

    const renamedCategory = await request(`/api/categories/${createdCategory.body.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: 'Temporal 2', icon: 'y', type: 'other' })
    });
    assert.equal(renamedCategory.response.status, 200);
    const renamedProduct = await request(`/api/products/${createdProduct.body.id}`);
    assert.equal(renamedProduct.body.category, 'Temporal 2');

    const blockedCategory = await request(`/api/categories/${createdCategory.body.id}`, { method: 'DELETE' });
    assert.equal(blockedCategory.response.status, 409);
    await request(`/api/products/${createdProduct.body.id}`, { method: 'DELETE' });
    const deletedCategory = await request(`/api/categories/${createdCategory.body.id}`, { method: 'DELETE' });
    assert.equal(deletedCategory.response.status, 200);

    const createdUser = await request('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            firstName: 'Usuario',
            lastName: 'Temporal',
            email: 'temporal@example.com',
            password: 'Temporal1!',
            confirmPassword: 'Temporal1!',
            adminFlag: false
        })
    });
    assert.equal(createdUser.response.status, 201);
    assert.equal(createdUser.body.firstName, 'Usuario');
    assert.equal(createdUser.body.passwordHash, undefined);
    const deletedUser = await request(`/api/users/${createdUser.body.id}`, { method: 'DELETE' });
    assert.equal(deletedUser.response.status, 200);

    const login = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@pediloo.local', password: 'Admin123!' })
    });
    assert.equal(login.response.status, 200);
    assert.equal(login.body.adminFlag, true);
    const me = await request('/api/auth/me');
    assert.equal(me.body.email, 'admin@pediloo.local');

    const added = await request('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: products.body[0].id })
    });
    assert.equal(added.response.status, 201);
    assert.equal(added.body.summary.totalItems, 1);
    assert.ok(cookies.has('pediloo.session'));
    assert.ok(cookies.has('pediloo.session.sig'));
    const increased = await request(`/api/cart/items/${products.body[0].id}`, {
        method: 'PUT',
        body: JSON.stringify({ delta: 1 })
    });
    assert.equal(increased.body.summary.totalItems, 2);

    await restartApi();
    const cartAfterRestart = await request('/api/cart');
    assert.equal(cartAfterRestart.body.summary.totalItems, 2);

    const order = await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ discountCode: 'DESCUENTO10' })
    });
    assert.equal(order.response.status, 201);
    assert.equal(order.body.status, 'Recibido');
    assert.equal(order.body.discountPercent, 10);
    assert.equal(order.body.items[0].quantity, 2);

    const movedOrder = await request(`/api/orders/${order.body.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'En proceso' })
    });
    assert.equal(movedOrder.body.status, 'En proceso');
    const emptyCart = await request('/api/cart');
    assert.equal(emptyCart.body.summary.totalItems, 0);

    const rejectedEmptyOrder = await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify({})
    });
    assert.equal(rejectedEmptyOrder.response.status, 400);
    assert.equal(rejectedEmptyOrder.body.error, 'El carrito está vacío');

    const stats = await request('/api/stats');
    assert.equal(stats.body.totalProducts, 30);
    assert.equal(stats.body.totalCategories, 5);
    assert.equal(stats.body.totalUsers, 1);
    assert.equal(stats.body.totalOrders, 1);
    assert.equal(stats.body.totalSales, products.body[0].price * 2 * 0.9);

    const unknownApiRoute = await request('/api/no-existe');
    assert.equal(unknownApiRoute.response.status, 404);
    const ssr = await fetch(`${baseUrl}/products`);
    assert.equal(ssr.status, 200);
});
