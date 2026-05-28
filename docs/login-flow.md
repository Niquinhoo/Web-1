# Login Flow — Task Tracker

## Estado actual (modo prefill / sin API real)

Los inputs están pre-rellenados con credenciales hardcoded para desarrollo:
- **Usuario:** `nicolas`
- **Contraseña:** `nicolas1234`

La llamada HTTP igual se hace. Si la API está caída → formulario muestra error API.
Si querés bypassear la API completamente → ver sección "Mock mode" abajo.

---

## Flujo completo (con API real)

```
Usuario carga /login
       │
       ▼
Login.jsx
  ├─ isAuthenticated? → redirect /  (token ya en localStorage)
  └─ loading?         → <Spinner />
       │
       ▼ (no auth)
LoginForm.jsx  (renderiza form-card)
  │  inputs: username, password (prefilled en dev)
  │
  ├─ submit → validate()
  │    ├─ username vacío      → error bajo campo
  │    ├─ username < 4 chars  → error bajo campo
  │    ├─ password vacío      → error bajo campo
  │    └─ password < 4 chars  → error bajo campo
  │
  ├─ errores? → setErrors, STOP
  │
  └─ sin errores → login(username, password)
       │
       ▼
AuthContext.jsx — login()
  POST /login  { username, password }
       │
       ├─ 200 OK → { token, user: { _id, email, username, name: { first, last } } }
       │    ├─ localStorage.setItem('taskTrackerToken', token)
       │    ├─ localStorage.setItem('taskTrackerUser', JSON.stringify(user))
       │    ├─ setToken(token)
       │    ├─ setUser(user)
       │    └─ return response → onSuccess() → navigate(from || '/')
       │
       ├─ 401 → client.js intercepta → limpia storage → redirect /login
       │         LoginForm muestra error API bajo el formulario
       │
       └─ Network error → LoginForm muestra "Error de conexión..."
```

---

## Persistencia de sesión

Al recargar la app:

```
App.jsx → AppRouter → AuthProvider
  useState(() => localStorage.getItem('taskTrackerToken'))
  useState(readStoredUser)   ← parsea 'taskTrackerUser' de localStorage
       │
       ▼
  isAuthenticated = Boolean(token)   ← true si token existe
       │
  ProtectedRoute
  ├─ isAuthenticated → renderiza ruta pedida
  └─ !isAuthenticated → Navigate /login
```

No hay re-validación de token contra API al recargar (sin `/me` endpoint).
Token se invalida solo cuando API devuelve 401 en cualquier request.

---

## Logout

```
Settings.jsx → logout() de AuthContext
  localStorage.removeItem('taskTrackerToken')
  localStorage.removeItem('taskTrackerUser')
  setToken(null)
  setUser(null)
  navigate('/login', { replace: true })
```

---

## Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Login.jsx` | Página wrapper, guard isAuthenticated |
| `src/components/forms/LoginForm.jsx` | UI del form, validaciones, error display |
| `src/context/AuthContext.jsx` | login(), logout(), estado user/token |
| `src/context/AuthContextValue.js` | createContext() exportado |
| `src/hooks/useAuth.js` | Shortcut useContext(AuthContext) |
| `src/api/client.js` | fetchClient, JWT inject, interceptor 401 |
| `src/router/AppRouter.jsx` | AuthProvider wrapping, ProtectedRoute |
| `src/router/ProtectedRoute.jsx` | Redirect /login si !isAuthenticated |

---

## Para conectar a otra API

Cambiar solo `API_BASE_URL` en `src/api/client.js`:

```js
// src/api/client.js
const API_BASE_URL = 'https://TU-NUEVA-API.com/api'
```

El endpoint que se llama es `POST /login` con body `{ username, password }`.
La respuesta debe tener la forma:

```json
{
  "token": "JWT_STRING",
  "user": {
    "_id": "...",
    "email": "...",
    "username": "...",
    "name": { "first": "...", "last": "..." }
  }
}
```

Si la nueva API usa otro formato de respuesta, actualizar `AuthContext.jsx`:
```js
// login() — líneas 30-33
localStorage.setItem('taskTrackerToken', response.token)      // ← ajustar key
localStorage.setItem('taskTrackerUser', JSON.stringify(response.user))  // ← ajustar key
setToken(response.token)
setUser(response.user)
```

---

## Mock mode (sin API — solo desarrollo local)

Para bypassear la API completamente, reemplazar `login()` en `AuthContext.jsx`:

```js
const login = useCallback(async (username, password) => {
  // Mock: acepta cualquier credencial
  const mockUser = {
    _id: 'mock-001',
    email: `${username}@mock.dev`,
    username,
    name: { first: username, last: 'Dev' },
  }
  const mockToken = 'mock-token-dev'
  localStorage.setItem('taskTrackerToken', mockToken)
  localStorage.setItem('taskTrackerUser', JSON.stringify(mockUser))
  setToken(mockToken)
  setUser(mockUser)
  return { token: mockToken, user: mockUser }
}, [])
```

> **No commitear el mock.** Revertir antes de conectar la API real.

---

## Credenciales de desarrollo (prefilled)

```
username: nicolas
password: nicolas1234
```

Estas credenciales están hardcoded como `defaultValue` en los inputs de `LoginForm.jsx`.
En producción: quitar los `defaultValue` o reemplazar con `''`.
```
