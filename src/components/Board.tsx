import { useState } from 'react'
import type { Task } from '../types'
import { COLUMNS } from '../types'
import Column from './Column'
import AddTaskModal from './AddTaskModal'
import './Board.css'

interface Props {
  tasks: Task[]
  onAddTask: (title: string, description: string, priority: string, due_date: string) => void
  onUpdateStatus: (id: string, status: string) => void
  onDeleteTask: (id: string) => void
}

export default function Board({ tasks, onAddTask, onUpdateStatus, onDeleteTask }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')

  function handleDragStart(task: Task) {
    setDraggedTask(task)
  }

  function handleDrop(status: string) {
    if (draggedTask && draggedTask.status !== status) {
      onUpdateStatus(draggedTask.id, status)
    }
    setDraggedTask(null)
  }

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date() && t.status !== 'done'
  }).length

  return (
    <div className="board-wrapper">
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-number done">{doneTasks}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat">
          <span className="stat-number overdue">{overdueTasks}</span>
          <span className="stat-label">Overdue</span>
        </div>
      </div>

      <div className="board-header">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        <button className="add-task-btn" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      <div className="board">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            column={col}
            tasks={filteredTasks.filter(t => t.status === col.id)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      {showModal && (
        <AddTaskModal
          onAdd={onAddTask}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}