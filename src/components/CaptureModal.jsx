import { useState } from 'react'

export default function CaptureModal({ onSave, onClose }) {
  const [type, setType] = useState('note')
  const [content, setContent] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!content.trim()) return
    onSave({ id: crypto.randomUUID(), type, content: content.trim() })
    setContent('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={submit}
        className="bg-white rounded shadow p-4 w-full max-w-sm space-y-4"
      >
        <h3 className="text-lg font-semibold">Capture</h3>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="note">Note</option>
          <option value="todo">To-do</option>
          <option value="link">Link</option>
        </select>
        <textarea
          className="w-full border rounded px-2 py-1"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
