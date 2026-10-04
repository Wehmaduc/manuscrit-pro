:root {
  --bg: #0b1020;
  --bg-soft: #111827;
  --bg-panel: rgba(17, 24, 39, 0.7);
  --panel: #101a2d;
  --panel-elevated: #15233d;
  --card: #111c2f;
  --line: rgba(148, 163, 184, 0.18);
  --text: #edf2ff;
  --muted: #a9b6d3;
  --primary: #7c5cff;
  --primary-2: #4cc9f0;
  --success: #2dd4bf;
  --warning: #fbbf24;
  --danger: #fb7185;
  --shadow: 0 20px 40px rgba(15, 23, 42, 0.35);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Inter, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(124, 92, 255, 0.2), transparent 25%),
    radial-gradient(circle at bottom right, rgba(76, 201, 240, 0.2), transparent 25%),
    var(--bg);
  color: var(--text);
}

button,
input,
textarea {
  font: inherit;
}

button {
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

img {
  max-width: 100%;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 5vw;
  background: rgba(11, 16, 32, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  font-weight: 700;
}

.brand-text {
  font-size: 1.05rem;
  font-weight: 700;
}

.main-nav {
  display: flex;
  gap: 22px;
}

.main-nav a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.96rem;
}

.nav-cta,
.primary-btn,
.secondary-btn,
.ghost-btn,
.plan-btn,
.tab-btn {
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
}

.primary-btn,
.nav-cta {
  background: linear-gradient(135deg, var(--primary), #8d7bff);
  color: white;
  box-shadow: var(--shadow);
}

.secondary-btn,
.ghost-btn,
.tab-btn {
  color: var(--text);
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid var(--line);
}

.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 70px;
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 32px;
  padding: 30px 0 20px;
}

.eyebrow {
  display: inline-block;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.74rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #d9e2ff;
  background: rgba(124, 92, 255, 0.16);
  border: 1px solid rgba(124, 92, 255, 0.35);
}

.hero-copy h1 {
  margin: 16px 0 12px;
  font-size: clamp(2.5rem, 4vw, 4.3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.hero-copy p {
  margin: 0;
  font-size: 1.07rem;
  line-height: 1.7;
  color: var(--muted);
  max-width: 620px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  margin-top: 26px;
  flex-wrap: wrap;
}

.microstats {
  display: flex;
  gap: 32px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.microstats div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.microstats strong {
  font-size: 1.2rem;
}

.microstats span {
  color: var(--muted);
  font-size: 0.8rem;
}

.hero-panel {
  display: flex;
  justify-content: center;
}

.panel-card {
  width: min(100%, 420px);
  background: linear-gradient(180deg, rgba(18, 29, 49, 0.9), rgba(10, 17, 31, 0.8));
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--muted);
}

.status-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 14px rgba(45, 212, 191, 0.8);
}

.score-ring {
  width: 172px;
  height: 172px;
  margin: 28px auto 18px;
  border-radius: 50%;
  background: conic-gradient(var(--primary) 0 84%, rgba(148, 163, 184, 0.12) 84% 100%);
  display: grid;
  place-items: center;
}

.score-ring-inner {
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background: var(--bg-soft);
  display: grid;
  place-items: center;
  text-align: center;
  border: 1px solid var(--line);
}

.score-ring-inner strong {
  font-size: 2rem;
}

.score-ring-inner span {
  color: var(--muted);
}

.mini-metrics {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.mini-metrics li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.03);
  color: var(--muted);
}

.mini-metrics strong {
  color: var(--text);
}

.feature-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin: 28px 0 18px;
}

.feature-item {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(17, 24, 39, 0.65);
  border: 1px solid var(--line);
}

.feature-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(124, 92, 255, 0.12);
  font-size: 1.2rem;
}

.feature-item h3 {
  margin: 0 0 6px;
  font-size: 1rem;
}

.feature-item p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
  font-size: 0.92rem;
}

.workspace-section,
.pricing-section {
  padding-top: 24px;
}

.workspace-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 24px;
}

.panel {
  background: rgba(17, 24, 39, 0.72);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 22px;
  box-shadow: var(--shadow);
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.section-title-row h2,
.report-header h2,
.section-header h2 {
  margin: 0;
  font-size: clamp(1.4rem, 2vw, 2rem);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  border: 1px solid var(--line);
}

.badge.neutral {
  background: rgba(148, 163, 184, 0.08);
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 9px;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--line);
  padding: 13px 14px;
  background: rgba(15, 23, 42, 0.8);
  color: var(--text);
}

textarea {
  resize: vertical;
  min-height: 260px;
  margin-top: 16px;
}

.upload-box {
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px dashed rgba(148, 163, 184, 0.28);
  border-radius: 14px;
  background: rgba(148, 163, 184, 0.02);
}

.upload-box input {
  padding: 8px 0 0;
  background: transparent;
  border: none;
}

.upload-box small {
  color: var(--muted);
  font-size: 0.8rem;
}

.actions-row {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
  color: var(--muted);
}

.feature-list li {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.04);
  border: 1px solid var(--line);
}

.mini-cta {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.18), rgba(76, 201, 240, 0.12));
  border: 1px solid rgba(124, 92, 255, 0.35);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mini-cta span {
  color: var(--muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.loader-section {
  display: none;
  padding: 40px 0;
}

.loader-card {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 30px 24px;
}

.spinner {
  width: 54px;
  height: 54px;
  border: 5px solid rgba(148, 163, 184, 0.18);
  border-top-color: var(--primary-2);
  border-radius: 50%;
  margin: 0 auto 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.12);
  margin-top: 18px;
}

.progress-fill {
  width: 0%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  transition: width 0.35s ease;
}

.results-section {
  display: none;
  padding-top: 30px;
}

.report-panel {
  padding: 20px 20px 24px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 16px;
}

.tab-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0 24px;
}

.tab-btn {
  font-size: 0.82rem;
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--primary), #8d7bff);
  color: white;
  border-color: transparent;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.score-card {
  background: rgba(148, 163, 184, 0.04);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px;
}

.score-card.high { border-left: 4px solid var(--success); }
.score-card.medium { border-left: 4px solid var(--warning); }
.score-card.low { border-left: 4px solid var(--danger); }

.score-label {
  color: var(--muted);
  font-size: 0.82rem;
  margin-bottom: 10px;
}

.score-value {
  font-weight: 800;
  font-size: 1.5rem;
}

.score-value.high { color: var(--success); }
.score-value.medium { color: var(--warning); }
.score-value.low { color: var(--danger); }

.alert {
  margin-top: 20px;
  padding: 16px 18px;
  border-radius: 16px;
  border-left: 5px solid transparent;
}

.alert-info { background: rgba(76, 201, 240, 0.08); border-left-color: var(--primary-2); }
.alert-warning { background: rgba(251, 191, 36, 0.08); border-left-color: var(--warning); }
.alert-success { background: rgba(45, 212, 191, 0.08); border-left-color: var(--success); }
.alert-danger { background: rgba(251, 113, 133, 0.08); border-left-color: var(--danger); }

.alert-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.issue-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.issue-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.04);
  border: 1px solid var(--line);
}

.character-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(148, 163, 184, 0.04);
  border: 1px solid var(--line);
  margin-bottom: 16px;
}

.character-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.character-info {
  display: grid;
  gap: 6px;
  color: var(--muted);
}

.timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  background: rgba(148, 163, 184, 0.04);
  border: 1px solid var(--line);
  border-left: 4px solid var(--primary-2);
  border-radius: 12px;
  padding: 12px 14px;
}

.pricing-section {
  padding-top: 46px;
}

.section-header.center {
  text-align: center;
  margin-bottom: 24px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 18px;
}

.pricing-card {
  position: relative;
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 22px 20px 20px;
  box-shadow: var(--shadow);
}

.pricing-card.featured {
  border-color: rgba(124, 92, 255, 0.55);
  background: linear-gradient(180deg, rgba(38, 28, 72, 0.84), rgba(17, 24, 39, 0.82));
}

.plan-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  border-radius: 999px;
  padding: 6px 10px;
}

.plan-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 18px;
}

.plan-price {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.plan-price span {
  font-size: 0.9rem;
  color: var(--muted);
}

.pricing-card p {
  color: var(--muted);
  line-height: 1.6;
}

.pricing-card ul {
  list-style: none;
  padding: 0;
  margin: 18px 0 26px;
  display: grid;
  gap: 10px;
  color: var(--text);
}

.pricing-card li::before {
  content: "✓";
  color: var(--success);
  margin-right: 10px;
}

@media (max-width: 900px) {
  .hero,
  .workspace-grid,
  .pricing-grid,
  .feature-strip {
    grid-template-columns: 1fr;
  }

  .main-nav {
    display: none;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}
