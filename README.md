# Lista de tareas de Nicolas

Esqueleto visual de una Single Page Application realizado con React y Vite a partir de los wireframes provistos. Esta entrega reproduce la estructura solicitada y no incluye lógica para agregar, completar o eliminar tareas.

## Requisitos

- Node.js 20.19 o superior
- npm 10 o superior

## Puesta en marcha

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación.

## Comandos

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Genera la versión de producción en dist/
npm run preview  # Previsualiza la versión de producción
npm run lint     # Revisa el código con ESLint
```

## Estructura

```text
Web-1/
├── docs/
│   └── paso-a-paso.md          Documentación de la resolución
├── src/
│   ├── App.jsx                 Componente principal y estructura HTML
│   ├── App.css                 Estilos específicos de la aplicación
│   ├── index.css               Estilos globales y normalización mínima
│   └── main.jsx                Punto de entrada de React
├── Ejercicio.md                Enunciado original
├── Wireframe.png               Referencia visual
├── WireframeLineamientos.png   Referencia visual anotada
├── index.html                  Documento base de Vite
├── package.json                Dependencias y comandos
└── vite.config.js              Configuración de Vite
```

## Decisiones de alcance

- Toda la interfaz está en `App.jsx`, tal como solicita el ejercicio.
- Las tareas son contenido estático y aparecen en el mismo orden que el wireframe.
- Los checkboxes completados usan HTML y CSS para tachar su texto.
- Los botones están representados visualmente, pero no ejecutan acciones.
- No se agregaron bibliotecas de estilos, componentes ni iconos.

El detalle completo de la implementación está en [docs/paso-a-paso.md](docs/paso-a-paso.md).

