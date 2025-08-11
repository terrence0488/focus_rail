import { useState, useEffect } from 'react'
import CardForm from './components/CardForm'
import FocusSession from './components/FocusSession'

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

export default function App() {
  const [cards, setCards] = useLocalStorage('cards', [])
  const [showForm, setShowForm] = useState(false)
  const [active, setActive] = useState(null)

  function addCard({ title, minutes, dod }) {
    const card = {
      id: crypto.randomUUID(),
      title,
      minutes,
      doneDefinition: dod,
      checklist: dod.map((d) => ({ id: crypto.randomUUID(), text: d, done: false })),
    }
    setCards([card, ...cards])
    setShowForm(false)
  }

  function updateCard(updated) {
    setCards(cards.map((c) => (c.id === updated.id ? updated : c)))
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-2xl mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Focus Rail</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            New Card
          </button>
        </header>
        <ul className="space-y-4">
          {cards.map((card) => (
            <li
              key={card.id}
              className="bg-white rounded shadow p-4 flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold">{card.title}</h2>
                <p className="text-sm text-gray-500">
                  {card.checklist.filter((i) => i.done).length}/
                  {card.checklist.length} checklist · {card.minutes} min
                </p>
              </div>
              <button
                onClick={() => setActive(card)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Start
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow p-4 w-full max-w-md">
            <CardForm onSave={addCard} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
      {active && (
        <FocusSession
          card={active}
          onUpdateCard={(c) => {
            updateCard(c)
            setActive(c)
          }}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}
