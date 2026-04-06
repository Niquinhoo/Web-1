const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const productos = [
        { 
            title: 'Burger Smash XL', 
            price: 1200, 
            src: '/assets/productos/hamburguesasmash.png', 
            badge: { text: 'Más vendido', type: 'offer' } 
        },
        { 
            title: 'Pizza Napolitana', 
            price: 1500, 
            src: '/assets/productos/pizzanapo.png', 
            badge: { text: 'Especial', type: 'new' } 
        },
        { 
            title: 'Combo Coca-Cola', 
            price: 800, 
            src: '/assets/productos/cocacolas.png' 
        },
        { 
            title: 'Chocotorta Tradicional', 
            price: 600, 
            src: '/assets/productos/chocotorta.png',
            badge: { text: 'Delicia', type: 'new' }
        },
        { 
            title: 'Whiskey Premium', 
            price: 4500, 
            src: '/assets/productos/whiskey.png',
            badge: { text: 'Black Label', type: 'coming-soon' }
        }
    ];

    const publicidades = [
        {
            title: '¡Sábado de Hamburguesas!',
            description: '2x1 en toda la línea Smash hasta las 22hs.',
            image: '/assets/publicidades/publicidad1.png',
            buttonText: 'Pedir Ahora'
        },
        {
            title: 'Noches de Pizza',
            description: 'Envío gratis en todas tus pizzas favoritas.',
            image: '/assets/publicidades/publicidad2.png',
            buttonText: 'Ver Locales'
        }
    ];

    res.render('pages/home/home-page', { productos, publicidades });
});

module.exports = router;