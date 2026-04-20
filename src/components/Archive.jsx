import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, differenceInDays, parseISO } from 'date-fns'
import { Trash2, Archive as ArchiveIcon, RotateCcw } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

function daysLeft(completedAt) {
  const days = differenceInDays(new Date(), parseISO(completedAt))
  return Math.max(0, 30 - days)
}

export default function Archive() {
  const { loadArchive, deleteArchivedTask, unarchiveTask } = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArchive().then(({ data }) => {
      setItems(data)
      setLoading(false)
    })
  }, [loadArchive])

  const handleDelete = async (id) => {
    await deleteArchivedTask(id)
    setItems(prev => prev.filter(t => t.id !== id))
  }

  const handleUnarchive = async (id) => {
    await unarchiveTask(id)
    setItems(prev => prev.filter(t => t.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-tx-muted border-t-logo-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3 shrink-0">
        <ArchiveIcon size={16} className="text-tx-secondary" />
        <h1 className="text-tx-primary text-lg font-semibold">Archive</h1>
        {items.length > 0 && (
          <span className="ml-auto text-xs text-tx-muted bg-bg-elevated px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 md:pb-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-3xl mb-3">🗂️</div>
            <p className="text-tx-secondary text-sm">Completed tasks will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map(task => {
                const left = daysLeft(task.completed_at)
                const urgent = left <= 5
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 p-4 rounded-xl bg-bg-card border border-border relative overflow-hidden group"
                  >
                    {/* Accent strip */}
                    <span
                      className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-50"
                      style={{ backgroundColor: task.lists?.accent_color ?? '#555' }}
                    />

                    <div className="flex-1 min-w-0 pl-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-tx-secondary text-sm line-through leading-snug flex-1 min-w-0 truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleUnarchive(task.id)}
                            className="shrink-0 text-tx-muted hover:text-logo-gold transition-colors p-1"
                            aria-label="Unarchive"
                          >
                            <RotateCcw size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="shrink-0 text-tx-muted hover:text-red-400 transition-colors p-1 -mr-1"
                            aria-label="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        {task.lists && (
                          <span className="text-[11px] text-tx-muted flex items-center gap-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: task.lists.accent_color }}
                            />
                            {task.lists.name}
                          </span>
                        )}
                        <span className="text-[11px] text-tx-muted">
                          Done {format(parseISO(task.completed_at), 'MMM d, h:mm a')}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                            urgent
                              ? 'bg-red-950 text-red-400'
                              : 'bg-bg-elevated text-tx-muted'
                          }`}
                        >
                          {left === 0 ? 'Deleting soon' : `${left}d left`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
