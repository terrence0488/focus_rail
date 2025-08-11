import { useState } from 'react'

export default function CardForm({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(50)
  const [dod, setDod] = useState([''])

  function updateDod(index, value) {
    const list = [...dod]
    list[index] = value
    setDod(list)
  }

  function addDod() {
    setDod([...dod, ''])
  }

  function submit(e) {
    e.preventDefault()
    const items = dod.map((d) => d.trim()).filter(Boolean)
    if (!title.trim() || items.length === 0) return
    onSave({ title: title.trim(), minutes, dod: items })
    setTitle('')
    setMinutes(50)
    setDod([''])
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-xl font-semibold">New Focus Card</h2>
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div>
        <label className="block text-sm mb-1">Session Length (min)</label>
        <input
          type="number"
          className="w-24 rounded border px-2 py-1"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Definition of Done</label>
        {dod.map((item, i) => (
          <input
            key={i}
            className="w-full rounded border px-3 py-2 mb-2"
            placeholder={`Item ${i + 1}`}
            value={item}
            onChange={(e) => updateDod(i, e.target.value)}
          />
        ))}
        <button
          type="button"
          onClick={addDod}
          className="text-blue-600 text-sm"
        >
          + Add item
        </button>
      </div>
      <div className="flex gap-2 justify-end">
        {onClose && (
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          Save
        </button>
      </div>
    </form>
  )
}
