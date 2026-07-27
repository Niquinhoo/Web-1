const usersService = require('../../services/usersService');

function getAll(req, res) {
    return res.json(usersService.getAllUsers());
}

function getById(req, res) {
    const user = usersService.getUserById(req.params.id);
    return user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado' });
}

function create(req, res) {
    return res.status(201).json(usersService.createUser(req.body));
}

function update(req, res) {
    const user = usersService.updateUser(req.params.id, req.body);
    return user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado' });
}

function remove(req, res) {
    const result = usersService.deleteUser(req.params.id);
    if (result.reason === 'not-found') return res.status(404).json({ error: 'Usuario no encontrado' });
    if (result.reason === 'last-admin') return res.status(409).json({ error: 'Debe quedar al menos un administrador' });
    if (req.session.userId === Number(req.params.id)) req.session.userId = null;
    return res.json({ message: 'Usuario eliminado' });
}

module.exports = { create, getAll, getById, remove, update };
