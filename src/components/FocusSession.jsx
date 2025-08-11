import { useState, useEffect, useRef } from 'react'
import HoldButton from './HoldButton'
import CaptureModal from './CaptureModal'
import ReviewModal from './ReviewModal'

export default function FocusSession({ card, onUpdateCard, onClose }) {
  const focusSec = card.minutes * 60
  const breakSec = 10 * 60
  const [phase, setPhase] = useState('focus')
  const [remaining, setRemaining] = useState(focusSec)
  const [captures, setCaptures] = useState([])
  const [showCapture, setShowCapture] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [interruptions, setInterruptions] = useState(0)
  const hiddenAt = useRef(null)

  useEffect(() => {
    let interval
    if (phase === 'focus' || phase === 'break') {
      interval = setInterval(() => {
        setRemaining((r) => r - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (remaining <= 0) {
      if (phase === 'focus') {
        setPhase('break')
        setRemaining(breakSec)
        playBeep()
      } else if (phase === 'break') {
        endSession()
      }
    }
  }, [remaining, phase, breakSec])

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === 'hidden' && phase === 'focus') {
        hiddenAt.current = Date.now()
      } else if (document.visibilityState === 'visible' && hiddenAt.current) {
        const away = (Date.now() - hiddenAt.current) / 1000
        hiddenAt.current = null
        if (away > 10) {
          setPhase('paused')
          setInterruptions((i) => i + 1)
        }
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [phase])

  function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 800
    osc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
  }

  function addCapture(cap) {
    setCaptures([...captures, cap])
  }

  function endSession() {
    setShowReview(true)
  }

  function resume() {
    setPhase('focus')
  }

  function format(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="fixed inset-0 bg-gray-900/90 text-white flex flex-col items-center justify-center p-4 z-50">
      <h2 className="text-2xl mb-4">{card.title}</h2>
      <div className="text-6xl font-mono mb-2">{format(remaining)}</div>
      <div className="mb-4 capitalize">{phase}</div>
      <div className="flex gap-4">
        {phase === 'paused' ? (
          <HoldButton
            onComplete={resume}
            duration={3000}
            className="px-6 py-3 bg-green-600 rounded"
          >
            Hold to Resume
          </HoldButton>
        ) : (
          <HoldButton
            onComplete={endSession}
            duration={2000}
            className="px-6 py-3 bg-red-600 rounded"
          >
            Hold to End
          </HoldButton>
        )}
        {phase !== 'paused' && (
          <button
            onClick={() => setShowCapture(true)}
            className="px-6 py-3 bg-blue-600 rounded"
          >
            Capture ({captures.length})
          </button>
        )}
      </div>
      {showCapture && (
        <CaptureModal
          onSave={(c) => {
            addCapture(c)
            setShowCapture(false)
          }}
          onClose={() => setShowCapture(false)}
        />
      )}
      {showReview && (
        <ReviewModal
          card={card}
          captures={captures}
          onUpdate={onUpdateCard}
          onDone={onClose}
        />
      )}
      <div className="mt-4 text-sm">Interruptions: {interruptions}</div>
    </div>
  )
}
