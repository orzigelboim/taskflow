import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import EditTaskModal from './EditTaskModal'

export default function TaskCard({ task, accentColor, onComplete }) {
  const { updateTask } = useApp()
  const [completing, setCompleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [priority, setPriority] = useState(task.priority ?? false)

  const handleComplete = async () => {
    if (completing) return
    setCompleting(true)
    await onComplete(task.id)
  }

  const handlePriority = async () => {
    const next = !priority
    setPriority(next)
    await updateTask(task.id, { priority: next })
  }

  const formatDue = (dateStr) => {
    if (!dateStr) return null
    const d = parseISO(dateStr)
    if (isToday(d)) return { label: 'Today', overdue: false }
    if (isTomorrow(d)) return { label: 'Tomorrow', overdue: false }
    return { label: format(d, 'MMM d'), overdue: isPast(d) }
  }

  const due = formatDue(task.due_date)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: completing ? 0.4 : 1, y: 0, scale: completing ? 0.97 : 1 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative flex gap-3 p-4 rounded-xl bg-bg-card border border-border overflow-hidden group"
      >
        {/* Accent left strip */}
        <span
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
          style={{ backgroundColor: accentColor }}
        />

        {/* Complete button */}
        <button
          onClick={handleComplete}
          disabled={completing}
          className="mt-0.5 w-[18px] h-[18px] shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-150"
          style={{
            borderColor: completing ? accentColor : `${accentColor}55`,
            backgroundColor: completing ? accentColor : 'transparent',
          }}
          onMouseEnter={e => { if (!completing) e.currentTarget.style.borderColor = accentColor }}
          onMouseLeave={e => { if (!completing) e.currentTarget.style.borderColor = `${accentColor}55` }}
          aria-label="Mark complete"
        >
          {completing && (
            <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
              <path d="M2 5 l2.5 2.5 L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 pl-1">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-tx-primary text-sm leading-snug">{task.title}</p>
            {priority && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 leading-none">
                P
              </span>
            )}
            {due && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded border leading-none ${
                  due.overdue
                    ? 'bg-red-950 text-red-400 border-red-900'
                    : 'bg-bg-elevated text-tx-secondary border-border'
                }`}
              >
                {due.label}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-tx-secondary text-xs mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePriority}
            className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold transition-colors ${
              priority
                ? 'bg-red-950 text-red-400 border border-red-900'
                : 'text-tx-muted hover:text-tx-secondary'
            }`}
            aria-label="Toggle priority"
          >
            P
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-tx-muted hover:text-tx-secondary transition-colors p-1"
            aria-label="Edit task"
          >
            <Pencil size={13} />
          </button>
        </div>
      </motion.div>

      {editing && (
        <EditTaskModal
          task={task}
          accentColor={accentColor}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
