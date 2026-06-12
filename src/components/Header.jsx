import React from 'react';
import { Brain } from 'lucide-react';
import { HARDCODED_API_KEY } from '../services/geminiService';

export default function Header({ apiKey }) {
  const isKeyActive = (HARDCODED_API_KEY && HARDCODED_API_KEY !== "PASTE_YOUR_GEMINI_API_KEY_HERE") || (apiKey && apiKey.trim().length > 10);

  return (
    <header style={styles.header}>
      <div style={styles.logoGroup}>
        <div style={styles.logoIconBg}>
          <Brain size={20} color="var(--color-pink-orchid)" />
        </div>
        <div>
          <h1 style={styles.logoTitle}>ARCHITECTURAL BRAIN</h1>
          <div className="mono-tag" style={styles.logoSubtitle}>
            [ MULTI-AGENT DESIGN REVIEW STUDIO ]
          </div>
        </div>
      </div>

      <div style={styles.statusGroup}>
        <div style={styles.statusPill}>
          <div className={`pulse-dot ${isKeyActive ? 'active' : ''}`}></div>
          <span className="mono-tag" style={{ fontSize: '0.65rem' }}>
            {isKeyActive ? 'ENGINE: GEMINI AI ACTIVE' : 'ENGINE: ARCHITECTURAL BRAIN AI'}
          </span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid rgba(200, 82, 124, 0.15)',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 100
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    background: 'rgba(80, 26, 49, 0.3)',
    border: '1px solid var(--color-berry)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(80, 26, 49, 0.2)'
  },
  logoTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    letterSpacing: '-0.01em',
    color: 'var(--text-pure)',
    lineHeight: 1.1
  },
  logoSubtitle: {
    marginTop: '0.1rem',
    opacity: 0.8
  },
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.4rem 0.8rem',
    background: 'rgba(15, 5, 11, 0.5)',
    border: '1px solid rgba(200, 82, 124, 0.12)',
    borderRadius: '12px'
  }
};
