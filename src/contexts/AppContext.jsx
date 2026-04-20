import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [lists, setLists] = useState([])
  const [tasks, setTasks] = useState([])   // active tasks only
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchLists(), fetchActiveTasks()]).finally(() => setLoading(false))
  }, [])

  async function fetchLists() {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .order('position', { ascending: true })
    if (error) { setError(error.message); return }
    setLists(data ?? [])
  }

  async function fetchActiveTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .is('completed_at', null)
    if (error) { setError(error.message); return }
    setTasks(data ?? [])
  }

  // ── Lists ─────────────────────────────────────────────────────────────────

  async function addList(name, accentColor = '#E2611E') {
    const position = lists.length
    const { data, error } = await supabase
      .from('lists')
      .insert({ name, accent_color: accentColor, position })
      .select()
      .single()
    if (error) return { error }
    setLists(prev => [...prev, data])
    return { data, error: null }
  }

  async function updateList(id, updates) {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return { error }
    setLists(prev => prev.map(l => (l.id === id ? data : l)))
    return { data, error: null }
  }

  async function deleteList(id) {
    const { error } = await supabase.from('lists').delete().eq('id', id)
    if (error) return { error }
    setLists(prev => prev.filter(l => l.id !== id))
    setTasks(prev => prev.filter(t => t.list_id !== id))
    return { error: null }
  }

  async function reorderLists(ordered) {
    setLists(ordered)
    await Promise.all(
      ordered.map((l, i) =>
        supabase.from('lists').update({ position: i }).eq('id', l.id)
      )
    )
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────

  async function addTask(listId, { title, description, dueDate }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        list_id: listId,
        title,
        description: description || null,
        due_date: dueDate || null,
      })
      .select()
      .single()
    if (error) return { error }
    setTasks(prev => [...prev, data])
    return { data, error: null }
  }

  async function updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return { error }
    setTasks(prev => prev.map(t => (t.id === id ? data : t)))
    return { data, error: null }
  }

  async function unarchiveTask(id) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed_at: null })
      .eq('id', id)
      .select()
      .single()
    if (error) return { error }
    setTasks(prev => [...prev, data])
    return { error: null }
  }

  async function completeTask(id) {
    const completedAt = new Date().toISOString()
    const { error } = await supabase
      .from('tasks')
      .update({ completed_at: completedAt })
      .eq('id', id)
    if (error) return { error }
    setTasks(prev => prev.filter(t => t.id !== id))
    return { error: null }
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
    return { error }
  }

  function getTasksForList(listId) {
    return [...tasks.filter(t => t.list_id === listId)].sort((a, b) => {
      if (a.due_date && b.due_date) return new Date(a.due_date) - new Date(b.due_date)
      if (a.due_date && !b.due_date) return -1
      if (!a.due_date && b.due_date) return 1
      return new Date(a.created_at) - new Date(b.created_at)
    })
  }

  // ── Archive ───────────────────────────────────────────────────────────────

  const loadArchive = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, lists(id, name, accent_color)')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
    return { data: data ?? [], error }
  }, [])

  async function clearArchive() {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .not('completed_at', 'is', null)
    return { error }
  }

  async function deleteArchivedTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    return { error }
  }

  return (
    <AppContext.Provider
      value={{
        lists, tasks, loading, error,
        addList, updateList, deleteList, reorderLists,
        addTask, updateTask, completeTask, unarchiveTask, deleteTask, getTasksForList,
        loadArchive, clearArchive, deleteArchivedTask,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
