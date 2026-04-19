(function () {
    const form = document.querySelector('[data-register-form="true"]');

    if (!form) {
        return;
    }

    const siteName = 'pediloo';
    const forbiddenPasswordParts = ['password', '1234', 'qwerty'];
    const fields = {
        firstName: form.querySelector('[name="firstName"]'),
        lastName: form.querySelector('[name="lastName"]'),
        email: form.querySelector('[name="email"]'),
        password: form.querySelector('[name="password"]'),
        confirmPassword: form.querySelector('[name="confirmPassword"]')
    };

    function setFieldState(fieldName, message) {
        const input = fields[fieldName];

        if (!input) {
            return;
        }

        const error = form.querySelector(`#${input.id}-error`);

        input.classList.toggle('is-invalid', Boolean(message));
        input.setAttribute('aria-invalid', message ? 'true' : 'false');

        if (error) {
            error.textContent = message || '';
        }
    }

    function validateField(fieldName) {
        const firstName = fields.firstName.value;
        const lastName = fields.lastName.value;
        const email = fields.email.value;
        const password = fields.password.value;
        const confirmPassword = fields.confirmPassword.value;

        switch (fieldName) {
            case 'firstName':
                if (!firstName.trim()) return 'Ingresa tu nombre.';
                if (firstName !== firstName.trim()) return 'El nombre no puede empezar ni terminar con espacios.';
                return '';
            case 'lastName':
                if (!lastName.trim()) return 'Ingresa tu apellido.';
                if (lastName !== lastName.trim()) return 'El apellido no puede empezar ni terminar con espacios.';
                return '';
            case 'email':
                if (!email.trim()) return 'Ingresa tu email.';
                if (email !== email.trim()) return 'El email no puede empezar ni terminar con espacios.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Ingresa un email valido.';
                return '';
            case 'password': {
                if (!password) return 'Ingresa una contrasena.';
                if (password !== password.trim()) return 'La contrasena no puede empezar ni terminar con espacios.';
                if (password.length < 8) return 'La contrasena debe tener al menos 8 caracteres.';
                if (!/[A-Za-z]/.test(password)) return 'La contrasena debe incluir al menos una letra.';
                if (!/\d/.test(password)) return 'La contrasena debe incluir al menos un numero.';
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'La contrasena debe incluir al menos un caracter especial.';

                const forbiddenParts = [
                    ...forbiddenPasswordParts,
                    siteName,
                    firstName.trim().toLowerCase(),
                    lastName.trim().toLowerCase(),
                    email.trim().toLowerCase()
                ].filter(Boolean);

                if (forbiddenParts.some((part) => password.toLowerCase().includes(part))) {
                    return 'La contrasena contiene una cadena no permitida.';
                }

                return '';
            }
            case 'confirmPassword':
                if (!confirmPassword) return 'Repite tu contrasena.';
                if (confirmPassword !== password) return 'Las contrasenas no coinciden.';
                return '';
            default:
                return '';
        }
    }

    function validateForm() {
        let isValid = true;

        Object.keys(fields).forEach((fieldName) => {
            const message = validateField(fieldName);
            setFieldState(fieldName, message);

            if (message) {
                isValid = false;
            }
        });

        return isValid;
    }

    Object.keys(fields).forEach((fieldName) => {
        const input = fields[fieldName];

        input.addEventListener('blur', function () {
            setFieldState(fieldName, validateField(fieldName));
        });

        input.addEventListener('input', function () {
            if (input.classList.contains('is-invalid')) {
                setFieldState(fieldName, validateField(fieldName));
            }

            if (fieldName === 'password' || fieldName === 'confirmPassword') {
                setFieldState('confirmPassword', validateField('confirmPassword'));
            }
        });
    });

    form.addEventListener('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });
})();
