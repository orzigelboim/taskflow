import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { useApp } from '../contexts/AppContext'
import EditTaskModal from './EditTaskModal'

export default function TaskCard({ task, accentColor, onComplete }) {
  const { updateTask } = useApp()
  const [completing, setCompleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [priority, setPriority] = useState(task.priority ?? false)

  const handleComplete = async (e) => {
    e.stopPropagation()
    if (completing) return
    setCompleting(true)
    await onComplete(task.id)
  }

  const handlePriority = async (e) => {
    e.stopPropagation()
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
        initial={false}
        animate={{ opacity: completing ? 0.4 : 1, scale: completing ? 0.97 : 1 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={() => setEditing(true)}
        className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl bg-bg-card border border-border overflow-hidden cursor-pointer hover:border-tx-muted/30 transition-colors"
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
          className="w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-150"
          style={{
            borderColor: completing ? accentColor : `${accentColor}55`,
            backgroundColor: completing ? accentColor : 'transparent',
          }}
          onMouseEnter={e => { if (!completing) e.currentTarget.style.borderColor = accentColor }}
          onMouseLeave={e => { if (!completing) e.currentTarget.style.borderColor = `${accentColor}55` }}
          aria-label="Mark complete"
        >
          {completing && (
            <svg className="w-3 h-3" viewBox="0 0 10 10" fill="none">
              <path d="M2 5 l2.5 2.5 L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Title + badges */}
        <div className="flex-1 min-w-0 pl-1 flex items-center gap-2 flex-wrap">
          <p className="text-tx-primary text-base leading-snug">{task.title}</p>
          {priority && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 leading-none">
              P
            </span>
          )}
          {due && (
            <span
              className={`text-[11px] font-medium px-1.5 py-0.5 rounded border leading-none ${
                due.overdue
                  ? 'bg-red-950 text-red-400 border-red-900'
                  : 'bg-bg-elevated text-tx-secondary border-border'
              }`}
            >
              {due.label}
            </span>
          )}
        </div>

        {/* Priority button */}
        <button
          onClick={handlePriority}
          className={`w-7 h-7 shrink-0 rounded flex items-center justify-center text-sm font-bold transition-colors ${
            priority
              ? 'bg-red-950 text-red-400 border border-red-900'
              : 'text-tx-muted hover:text-tx-secondary'
          }`}
          aria-label="Toggle priority"
        >
          P
        </button>
      </motion.div>

      {editing && (
        <EditTaskModal
          task={{ ...task, priority }}
          accentColor={accentColor}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
