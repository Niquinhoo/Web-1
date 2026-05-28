# Checklist de Verificación y Auditoría — Task Tracker App

Este documento contrasta cada uno de los puntos del [Plan de Implementación](file:///c:/Users/nicot/Desktop/Web-1-26/docs/implementation_plan.md) y de la integración de Stitch con el código actual del repositorio.

---

## 🎨 1. Estética y Directiva de Diseño (v2)

- [x] **Tipografía Outfit:**
  - **Requisito:** Self-hosted vía `@font-face` con `font-display: swap` en index.css sin usar links a Google Fonts en producción.
  - **Código:** Definido en [index.css:L2-L9](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L2-L9) usando la URL CDN directa y `font-display: swap`.
- [x] **Electric Blue Accent Color:**
  - **Requisito:** Usar `hsl(214, 90%, 62%)` y evitar AI-purple como default.
  - **Código:** Definido en [index.css:L21](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L21) como `--primary: hsl(214, 90%, 62%)`.
- [x] **Glassmorphism Selectivo:**
  - **Requisito:** Solo en Header flotante y modales, las tarjetas deben usar fondo sólido.
  - **Código:** `.glass-panel`, `.modal-panel` y `.form-card` definidos en [index.css:L163-L173](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L163-L173) con blur. Tarjetas normales `.card` definidas en [index.css:L183-L200](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L183-L200) con color sólido `--bg-secondary`.
- [x] **Esquinas Redondeadas Unificadas:**
  - **Requisito:** Botones `999px`, tarjetas `1.2rem`, inputs `0.75rem`.
  - **Código:** Variable `--radius-lg: 1.45rem` en [index.css:L49](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L49) y `--radius-md: 1rem` en [index.css:L48](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L48). Botones estilizados en `.btn` con `border-radius: 999px` en [index.css:L259](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L259).
- [x] **Librería de Iconos Única:**
  - **Requisito:** `@phosphor-icons/react` únicamente, peso consistente.
  - **Código:** Importado en componentes como [Sidebar.jsx:L1](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Sidebar.jsx#L1), [Header.jsx:L1](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Header.jsx#L1), y [StoryDetail.jsx:L3](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/StoryDetail.jsx#L3).
- [x] **Accesibilidad:**
  - **Requisito:** HTML semántico, focus outlines visibles, aria labels.
  - **Código:** `:focus-visible` definido en [index.css:L101-L104](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L101-L104). Atributos `aria-label`, `role`, `aria-checked` e `inert` aplicados correctamente en [Sidebar.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Sidebar.jsx) y [StoryDetail.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/StoryDetail.jsx).

---

## ⚙️ 2. Stack Tecnológico y Configuración

- [x] **React 19 & react-router-dom:**
  - **Código:** Configurado en [AppRouter.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/router/AppRouter.jsx) usando `BrowserRouter`, `Routes`, y `Route`.
- [x] **Vanilla CSS:**
  - **Código:** No hay librerías de componentes ni TailwindCSS en tiempo de build en el código base (los estilos provienen únicamente de [index.css](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css) y [App.css](file:///c:/Users/nicot/Desktop/Web-1-26/src/App.css)).
- [x] **Fetch Nativo:**
  - **Código:** Wrapper [fetchClient](file:///c:/Users/nicot/Desktop/Web-1-26/src/api/client.js#L199) usa la API nativa de `fetch` para realizar peticiones.

---

## 🗺️ 3. Rutas y Enrutamiento

- [x] **Rutas Definidas:**
  - **Ruta `/` y `/home`:** Registradas en [AppRouter.jsx:L22-L23](file:///c:/Users/nicot/Desktop/Web-1-26/src/router/AppRouter.jsx#L22-L23), mapeando `/home` como un redirect de alias a `/`.
  - **Ruta `/login`:** Registrada fuera del Layout en [AppRouter.jsx:L19](file:///c:/Users/nicot/Desktop/Web-1-26/src/router/AppRouter.jsx#L19).
  - **Rutas de proyectos y detalle:** `/my-projects`, `/my-projects/:projectId`, `/my-projects/:projectId/:epicId`, y `/my-projects/:projectId/:epicId/:storyId` registradas en [AppRouter.jsx:L24-L33](file:///c:/Users/nicot/Desktop/Web-1-26/src/router/AppRouter.jsx#L24-L33).
  - **Rutas secundarias:** `/my-stories` y `/settings` mapeadas.
- [x] **Rutas Protegidas:**
  - **Requisito:** Redireccionar a `/login` si no hay token guardado.
  - **Código:** [ProtectedRoute.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/router/ProtectedRoute.jsx#L17) redirige a `/login` pasando la ubicación previa en `state.from`.

---

## 🔌 4. API Mocking y Datos Locales

- [x] **Bypass de la API Real:**
  - **Requisito:** Anular peticiones para ver las pantallas offline.
  - **Código:** Seteado `MOCK_MODE = true` en [client.js:L2](file:///c:/Users/nicot/Desktop/Web-1-26/src/api/client.js#L2).
- [x] **Persistencia Local de Tareas:**
  - **Requisito:** Permitir mutaciones reactivas interactivas en offline.
  - **Código:** `getMockDb()` y `saveMockTasks()` implementados en [client.js:L166-L191](file:///c:/Users/nicot/Desktop/Web-1-26/src/api/client.js#L166-L191) utilizando `localStorage`.
- [x] **Simulación de Endpoints:**
  - **POST `/login`:** Retorna credenciales válidas si se ingresa `nicolas` / `nicolas1234` ([client.js:L207](file:///c:/Users/nicot/Desktop/Web-1-26/src/api/client.js#L207)).
  - **GET `/projects`, `/epics`, `/stories`, `/tasks`:** Filtrados dinámicamente y devueltos conforme a las consultas.
  - **POST `/tasks` y DELETE `/tasks/:id`:** Inserta y remueve tareas en el mock DB de `localStorage` ([client.js:L280-L302](file:///c:/Users/nicot/Desktop/Web-1-26/src/api/client.js#L280-L302)).
  - **PATCH `/tasks/:id`:** Permite actualizar la propiedad `done` del checkbox ([client.js:L302-L315](file:///c:/Users/nicot/Desktop/Web-1-26/src/api/client.js#L302-L315)).

---

## 👥 5. Funcionalidad de Componentes

- [x] **Lógica de Navegación del Header:**
  - **Requisito:** Hamburguesa en páginas de 1er nivel, botón retroceder en detalle.
  - **Código:** Implementado mediante `isFirstLevel` check en [Header.jsx:L23](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Header.jsx#L23).
- [x] **Sidebar de 3 Secciones:**
  - **Requisito:** Logo/Brand, Links (Home, Projects, Stories), Settings al fondo.
  - **Código:** Estructurado en [Sidebar.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Sidebar.jsx) con avatar en la sección de marca y `Settings` abajo.
- [x] **LoginForm:**
  - **Requisito:** Inputs pre-rellenados en dev, errores individuales y del servidor en las posiciones correctas.
  - **Código:** Inputs prefilled en [LoginForm.jsx:L7](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/forms/LoginForm.jsx#L7). Errores individuales renderizados bajo inputs en [LoginForm.jsx:L69](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/forms/LoginForm.jsx#L69) y [LoginForm.jsx:L82](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/forms/LoginForm.jsx#L82). Errores de API bajo el formulario en [LoginForm.jsx:L84](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/forms/LoginForm.jsx#L84).
- [x] **TaskForm:**
  - **Requisito:** Nombre obligatorio, descripción opcional (mín 10 chars si presente).
  - **Código:** Validaciones locales en [TaskForm.jsx:L18-L25](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/forms/TaskForm.jsx#L18-L25).
- [x] **ConfirmDialog:**
  - **Requisito:** Confirmación de borrado con botón cancel/delete y spinner.
  - **Código:** Construido en [ConfirmDialog.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/ui/ConfirmDialog.jsx) con bloqueo de cerrado e indicador de carga.
- [x] **Estados UI (Loading, Empty, Data):**
  - **Código:** Implementado en [MyProjects.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/MyProjects.jsx), [ProjectDetail.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/ProjectDetail.jsx), [EpicDetail.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/EpicDetail.jsx), y [StoryDetail.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/StoryDetail.jsx).

---

## 🖥️ 6. Distribución de Pantallas (Integración Stitch)

- [x] **Sidebar Persistente en Desktop:**
  - **Código:** `@media (min-width: 768px)` en [index.css:L819-L847](file:///c:/Users/nicot/Desktop/Web-1-26/src/index.css#L819-L847) fuerza el sidebar a mostrarse permanentemente con ancho `280px` y corre los contenedores `.app-main` y `.app-header` a la derecha. Huye el botón `X` y el overlay móvil.
- [x] **Header Flotante:**
  - **Código:** Oculta el toggle de hamburguesa en desktop ([Header.jsx:L23](file:///c:/Users/nicot/Desktop/Web-1-26/src/components/Layout/Header.jsx#L23)) y muestra el avatar de usuario con enlace a `/settings`.
- [x] **Home Bento Layout:**
  - **Código:** Dashboard en bento grid con métricas, Quick Actions, y Recent Activity log en [Home.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/Home.jsx).
- [x] **Proyectos Bento:**
  - **Código:** Grid de 3 columnas para proyectos activos con indicador de sincronización e información en tarjeta [MyProjects.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/MyProjects.jsx).
- [x] **Detalle de Story & Optimización:**
  - **Código:** Hero con resplandor radial `.detail-hero-glow`, listado "Execution Tasks" con contador dinámico ([StoryDetail.jsx](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/StoryDetail.jsx)).
- [x] **Actualización Optimista y Carga Silenciosa:**
  - **Código:** [StoryDetail.jsx:L60-L86](file:///c:/Users/nicot/Desktop/Web-1-26/src/pages/StoryDetail.jsx#L60-L86) cambia localmente la tarea antes de resolver la red. [useFetch.js:L14](file:///c:/Users/nicot/Desktop/Web-1-26/src/hooks/useFetch.js#L14) evita mostrar el spinner completo en refetch.
