import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import AddTaskModal from './AddTaskModal'
import { Plus } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Layout({ children }) {
  const [addOpen, setAddOpen] = useState(false)
  const location = useLocation()
  const { lists } = useApp()

  const match = location.pathname.match(/^\/list\/(.+)$/)
  const currentListId = match ? match[1] : null
  const currentList = lists.find(l => l.id === currentListId)
  const showFAB = Boolean(currentListId && currentList)

  return (
    <div className="h-full flex flex-col md:flex-row bg-bg-base overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r border-border">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden border-t border-border bg-bg-card safe-bottom">
          <BottomNav />
        </div>
      </div>

      {/* FAB */}
      {showFAB && (
        <button
          onClick={() => setAddOpen(true)}
          className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95 hover:scale-105"
          style={{ backgroundColor: currentList?.accent_color ?? '#6366f1' }}
          aria-label="Add task"
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
        </button>
      )}

      {addOpen && currentListId && (
        <AddTaskModal
          listId={currentListId}
          accentColor={currentList?.accent_color ?? '#6366f1'}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  )
}
