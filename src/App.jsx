import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './contexts/AppContext'
import Layout from './components/Layout'
import TaskList from './components/TaskList'
import Archive from './components/Archive'
import Settings from './components/Settings'

export default function App() {
  const { lists, loading } = useApp()

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-base">
        <div className="w-6 h-6 border-2 border-tx-muted border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  const defaultPath = lists.length > 0 ? `/list/${lists[0].id}` : '/settings'

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={defaultPath} replace />} />
        <Route path="/list/:listId" element={<TaskList />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
    </Layout>
  )
}
