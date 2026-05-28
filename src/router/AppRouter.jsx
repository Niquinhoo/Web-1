import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { Layout } from '../components/Layout/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { MyProjects } from '../pages/MyProjects'
import { ProjectDetail } from '../pages/ProjectDetail'
import { EpicDetail } from '../pages/EpicDetail'
import { StoryDetail } from '../pages/StoryDetail'
import { MyStories } from '../pages/MyStories'
import { Settings } from '../pages/Settings'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/my-projects" element={<MyProjects />} />
              <Route path="/my-projects/:projectId" element={<ProjectDetail />} />
              <Route
                path="/my-projects/:projectId/:epicId"
                element={<EpicDetail />}
              />
              <Route
                path="/my-projects/:projectId/:epicId/:storyId"
                element={<StoryDetail />}
              />
              <Route path="/my-stories" element={<MyStories />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
