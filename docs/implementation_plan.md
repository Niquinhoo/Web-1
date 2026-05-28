# Plan de Implementación — Task Tracker App

## 🎨 Directiva de Diseño — OBLIGATORIO

> **El agente que implemente este plan DEBE leer y seguir el skill `design-taste-frontend` (v2) antes de escribir cualquier CSS o componente visual.**
>
> Skill path: `c:\Users\nicot\Desktop\Web-1-26\.agents\skills\design-taste-frontend\SKILL.md`
>
> El skill v2 (`design-taste-frontend`) es el default actual. **No usar `design-taste-frontend-v1`.**
> Aplicar sus reglas en este orden:
> 1. Leer el SKILL.md completo antes de tocar `index.css`
> 2. Seguir su sistema de auditoría/dirección para decidir la paleta, tipografía y layout
> 3. Aplicar sus restricciones anti-genérico (no plain cards, no generic blues, no default shadows)
> 4. Toda decisión de diseño no especificada en este plan → defer al skill

### Design Read (§0.B — Obligatorio declarar antes de generar)

> **"Reading this as: product SPA for developer/student audience, dark-tech minimalist language, leaning toward native CSS + Outfit font + restrained motion."**

### Dials (§1 — Valores explícitos para este proyecto)

| Dial | Valor | Razón |
|------|-------|-------|
| `DESIGN_VARIANCE` | **6** | App funcional, no portafolio creativo; variedad moderada sin caos |
| `MOTION_INTENSITY` | **5** | Micro-interacciones justificadas (slide sidebar, fadeUp, hover), nada cinético |
| `VISUAL_DENSITY` | **5** | Datos reales (tasks, stories, epics) requieren densidad media |

### Decisiones de diseño fijadas (§ skill override)

| Aspecto | Decisión | Justificación skill |
|---------|----------|---------------------|
| **Fuente** | `Outfit` (self-hosted `@font-face`, NO `<link>` Google Fonts) | §3.A, §4.1: Inter discouraged; self-host obligatorio |
| **Accent color** | `hsl(214, 90%, 62%)` — Electric Blue | §4.2 Lila Rule: AI-purple prohibido como default |
| **Glassmorphism** | Sólo en Header pill + modal panels (NO en todas las cards) | §5: contextual, no en todo |
| **Iconos** | `@phosphor-icons/react` — UNA librería, peso estándar 1.5 | §3.C: librería permitida, no hand-roll SVGs |
| **EmptyState icon** | Ícono de Phosphor, no emoji | §3.D: emojis discouraged by default |
| **Corner radius** | Sistema único: buttons `999px`, cards `1.2rem`, inputs `0.75rem` | §4.4 Shape Consistency Lock |
| **Dark mode** | Un tema locked, dark completo, sin secciones invertidas | §4.11 Page Theme Lock |

---

## Stack

- **React 19** + **Vite** (ya configurado)
- **react-router-dom v6** — rutas SPA
- **CSS Vanilla** — estilos, mobile-first
- **Context API** — estado global (auth + user)
- **fetch nativo** — llamadas a API (no axios)
- **`@phosphor-icons/react`** — iconos (§3.C skill v2, una sola familia)
- **API Base:** `https://lamansysfaketaskmanagerapi.onrender.com/api`

---

## Alcance — Exclusiones Explícitas

> Los requerimientos **9, 10 y 11** (Agregar/Editar/Eliminar Projects, Epics y Stories) están marcados como 👥 *"sólo proyectos grupales"* en las guidelines. Este es un proyecto individual, por lo tanto **quedan fuera del alcance**.
>
> Se implementa sólo: **Agregar Tasks** (Req 12) y **Eliminar Tasks** (Req 13).

---

## Estructura de Carpetas

```
src/
├── api/
│   └── client.js              # fetch wrapper + JWT auto-inject + error interceptor
├── context/
│   └── AuthContext.jsx         # token, user, login(), logout(), isAuthenticated
├── hooks/
│   ├── useFetch.js             # generic data fetching hook
│   └── useAuth.js              # shortcut to AuthContext
├── components/
│   ├── Layout/
│   │   ├── Header.jsx          # hamburger vs back-arrow logic
│   │   ├── Sidebar.jsx         # nav panel lateral + overlay
│   │   └── Layout.jsx          # wrapper: Header + Sidebar + <Outlet>
│   ├── ui/
│   │   ├── Card.jsx            # tarjeta reutilizable con icon, título, descripción
│   │   ├── Spinner.jsx         # loading indicator
│   │   ├── EmptyState.jsx      # mensaje "no hay datos"
│   │   ├── StatusBadge.jsx     # badge para status: todo/running/done
│   │   ├── Modal.jsx           # modal genérico con overlay
│   │   └── ConfirmDialog.jsx   # diálogo de confirmación (usa Modal)
│   └── forms/
│       ├── TaskForm.jsx        # formulario agregar tarea
│       └── LoginForm.jsx       # formulario login
├── pages/
│   ├── Home.jsx                # dashboard creativo
│   ├── Login.jsx               # pantalla login (sin Layout)
│   ├── MyProjects.jsx          # lista proyectos
│   ├── ProjectDetail.jsx       # info proyecto + lista epics
│   ├── EpicDetail.jsx          # info epic + lista stories
│   ├── StoryDetail.jsx         # info story + lista tasks + add/delete
│   ├── MyStories.jsx           # todas las stories del user
│   └── Settings.jsx            # datos user + logout
├── router/
│   └── AppRouter.jsx           # rutas + ProtectedRoute wrapper
├── App.jsx
├── main.jsx
├── index.css                   # design system + tokens
└── App.css                     # reset / global
```

---

## Rutas

| URL | Componente | Nivel | Header |
|-----|-----------|-------|--------|
| `/` | `Home` | 1er nivel | ☰ hamburger + "Home" |
| `/home` | `Home` (alias de `/`) | 1er nivel | ☰ hamburger + "Home" |
| `/login` | `Login` | sin layout | sin header |
| `/my-projects` | `MyProjects` | 1er nivel | ☰ hamburger + "My Projects" |
| `/my-projects/:projectId` | `ProjectDetail` | detalle | ‹ back + nombre proyecto |
| `/my-projects/:projectId/:epicId` | `EpicDetail` | detalle | ‹ back + nombre epic |
| `/my-projects/:projectId/:epicId/:storyId` | `StoryDetail` | detalle | ‹ back + nombre story |
| `/my-stories` | `MyStories` | 1er nivel | ☰ hamburger + "My Stories" |
| `/settings` | `Settings` | 1er nivel | ☰ hamburger + "Settings" |

> **ProtectedRoute:** si no hay token en localStorage → redirect a `/login`.
> Ruta `/home` se registra como alias redirect a `/` o como ruta duplicada que renderiza `Home`.

---

## Entidades, Schemas y Endpoints

### Auth

| Endpoint | Método | Body | Respuesta |
|----------|--------|------|-----------|
| `/login` | POST | `{ username, password }` | `{ token, user: { _id, email, username, name: { first, last } } }` |

### Projects

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /projects` | GET | Lista proyectos del user autenticado |
| `GET /projects/:id` | GET | Detalle de un proyecto |

**Campos renderizados:** `name`, `description`, `icon` (emoji o null), `members`

### Epics

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /epics?project=:id` | GET | Epics de un proyecto |
| `GET /epics/:id` | GET | Detalle de un epic |

**Campos renderizados:** `name`, `description`, `icon` (emoji o null), `project`

### Stories

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /stories?epic=:id` | GET | Stories de un epic |
| `GET /stories` | GET | Todas las stories del user |
| `GET /stories/:id` | GET | Detalle de una story |

**Campos renderizados:** `name`, `description`, `icon`, `points` (0-5), `status` (todo/running/done), `assignedTo`, `created`, `due`, `started`, `finished`

### Tasks

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /tasks?story=:id` | GET | Tasks de una story |
| `POST /tasks` | POST | Crear tarea. Body: `{ name, description?, story, dueDate? }` |
| `DELETE /tasks/:id` | DELETE | Eliminar tarea |

**Campos renderizados:** `name`, `description`, `done` (boolean), `created`, `dueDate`

> **Nota:** No existe endpoint `PATCH /tasks/:id` documentado. El checkbox `done` se renderiza como informativo (read-only) a menos que se descubra endpoint de update durante desarrollo.

---

## Componentes — Props y Responsabilidades

### `api/client.js`

```
fetchClient(endpoint, options?)
```
- Auto-inyecta `Authorization: Bearer <token>` desde localStorage
- Base URL: `https://lamansysfaketaskmanagerapi.onrender.com/api`
- Parsea JSON automáticamente
- **Manejo de errores:**
  - `401` → limpia token, redirige a `/login`
  - `4xx/5xx` → throw error con mensaje del server
  - Network error → throw error genérico "Error de conexión"

### `AuthContext`

```
Provee: { user, token, isAuthenticated, login(username, pwd), logout(), loading }
```
- `login()` → `POST /login` → guarda token en `localStorage` → setea user
- `logout()` → limpia `localStorage` → setea user null → redirect `/login`
- Al montar: lee token de `localStorage`, si existe setea `isAuthenticated = true`
- `loading`: true mientras verifica token inicial

### `useFetch(endpoint, dependencies?)`

```
Retorna: { data, loading, error, refetch }
```
- Usa `fetchClient` internamente
- Re-fetch cuando cambian `dependencies`
- `refetch()` — función manual para re-obtener datos (usado post-create/delete)
- `loading` inicia en `true`
- `error` contiene mensaje string o null

### `Header`

```
Props: ninguna (lee ruta de react-router)
```
- Detecta rutas 1er nivel: `/`, `/home`, `/my-projects`, `/my-stories`, `/settings`
  - → Muestra `☰` + título de vista
- Cualquier otra ruta (detalle):
  - → Muestra `‹` + `navigate(-1)` + nombre item (obtenido de contexto o prop del Outlet)
- Título dinámico: en vistas detalle, mostrar nombre del recurso actual

### `Sidebar`

```
Props: { isOpen, onClose }
```
- Panel deslizante desde izquierda con `transform: translateX`
- **3 secciones** (según Req 3):
  1. Encabezado con logo/marca de app
  2. Links de navegación: Home, My Projects, My Stories
  3. Sección inferior: Settings (icono + texto)
- **Cierre:** click en overlay (backdrop), click en link de nav, o botón X
- Overlay semi-transparente detrás del sidebar
- Transición animada CSS (~300ms ease)

### `Layout`

```
Estructura: <Header /> + <Sidebar /> + <main><Outlet /></main>
```
- Estado `sidebarOpen` controlado acá
- Pasa `toggleSidebar` a Header, `isOpen/onClose` a Sidebar

### `Card`

```
Props: { icon?, title, subtitle?, description?, badge?, onClick?, children? }
```
- Tarjeta reutilizable para Projects, Epics, Stories, Tasks
- `icon`: emoji del schema (renderizar si no null)
- `badge`: para StatusBadge en stories
- `onClick`: navegación al detalle

### `StatusBadge`

```
Props: { status } — 'todo' | 'running' | 'done'
```
- Colores: `todo` → gris, `running` → amarillo, `done` → verde
- Texto: "To Do", "Running", "Done"

### `Spinner`

```
Props: { size? }
```
- Animación CSS pulse/rotate
- Centrado en contenedor padre

### `EmptyState`

```
Props: { message }
```
- Icono ilustrativo + texto descriptivo
- Centrado vertical

### `Modal`

```
Props: { isOpen, onClose, title, children }
```
- Overlay oscuro + panel centrado
- Click en overlay NO cierra (para evitar pérdida de form data)
- Botón X para cerrar (o escape key)

### `ConfirmDialog`

```
Props: { isOpen, onConfirm, onCancel, message, loading? }
```
- Usa `Modal` internamente
- Botones: "Cancelar" + "Confirmar"
- Si `loading=true` → botón confirmar muestra spinner + disabled

### `TaskForm`

```
Props: { storyId, onSuccess, onCancel }
```
- Campos: `name` (requerido), `description` (opcional, mín 10 chars si presente)
- Validación on-submit (no real-time)
- Errores bajo cada campo
- Al submit: `POST /tasks` con body `{ name, description, story: storyId }`
- Mientras guarda: spinner en botón + form disabled + diálogo permanece abierto
- On success: llama `onSuccess()` para refetch + cierra

### `LoginForm`

```
Props: { onSuccess }
```
- Campos: `username` (requerido, mín 4 chars), `password` (requerido, mín 4 chars)
- Validación on-submit
- Errores de validación: **debajo del campo correspondiente**
- Error de API (credenciales inválidas, server error): **debajo del formulario**
- Al submit: llama `login()` de AuthContext
- On success: redirect a `/`

---

## Pasos de Implementación

### Paso 0 — Instalar dependencias

```bash
npm install react-router-dom @phosphor-icons/react
```

> **Nota §3.F skill v2:** verificar en `package.json` antes de importar. No asumir existencia.

### Paso 1 — Design System (`index.css`)

> ⚠️ Leer SKILL.md completo (Paso 0b) antes de escribir una sola línea de CSS.

- **Fuente — `Outfit`** (§3.A, §4.1):
  - Self-hosted vía `@font-face` + `font-display: swap` en `index.css`
  - **NO** usar `<link href="fonts.googleapis.com">` en producción
  - Alternativa aceptable: `Geist` (también self-hosted)
  - `Inter` sólo si el usuario lo pide explícitamente

- **Color accent — Electric Blue** (§4.2 Lila Rule):
  - `--primary: hsl(214, 90%, 62%)` — prohibido AI-purple `hsl(252, 92%, 68%)` como default
  - Neutrales: Zinc/Slate base (`#0f1117` fondo, `#151824` secundario)
  - Status: `--done: hsl(152, 68%, 48%)`, `--running: hsl(43, 96%, 59%)`, `--todo: hsl(224, 13%, 58%)`
  - **Color Consistency Lock:** un solo accent en toda la app, sin mezclar warm/cool grays (§4.2)

- **Glassmorphism — acotado** (§5, §4.4):
  - ✅ Header pill flotante: `backdrop-filter: blur(20px)` — justificado (premium feel en nav)
  - ✅ Modal panels: `backdrop-filter: blur(18px)` — justificado (overlay sobre contenido)
  - ❌ Cards de listado (Projects, Epics, Stories, Tasks): **NO glassmorphism**, usar `border + bg sólido oscuro`
  - Motivo: glassmorphism en todo = AI-slop genérico (§4.4)

- **Corner radius — Shape Consistency Lock** (§4.4):
  - Buttons: `999px` (pill)
  - Cards / panels / modal: `1.2rem`
  - Inputs / badges: `0.75rem`
  - NO mezclar sistemas

- **Tokens CSS:**
  - Spacing: `--space-1` (4px) a `--space-8` (64px)
  - Font sizes: `--fs-xs` a `--fs-2xl` (clamp)
  - Shadows: tintadas al hue del fondo — no pure-black drops (§4.4)

- **Mobile-first breakpoints:**
  - Base: 375px (mobile)
  - `@media (min-width: 768px)` — tablet
  - `@media (min-width: 1024px)` — desktop

- **Clases utilitarias:** `.card`, `.spinner`, `.badge`, `.btn`, `.btn--primary`, `.btn--danger`, `.modal-overlay`, `.form-error`

- **Accesibilidad** (§6.B, §4.5, §4.6):
  - `focus-visible` outlines con color accent
  - Contrast ≥ 4.5:1 texto/fondo
  - `prefers-reduced-motion` en todas las animaciones
  - `prefers-reduced-transparency` fallback en glassmorphism
  - Label SOBRE input, error BAJO input (§4.6)

- **Motion motivado** (§5, MOTION_INTENSITY: 5):
  - `@keyframes fadeUp` → page enter (jerarquía)
  - `@keyframes spin` → spinner loading (feedback)
  - Sidebar slide 300ms ease → state transition
  - Hover `translateY(-3px)` en cards clickeables → tactile feedback (§4.5)
  - Nada de infinite loops sin propósito

### Paso 2 — Auth (`AuthContext` + `api/client.js`)

1. Crear `api/client.js` — fetch wrapper con JWT inject + error handling
2. Crear `AuthContext.jsx` — login/logout/user/token/isAuthenticated
3. Crear `useAuth.js` — `useContext(AuthContext)` shortcut
4. Crear `ProtectedRoute` en `router/` — wrapper que redirige a `/login` si no auth
5. Verificar: al recargar página, token persiste y user sigue logueado

### Paso 3 — Router (`AppRouter.jsx`)

1. Registrar todas rutas:
   - `/` → `Home` (dentro de Layout)
   - `/home` → redirect a `/` (o render `Home` directo)
   - `/login` → `Login` (SIN Layout wrapper)
   - `/my-projects` → `MyProjects` (dentro de Layout)
   - `/my-projects/:projectId` → `ProjectDetail`
   - `/my-projects/:projectId/:epicId` → `EpicDetail`
   - `/my-projects/:projectId/:epicId/:storyId` → `StoryDetail`
   - `/my-stories` → `MyStories`
   - `/settings` → `Settings`
2. Todas excepto `/login` envueltas en `ProtectedRoute`
3. Ruta catch-all `*` → redirect a `/`

### Paso 4 — Layout Global (Header + Sidebar + Layout)

1. `Layout.jsx`:
   - Estado `sidebarOpen`
   - Renderiza `<Header>` + `<Sidebar>` + `<main><Outlet /></main>`
   - Usa elemento semántico `<main>` para contenido

2. `Header.jsx`:
   - Lee `location.pathname` de react-router
   - Rutas 1er nivel (`/`, `/home`, `/my-projects`, `/my-stories`, `/settings`):
     - Renderiza botón `☰` que llama `toggleSidebar()`
     - Muestra título estático de la vista
   - Rutas detalle (cualquier otra):
     - Renderiza botón `‹` que llama `navigate(-1)`
     - Muestra nombre dinámico del recurso actual
   - HTML semántico: `<header>`, `<nav>`, `<button aria-label="...">`

3. `Sidebar.jsx`:
   - Panel con `position: fixed`, `transform: translateX(-100%)` cuando cerrado
   - Transición CSS `transform 300ms ease`
   - Overlay/backdrop semi-transparente: click cierra sidebar
   - **3 secciones:**
     - Top: logo/marca app
     - Middle: links — Home, My Projects, My Stories
     - Bottom: Settings
   - Click en cualquier link → navega + cierra sidebar
   - HTML semántico: `<nav>`, `<ul>`, `<li>`, links con `<NavLink>`

### Paso 5 — Pantalla Login (`/login`)

- Renderiza `LoginForm` centrado, sin Layout
- Flujo:
  1. User ingresa `username` + `password`
  2. Validación on-submit: ambos requeridos, mín 4 chars
  3. Errores validación → bajo cada campo correspondiente
  4. Submit → `POST /login` via AuthContext
  5. Error API (401, network) → mensaje bajo el formulario
  6. Éxito → guardar JWT en localStorage → redirect a `/`
- No accesible si ya logueado (redirect a `/`)

### Paso 6 — Home (`/`)

- Pantalla creativa (Req 4: "deja volar tu creatividad")
- Contenido propuesto:
  - Saludo: "¡Hola, {user.name.first}!"
  - Resumen: cantidad de proyectos, stories pendientes (status: todo/running)
  - Quick links a My Projects y My Stories
- Fetches necesarios:
  - `GET /projects` → count
  - `GET /stories` → count por status
- Estados: loading → dashboard

### Paso 7 — My Projects (`/my-projects`)

- `GET /projects` → lista de Cards
- Cada Card muestra: `icon` (si existe), `name`, `description` (truncada)
- **3 estados UI:**
  1. Loading → `<Spinner />`
  2. Empty → `<EmptyState message="No tenés proyectos asignados" />`
  3. Data → lista de `<Card onClick={() => navigate(/my-projects/${id})} />`

### Paso 8 — Project Detail (`/my-projects/:projectId`)

- Fetches **en paralelo** (Promise.all o dos useFetch):
  - `GET /projects/:id` → info proyecto (header de página)
  - `GET /epics?project=:id` → lista epics
- Sección superior: nombre proyecto, descripción completa, icon
- Sección inferior: lista de epic Cards
  - Cada Card: `icon`, `name`, `description`
  - Click → `navigate(.../:epicId)`
- **3 estados UI** para lista epics

### Paso 9 — Epic Detail (`/my-projects/:projectId/:epicId`)

- Fetches **en paralelo**:
  - `GET /epics/:id` → info epic (cabecera)
  - `GET /stories?epic=:id` → lista stories
- **Cabecera obligatoria** (Req 7): mostrar info del epic — `name`, `description`, `icon`
- Lista stories — cada Card muestra:
  - `name`, `icon`
  - `<StatusBadge status={story.status} />`
  - `points` (mostrar como número o indicador visual)
  - `assignedTo` (si populated, mostrar nombres; si IDs, mostrar count)
  - Click → `navigate(.../:storyId)`
- **3 estados UI** para lista stories

### Paso 10 — Story Detail (`/my-projects/:projectId/:epicId/:storyId`)

- Fetches **en paralelo**:
  - `GET /stories/:id` → info story (cabecera)
  - `GET /tasks?story=:id` → lista tasks
- **Cabecera story:** `name`, `description`, `status` badge, `points`, fechas (`created`, `due`, `started`, `finished`)
- **Lista tasks:** cada Card muestra:
  - Indicador visual `done` (checkbox estilizado, **read-only**)
  - `name`, `description`
  - `dueDate` (si existe, formateado)
  - `created` (formateado)
  - Botón 🗑️ eliminar → abre `ConfirmDialog`

#### Agregar Tarea (Req 12)

- Botón "Agregar tarea" **encima del listado**
- Click → abre `Modal` con `TaskForm`
- `TaskForm` campos:
  - `name` — requerido
  - `description` — opcional, si se llena mín 10 chars
- Validación errores bajo cada campo
- Submit → `POST /tasks` con body: `{ name, description, story: storyId }`
- **Mientras guarda:** diálogo permanece abierto, botón muestra "Creando tarea...", form disabled
- Éxito → cierra modal, `refetch()` lista tasks

#### Eliminar Tarea (Req 13)

- Botón 🗑️ en cada task Card
- Click → `ConfirmDialog`: "¿Estás seguro de eliminar esta tarea?"
- **Mientras elimina:** diálogo permanece abierto, botón muestra "Eliminando..."
- Confirmar → `DELETE /tasks/:id` → `refetch()` lista
- Cancelar → cierra diálogo, sin cambios

### Paso 11 — My Stories (`/my-stories`)

- `GET /stories` → todas las stories del user
- Cada Card muestra: `name`, `status` badge, `points`, `icon`
- **Información de contexto:** la story tiene campo `epic` (ID). Para mostrar nombre del epic/proyecto asociado:
  - Opción A: si API devuelve datos populated → usarlos directo
  - Opción B: si solo IDs → fetch adicional de epics/projects, o mostrar sin contexto
- **3 estados UI**

### Paso 12 — Settings (`/settings`)

- Muestra datos del user logueado:
  - Nombre completo (`name.first` + `name.last`)
  - Username
  - Email
- Botón "Cerrar sesión" → `logout()` de AuthContext → limpia localStorage → redirect `/login`

---

## Manejo Global de Errores

| Escenario | Comportamiento |
|-----------|---------------|
| API retorna `401` | `client.js` intercepta → limpia token → redirect a `/login` |
| API retorna `4xx` (no 401) | Muestra error message del server en UI correspondiente |
| API retorna `5xx` | Muestra "Error del servidor. Intentá de nuevo más tarde" |
| Sin conexión / network error | Muestra "Error de conexión. Verificá tu internet" |
| Token no existe al cargar app | `ProtectedRoute` redirige a `/login` |

---

## Estados UI — Regla Global

Cada pantalla de listado cumple **3 estados**:

1. **Loading** → `<Spinner />` centrado
2. **Empty** → `<EmptyState message="..." />`
3. **Data** → lista de `<Card />`

Los mensajes de empty state son específicos por pantalla:
- Projects: "No tenés proyectos asignados"
- Epics: "Este proyecto no tiene épicas"
- Stories: "Esta épica no tiene stories"
- Tasks: "Esta story no tiene tareas"

---

## Header Logic — Regla de Navegación

```
Rutas 1er nivel: /, /home, /my-projects, /my-stories, /settings
  → Header: [☰ hamburger] + [título estático de vista]

Rutas detalle: /my-projects/:id, /:id/:epicId, /:id/:epicId/:storyId
  → Header: [‹ back (navigate(-1))] + [nombre dinámico del recurso]
```

---

## Notas de Diseño

> ⚠️ **El agente implementador DEBE leer `design-taste-frontend` (v2) SKILL.md antes de cualquier CSS.** Las notas abajo son constraints del proyecto; el skill define el HOW.

- **Skill de referencia**: `design-taste-frontend` (v2, default) — anti-slop, audit-first, no templated UI
- **Design Read**: product SPA for developer audience, dark-tech minimalist, VARIANCE 6 / MOTION 5 / DENSITY 5
- **Mobile-first**: diseño base para 375px, responsive breakpoints 768px / 1024px
- **Dark mode locked**: fondo `#0f1117`, un solo tema, sin secciones invertidas mid-page (§4.11)
- **Cards**: glassmorphism SOLO en Header pill + Modal — cards de listado usan `border + bg sólido`
- **Colores**: Electric Blue `hsl(214, 90%, 62%)` accent, verde `done`, amarillo `running`, gris `todo`
- **AI-purple prohibido**: `hsl(252, 92%, 68%)` no es el accent de este proyecto (§4.2 Lila Rule)
- **Micro-animaciones justificadas** (MOTION: 5): sidebar slide (state transition), fadeUp page (jerarquía), hover cards (tactile), spinner (feedback)
- **Fuente**: `Outfit` — self-hosted `@font-face`, no `<link>` Google Fonts (§3.A)
- **Iconos**: `@phosphor-icons/react` únicamente — peso 1.5, no emojis en UI (§3.C, §3.D)
- **Accesibilidad:**
  - HTML semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<button>`, `<form>`
  - `aria-label` en botones icónicos (hamburger, back, delete)
  - Focus-visible con color accent
  - Contrast ≥ 4.5:1 para texto sobre fondos oscuros
  - `prefers-reduced-motion` en todos los keyframes/transitions
  - `prefers-reduced-transparency` fallback en glassmorphism del Header y Modal

---

## Orden de Desarrollo Sugerido

```
Paso 0  → npm install react-router-dom @phosphor-icons/react
Paso 0b → LEER design-taste-frontend SKILL.md (v2) — OBLIGATORIO antes de Paso 1
Paso 0c → Descargar/self-host fuente Outfit (woff2) → src/assets/fonts/
Paso 1  → index.css (design system — Outfit @font-face, Electric Blue accent, tokens, radius lock)
Paso 2  → Auth (client.js + AuthContext + useAuth + ProtectedRoute)
Paso 3  → Router (AppRouter con todas rutas + componentes vacíos)
Paso 4  → Layout (Header + Sidebar + Layout wrapper)
Paso 5  → Login (formulario + validaciones + conexión AuthContext)
Paso 6  → Home (dashboard creativo)
Paso 7  → MyProjects (lista cards — sin glassmorphism, iconos Phosphor)
Paso 8  → ProjectDetail (info + lista epics)
Paso 9  → EpicDetail (info epic + lista stories con status/points)
Paso 10 → StoryDetail (info story + lista tasks + agregar + eliminar)
Paso 11 → MyStories (lista global stories)
Paso 12 → Settings (datos user + logout)
```

> Cada paso se considera completo cuando cumple: render correcto de 3 estados UI, navegación funciona, datos de API se muestran, errores se manejan.

---

# Integración de Layout — Stitch Nexus Task Tracker

Integramos el nuevo sistema de distribución y estética del set de pantallas de `stitch_nexus_task_tracker` al diseño existente.

## User Review Required

> [!IMPORTANT]
> - **Estilo Vanilla CSS:** Para mantener la arquitectura del proyecto, traducimos las clases y distribuciones de Tailwind CSS (de los archivos `code.html` de Stitch) a reglas equivalentes en `src/index.css` de Vanilla CSS.
> - **Sidebar Persistente en Desktop:** En pantallas mayores a 768px (MD), la barra lateral se vuelve fija a la izquierda y el contenido del layout se desplaza a la derecha, ocultando el botón hamburguesa del encabezado.

## Proposed Changes

### [Layout / CSS Components]

#### [MODIFY] [index.css](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css)
- Agregar reglas para sidebar persistente: `.sidebar` en `@media (min-width: 768px)` cambia a `position: fixed`, `transform: translateX(0) !important`, `width: 280px`, `box-shadow: none`.
- Desplazamiento del main content y header: `.app-main` y `.app-header` reciben `margin-left: 280px` en pantallas grandes.
- Modificar estilos de tarjetas (`.card`) para incluir gradientes con hover transitions, sombras profundas (`shadow-deep`), y padding adaptado de las pantallas de Stitch.
- Agregar animaciones de entrada `animate-fade-up` y retrasos secuenciales (`.delay-100`, `.delay-200`, `.delay-300`).

#### [MODIFY] [Sidebar.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Sidebar.jsx)
- Mostrar perfil del usuario en la parte superior del sidebar (avatar inicial `DN` / `Nico`, nombre y rol `"Productivity Focus"`).
- Ocultar botón `X` (cerrar menú) en pantallas de desktop.
- Cambiar estilo de la opción activa para mostrar el borde derecho de color primary accent (`border-r-4 border-primary bg-surface-container-high`).

#### [MODIFY] [Header.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Header.jsx)
- Ocultar botón hamburguesa en pantallas desktop (`md:hidden`).
- Agregar avatar/perfil a la derecha como en la maqueta de Stitch.

### [Pages / Bento Layouts]

#### [MODIFY] [Home.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/Home.jsx)
- Refactorizar a Bento Grid:
  - Dos tarjetas de métricas grandes: "Proyectos Asignados" y "Stories Pendientes".
  - Una tarjeta de acciones rápidas (Quick Actions): botones para navegar a Proyectos y Stories.
  - Una tarjeta de actividad reciente (Recent Activity) simulando actualizaciones de las User Stories.

#### [MODIFY] [MyProjects.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/MyProjects.jsx)
- Adaptar bento grid de proyectos de 3 columnas en desktop.
- Agregar gradiente hover en fondo y bordes a las tarjetas.
- Agregar badges de estado de sincronización / syncing e ícono más destacado.

#### [MODIFY] [StoryDetail.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/StoryDetail.jsx)
- Dividir la pantalla en dos secciones principales:
  1. Header y metadata del Story (puntos, fecha límite, estado) dentro de una tarjeta con brillo atmosférico.
  2. Listado de tareas con la cabecera "Execution Tasks" y el contador de tareas.

## Verification Plan

### Manual Verification
- Cargar aplicación en desktop y verificar que el sidebar lateral izquierdo se mantenga fijo y no se solape con el contenido.
- Achicar la ventana a tamaño móvil y comprobar que el sidebar se oculte, se active el botón hamburguesa, y funcione el slide drawer correctamente.
- Comprobar que las páginas Home, Proyectos y Detalle de Story mantengan la nueva distribución Bento Grid e interactividad.

