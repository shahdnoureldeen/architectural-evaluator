import React, { useState, useEffect } from 'react';
import { Brain, Key, HelpCircle, Activity } from 'lucide-react';

export default function Header({ apiKey, onApiKeyChange }) {
  const [showModal, setShowModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');

  useEffect(() => {
    setTempKey(apiKey || '');
  }, [apiKey]);

  const handleSave = () => {
    onApiKeyChange(tempKey);
    setShowModal(false);
  };

  const handleClear = () => {
    onApiKeyChange('');
    setTempKey('');
    setShowModal(false);
  };

  return (
    <>
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
            <div className={`pulse-dot ${apiKey ? 'active' : ''}`}></div>
            <span className="mono-tag" style={{ fontSize: '0.65rem' }}>
              {apiKey ? 'ENGINE: GEMINI LIVE' : 'ENGINE: LOCAL SIMULATION'}
            </span>
          </div>

          <button 
            style={styles.keyBtn} 
            className="tech-btn"
            onClick={() => setShowModal(true)}
          >
            <Key size={14} style={{ marginRight: '6px' }} />
            {apiKey ? 'CONFIG KEY' : 'ENTER API KEY'}
          </button>
        </div>
      </header>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div 
            style={styles.modalContent} 
            className="tech-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="scan-line"></div>
            <div style={styles.modalHeader}>
              <Key size={18} color="var(--color-pink-orchid)" style={{ marginRight: '8px' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)' }}>GEMINI API CONFIGURATION</h3>
            </div>
            
            <p style={styles.modalText}>
              Provide your personal Google Gemini API Key to enable <strong>live, real-time architectural evaluations</strong> of custom project parameters.
            </p>
            <p style={styles.modalWarning} className="mono-tag">
              * The key is stored locally in your browser (localStorage) and never leaves your machine.
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={styles.modalInput}
              className="form-input"
            />

            <div style={styles.modalActions}>
              <button 
                className="tech-btn" 
                onClick={handleClear}
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Clear Key
              </button>
              <button 
                className="tech-btn primary" 
                onClick={handleSave}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  },
  keyBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(11, 3, 8, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    width: '90%',
    maxWidth: '460px',
    background: 'rgba(25, 10, 19, 0.95)',
    border: '1px solid var(--color-mulberry)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(241, 178, 204, 0.1)',
    paddingBottom: '0.75rem',
  },
  modalText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'var(--text-primary)'
  },
  modalWarning: {
    fontSize: '0.65rem',
    color: 'var(--color-pink-orchid)',
  },
  modalInput: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem'
  }
};
