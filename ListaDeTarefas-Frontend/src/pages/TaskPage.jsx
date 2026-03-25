import { useState, useEffect } from 'react';
import { BASE_STYLES } from '../styles/theme';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasksApi';
import { useAuth } from '../context/AuthContext';
import TaskFormDialog from '../components/TaskFormDialog';

export default function TasksPage() {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [erro, setErro]           = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) { setTasks([]); return; }
    fetchTasks();
  }, [user]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch {
      setErro('Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setDialogOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch {
      setErro('Erro ao salvar tarefa.');
    }
  }

  async function handleToggle(task) {
    await updateTask(task.id, { ...task, concluido: !task.concluido });
    fetchTasks();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    fetchTasks();
  }

  function handleEdit(task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  const pending = tasks.filter(t => !t.concluido);
  const done    = tasks.filter(t => t.concluido);

  return (
    <>
      <style>{BASE_STYLES}</style>
      <style>{LOCAL_STYLES}</style>

      <div className="tm-root tasks-layout">
        <div className="tm-blob-pink" />

        {/* Header */}
        <header className="tasks-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="tasks-logo">Task<span>Flow</span></span>
            {!loading && (
              <span className="tasks-badge">{pending.length} pendentes</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="tasks-user">{user?.email}</span>
            <button className="tm-btn tm-btn-ghost tasks-btn-sair" onClick={logout}>
              <span>Sair</span>
            </button>
            <button className="tm-btn" style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem' }}
              onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
              <span>+ Nova tarefa</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="tasks-main">
          {erro && <div className="tm-error" style={{ marginBottom: '1.5rem' }}>{erro}</div>}

          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Carregando…</p>
          ) : (
            <>
              <p className="tasks-section-label">Pendentes · {pending.length}</p>
              <div className="tasks-list">
                {pending.length === 0 ? (
                  <div className="tasks-empty">
                    <span className="tasks-empty-icon">✓</span>
                    <p>Tudo em dia. Crie uma nova tarefa acima.</p>
                  </div>
                ) : pending.map((t, i) => (
                  <TaskItem key={t.id} task={t} delay={i * 0.05}
                    onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>

              {done.length > 0 && (
                <>
                  <p className="tasks-section-label">Concluídas · {done.length}</p>
                  <div className="tasks-list">
                    {done.map((t, i) => (
                      <TaskItem key={t.id} task={t} delay={i * 0.04}
                        onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Reutiliza o dialog existente */}
      <TaskFormDialog
        open={dialogOpen}
        task={editingTask}
        onSave={handleSave}
        onClose={() => { setDialogOpen(false); setEditingTask(null); }}
      />
    </>
  );
}

// ── Task item ────────────────────────────────────────────────────────────────
function TaskItem({ task, delay, onToggle, onDelete, onEdit }) {
  const prazo = task.prazo
    ? new Date(task.prazo).toLocaleDateString('pt-BR')
    : null;

  return (
    <div className={`task-item ${task.concluido ? 'done' : ''}`}
      style={{ animationDelay: `${delay}s` }}>
      <input type="checkbox" className="task-check"
        checked={task.concluido} onChange={() => onToggle(task)} />
      <div className="task-body">
        <span className="task-text">{task.titulo}</span>
        {prazo && <span className="task-prazo">Prazo: {prazo}</span>}
      </div>
      <button className="task-action" onClick={() => onEdit(task)} title="Editar">✎</button>
      <button className="task-action task-action-delete" onClick={() => onDelete(task.id)} title="Excluir">✕</button>
    </div>
  );
}

// ── Estilos locais ────────────────────────────────────────────────────────────
const LOCAL_STYLES = `
  .tasks-layout { min-height: 100vh; }

  .tasks-header {
    position: sticky; top: 0; z-index: 10;
    background: rgba(8,8,16,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tasks-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .tasks-logo span {
    background: linear-gradient(135deg, #A78BFA, #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tasks-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--purple-light);
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.25);
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    margin-left: 0.75rem;
  }

  .tasks-user {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .tasks-btn-sair {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .tasks-main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
    position: relative;
    z-index: 1;
  }

  .tasks-section-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  .tasks-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--divider);
  }

  .tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
  }

  .task-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.9rem 1.1rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    backdrop-filter: blur(12px);
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    animation: fadeUp 0.35s both;
  }

  .task-item:hover {
    background: var(--glass-hover);
    border-color: rgba(139,92,246,0.25);
    transform: translateX(2px);
  }

  .task-item.done .task-text {
    text-decoration: line-through;
    opacity: 0.35;
  }

  .task-check {
    width: 19px; height: 19px;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 5px;
    background: transparent;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    flex-shrink: 0;
    position: relative;
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .task-check:checked {
    background: linear-gradient(135deg, var(--purple), var(--blue));
    border-color: transparent;
    box-shadow: 0 0 10px rgba(139,92,246,0.4);
  }

  .task-check:checked::after {
    content: '✓';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.65rem;
    line-height: 19px;
    text-align: center;
  }

  .task-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .task-text {
    font-size: 0.9rem;
    color: var(--text);
    transition: opacity 0.2s;
  }

  .task-prazo {
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  .task-action {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    opacity: 0;
    font-size: 0.9rem;
    padding: 0.2rem 0.35rem;
    border-radius: 5px;
    transition: opacity 0.15s, color 0.15s, background 0.15s;
    line-height: 1;
  }

  .task-item:hover .task-action { opacity: 1; }
  .task-action:hover { color: var(--text); background: rgba(255,255,255,0.08); }
  .task-action-delete:hover { color: var(--error); background: rgba(248,113,113,0.1); }

  .tasks-empty {
    text-align: center;
    padding: 3.5rem 1rem;
    color: var(--text-muted);
  }

  .tasks-empty-icon {
    font-family: 'Syne', sans-serif;
    font-size: 2.5rem;
    opacity: 0.12;
    display: block;
    margin-bottom: 0.75rem;
  }

  .tasks-empty p { font-size: 0.875rem; font-weight: 300; }
`;