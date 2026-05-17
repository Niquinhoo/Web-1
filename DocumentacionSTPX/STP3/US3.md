# UserStory#3: Servicio de Productos con SQLite

**Estado:** Completada
**Sprint:** 3

## Descripción

Se reemplazó completamente la lógica interna de `productsService.js` para que todas las funciones lean datos desde SQLite en lugar del array hardcodeado en `productModel.js`. El contrato de la API exportada no cambió, por lo que los controladores y vistas funcionan sin modificaciones.

## Acciones Realizadas

### Archivo modificado: `services/productsService.js`

Se reemplazó el `require('../models/productModel')` por `require('../db/database')`. Cada función ahora ejecuta una query SQL con `better-sqlite3`. Detalle por función:

| Función | Implementación SQL |
|---|---|
| `getAllProducts()` | `SELECT * FROM products` |
| `getSuggestedProducts(limit)` | `SELECT * FROM products LIMIT ?` |
| `getTopOrderedProducts(limit)` | Top sellers primero (`WHERE isTopSeller = 1`), resto aleatorio (`ORDER BY RANDOM()`) |
| `getProductById(id)` | `SELECT * FROM products WHERE id = ?` (id convertido a Number) |
| `getRelatedProducts(product)` | `WHERE category = ? AND id != ? ORDER BY RANDOM() LIMIT 4` |
| `getRandomProducts(limit)` | `ORDER BY RANDOM() LIMIT ?` |
| `getProductsByCategory(category)` | `SELECT *` + filtro JS con normalización de acentos (SQLite no tiene `normalize`) |
| `getProductsSortedByPrice(sort)` | `ORDER BY price ASC/DESC` según parámetro |
| `searchProductsByName(query)` | `WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'` |

Se agregó `isTopSeller: Boolean(product.isTopSeller)` en `withFallbackImage` para convertir el `0/1` de SQLite a booleano correcto en JS.

## Validación

Verificado con `node -e`:

```
getAllProducts: 5
getProductById(1): Burger Smash XL
searchProductsByName(pizza): [ 'Pizza Napolitana' ]
sortAsc: [ 600, 800, 1200, 1500, 4500 ]
byCategory(Bebidas): [ 'Combo Coca-Cola', 'Whiskey Premium' ]
```

- ✅ Ninguna función del servicio usa JSON ni el modelo viejo.
- ✅ Los controladores siguen funcionando sin cambios.
- ✅ Las vistas muestran datos reales desde la base.
