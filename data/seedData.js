const products = [
    {
        title: 'Burger Smash XL',
        description: 'Doble medallon de 120g de carne seleccionada, queso cheddar derretido, panceta crocante y nuestra salsa secreta en pan brioche artesanal.',
        price: 1200,
        src: '/assets/productos/hamburguesasmash.png',
        category: 'Alimentos',
        isTopSeller: 1,
        stock: 50,
        status: 'Activo'
    },
    {
        title: 'Pizza Napolitana',
        description: 'Masa madre de fermentacion lenta, salsa de tomates italianos, muzzarella fior di latte, ajo, y hojas de albahaca fresca.',
        price: 1500,
        src: '/assets/productos/pizzanapo.png',
        category: 'Alimentos',
        isTopSeller: 1,
        stock: 30,
        status: 'Activo'
    },
    {
        title: 'Combo Coca-Cola',
        description: 'Lleva 2 Coca-Colas de litro y medio bien heladas. Ideal para compartir.',
        price: 800,
        src: '/assets/productos/cocacolas.png',
        category: 'Bebidas',
        isTopSeller: 0,
        stock: 10,
        status: 'Stock Bajo'
    },
    {
        title: 'Chocotorta Tradicional',
        description: 'El clasico argentino. Capas de galletitas de chocolate humedecidas en cafe, intercaladas con la mas suave mezcla de dulce de leche y queso crema.',
        price: 600,
        src: '/assets/productos/chocotorta.png',
        category: 'Alimentos',
        isTopSeller: 1,
        stock: 0,
        status: 'Sin Stock'
    },
    {
        title: 'Whiskey Premium',
        description: 'Whiskey de malta escoces con 12 anos de anejamiento. Notas de roble, vainilla y un final suavemente ahumado.',
        price: 4500,
        src: '/assets/productos/whiskey.png',
        category: 'Bebidas',
        isTopSeller: 0,
        stock: 15,
        status: 'Activo'
    }
];

const categories = [
    { name: 'Electronica', icon: '💻', type: 'main' },
    { name: 'Alimentos', icon: '🍔', type: 'main' },
    { name: 'Bebidas', icon: '🥤', type: 'main' },
    { name: 'Indumentaria', icon: '👕', type: 'main' },
    { name: 'Juegos', icon: '🎮', type: 'other' },
    { name: 'Automotor', icon: '🚗', type: 'other' },
    { name: 'Hogar', icon: '🏠', type: 'other' },
    { name: 'Otros', icon: '📦', type: 'other' },
    { name: 'Proximamente', icon: '❓', type: 'other' }
];

module.exports = {
    products,
    categories
};
