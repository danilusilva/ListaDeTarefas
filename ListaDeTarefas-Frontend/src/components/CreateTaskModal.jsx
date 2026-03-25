// CreateTaskModal.jsx — modal de criação de tarefa · Glassmorphism Dark
// Uso: <CreateTaskModal open={open} onClose={() => setOpen(false)} onCreated={handleCreated} />

import { useState } from 'react';
import { BASE_STYLES } from './theme';

export default function CreateTaskModal({ open, onClose, onCreated }) {
  const [title, setTitle]     = useState('');
  const [notes, setNotes]     = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState('');

  if (!open) return null;

  async function handleSubmit() {
    if (!title.trim()) { setErro('Task title is required.'); return; }
    setErro('');
    setLoading(true);
    try {
      // const task = await createTask({ title, notes });
      onCreated?.({ id: Date.now(), title, notes, done: false }); // placeholder
      setTitle(''); setNotes('');
      onClose();
    } catch (e) {
      setErro(e.response?.data?.erro ?? 'Could not create task.');
    } finally {
      setLoading(false);
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <>
      <style>{BASE_STYLES}</style>
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8,8,16,0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 100;
          animation: backdropIn 0.2s both;
        }

        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .modal-card {
          width: 100%;
          max-width: 460px;
          padding: 2.5rem 2.25rem 2rem;
          animation: cardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }

        .modal-close {
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 0.9rem;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }

        .modal-fields {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
      `}</style>

      <div className="modal-backdrop" onClick={handleBackdrop}>
        <div className="tm-card modal-card">

          <div className="modal-header">
            <div>
              <span className="tm-eyebrow">✦ New Task</span>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '1.6rem',
                color: 'var(--text)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}>
                What needs<br />
                <span style={{
                  background: 'linear-gradient(135deg, #A78BFA, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>to be done?</span>
              </h2>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="modal-fields">
            <div>
              <label className="tm-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                className="tm-input"
                type="text"
                placeholder="e.g. Review pull requests"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
            </div>
            <div>
              <label className="tm-label" htmlFor="task-notes">
                Notes{' '}
                <span style={{ opacity: 0.45, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <textarea
                id="task-notes"
                className="tm-input tm-textarea"
                placeholder="Any extra context…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          {erro && <div className="tm-error">{erro}</div>}

          <div className="modal-actions" style={{ marginTop: erro ? '1rem' : 0 }}>
            <button className="tm-btn tm-btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="tm-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <span>{loading ? 'Creating…' : 'Create Task →'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}