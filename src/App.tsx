import { useEffect, useState } from 'react'
import { supabase, signInAsGuest } from './supabase'
import type { Task } from './types'
import Board from './components/Board'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      await signInAsGuest()
      await fetchTasks()
      setLoading(false)
    }
    init()
  }, [])

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setTasks(data)
  }

  async function addTask(title: string, description: string, priority: string, due_date: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data, error } = await supabase.from('tasks').insert({
      title,
      description,
      priority,
      due_date: due_date || null,
      status: 'todo',
      user_id: session.user.id,
    }).select().single()
    if (!error && data) setTasks(prev => [...prev, data])
  }

  async function updateTaskStatus(id: string, status: string) {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as any } : t))
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading your board...</p>
    </div>
  )

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⬡</span>
          <h1>Next Play Board</h1>
        </div>
        <div className="header-right">
          <span className="guest-badge">Guest Session</span>
        </div>
      </header>
      <Board
        tasks={tasks}
        onAddTask={addTask}
        onUpdateStatus={updateTaskStatus}
        onDeleteTask={deleteTask}
      />
    </div>
  )
}

export default App