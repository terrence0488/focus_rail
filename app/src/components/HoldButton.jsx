import { useState, useRef } from 'react'

export default function HoldButton({
  onComplete,
  children,
  duration = 2000,
  className = '',
}) {
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const startTime = useRef(0)

  function start() {
    if (timerRef.current) return
    startTime.current = performance.now()
    timerRef.current = requestAnimationFrame(step)
  }

  function cancel() {
    if (timerRef.current) cancelAnimationFrame(timerRef.current)
    timerRef.current = null
    setProgress(0)
  }

  function step(now) {
    const elapsed = now - startTime.current
    const p = Math.min(elapsed / duration, 1)
    setProgress(p)
    if (p === 1) {
      cancel()
      onComplete()
    } else {
      timerRef.current = requestAnimationFrame(step)
    }
  }

  return (
    <button
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {progress > 0 && (
        <span
          className="absolute left-0 top-0 h-full bg-white/30"
          style={{ width: `${progress * 100}%` }}
        />
      )}
    </button>
  )
}
