const fs = require('fs');
const path = require('path');

const files = {
    // CSS ATOMS
    'styles/atoms/cart/cart-item-image.css': `.cart-item-img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }`,
    'styles/atoms/cart/cart-item-title.css': `.cart-item-title { font-size: 1.1rem; font-weight: 600; color: var(--text-color, #333); margin: 0; }`,
    'styles/atoms/cart/cart-item-price.css': `.cart-item-price { font-size: 1rem; font-weight: 700; color: var(--primary-color, #e63946); }`,
    'styles/atoms/cart/quantity-btn.css': `.quantity-btn { background-color: #f1f1f1; border: none; border-radius: 4px; padding: 4px 12px; font-size: 1.2rem; cursor: pointer; transition: background-color 0.2s; } .quantity-btn:hover { background-color: #e0e0e0; }`,
    'styles/atoms/cart/quantity-counter.css': `.quantity-counter { font-size: 1rem; font-weight: 600; padding: 0 12px; min-width: 20px; text-align: center; }`,
    'styles/atoms/cart/discount-input.css': `.discount-input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; flex-grow: 1; outline: none; } .discount-input:focus { border-color: var(--primary-color, #e63946); }`,
    'styles/atoms/cart/checkout-btn.css': `.checkout-btn { background-color: var(--primary-color, #e63946); color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; width: 100%; transition: background-color 0.2s; } .checkout-btn:hover { background-color: var(--primary-hover, #d62828); }`,
    'styles/atoms/cart/back-btn.css': `.back-btn { background-color: transparent; color: var(--text-color, #333); padding: 12px 24px; border: 1px solid #ccc; border-radius: 6px; font-size: 1.1rem; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; width: 100%; margin-top: 10px; transition: background-color 0.2s; } .back-btn:hover { background-color: #f1f1f1; }`,
    'styles/atoms/cart/search-input.css': `.search-input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 20px; font-size: 0.9rem; outline: none; width: 250px; }`,
    
    // CSS MOLECULES
    'styles/molecules/cart/search-bar.css': `.search-bar { display: flex; align-items: center; gap: 8px; }`,
    'styles/molecules/cart/cart-item.css': `.cart-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #eee; gap: 16px; } .cart-item-details { flex-grow: 1; display: flex; flex-direction: column; gap: 8px; }`,
    'styles/molecules/cart/cart-item-actions.css': `.cart-item-actions { display: flex; align-items: center; gap: 8px; }`,
    'styles/molecules/cart/discount-form.css': `.discount-form { display: flex; gap: 10px; margin-bottom: 20px; } .apply-discount-btn { padding: 10px 16px; background-color: #333; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }`,
    
    // CSS ORGANISMS
    'styles/organisms/cart/cart-header.css': `.cart-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } .store-name { font-size: 1.5rem; font-weight: bold; color: var(--primary-color, #e63946); }`,
    'styles/organisms/cart/cart-list.css': `.cart-list { display: flex; flex-direction: column; gap: 0; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px; }`,
    'styles/organisms/cart/cart-summary.css': `.cart-summary { background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); } .cart-summary-total { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; margin-bottom: 20px; }`,
    
    // CSS TEMPLATES
    'styles/templates/cart-layout.css': `.cart-layout { max-width: 1200px; margin: 0 auto; padding: 32px 16px; display: grid; grid-template-columns: 2fr 1fr; gap: 32px; } @media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } }`,

    // EJS ATOMS
    'views/partials/atoms/cart/cart-item-image.ejs': `<img src="<%= image %>" alt="<%= title %>" class="cart-item-img">`,
    'views/partials/atoms/cart/cart-item-title.ejs': `<h3 class="cart-item-title"><%= title %></h3>`,
    'views/partials/atoms/cart/cart-item-price.ejs': `<span class="cart-item-price"><%= price %> pts</span>`,
    'views/partials/atoms/cart/quantity-btn.ejs': `<button type="button" class="quantity-btn" aria-label="<%= action %>"><%= text %></button>`,
    'views/partials/atoms/cart/quantity-counter.ejs': `<span class="quantity-counter"><%= quantity %></span>`,
    'views/partials/atoms/cart/discount-input.ejs': `<input type="text" class="discount-input" placeholder="Código de descuento" aria-label="Código de descuento">`,
    'views/partials/atoms/cart/checkout-btn.ejs': `<a href="/checkout" class="checkout-btn">Ir a Pagar</a>`,
    'views/partials/atoms/cart/back-btn.ejs': `<a href="/" class="back-btn">Volver al listado</a>`,
    'views/partials/atoms/cart/search-input.ejs': `<input type="search" class="search-input" placeholder="Buscar productos..." aria-label="Buscar productos">`,
    'views/partials/atoms/logo.ejs': `<a href="/" class="header-logo"><span class="logo-text">Pediloo</span></a>`, // reusing existing logic or just fallback

    // EJS MOLECULES
    'views/partials/molecules/cart/search-bar.ejs': `<form class="search-bar"> <%- include('../../atoms/cart/search-input') %> </form>`,
    'views/partials/molecules/cart/cart-item-actions.ejs': `<div class="cart-item-actions"> <%- include('../../atoms/cart/quantity-btn', {action: 'Reducir cantidad', text: '➖'}) %> <%- include('../../atoms/cart/quantity-counter', {quantity: quantity}) %> <%- include('../../atoms/cart/quantity-btn', {action: 'Aumentar cantidad', text: '➕'}) %> </div>`,
    'views/partials/molecules/cart/cart-item.ejs': `<article class="cart-item"> <%- include('../../atoms/cart/cart-item-image', {image: item.image, title: item.title}) %> <div class="cart-item-details"> <%- include('../../atoms/cart/cart-item-title', {title: item.title}) %> <%- include('../../atoms/cart/cart-item-price', {price: item.price}) %> </div> <%- include('../../molecules/cart/cart-item-actions', {quantity: item.quantity}) %> </article>`,
    'views/partials/molecules/cart/discount-form.ejs': `<form class="discount-form"> <%- include('../../atoms/cart/discount-input') %> <button type="submit" class="apply-discount-btn">Aplicar</button> </form>`,

    // EJS ORGANISMS
    'views/partials/organisms/cart/cart-header.ejs': `<header class="cart-header"> <div class="store-name">Pediloo Store</div> <%- include('../../molecules/cart/search-bar') %> </header>`,
    'views/partials/organisms/cart/cart-list.ejs': `<section class="cart-list" aria-label="Lista de productos en el carrito"> <% items.forEach(item => { %> <%- include('../../molecules/cart/cart-item', {item: item}) %> <% }); %> </section>`,
    'views/partials/organisms/cart/cart-summary.ejs': `<aside class="cart-summary"> <%- include('../../molecules/cart/discount-form') %> <div class="cart-summary-total"> <span>Total a pagar:</span> <span><%= total %> pts</span> </div> <%- include('../../atoms/cart/checkout-btn') %> <%- include('../../atoms/cart/back-btn') %> </aside>`,

    // EJS TEMPLATES
    'views/partials/templates/cart-layout.ejs': `<main class="cart-layout"> <div class="cart-main-content"> <h1>Tu Carrito</h1> <%- include('../../organisms/cart/cart-list', {items: items}) %> </div> <div class="cart-sidebar"> <%- include('../../organisms/cart/cart-summary', {total: total}) %> </div> </main>`,

    // EJS PAGE
    'views/pages/cart/cart-page.ejs': `<!DOCTYPE html> <html lang="es"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Carrito - Pediloo</title> <link rel="stylesheet" href="/styles/main.css"> </head> <body> <%- include('../../partials/organisms/cart/cart-header') %> <%- include('../../partials/templates/cart-layout', {items: cartItems, total: cartTotal}) %> </body> </html>`
};

for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(__dirname, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
}

console.log('Archivos del carrito creados correctamente.');
