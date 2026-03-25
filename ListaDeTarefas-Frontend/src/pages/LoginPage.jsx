import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BASE_STYLES } from '../styles/theme';

/* ─────────────────────────────────────────────
   Glassmorphism Dark — Task Manager Login
   Inspirado na referência enviada:
   • Fundo preto com ondas neon roxo/azul animadas
   • Card dividido: painel esquerdo (branding) + painel direito (form)
   • Campos arredondados com fundo semitransparente
   • Tipografia: Syne (display bold) + Inter (body)
───────────────────────────────────────────── */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #0a0a0f;
    --card-bg:    rgba(20, 20, 30, 0.75);
    --panel-left: rgba(15, 15, 22, 0.6);
    --glass:      rgba(255,255,255,0.06);
    --glass-border: rgba(255,255,255,0.10);
    --neon-purple: #9b4dca;
    --neon-blue:   #4f46e5;
    --neon-pink:   #c026d3;
    --text:        #f0f0f5;
    --text-muted:  rgba(240,240,245,0.55);
    --field-bg:    rgba(255,255,255,0.07);
    --field-border: rgba(255,255,255,0.12);
    --field-focus: rgba(155,77,202,0.5);
    --rust:        #f87171;
  }

  /* ── Root / background ── */
  .gl-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    color: var(--text);
    overflow: hidden;
    position: relative;
    padding: 2rem;
  }

  /* ── Animated wave blobs ── */
  .gl-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    animation: blobFloat 12s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }
  .gl-blob-1 {
    width: 520px; height: 340px;
    background: radial-gradient(ellipse, var(--neon-purple), transparent 70%);
    bottom: -60px; left: -100px;
    animation-duration: 14s;
  }
  .gl-blob-2 {
    width: 400px; height: 300px;
    background: radial-gradient(ellipse, var(--neon-blue), transparent 70%);
    top: -80px; right: -80px;
    animation-duration: 10s;
    animation-delay: -4s;
  }
  .gl-blob-3 {
    width: 280px; height: 200px;
    background: radial-gradient(ellipse, var(--neon-pink), transparent 70%);
    bottom: 30%; right: 15%;
    opacity: 0.2;
    animation-duration: 16s;
    animation-delay: -7s;
  }

  /* Wavy lines overlay — SVG via background */
  .gl-waves {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.18;
    background-image:
      repeating-linear-gradient(
        -30deg,
        transparent,
        transparent 28px,
        rgba(155,77,202,0.4) 28px,
        rgba(155,77,202,0.4) 29px
      ),
      repeating-linear-gradient(
        60deg,
        transparent,
        transparent 40px,
        rgba(79,70,229,0.25) 40px,
        rgba(79,70,229,0.25) 41px
      );
    animation: waveShift 20s linear infinite;
  }

  @keyframes waveShift {
    from { background-position: 0 0, 0 0; }
    to   { background-position: 200px 300px, -150px 200px; }
  }

  @keyframes blobFloat {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, -40px) scale(1.08); }
  }

  /* ── Card ── */
  .gl-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 820px;
    min-height: 420px;
    display: flex;
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04),
      0 20px 60px rgba(0,0,0,0.6),
      0 0 80px rgba(155,77,202,0.08);
    overflow: hidden;
    animation: cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Left panel ── */
  .gl-left {
    flex: 1;
    padding: 3rem 2.5rem;
    background: var(--panel-left);
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .gl-left::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(155,77,202,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .gl-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.4rem;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 0.2rem;
    animation: fadeUp 0.5s 0.15s both;
  }

  .gl-tagline {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color: var(--text);
    line-height: 1.2;
    margin: 1.5rem 0 0.75rem;
    animation: fadeUp 0.5s 0.2s both;
  }

  .gl-tagline span {
    display: block;
    background: linear-gradient(90deg, var(--neon-purple), var(--neon-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gl-desc {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 240px;
    animation: fadeUp 0.5s 0.25s both;
  }

  .gl-url {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.05em;
    animation: fadeUp 0.5s 0.3s both;
  }

  /* ── Right panel ── */
  .gl-right {
    flex: 1;
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .gl-form-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.6rem;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text);
    animation: fadeUp 0.5s 0.2s both;
  }

  /* ── Tabs ── */
  .gl-tabs {
    display: flex;
    background: rgba(255,255,255,0.05);
    border-radius: 100px;
    padding: 4px;
    margin-bottom: 1.75rem;
    animation: fadeUp 0.5s 0.25s both;
  }

  .gl-tab {
    flex: 1;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    border-radius: 100px;
    transition: all 0.25s;
    letter-spacing: 0.02em;
  }

  .gl-tab.active {
    background: rgba(155,77,202,0.35);
    color: var(--text);
    box-shadow: 0 0 16px rgba(155,77,202,0.3);
  }

  /* ── Fields ── */
  .gl-field-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    animation: fadeUp 0.5s 0.3s both;
  }

  .gl-input {
    width: 100%;
    padding: 0.85rem 1.25rem;
    background: var(--field-bg);
    border: 1px solid var(--field-border);
    border-radius: 100px;
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
  }

  .gl-input::placeholder { color: var(--text-muted); }

  .gl-input:focus {
    border-color: var(--neon-purple);
    box-shadow: 0 0 0 3px var(--field-focus);
    background: rgba(255,255,255,0.10);
  }

  /* ── Error ── */
  .gl-error {
    font-size: 0.78rem;
    color: var(--rust);
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 8px;
    padding: 0.55rem 1rem;
    margin-top: 0.25rem;
    animation: fadeUp 0.3s both;
  }

  /* ── Submit button ── */
  .gl-btn {
    margin-top: 1.25rem;
    width: 100%;
    padding: 0.85rem;
    background: rgba(155,77,202,0.25);
    border: 1px solid rgba(155,77,202,0.4);
    border-radius: 100px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text);
    letter-spacing: 0.04em;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    animation: fadeUp 0.5s 0.35s both;
    position: relative;
    overflow: hidden;
  }

  .gl-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 100px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }

  .gl-btn:hover {
    background: rgba(155,77,202,0.45);
    box-shadow: 0 0 24px rgba(155,77,202,0.35);
  }

  .gl-btn:hover::before { transform: translateX(100%); }
  .gl-btn:active { transform: scale(0.98); }

  /* ── Footer hint ── */
  .gl-hint {
    text-align: center;
    margin-top: 1.1rem;
    font-size: 0.73rem;
    color: rgba(255,255,255,0.28);
    animation: fadeUp 0.5s 0.4s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 620px) {
    .gl-left { display: none; }
    .gl-card { max-width: 400px; }
  }
`;

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab]     = useState(0);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro]   = useState('');

  async function handleSubmit() {
    setErro('');
    try {
      if (tab === 0) await login(email, senha);
      else           await register(email, senha);
    } catch (e) {
      setErro(e.response?.data?.erro ?? 'Erro ao autenticar. Verifique os dados.');
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="gl-root">
        {/* Animated background */}
        <div className="gl-blob gl-blob-1" />
        <div className="gl-blob gl-blob-2" />
        <div className="gl-blob gl-blob-3" />
        <div className="gl-waves" />

        {/* Card */}
        <div className="gl-card">

          {/* Left panel — branding */}
          <div className="gl-left">
            <div>
              <p className="gl-logo">TM</p>
              <h2 className="gl-tagline">
                Welcome to your<br />
                <span>task manager.</span>
              </h2>
              <p className="gl-desc">
                Organize your day, track your progress and stay on top of everything that matters.
              </p>
            </div>
            <span className="gl-url">taskmanager.app</span>
          </div>

          {/* Right panel — form */}
          <div className="gl-right">
            <h1 className="gl-form-title">
              {tab === 0 ? 'Login' : 'Register'}
            </h1>

            <div className="gl-tabs">
              <button
                className={`gl-tab ${tab === 0 ? 'active' : ''}`}
                onClick={() => { setTab(0); setErro(''); }}
              >Sign In</button>
              <button
                className={`gl-tab ${tab === 1 ? 'active' : ''}`}
                onClick={() => { setTab(1); setErro(''); }}
              >Register</button>
            </div>

            <div className="gl-field-wrap">
              <input
                className="gl-input"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className="gl-input"
                type="password"
                placeholder="Password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {erro && <div className="gl-error">{erro}</div>}

            <button className="gl-btn" onClick={handleSubmit}>
              {tab === 0 ? 'Login →' : 'Create Account →'}
            </button>

            <p className="gl-hint">
              {tab === 0
                ? "No account yet? Switch to Register."
                : "Already registered? Switch to Sign In."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}