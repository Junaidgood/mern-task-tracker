import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import '../styles/TaskCelebration.css';

function TaskCelebration({ celebration, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!celebration || !canvasRef.current) return;

    const fire = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const colors = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];

    // Center realistic burst (front layer)
    fire({
      particleCount: 80,
      spread: 85,
      origin: { x: 0.5, y: 0.5 },
      colors,
      ticks: 220,
      gravity: 0.9,
      scalar: 1.15,
    });

    // Left & Right party-popper cannons
    fire({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0.15, y: 0.65 },
      colors,
      ticks: 240,
      scalar: 1.1,
    });
    fire({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 0.85, y: 0.65 },
      colors,
      ticks: 240,
      scalar: 1.1,
    });

    return () => {
      fire.reset();
    };
  }, [celebration]);

  if (!celebration) return null;

  const action = celebration.action || 'Task Updated';
  const taskList = Array.isArray(celebration.tasks) ? celebration.tasks : [];

  return createPortal(
    <>
      <div className="celebration-backdrop" onClick={onClose}>
        <div
          className="celebration-layer"
          role="status"
          aria-live="polite"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="celebration-popup">
            <div className="celebration-icon-ring" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <div className="celebration-content">
              <strong className="celebration-title">{action}</strong>
              {taskList.length > 0 && (
                <ul className="celebration-task-list">
                  {taskList.map((title, idx) => (
                    <li key={idx} className="celebration-task-pill">
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {onClose && (
              <button
                type="button"
                className="celebration-close"
                onClick={onClose}
                aria-label="Close notification"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confetti canvas always on top of the popup, never blurred */}
      <canvas ref={canvasRef} className="celebration-confetti-canvas" aria-hidden="true" />
    </>,
    document.body
  );
}

export default TaskCelebration;
