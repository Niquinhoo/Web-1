const productos = [
    {
        id: '1',
        title: 'Burger Smash XL',
        description: 'Doble medallón de 120g de carne seleccionada, queso cheddar derretido, panceta crocante y nuestra salsa secreta en pan brioche artesanal.',
        price: 1200,
        src: '/assets/productos/hamburguesasmash.png',
        badge: { text: 'Más vendido', type: 'offer' },
        category: 'Alimentos'
    },
    {
        id: '2',
        title: 'Pizza Napolitana',
        description: 'Masa madre de fermentación lenta, salsa de tomates italianos, muzzarella fior di latte, ajo, y hojas de albahaca fresca.',
        price: 1500,
        src: '/assets/productos/pizzanapo.png',
        badge: { text: 'Especial', type: 'new' },
        category: 'Alimentos'
    },
    {
        id: '3',
        title: 'Combo Coca-Cola',
        description: 'Llevá 2 Coca-Colas de litro y medio bien heladas. Ideal para compartir.',
        price: 800,
        src: '/assets/productos/cocacolas.png',
        category: 'Bebidas'
    },
    {
        id: '4',
        title: 'Chocotorta Tradicional',
        description: 'El clásico argentino. Capas de galletitas de chocolate humedecidas en café, intercaladas con la más suave mezcla de dulce de leche y queso crema.',
        price: 600,
        src: '/assets/productos/chocotorta.png',
        badge: { text: 'Delicia', type: 'new' },
        category: 'Alimentos'
    },
    {
        id: '5',
        title: 'Whiskey Premium',
        description: 'Whiskey de malta escocés con 12 años de añejamiento. Notas de roble, vainilla y un final suavemente ahumado.',
        price: 4500,
        src: '/assets/productos/whiskey.png',
        badge: { text: 'Black Label', type: 'coming-soon' },
        category: 'Bebidas'
    }
];

const publicidades = [
    {
        title: '¡Sábado de Hamburguesas!',
        description: '2x1 en toda la línea Smash hasta las 22hs.',
        image: '/assets/banners/banner1.png',
        buttonText: 'Pedir Ahora'
    },
    {
        title: 'Noches de Pizza',
        description: 'Envío gratis en todas tus pizzas favoritas.',
        image: '/assets/banners/banner2.png',
        buttonText: 'Ver Locales'
    }
];

const categorias = [
    { name: 'Electrónica', icon: '💻', type: 'main' },
    { name: 'Alimentos', icon: '🍔', type: 'main' },
    { name: 'Bebidas', icon: '🥤', type: 'main' },
    { name: 'Indumentaria', icon: '👕', type: 'main' },
    { name: 'Juegos', icon: '🎮', type: 'other' },
    { name: 'Automotor', icon: '🚗', type: 'other' },
    { name: 'Hogar', icon: '🏠', type: 'other' },
    { name: 'Otros', icon: '📦', type: 'other' }
];

const carrito = [
    { productId: '1', quantity: 2 },
    { productId: '2', quantity: 1 },
    { productId: '3', quantity: 3 }
];

module.exports = { productos, publicidades, categorias, carrito };
