import { useParams, Navigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import TaskCard from './TaskCard'

export default function TaskList() {
  const { listId } = useParams()
  const { lists, getTasksForList, completeTask } = useApp()

  const list = lists.find(l => l.id === listId)
  if (!list) return <Navigate to="/" replace />

  const tasks = getTasksForList(listId)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3 shrink-0">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: list.accent_color }}
        />
        <h1 className="text-tx-primary text-lg font-semibold">{list.name}</h1>
        {tasks.length > 0 && (
          <span className="ml-auto text-xs text-tx-muted bg-bg-elevated px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>

      {/* Task cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 md:pb-8">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <span
              className="w-3 h-3 rounded-full opacity-40"
              style={{ backgroundColor: list.accent_color }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                accentColor={list.accent_color}
                onComplete={completeTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
