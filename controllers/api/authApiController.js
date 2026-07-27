const usersService = require('../../services/usersService');

function me(req, res) {
    if (!req.session.userId) return res.json(null);
    return res.json(usersService.getUserById(req.session.userId) || null);
}

function login(req, res) {
    const user = usersService.authenticate(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    req.session.userId = user.id;
    return res.json(user);
}

function register(req, res) {
    const user = usersService.createUser({ ...req.body, adminFlag: false });
    req.session.userId = user.id;
    return res.status(201).json(user);
}

function logout(req, res) {
    req.session.destroy(() => res.status(204).end());
}

module.exports = { login, logout, me, register };
