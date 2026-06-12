import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import Dashboard from './components/Dashboard';
import EvaluationFlow from './components/EvaluationFlow';
import { generateArchitecturalReview } from './services/geminiService';
import { Brain, ArrowRight, Activity, Terminal, Layout, Layers, Cpu } from 'lucide-react';
import SpaceProgram from './components/SpaceProgram';
// Standalone components imported for welcoming page tabs

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [view, setView] = useState('home'); // 'home', 'form', 'dashboard'
  const [projectData, setProjectData] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [homeTab, setHomeTab] = useState('pipeline'); // 'pipeline', 'space_program'
  const [standaloneProject, setStandaloneProject] = useState({
    title: 'Nile Delta Straw Bio-Composite Center',
    type: 'Recycling & R&D Center',
    scale: '10 Feddan (~42,000 m²)'
  });

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

          {/* Welcoming Page Tabs */}
          <div style={styles.homeTabs} className="tech-panel">
            <div className="scan-line" style={{ height: '2px', opacity: 0.1 }}></div>
            {[
              { id: 'pipeline', name: 'Project Evaluator', icon: Cpu },
              { id: 'space_program', name: 'Interactive Space Program', icon: Layout }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setHomeTab(tab.id)}
                  style={{
                    ...styles.homeTabBtn,
                    color: homeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                    borderColor: homeTab === tab.id ? 'var(--color-pink-orchid)' : 'transparent',
                    background: homeTab === tab.id ? 'rgba(80, 26, 49, 0.25)' : 'transparent'
                  }}
                  className="mono-tag"
                >
                  <IconComp size={12} style={{ marginRight: '6px' }} /> {tab.name.toUpperCase()}
                </button>
              );
            })}
          </div>

          {homeTab === 'pipeline' && (
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
                <EvaluationFlow />
              </div>
            </div>
          )}

          {homeTab === 'space_program' && (
            <div style={styles.standaloneToolWrapper} className="tech-panel">
              <div className="scan-line"></div>
              <div style={styles.presetPickerContainer}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <Cpu size={14} color="var(--color-pink-orchid)" />
                  <span className="mono-tag" style={{ color: 'var(--color-pink-orchid)', fontSize: '0.7rem' }}>
                    LOAD ARCHITECTURAL STUDY CASE-STUDIES:
                  </span>
                </div>
                <div style={styles.presetButtonsRow}>
                  {[
                    { title: 'Nile Delta Straw Bio-Composite Center', type: 'Recycling & R&D Center', scale: '10 Feddan (~42,000 m²)' },
                    { title: 'Red Sea Mangrove Regeneration Canopy', type: 'Eco-Tourism & Marine Research Station', scale: '2.5 Feddan (~10,500 m²)' },
                    { title: 'Mokattam Quarry Cultural Amphitheater', type: 'Community Arts & Performance Center', scale: '5 Feddan (~21,000 m²)' },
                    { title: 'Custom Blank Design', type: 'Blank Workspace', scale: '10,000 m²' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="tech-btn"
                      style={{
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.65rem',
                        borderColor: standaloneProject.title === preset.title ? 'var(--color-pink-orchid)' : 'var(--panel-border)',
                        background: standaloneProject.title === preset.title ? 'rgba(200, 82, 124, 0.12)' : 'transparent'
                      }}
                      onClick={() => setStandaloneProject(preset)}
                    >
                      {preset.title.split(' ')[0]} {preset.title.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(241,178,204,0.08)', paddingTop: '1.5rem' }}>
                <SpaceProgram projectData={standaloneProject} />
              </div>
            </div>
          )}



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
        <ProjectForm 
          onSubmit={handleFormSubmit} 
          initialData={projectData} 
          onCancel={() => setView('home')} 
        />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          review={review} 
          onReset={handleReset} 
          onGoHome={() => setView('home')}
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
  },
  homeTabs: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(25, 10, 19, 0.2)',
    border: '1px solid rgba(200, 82, 124, 0.15)',
    borderRadius: '4px',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    zIndex: 10
  },
  homeTabBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    background: 'transparent',
    borderStyle: 'solid',
    borderWidth: '0 0 2px 0',
    borderColor: 'transparent',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    whiteSpace: 'nowrap'
  },
  standaloneToolWrapper: {
    background: 'var(--panel-bg)',
    border: '1px solid var(--panel-border)',
    boxShadow: '0 0 15px rgba(42, 17, 32, 0.3)',
    borderRadius: '4px',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '0.5rem'
  },
  presetPickerContainer: {
    background: 'rgba(15, 5, 11, 0.4)',
    border: '1px solid rgba(200, 82, 124, 0.08)',
    borderRadius: '4px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  presetButtonsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
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
