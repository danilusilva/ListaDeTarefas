// ─── Design System · Glassmorphism Dark ──────────────────────────────────────
// Paleta: preto profundo + roxo/azul néon + glass translúcido
// Tipografia: Syne (display) + Outfit (body)
// Reutilize BASE_STYLES em todas as páginas do projeto.

export const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #080810;
    --glass-bg:    rgba(255,255,255,0.04);
    --glass-border:rgba(255,255,255,0.10);
    --glass-hover: rgba(255,255,255,0.07);
    --input-bg:    rgba(255,255,255,0.07);
    --input-border:rgba(255,255,255,0.12);
    --input-focus: rgba(139,92,246,0.6);
    --purple:      #8B5CF6;
    --purple-light:#A78BFA;
    --pink:        #EC4899;
    --blue:        #3B82F6;
    --text:        #F1F5F9;
    --text-muted:  rgba(241,245,249,0.5);
    --divider:     rgba(255,255,255,0.12);
    --error:       #F87171;
  }

  /* ── Animated background ── */
  .tm-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    position: relative;
    overflow: hidden;
  }

  /* Flowing wave blobs */
  .tm-root::before,
  .tm-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }

  .tm-root::before {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%);
    top: -150px; right: -100px;
    animation: blobFloat1 12s ease-in-out infinite alternate;
  }

  .tm-root::after {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%);
    bottom: -100px; left: -80px;
    animation: blobFloat2 15s ease-in-out infinite alternate;
  }

  @keyframes blobFloat1 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-60px, 80px) scale(1.15); }
  }

  @keyframes blobFloat2 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(80px, -60px) scale(1.2); }
  }

  /* Extra pink blob */
  .tm-blob-pink {
    position: fixed;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(60px);
    bottom: 20%; right: 10%;
    pointer-events: none;
    z-index: 0;
    animation: blobFloat3 10s ease-in-out infinite alternate;
  }

  @keyframes blobFloat3 {
    from { transform: translate(0, 0); }
    to   { transform: translate(-40px, 50px); }
  }

  /* Animated lines / wave SVG overlay */
  .tm-waves {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
  }

  /* ── Glass card ── */
  .tm-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 20px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  /* Shine sweep on load */
  .tm-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Typography ── */
  .tm-display {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.6rem;
    line-height: 1.05;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .tm-display em {
    font-style: normal;
    background: linear-gradient(135deg, var(--purple-light), var(--pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tm-eyebrow {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--purple-light);
    display: block;
    margin-bottom: 0.6rem;
  }

  .tm-body {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
  }

  .tm-section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--text);
    text-align: center;
    margin-bottom: 1.75rem;
    letter-spacing: -0.01em;
  }

  /* ── Inputs ── */
  .tm-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
  }

  .tm-input {
    width: 100%;
    padding: 0.8rem 1.1rem;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
  }

  .tm-input::placeholder { color: var(--text-muted); }

  .tm-input:focus {
    border-color: var(--input-focus);
    background: rgba(139,92,246,0.08);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
  }

  .tm-textarea {
    resize: vertical;
    min-height: 90px;
  }

  /* ── Buttons ── */
  .tm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.85rem 1.75rem;
    background: linear-gradient(135deg, var(--purple), var(--blue));
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .tm-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--purple-light), var(--pink));
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tm-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(139,92,246,0.4); }
  .tm-btn:hover::before { opacity: 1; }
  .tm-btn:active { transform: scale(0.98); }

  .tm-btn span { position: relative; z-index: 1; }

  .tm-btn-ghost {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--text-muted);
    border-radius: 10px;
  }
  .tm-btn-ghost:hover { background: var(--glass-hover); color: var(--text); box-shadow: none; transform: none; }
  .tm-btn-ghost::before { display: none; }

  .tm-btn-full { width: 100%; }

  /* ── Tabs ── */
  .tm-tabs {
    display: flex;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 1.75rem;
    gap: 4px;
  }

  .tm-tab {
    flex: 1;
    background: none;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    padding: 0.6rem 0;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: background 0.2s, color 0.2s;
  }

  .tm-tab.active {
    background: linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3));
    color: var(--text);
    box-shadow: 0 2px 10px rgba(139,92,246,0.2);
  }

  .tm-tab:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.04); }

  /* ── Error ── */
  .tm-error {
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.3);
    color: var(--error);
    font-size: 0.8rem;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    margin-top: 0.5rem;
  }

  /* ── Divider ── */
  .tm-divider {
    border: none;
    border-top: 1px solid var(--divider);
    margin: 1.5rem 0;
  }

  /* ── Animations ── */
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .tm-fade { animation: fadeUp 0.5s both; }
`;