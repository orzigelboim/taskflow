import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Calendar, AlignLeft } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function EditTaskModal({ task, accentColor, onClose }) {
  const { updateTask } = useApp()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [dueDate, setDueDate] = useState(task.due_date ?? '')
  const [showDesc, setShowDesc] = useState(Boolean(task.description))
  const [showDue, setShowDue] = useState(Boolean(task.due_date))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => titleRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    const { error } = await updateTask(task.id, {
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 backdrop bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:left-1/2 md:bottom-1/2 md:-translate-x-1/2 md:translate-y-1/2 md:w-[480px]"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-bg-card border border-border rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex justify-center pt-2.5 pb-1 md:hidden">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-tx-primary text-sm font-semibold">Edit task</h2>
            <button onClick={onClose} className="text-tx-muted hover:text-tx-primary transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3">
            <input
              ref={titleRef}
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => { setTitle(e.target.value); setError('') }}
              className="w-full bg-transparent text-tx-primary placeholder-tx-muted outline-none text-base py-1"
            />
            {error && <p className="text-red-400 text-xs -mt-1">{error}</p>}

            <div>
              <button
                type="button"
                onClick={() => setShowDesc(v => !v)}
                className="flex items-center gap-2 text-tx-muted text-xs hover:text-tx-secondary transition-colors py-1"
              >
                <AlignLeft size={13} />
                <span>Description</span>
                {showDesc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              <AnimatePresence initial={false}>
                {showDesc && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      placeholder="Add details…"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="w-full mt-2 bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-tx-primary placeholder-tx-muted text-sm outline-none resize-none focus:border-tx-muted transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowDue(v => !v)}
                className="flex items-center gap-2 text-tx-muted text-xs hover:text-tx-secondary transition-colors py-1"
              >
                <Calendar size={13} />
                <span>{dueDate ? `Due: ${dueDate}` : 'Due date'}</span>
                {showDue ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              <AnimatePresence initial={false}>
                {showDue && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="date"
                      min={today}
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="mt-2 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-tx-primary text-sm outline-none focus:border-tx-muted transition-colors [color-scheme:dark]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 pt-1 safe-bottom">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm text-tx-secondary border border-border hover:bg-bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: accentColor }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
