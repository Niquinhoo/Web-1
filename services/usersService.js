const crypto = require('node:crypto');
const db = require('../db/database');

function publicUser(row) {
    return row && {
        id: row.id,
        name: row.name,
        firstName: row.first_name || '',
        lastName: row.last_name || '',
        email: row.email,
        adminFlag: Boolean(row.admin_flag),
        createdAt: row.created_at
    };
}

function getAllUsers() {
    return db.prepare('SELECT * FROM users ORDER BY id').all().map(publicUser);
}

function getUserById(id) {
    const value = Number(id);
    if (!Number.isInteger(value) || value <= 0) return undefined;
    return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(value));
}

function getPrivateUserByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    return `scrypt:${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}

function passwordMatches(stored, password) {
    const [algorithm, salt, expected] = String(stored || '').split(':');
    if (algorithm !== 'scrypt' || !salt || !expected) return false;
    const actual = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}

function validate(payload, currentId, passwordRequired) {
    const firstName = String(payload.firstName || '').trim();
    const lastName = String(payload.lastName || '').trim();
    const email = String(payload.email || '').trim();
    const password = String(payload.password || '');

    if (!firstName) throw Object.assign(new Error('El nombre es obligatorio'), { statusCode: 400 });
    if (!lastName) throw Object.assign(new Error('El apellido es obligatorio'), { statusCode: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw Object.assign(new Error('El email es inválido'), { statusCode: 400 });
    }
    const duplicate = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id != ?')
        .get(email, currentId || 0);
    if (duplicate) throw Object.assign(new Error('Ya existe un usuario con ese email'), { statusCode: 409 });
    if (passwordRequired && password.length < 8) {
        throw Object.assign(new Error('La contraseña debe tener al menos 8 caracteres'), { statusCode: 400 });
    }
    if (password && password !== payload.confirmPassword) {
        throw Object.assign(new Error('Las contraseñas no coinciden'), { statusCode: 400 });
    }

    return { firstName, lastName, email, password, adminFlag: payload.adminFlag === true };
}

function createUser(payload) {
    const value = validate(payload, null, true);
    const result = db.prepare(`
        INSERT INTO users (name, first_name, last_name, email, password_hash, admin_flag)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        `${value.firstName} ${value.lastName}`,
        value.firstName,
        value.lastName,
        value.email,
        hashPassword(value.password),
        value.adminFlag ? 1 : 0
    );
    return getUserById(result.lastInsertRowid);
}

function updateUser(id, payload) {
    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
    if (!current) return undefined;
    const value = validate({
        firstName: payload.firstName ?? current.first_name,
        lastName: payload.lastName ?? current.last_name,
        email: payload.email ?? current.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        adminFlag: payload.adminFlag ?? Boolean(current.admin_flag)
    }, current.id, false);

    if (current.admin_flag && !value.adminFlag) {
        const admins = db.prepare('SELECT COUNT(*) AS total FROM users WHERE admin_flag = 1').get().total;
        if (admins <= 1) throw Object.assign(new Error('Debe quedar al menos un administrador'), { statusCode: 409 });
    }

    db.prepare(`
        UPDATE users
        SET name = ?, first_name = ?, last_name = ?, email = ?, password_hash = ?, admin_flag = ?
        WHERE id = ?
    `).run(
        `${value.firstName} ${value.lastName}`,
        value.firstName,
        value.lastName,
        value.email,
        value.password ? hashPassword(value.password) : current.password_hash,
        value.adminFlag ? 1 : 0,
        current.id
    );
    return getUserById(current.id);
}

function deleteUser(id) {
    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
    if (!current) return { ok: false, reason: 'not-found' };
    if (current.admin_flag) {
        const admins = db.prepare('SELECT COUNT(*) AS total FROM users WHERE admin_flag = 1').get().total;
        if (admins <= 1) return { ok: false, reason: 'last-admin' };
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(current.id);
    return { ok: true };
}

function authenticate(email, password) {
    const user = getPrivateUserByEmail(String(email || '').trim());
    return user && passwordMatches(user.password_hash, String(password || '')) ? publicUser(user) : undefined;
}

module.exports = {
    authenticate,
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
};
