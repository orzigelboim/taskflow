import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Plus, Check, X, Settings as Gear, LogOut } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const PALETTE = [
  '#D8131D', '#DD3A1E', '#E2611E', '#EBAF20',
  '#f59e0b', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b',
]

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 p-3 bg-bg-elevated rounded-xl border border-border mt-2">
      {PALETTE.map(color => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className="w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{ backgroundColor: color }}
          aria-label={color}
        >
          {value === color && <Check size={11} color="white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  )
}

function SortableListItem({ list, onRename, onDelete, onColorChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: list.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  }

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(list.name)
  const [showPicker, setShowPicker] = useState(false)

  const commitRename = () => {
    if (name.trim() && name.trim() !== list.name) onRename(list.id, name.trim())
    setEditing(false)
  }

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col">
      <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-bg-card border border-border">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="drag-handle text-tx-muted hover:text-tx-secondary p-1 -ml-1"
        >
          <GripVertical size={15} />
        </button>

        {/* Color dot */}
        <button
          onClick={() => setShowPicker(v => !v)}
          className="w-4 h-4 rounded-full shrink-0 ring-1 ring-offset-1 ring-offset-bg-card transition-transform hover:scale-110"
          style={{ backgroundColor: list.accent_color, ringColor: list.accent_color }}
        />

        {/* Name */}
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') { setName(list.name); setEditing(false) }
            }}
            className="flex-1 bg-bg-elevated border border-border rounded-lg px-2 py-1 text-sm text-tx-primary outline-none"
          />
        ) : (
          <span className="flex-1 text-sm text-tx-primary truncate">{list.name}</span>
        )}

        {/* Actions */}
        <button
          onClick={() => setEditing(true)}
          className="text-tx-muted hover:text-tx-secondary transition-colors p-1"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(list.id)}
          className="text-tx-muted hover:text-logo-red transition-colors p-1"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Color picker */}
      {showPicker && (
        <ColorPicker
          value={list.accent_color}
          onChange={color => { onColorChange(list.id, color); setShowPicker(false) }}
        />
      )}
    </div>
  )
}

export default function Settings() {
  const { lists, addList, updateList, deleteList, reorderLists, clearArchive } = useApp()
  const navigate = useNavigate()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const oldIndex = lists.findIndex(l => l.id === active.id)
      const newIndex = lists.findIndex(l => l.id === over.id)
      reorderLists(arrayMove(lists, oldIndex, newIndex))
    }
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    const { data } = await addList(newName.trim())
    setNewName('')
    setAdding(false)
    if (data) navigate(`/list/${data.id}`)
  }

  const handleClearArchive = async () => {
    setClearing(true)
    await clearArchive()
    setClearing(false)
    setClearConfirm(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3 shrink-0">
        <Gear size={16} className="text-tx-secondary" />
        <h1 className="text-tx-primary text-lg font-semibold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 md:pb-8 space-y-6">

        {/* Lists section */}
        <section>
          <p className="text-xs font-semibold text-tx-muted uppercase tracking-widest mb-3 px-1">
            Lists
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={lists.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {lists.map(list => (
                  <SortableListItem
                    key={list.id}
                    list={list}
                    onRename={(id, name) => updateList(id, { name })}
                    onDelete={(id) => {
                      if (confirm(`Delete "${lists.find(l=>l.id===id)?.name}"? All tasks in this list will be deleted.`)) {
                        deleteList(id)
                      }
                    }}
                    onColorChange={(id, color) => updateList(id, { accent_color: color })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add list */}
          {adding ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                autoFocus
                type="text"
                placeholder="List name…"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAdd()
                  if (e.key === 'Escape') { setAdding(false); setNewName('') }
                }}
                className="flex-1 bg-bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-tx-primary placeholder-tx-muted outline-none focus:border-tx-muted transition-colors"
              />
              <button onClick={handleAdd} className="p-2 rounded-lg text-logo-gold hover:bg-bg-elevated transition-colors">
                <Check size={16} />
              </button>
              <button onClick={() => { setAdding(false); setNewName('') }} className="p-2 rounded-lg text-tx-muted hover:bg-bg-elevated transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-2 flex items-center gap-2 w-full py-2.5 px-3 rounded-xl text-sm text-tx-muted hover:text-tx-secondary border border-dashed border-border hover:border-tx-muted transition-colors"
            >
              <Plus size={14} />
              New list
            </button>
          )}
        </section>

        {/* Account */}
        <section>
          <p className="text-xs font-semibold text-tx-muted uppercase tracking-widest mb-3 px-1">
            Account
          </p>
          <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-tx-primary">Sign out</p>
              <p className="text-xs text-tx-muted mt-0.5">You'll need to sign in again to access your tasks</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 text-xs font-medium text-tx-muted border border-border px-3 py-1.5 rounded-lg hover:text-tx-primary hover:border-tx-muted transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <p className="text-xs font-semibold text-tx-muted uppercase tracking-widest mb-3 px-1">
            Danger zone
          </p>
          <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-tx-primary">Clear Archive</p>
              <p className="text-xs text-tx-muted mt-0.5">Permanently delete all completed tasks</p>
            </div>
            {clearConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearArchive}
                  disabled={clearing}
                  className="text-xs font-medium text-logo-red border border-logo-red/40 px-3 py-1.5 rounded-lg hover:bg-logo-red/10 transition-colors disabled:opacity-50"
                >
                  {clearing ? 'Clearing…' : 'Confirm'}
                </button>
                <button
                  onClick={() => setClearConfirm(false)}
                  className="text-xs text-tx-muted px-2 py-1.5"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setClearConfirm(true)}
                className="text-xs font-medium text-logo-red border border-logo-red/40 px-3 py-1.5 rounded-lg hover:bg-logo-red/10 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
