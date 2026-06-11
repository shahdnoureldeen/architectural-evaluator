import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import Dashboard from './components/Dashboard';
import { generateArchitecturalReview } from './services/geminiService';
import { Brain, ArrowRight, Activity, Terminal } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [view, setView] = useState('home'); // 'home', 'form', 'dashboard'
  const [projectData, setProjectData] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Clock telemetry matching design inspiration
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApiKeyChange = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('gemini_api_key', newKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleFormSubmit = async (data) => {
    setProjectData(data);
    setLoading(true);
    setView('dashboard'); // Transition immediately so dashboard can show boot diagnostics
    
    try {
      const result = await generateArchitecturalReview(data, apiKey);
      setReview(result);
    } catch (error) {
      console.error(error);
      alert("An error occurred during evaluation. Falling back to local simulation.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReview(null);
    setProjectData(null);
    setView('form');
  };

  return (
    <div className="main-wrapper">
      <Header apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

      {view === 'home' && (
        <div style={styles.homeContainer}>
          {/* Top telemetry lines */}
          <div style={styles.telemetryBar}>
            <span className="mono-tag">[ SYSTEM MODULE: ACTIVE ]</span>
            <span className="mono-tag" style={{ marginLeft: 'auto' }}>LOCAL TIME {localTime}</span>
          </div>

          <div style={styles.heroLayout} className="hero-layout-responsive">
            {/* Title section */}
            <div style={styles.titleSection}>
              <h1 style={styles.heroTitle}>
                REALITY,<br />BY DESIGN.
              </h1>
              <div style={styles.subtextBlock}>
                <div className="mono-tag" style={{ color: 'var(--color-pink-orchid)', marginBottom: '0.5rem' }}>
                  // DECENTRALIZED MULTI-AGENT TELESIS STUDIO
                </div>
                <p style={styles.heroDesc}>
                  Evaluating architectural concepts, site-specific hydrology, structural feasibility, and circular feedstock paths through an integrated panel of simulated specialist agents.
                </p>
              </div>
              
              <button 
                className="tech-btn primary" 
                style={styles.initiateBtn}
                onClick={() => setView('form')}
              >
                INITIATE DESIGN REVIEW <ArrowRight size={14} style={{ marginLeft: '8px' }} />
              </button>
            </div>

            {/* Central Graphic Section */}
            <div style={styles.graphicSection}>
              <div style={styles.graphicFrame}>
                <div className="scan-line"></div>
                <img 
                  src="/holographic_pavilion.png" 
                  alt="Holographic pavilion blueprint" 
                  style={styles.previewImage}
                />
                
                {/* Visual annotations pointing to image like inspiration */}
                <div style={{ ...styles.previewTag, top: '22%', right: '5%' }} className="mono-tag">
                  SUTÉRA // TARA (EARTH)<br />
                  - UNDERNEATH THE EARTH
                </div>
                <div style={{ ...styles.previewTag, bottom: '20%', left: '5%' }} className="mono-tag">
                  CORE THREADS OF AGRO-COMPOSITE<br />
                  - RICE STRAW DETECTOR
                </div>
              </div>
            </div>
          </div>

          {/* Footer stats inspired by mock-up */}
          <div style={styles.footerRow}>
            <div style={styles.footerStat}>
              <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>PROJECT GRID STATUS</span>
              <div style={styles.statVal}>OK // WGS-84</div>
            </div>
            <div style={styles.footerStat}>
              <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>INTEGRATION NODES</span>
              <div style={styles.statVal}>6 EXPERT AGENTS</div>
            </div>
            <div style={styles.footerStat}>
              <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>PRIMARY RESOLUTION</span>
              <div style={styles.statVal}>GEMINI 2.5 TELEMETRY</div>
            </div>
          </div>
        </div>
      )}

      {view === 'form' && (
        <ProjectForm onSubmit={handleFormSubmit} initialData={projectData} />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          review={review} 
          onReset={handleReset} 
          projectData={projectData} 
        />
      )}
    </div>
  );
}

const styles = {
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    position: 'relative',
    zIndex: 10
  },
  telemetryBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(241, 178, 204, 0.15)',
    paddingBottom: '0.5rem',
    fontSize: '0.75rem',
  },
  heroLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2.5rem',
    alignItems: 'center',
    minHeight: '420px',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.75rem'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '0.95',
    color: '#ffffff',
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-heading)'
  },
  subtextBlock: {
    maxWidth: '440px'
  },
  heroDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  initiateBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem 1.6rem',
    fontSize: '0.85rem'
  },
  graphicSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicFrame: {
    position: 'relative',
    width: '100%',
    maxWidth: '440px',
    height: '360px',
    background: 'rgba(25, 10, 19, 0.25)',
    border: '1px solid rgba(200, 82, 124, 0.15)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  previewImage: {
    maxHeight: '85%',
    maxWidth: '85%',
    objectFit: 'contain',
    opacity: 0.85,
    filter: 'contrast(1.05) saturate(1.1)'
  },
  previewTag: {
    position: 'absolute',
    fontSize: '0.55rem',
    color: 'var(--color-pink-orchid)',
    background: 'rgba(11, 3, 8, 0.7)',
    padding: '0.35rem 0.6rem',
    border: '1px solid rgba(200, 82, 124, 0.2)',
    borderRadius: '2px',
    lineHeight: '1.4'
  },
  footerRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    borderTop: '1px solid rgba(241, 178, 204, 0.15)',
    paddingTop: '1.5rem',
    marginTop: '1.5rem'
  },
  footerStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  statVal: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'var(--font-mono)'
  }
};

// Insert media queries dynamically
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (min-width: 768px) {
      .hero-layout-responsive {
        grid-template-columns: 5fr 4fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
