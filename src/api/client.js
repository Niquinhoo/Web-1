const API_BASE_URL = 'https://lamansysfaketaskmanagerapi.onrender.com/api'
const MOCK_MODE = true // Cambiar a false para usar la API real

const MOCK_USER_NICOLAS = {
  _id: 'user-nicolas',
  name: { first: 'Nicolás', last: 'Dev' },
  username: 'nicolas',
  email: 'nicolas@mock.dev',
}

const MOCK_USER_LUCAS = {
  _id: 'user-lucas',
  name: { first: 'Lucas', last: 'QA' },
  username: 'lucas',
  email: 'lucas@mock.dev',
}

const SEED_PROJECTS = [
  {
    _id: 'p1',
    name: 'Proyecto Alpha',
    description: 'Plataforma de e-commerce de alto rendimiento con arquitectura serverless y optimización SEO.',
    icon: '🚀',
    members: [MOCK_USER_NICOLAS, MOCK_USER_LUCAS],
  },
  {
    _id: 'p2',
    name: 'Proyecto Beta',
    description: 'Sistema de monitoreo ambiental IoT para smart cities con análisis predictivo en tiempo real.',
    icon: '🌱',
    members: [MOCK_USER_NICOLAS],
  },
]

const SEED_EPICS = [
  {
    _id: 'e1',
    name: 'Autenticación & Seguridad',
    description: 'Módulo de login, registro, recuperación de contraseña y roles de usuario utilizando JWT y OAuth.',
    icon: '🔐',
    project: 'p1',
  },
  {
    _id: 'e2',
    name: 'Pasarela de Pagos',
    description: 'Integración con Stripe y PayPal, checkout seguro, soporte para monedas múltiples y suscripciones.',
    icon: '💳',
    project: 'p1',
  },
  {
    _id: 'e3',
    name: 'Ingesta de Métricas IoT',
    description: 'API Gateway de alta disponibilidad para recolectar datos de sensores distribuidos.',
    icon: '📡',
    project: 'p2',
  },
]

const SEED_STORIES = [
  {
    _id: 's1',
    name: 'Diseñar pantalla de login',
    description: 'Layout responsivo de login con soporte para error states y micro-animaciones en los inputs.',
    icon: '🖥️',
    points: 3,
    status: 'done',
    assignedTo: MOCK_USER_NICOLAS,
    epic: { _id: 'e1', name: 'Autenticación & Seguridad' },
    project: { _id: 'p1', name: 'Proyecto Alpha' },
    created: '2026-05-20T10:00:00Z',
    started: '2026-05-21T09:00:00Z',
    finished: '2026-05-22T18:00:00Z',
    due: '2026-05-25T23:59:59Z',
  },
  {
    _id: 's2',
    name: 'Conectar login con API',
    description: 'Integrar el cliente HTTP con los endpoints de auth y guardar el token JWT en localStorage.',
    icon: '🔌',
    points: 5,
    status: 'running',
    assignedTo: MOCK_USER_NICOLAS,
    epic: { _id: 'e1', name: 'Autenticación & Seguridad' },
    project: { _id: 'p1', name: 'Proyecto Alpha' },
    created: '2026-05-21T10:00:00Z',
    started: '2026-05-23T09:00:00Z',
    due: '2026-05-28T23:59:59Z',
  },
  {
    _id: 's3',
    name: 'Configurar webhooks de Stripe',
    description: 'Escuchar eventos de pago exitoso y suscripción cancelada para actualizar el estado de cuenta.',
    icon: '⚡',
    points: 8,
    status: 'todo',
    assignedTo: MOCK_USER_LUCAS,
    epic: { _id: 'e2', name: 'Pasarela de Pagos' },
    project: { _id: 'p1', name: 'Proyecto Alpha' },
    created: '2026-05-25T10:00:00Z',
    due: '2026-06-05T23:59:59Z',
  },
  {
    _id: 's4',
    name: 'Pipeline de procesamiento en tiempo real',
    description: 'Procesamiento de eventos con Apache Kafka y persistencia optimizada en TimescaleDB.',
    icon: '📊',
    points: 5,
    status: 'running',
    assignedTo: MOCK_USER_NICOLAS,
    epic: { _id: 'e3', name: 'Ingesta de Métricas IoT' },
    project: { _id: 'p2', name: 'Proyecto Beta' },
    created: '2026-05-22T10:00:00Z',
    started: '2026-05-24T09:00:00Z',
    due: '2026-06-02T23:59:59Z',
  },
]

const SEED_TASKS = [
  {
    _id: 't1',
    name: 'Maquetar formulario HTML/CSS',
    description: 'Crear estructura semántica e inputs con accesibilidad y Outfit font.',
    done: true,
    created: '2026-05-20T10:30:00Z',
    dueDate: '2026-05-21T23:59:59Z',
    story: 's1',
  },
  {
    _id: 't2',
    name: 'Implementar validaciones de inputs',
    description: 'Mínimo de 4 caracteres, campos requeridos y visualización de errores bajo cada input.',
    done: true,
    created: '2026-05-20T11:00:00Z',
    dueDate: '2026-05-21T23:59:59Z',
    story: 's1',
  },
  {
    _id: 't3',
    name: 'Escribir cliente fetchClient',
    description: 'Manejo de headers y token de autorización JWT desde localStorage.',
    done: true,
    created: '2026-05-21T10:30:00Z',
    dueDate: '2026-05-24T23:59:59Z',
    story: 's2',
  },
  {
    _id: 't4',
    name: 'Manejar redirección al expirar sesión (401)',
    description: 'Interceptar 401, limpiar localStorage y redirigir a /login.',
    done: false,
    created: '2026-05-21T11:00:00Z',
    dueDate: '2026-05-25T23:59:59Z',
    story: 's2',
  },
  {
    _id: 't5',
    name: 'Crear pantalla de Settings con Logout',
    description: 'Vista de configuración de usuario con datos del perfil y botón de salida.',
    done: false,
    created: '2026-05-22T09:00:00Z',
    dueDate: '2026-05-27T23:59:59Z',
    story: 's2',
  },
]

const getMockDb = () => {
  const getOrSeed = (key, seedData) => {
    const val = localStorage.getItem(key)
    if (!val) {
      localStorage.setItem(key, JSON.stringify(seedData))
      return seedData
    }
    try {
      return JSON.parse(val)
    } catch {
      localStorage.setItem(key, JSON.stringify(seedData))
      return seedData
    }
  }

  return {
    projects: getOrSeed('mock_projects', SEED_PROJECTS),
    epics: getOrSeed('mock_epics', SEED_EPICS),
    stories: getOrSeed('mock_stories', SEED_STORIES),
    tasks: getOrSeed('mock_tasks', SEED_TASKS),
  }
}

const saveMockTasks = (tasks) => {
  localStorage.setItem('mock_tasks', JSON.stringify(tasks))
}

const getServerMessage = (payload, fallback) => {
  if (!payload) return fallback
  if (typeof payload === 'string') return payload
  return payload.message || payload.error || fallback
}

export async function fetchClient(endpoint, options = {}) {
  if (MOCK_MODE) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 300))
    const db = getMockDb()
    const method = (options.method || 'GET').toUpperCase()

    // 1. POST /login
    if (method === 'POST' && endpoint === '/login') {
      const { username, password } = JSON.parse(options.body || '{}')
      if (username === 'nicolas' && password === 'nicolas1234') {
        return {
          token: 'mock-jwt-token-xyz',
          user: {
            _id: 'user-nicolas',
            email: 'nicolas@mock.dev',
            username: 'nicolas',
            name: { first: 'Nicolás', last: 'Dev' },
          },
        }
      } else {
        throw new Error('Usuario o contraseña incorrectos (Mock)')
      }
    }

    // 2. GET /projects
    if (method === 'GET' && endpoint === '/projects') {
      return db.projects
    }

    // 3. GET /projects/:projectId
    if (method === 'GET' && endpoint.startsWith('/projects/')) {
      const projectId = endpoint.substring('/projects/'.length)
      const project = db.projects.find((p) => p._id === projectId)
      if (!project) throw new Error('Proyecto no encontrado')
      return project
    }

    // 4. GET /epics?project=:projectId
    if (method === 'GET' && endpoint.startsWith('/epics?project=')) {
      const projectId = endpoint.split('=')[1]
      return db.epics.filter((e) => e.project === projectId)
    }

    // 5. GET /epics/:epicId
    if (method === 'GET' && endpoint.startsWith('/epics/')) {
      const epicId = endpoint.substring('/epics/'.length)
      const epic = db.epics.find((e) => e._id === epicId)
      if (!epic) throw new Error('Épica no encontrada')
      return epic
    }

    // 6. GET /stories?epic=:epicId
    if (method === 'GET' && endpoint.startsWith('/stories?epic=')) {
      const epicId = endpoint.split('=')[1]
      return db.stories.filter((s) => s.epic?._id === epicId || s.epic === epicId)
    }

    // 7. GET /stories
    if (method === 'GET' && endpoint === '/stories') {
      return db.stories
    }

    // 8. GET /stories/:storyId
    if (method === 'GET' && endpoint.startsWith('/stories/')) {
      const storyId = endpoint.substring('/stories/'.length)
      const story = db.stories.find((s) => s._id === storyId)
      if (!story) throw new Error('Story no encontrada')
      return story
    }

    // 9. GET /tasks?story=:storyId
    if (method === 'GET' && endpoint.startsWith('/tasks?story=')) {
      const storyId = endpoint.split('=')[1]
      return db.tasks.filter((t) => t.story === storyId)
    }

    // 10. POST /tasks
    if (method === 'POST' && endpoint === '/tasks') {
      const { name, description, story, dueDate } = JSON.parse(options.body || '{}')
      const newTask = {
        _id: `t-${Date.now()}`,
        name,
        description: description || '',
        done: false,
        created: new Date().toISOString(),
        dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
        story,
      }
      const updatedTasks = [...db.tasks, newTask]
      saveMockTasks(updatedTasks)
      return newTask
    }

    // 11. DELETE /tasks/:taskId
    if (method === 'DELETE' && endpoint.startsWith('/tasks/')) {
      const taskId = endpoint.substring('/tasks/'.length)
      const updatedTasks = db.tasks.filter((t) => t._id !== taskId)
      saveMockTasks(updatedTasks)
      return { success: true }
    }

    // 12. PATCH /tasks/:taskId
    if (method === 'PATCH' && endpoint.startsWith('/tasks/')) {
      const taskId = endpoint.substring('/tasks/'.length)
      const { done } = JSON.parse(options.body || '{}')
      const updatedTasks = db.tasks.map((t) => {
        if (t._id === taskId) {
          return { ...t, done }
        }
        return t
      })
      saveMockTasks(updatedTasks)
      return { success: true }
    }

    throw new Error(`Endpoint mock no encontrado: ${method} ${endpoint}`)
  }

  const token = localStorage.getItem('taskTrackerToken')
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const contentType = response.headers.get('content-type')
    const payload = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    if (response.status === 401) {
      localStorage.removeItem('taskTrackerToken')
      localStorage.removeItem('taskTrackerUser')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
      throw new Error('Sesión expirada. Iniciá sesión nuevamente.')
    }

    if (!response.ok) {
      const fallback =
        response.status >= 500
          ? 'Error del servidor. Intentá de nuevo más tarde'
          : 'No se pudo completar la operación'
      throw new Error(getServerMessage(payload, fallback))
    }

    return payload
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Error de conexión. Verificá tu internet', { cause: error })
    }
    throw error
  }
}

