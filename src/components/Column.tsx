import { useState } from 'react'
import type { Task, Status } from '../types'
import TaskCard from './TaskCard'
import './Column.css'

interface Props {
  column: { id: Status; label: string }
  tasks: Task[]
  onDragStart: (task: Task) => void
  onDrop: (status: string) => void
  onDeleteTask: (id: string) => void
}

export default function Column({ column, tasks, onDragStart, onDrop, onDeleteTask }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(column.id)
  }

  const colorMap: Record<string, string> = {
    todo: '#888',
    in_progress: '#7c6af7',
    in_review: '#f0a500',
    done: '#5cb85c',
  }

  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" style={{ background: colorMap[column.id] }} />
          <span>{column.label}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}