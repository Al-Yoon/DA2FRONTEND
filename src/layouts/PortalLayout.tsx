import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/portal/sidebar'

export function PortalLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:overflow-auto pt-16 lg:pt-0 pb-8">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

