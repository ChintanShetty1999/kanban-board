import type { Task } from '../types'
import './TaskCard.css'

interface Props {
  task: Task
  onDragStart: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onDragStart, onDelete }: Props) {
  const priorityColors: Record<string, string> = {
    low: '#5cb85c',
    normal: '#7c6af7',
    high: '#e05252',
  }

  function isOverdue() {
    if (!task.due_date) return false
    return new Date(task.due_date) < new Date()
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={() => onDragStart(task)}
    >
      <div className="task-header">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>×</button>
      </div>
      <p className="task-title">{task.title}</p>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      {task.due_date && (
        <div className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
          📅 {formatDate(task.due_date)}
          {isOverdue() && <span className="overdue-label"> · Overdue</span>}
        </div>
      )}
    </div>
  )
}