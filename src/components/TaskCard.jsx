import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { Pencil } from 'lucide-react'
import EditTaskModal from './EditTaskModal'

export default function TaskCard({ task, accentColor, onComplete }) {
  const [completing, setCompleting] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleComplete = async () => {
    if (completing) return
    setCompleting(true)
    await onComplete(task.id)
  }

  const formatDue = (dateStr) => {
    if (!dateStr) return null
    const d = parseISO(dateStr)
    if (isToday(d)) return { label: 'Today', overdue: false }
    if (isTomorrow(d)) return { label: 'Tomorrow', overdue: false }
    const overdue = isPast(d)
    return { label: format(d, 'MMM d'), overdue }
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
          <p className="text-tx-primary text-sm leading-snug">{task.title}</p>

          {task.description && (
            <p className="text-tx-secondary text-xs mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {due && (
              <span
                className={`text-[11px] flex items-center gap-1 ${
                  due.overdue ? 'text-red-400' : 'text-tx-secondary'
                }`}
              >
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="2" width="10" height="9" rx="1.5"/>
                  <path d="M4 1v2M8 1v2M1 5h10"/>
                </svg>
                {due.label}
              </span>
            )}
            <span className="text-[11px] text-tx-muted flex items-center gap-1">
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="6" r="4.5"/>
                <path d="M6 3.5V6l1.5 1.5"/>
              </svg>
              {format(new Date(task.created_at), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 text-tx-muted hover:text-tx-secondary transition-colors p-1 -mr-1 opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Edit task"
        >
          <Pencil size={13} />
        </button>
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
