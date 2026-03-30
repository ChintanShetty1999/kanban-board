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

  function handleDragStart(task: Task) {
    setDraggedTask(task)
  }

  function handleDrop(status: string) {
    if (draggedTask && draggedTask.status !== status) {
      onUpdateStatus(draggedTask.id, status)
    }
    setDraggedTask(null)
  }

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'done').length

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <div className="board-stats">
          <span>{totalTasks} tasks</span>
          <span className="dot">·</span>
          <span className="done-count">{doneTasks} completed</span>
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
            tasks={tasks.filter(t => t.status === col.id)}
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
