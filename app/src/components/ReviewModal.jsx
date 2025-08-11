import { useState } from 'react'

export default function ReviewModal({ card, captures, onUpdate, onDone }) {
  const [items, setItems] = useState(captures)

  function convert(capture) {
    const newItem = {
      id: crypto.randomUUID(),
      text: capture.content,
      done: false,
    }
    const updatedCard = {
      ...card,
      checklist: [...card.checklist, newItem],
    }
    onUpdate(updatedCard)
    setItems(items.filter((c) => c.id !== capture.id))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Review Session</h3>
        {items.length === 0 && <p className="mb-4">No captures.</p>}
        <ul className="mb-4 space-y-2 max-h-60 overflow-auto">
          {items.map((c) => (
            <li key={c.id} className="flex justify-between items-center">
              <span>{c.content}</span>
              <button
                className="text-sm text-blue-600"
                onClick={() => convert(c)}
              >
                Convert to Checklist
              </button>
            </li>
          ))}
        </ul>
        <div className="text-right">
          <button onClick={onDone} className="px-4 py-2 bg-green-600 text-white rounded">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
