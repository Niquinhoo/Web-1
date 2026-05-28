import { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [headerTitle, setHeaderTitle] = useState('')

  const outletContext = useMemo(
    () => ({
      setHeaderTitle,
    }),
    [],
  )

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background text-on-background selection:bg-primary/30 selection:text-primary">
      {/* Sidebar Component: Persistent on desktop, drawer on mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area shifted left by 280px on desktop */}
      <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col relative">
        <Header
          detailTitle={headerTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Page Canvas Container */}
        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max w-full mx-auto flex-1">
          <Outlet context={outletContext} />
        </div>
      </main>
    </div>
  )
}
