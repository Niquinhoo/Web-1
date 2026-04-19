const express = require('express');
const router = express.Router();

const SITE_NAME = 'pediloo';
const FORBIDDEN_PASSWORD_PARTS = ['password', '1234', 'qwerty'];

function buildRegisterViewModel(overrides = {}) {
    return {
        errors: {},
        generalErrors: [],
        values: {
            firstName: '',
            lastName: '',
            email: ''
        },
        ...overrides
    };
}

function renderRegister(res, overrides = {}, status = 200) {
    return res.status(status).render('pages/register/register-page', buildRegisterViewModel(overrides));
}

function hasTrimmedSpaces(value) {
    return value !== value.trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasLetter(value) {
    return /[A-Za-z]/.test(value);
}

function hasNumber(value) {
    return /\d/.test(value);
}

function hasSpecialCharacter(value) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
}

function validateRegisterForm(formData = {}) {
    const rawValues = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        password: formData.password || '',
        confirmPassword: formData.confirmPassword || ''
    };

    const values = {
        firstName: rawValues.firstName.trim(),
        lastName: rawValues.lastName.trim(),
        email: rawValues.email.trim()
    };

    const errors = {};

    if (!rawValues.firstName.trim()) {
        errors.firstName = 'Ingresa tu nombre.';
    } else if (hasTrimmedSpaces(rawValues.firstName)) {
        errors.firstName = 'El nombre no puede empezar ni terminar con espacios.';
    }

    if (!rawValues.lastName.trim()) {
        errors.lastName = 'Ingresa tu apellido.';
    } else if (hasTrimmedSpaces(rawValues.lastName)) {
        errors.lastName = 'El apellido no puede empezar ni terminar con espacios.';
    }

    if (!rawValues.email.trim()) {
        errors.email = 'Ingresa tu email.';
    } else if (hasTrimmedSpaces(rawValues.email)) {
        errors.email = 'El email no puede empezar ni terminar con espacios.';
    } else if (!isValidEmail(values.email)) {
        errors.email = 'Ingresa un email valido.';
    }

    if (!rawValues.password) {
        errors.password = 'Ingresa una contrasena.';
    } else if (hasTrimmedSpaces(rawValues.password)) {
        errors.password = 'La contrasena no puede empezar ni terminar con espacios.';
    } else if (rawValues.password.length < 8) {
        errors.password = 'La contrasena debe tener al menos 8 caracteres.';
    } else if (!hasLetter(rawValues.password)) {
        errors.password = 'La contrasena debe incluir al menos una letra.';
    } else if (!hasNumber(rawValues.password)) {
        errors.password = 'La contrasena debe incluir al menos un numero.';
    } else if (!hasSpecialCharacter(rawValues.password)) {
        errors.password = 'La contrasena debe incluir al menos un caracter especial.';
    } else {
        const normalizedPassword = rawValues.password.toLowerCase();
        const forbiddenParts = [
            ...FORBIDDEN_PASSWORD_PARTS,
            SITE_NAME,
            values.firstName.toLowerCase(),
            values.lastName.toLowerCase(),
            values.email.toLowerCase()
        ].filter(Boolean);

        if (forbiddenParts.some((part) => normalizedPassword.includes(part))) {
            errors.password = 'La contrasena contiene una cadena no permitida.';
        }
    }

    if (!rawValues.confirmPassword) {
        errors.confirmPassword = 'Repite tu contrasena.';
    } else if (rawValues.confirmPassword !== rawValues.password) {
        errors.confirmPassword = 'Las contrasenas no coinciden.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        values
    };
}

router.get('/', (req, res) => {
    renderRegister(res);
});

router.post('/', (req, res) => {
    const validation = validateRegisterForm(req.body);

    if (!validation.isValid) {
        return renderRegister(
            res,
            {
                errors: validation.errors,
                generalErrors: ['Revisa los campos marcados antes de continuar.'],
                values: validation.values
            },
            422
        );
    }

    console.log('Registro validado para:', validation.values.email);
    return res.redirect('/home');
});

module.exports = router;
