import { useState } from 'react'
import './AddTaskModal.css'

interface Props {
  onAdd: (title: string, description: string, priority: string, due_date: string) => void
  onClose: () => void
}

export default function AddTaskModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit() {
    if (!title.trim()) return
    onAdd(title.trim(), description.trim(), priority, dueDate)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Task</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              placeholder="Add more details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="field">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Create Task</button>
        </div>
      </div>
    </div>
  )
}