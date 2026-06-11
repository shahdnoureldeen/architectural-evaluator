import React, { useState, useEffect } from 'react';
import ScoreChart from './ScoreChart';
import Diagrams from './Diagrams';
import { 
  ShieldAlert, Sparkles, FileText, Download, CheckCircle, 
  HelpCircle, ChevronRight, RefreshCw, AlertTriangle, 
  Cpu, Layers, Eye, RefreshCw as LoopIcon
} from 'lucide-react';

export default function Dashboard({ review, onReset, projectData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);

  // States for NANO BANANA rendering engine simulation
  const [nanoState, setNanoState] = useState('idle'); // 'idle', 'rendering', 'complete'
  const [nanoLogStep, setNanoLogStep] = useState(0);
  const [nanoProgress, setNanoProgress] = useState(0);

  const bootLogs = [
    "ACQUIRING SITE CLIMATOLOGY & TOPOGRAPHIC ARRAYS...",
    "ESTABLISHING TECTIONIC MATERIAL MATRIX INTERFACE...",
    "SIMULATING ARCHITECT AGENT [FORM, CIRCULATION, MASSING]...",
    "SIMULATING SUSTAINABILITY AGENT [THERMAL, CARBON, WATER]...",
    "SIMULATING STRUCTURAL AGENT [FEASIBILITY, FOUNDATIONS, GRIDS]...",
    "SIMULATING USER EXPERIENCE AGENT [WAYFINDING, ACCESSIBILITY]...",
    "CONVENING THE ARCHITECTURAL JURY PANEL...",
    "SYNTHESIZING DESIGN DIRECTOR RECOMMENDATIONS...",
    "REVIEW GENERATION SEQUENCE COMPLETED."
  ];

  const nanoLogs = [
    "ACQUIRING UPLINK LAYER AND BOUNDING CHANNELS...",
    "DECONSTRUCTING MONOLITHIC GEOMETRY & VERTICES...",
    "PERFORMING STEPPED-ROOF VOLUMETRIC CELLULAR SPLITS...",
    "CALCULATING HYDRODYNAMIC SHEAR STRESS VOIDS...",
    "INJECTING NANO BANANA OPTIMIZED SHADER MAPS...",
    "RENDERING COMPLETED. SYNTHESIZING DfD BLUEPRINT..."
  ];

  // Simulated diagnostic logging sequence on mount
  useEffect(() => {
    if (booting) {
      const interval = setInterval(() => {
        setBootStep(prev => {
          if (prev >= bootLogs.length - 1) {
            clearInterval(interval);
            setTimeout(() => setBooting(false), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 350);
      return () => clearInterval(interval);
    }
  }, [booting]);

  // Handle Nano Banana Rendering Simulation
  const handleNanoRender = () => {
    setNanoState('rendering');
    setNanoLogStep(0);
    setNanoProgress(0);

    // Increment progress and log messages
    const progressInterval = setInterval(() => {
      setNanoProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setNanoState('complete');
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    const logInterval = setInterval(() => {
      setNanoLogStep(prev => {
        if (prev >= nanoLogs.length - 1) {
          clearInterval(logInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  if (booting) {
    return (
      <div style={styles.bootContainer} className="tech-panel">
        <div className="scan-line"></div>
        <div style={styles.bootHeader}>
          <RefreshCw className="spin" size={24} color="var(--color-pink-orchid)" />
          <h2 style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>BOOTING MULTI-AGENT STUDIO...</h2>
        </div>
        <div style={styles.bootLogContainer}>
          {bootLogs.slice(0, bootStep + 1).map((log, idx) => (
            <div key={idx} style={styles.bootLogLine} className="mono-tag">
              <span style={{ color: 'var(--color-pink-orchid)' }}>&gt;</span> {log}
              {idx < bootStep && <span style={{ color: '#00ff66', marginLeft: '6px' }}>[OK]</span>}
            </div>
          ))}
        </div>
        <div style={styles.bootProgressTrack}>
          <div style={{ ...styles.bootProgressFill, width: `${(bootStep / (bootLogs.length - 1)) * 100}%` }}></div>
        </div>
      </div>
    );
  }

  const handleExportMarkdown = () => {
    const mdContent = `
# ARCHITECTURAL REVIEW REPORT: ${projectData.title.toUpperCase()}
**Location:** ${projectData.location}  
**Scale:** ${projectData.scale}  
**Overall Score:** ${review.directorSummary.overallScore}/10

---

## PROJECT UNDERSTANDING
*   **Type:** ${review.projectUnderstanding.type}
*   **Site Context:** ${review.projectUnderstanding.site}
*   **Goals:** ${review.projectUnderstanding.goals}
*   **Challenges:** ${review.projectUnderstanding.challenges}

---

## ARCHITECT AGENT REVIEW (Score: ${review.agents.architect.score}/10)
*   **Strengths:**
${review.agents.architect.strengths.map(s => `    - ${s}`).join('\n')}
*   **Weaknesses:**
${review.agents.architect.weaknesses.map(w => `    - ${w}`).join('\n')}
*   **Opportunities:**
${review.agents.architect.opportunities.map(o => `    - ${o}`).join('\n')}
*   **Precedent study:** ${review.agents.architect.precedent || 'N/A'}
*   **Suggested Form & Massing Edits:**
${(review.agents.architect.massingEdits || []).map((m, i) => `    ${i+1}. ${m.title}: ${m.description}`).join('\n')}

## SUSTAINABILITY AGENT REVIEW (Score: ${review.agents.sustainability.score}/10)
*   **Strengths:**
${review.agents.sustainability.strengths.map(s => `    - ${s}`).join('\n')}
*   **Weaknesses:**
${review.agents.sustainability.weaknesses.map(w => `    - ${w}`).join('\n')}
*   **Recommendations:**
${review.agents.sustainability.recommendations.map(r => `    - ${r}`).join('\n')}
*   **Precedent study:** ${review.agents.sustainability.precedent || 'N/A'}

## STRUCTURAL AGENT REVIEW (Score: ${review.agents.structural.score}/10)
*   **Strengths:**
${review.agents.structural.strengths.map(s => `    - ${s}`).join('\n')}
*   **Weaknesses:**
${review.agents.structural.weaknesses.map(w => `    - ${w}`).join('\n')}
*   **Recommendations:**
${review.agents.structural.recommendations.map(r => `    - ${r}`).join('\n')}
*   **Precedent study:** ${review.agents.structural.precedent || 'N/A'}

## USER EXPERIENCE AGENT REVIEW (Score: ${review.agents.ux.score}/10)
*   **Strengths:**
${review.agents.ux.strengths.map(s => `    - ${s}`).join('\n')}
*   **Weaknesses:**
${review.agents.ux.weaknesses.map(w => `    - ${w}`).join('\n')}
*   **Recommendations:**
${review.agents.ux.recommendations.map(r => `    - ${r}`).join('\n')}

---

## ARCHITECTURAL JURY REVIEW
*   **Critical Questions:**
${review.agents.jury.criticalQuestions.map((q, idx) => `    ${idx + 1}. ${q}`).join('\n')}
*   **Main Risks:**
${review.agents.jury.mainRisks.map(r => `    - ${r}`).join('\n')}

---

## DESIGN DIRECTOR SUMMARY
*   **Areas of Agreement:**
${review.directorSummary.areasOfAgreement.map(a => `    - ${a}`).join('\n')}
*   **Areas of Conflict:**
${review.directorSummary.areasOfConflict.map(c => `    - ${c}`).join('\n')}
*   **Priority Improvements:**
${review.directorSummary.priorityImprovements.map(p => `    - ${p}`).join('\n')}

## NEXT DESIGN ACTIONS
${review.nextActions.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}
    `;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.title.toLowerCase().replace(/\s+/g, '_')}_review_report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.dashboardGrid}>
      {/* Top Banner */}
      <div style={styles.banner} className="tech-panel">
        <div className="scan-line"></div>
        <div style={styles.bannerLeft}>
          <span className="mono-tag" style={{ color: 'var(--color-pink-orchid)' }}>[ ANALYSIS STAGE REPORT ]</span>
          <h2 style={styles.projectTitle}>{projectData.title}</h2>
          <p style={styles.projectLoc}>{projectData.location} // {projectData.scale}</p>
        </div>
        <div style={styles.bannerRight}>
          <div style={styles.overallCircle}>
            <span style={styles.overallScore}>{review.directorSummary.overallScore}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OVERALL</span>
          </div>
          <div style={styles.actions}>
            <button className="tech-btn" onClick={handleExportMarkdown} style={styles.actionBtn}>
              <Download size={14} style={{ marginRight: '6px' }} /> EXPORT MD
            </button>
            <button className="tech-btn" onClick={() => window.print()} style={styles.actionBtn}>
              <FileText size={14} style={{ marginRight: '6px' }} /> PRINT
            </button>
            <button className="tech-btn primary" onClick={onReset} style={styles.actionBtn}>
              NEW ANALYSIS
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={styles.layoutColumns} className="dashboard-columns-responsive">
        {/* Left Column: Visual Analytics */}
        <div style={styles.leftColumn}>
          <Diagrams projectData={{
            ...projectData,
            // If Nano Banana is complete, swap diagram overlay to show the refined image
            uploadedImage: nanoState === 'complete' ? '/holographic_refined.png' : projectData.uploadedImage
          }} />
          
          <div className="tech-panel" style={{ background: 'rgba(25, 10, 19, 0.2)' }}>
            <h3 style={styles.panelTitle} className="mono-tag">[ RADAR VECTORS ]</h3>
            <ScoreChart scores={review.directorSummary} />
          </div>
        </div>

        {/* Right Column: Tabbed Reviews */}
        <div style={styles.rightColumn}>
          {/* Tabs header */}
          <div style={styles.tabsHeader}>
            {['overview', 'architect', 'sustainability', 'structural', 'ux', 'jury'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tabBtn,
                  color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
                  borderColor: activeTab === tab ? 'var(--color-pink-orchid)' : 'transparent',
                  background: activeTab === tab ? 'rgba(80, 26, 49, 0.25)' : 'transparent'
                }}
                className="mono-tag"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="tech-panel" style={styles.tabContentPanel}>
            <div className="scan-line"></div>
            
            {activeTab === 'overview' && (
              <div style={styles.tabScrollable} className="glass-scroll">
                <h3 style={styles.sectionHeading}>DIRECTOR SUMMARY</h3>
                
                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag">[ AREAS OF AGREEMENT ]</h4>
                  <ul style={styles.list}>
                    {review.directorSummary.areasOfAgreement.map((item, i) => (
                      <li key={i} style={styles.listItem}>
                        <CheckCircle size={14} color="var(--color-pink-orchid)" style={styles.listIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag" style={{ color: 'var(--color-blush)' }}>
                    [ AREAS OF CONFLICT ]
                  </h4>
                  <ul style={styles.list}>
                    {review.directorSummary.areasOfConflict.map((item, i) => (
                      <li key={i} style={styles.listItem}>
                        <AlertTriangle size={14} color="var(--color-blush)" style={styles.listIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag">[ PRIORITY IMPROVEMENTS ]</h4>
                  <ul style={styles.list}>
                    {review.directorSummary.priorityImprovements.map((item, i) => (
                      <li key={i} style={styles.listItem}>
                        <ChevronRight size={14} color="var(--color-pink-orchid)" style={styles.listIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 style={{ ...styles.sectionHeading, marginTop: '2rem' }}>NEXT DESIGN ACTIONS</h3>
                <div style={styles.nextActionsList}>
                  {review.nextActions.map((item, idx) => (
                    <div key={idx} style={styles.actionCard} className="tech-panel">
                      <div style={styles.actionNum} className="mono-tag">0{idx + 1}</div>
                      <div style={styles.actionDesc}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'architect' && (
              <div style={styles.tabScrollable} className="glass-scroll">
                <div style={styles.agentHeader}>
                  <h3 style={styles.agentTitle}>ARCHITECT AGENT EVALUATION</h3>
                  <div style={styles.agentScorePill} className="tech-panel">
                    <span className="mono-tag" style={{ fontSize: '0.6rem' }}>RATING:</span>
                    <span style={styles.agentScoreVal}>{review.agents.architect.score}/10</span>
                  </div>
                </div>

                {/* Standard Strengths/Weaknesses */}
                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag" style={{ color: '#00ff66' }}>[ CRITICAL STRENGTHS ]</h4>
                  <ul style={styles.list}>
                    {review.agents.architect.strengths.map((item, i) => (
                      <li key={i} style={styles.listItem}>
                        <CheckCircle size={14} color="#00ff66" style={styles.listIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag" style={{ color: 'var(--color-blush)' }}>[ SYSTEM WEAKNESSES ]</h4>
                  <ul style={styles.list}>
                    {review.agents.architect.weaknesses.map((item, i) => (
                      <li key={i} style={styles.listItem}>
                        <AlertTriangle size={14} color="var(--color-blush)" style={styles.listIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FORM & MASSING DETAILED EDITS */}
                <h3 style={{ ...styles.sectionHeading, marginTop: '2rem' }}>FORM & MASSING EVALUATION</h3>
                <div style={styles.nextActionsList}>
                  {(review.agents.architect.massingEdits || []).map((edit, idx) => (
                    <div key={idx} style={styles.massingCard} className="tech-panel">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                        <Layers size={14} color="var(--color-pink-orchid)" />
                        <span className="mono-tag" style={{ fontSize: '0.75rem', color: '#ffffff' }}>
                          EDIT 0{idx + 1}: {edit.title}
                        </span>
                      </div>
                      <div style={styles.massingDesc}>{edit.description}</div>
                    </div>
                  ))}
                </div>

                {/* NANO BANANA VISUAL RE-IMAGINING ENGINE */}
                <div style={styles.nanoContainer} className="tech-panel">
                  <div className="scan-line"></div>
                  
                  <div style={styles.nanoHeader}>
                    <Cpu size={16} color="var(--color-pink-orchid)" />
                    <span className="mono-tag" style={{ color: '#ffffff', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                      NANO BANANA // FORM RE-IMAGINING ENGINE
                    </span>
                  </div>

                  {nanoState === 'idle' && (
                    <div style={styles.nanoBody}>
                      <p style={styles.nanoText}>
                        The Architect Agent has generated volumetric adjustments. Run the <strong>NANO BANANA</strong> shader compilation to synthesize a refined visual pavilion model.
                      </p>
                      <button 
                        type="button" 
                        className="tech-btn primary" 
                        onClick={handleNanoRender}
                        style={styles.nanoBtn}
                      >
                        <Sparkles size={14} style={{ marginRight: '6px' }} /> GENERATE REFINED MASSING
                      </button>
                    </div>
                  )}

                  {nanoState === 'rendering' && (
                    <div style={styles.nanoBody}>
                      <div style={styles.terminalPanel}>
                        <div style={styles.terminalHeader}>
                          <span className="mono-tag" style={{ fontSize: '0.6rem', opacity: 0.5 }}>GPU CLUSTER UPLINK ACTIVE</span>
                          <span style={styles.terminalLoader} className="spin"></span>
                        </div>
                        <div style={styles.terminalConsole}>
                          {nanoLogs.slice(0, nanoLogStep + 1).map((log, idx) => (
                            <div key={idx} style={styles.terminalLine} className="mono-tag">
                              &gt; {log} {idx < nanoLogStep && <span style={{ color: '#00ff66' }}>[DONE]</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Glowing progress bar */}
                      <div style={styles.progressContainer}>
                        <div className="mono-tag" style={{ fontSize: '0.65rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>COMPUTING RENDER BUFFER</span>
                          <span>{Math.round(nanoProgress)}%</span>
                        </div>
                        <div style={styles.progressBarTrack}>
                          <div style={{ ...styles.progressBarFill, width: `${nanoProgress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {nanoState === 'complete' && (
                    <div style={styles.nanoBody}>
                      <p style={styles.nanoText}>
                        <strong>Visual synthesis successful.</strong> The model has been re-imagined with stepped-roof volumetric contours and stilted floor grids, resolving convective thermal currents and flood loading.
                      </p>

                      {/* Before / After side-by-side view */}
                      <div style={styles.comparisonGrid}>
                        <div style={styles.comparisonCard} className="tech-panel">
                          <span className="mono-tag" style={styles.comparisonTag}>[ ORIGINAL MASSING ]</span>
                          <img 
                            src={projectData.uploadedImage || "/holographic_pavilion.png"} 
                            alt="Original design" 
                            style={styles.comparisonImg} 
                          />
                        </div>
                        <div style={styles.comparisonCard} className="tech-panel" style={{ ...styles.comparisonCard, borderColor: 'var(--color-pink-orchid)', boxShadow: 'var(--glow-shadow)' }}>
                          <span className="mono-tag" style={{ ...styles.comparisonTag, color: 'var(--color-pink-orchid)' }}>
                            [ NANO BANANA REFINED ]
                          </span>
                          <img 
                            src="/holographic_refined.png" 
                            alt="Refined stepped-roof design" 
                            style={styles.comparisonImg} 
                          />
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="tech-btn" 
                        onClick={() => setNanoState('idle')}
                        style={{ ...styles.nanoBtn, width: 'auto', alignSelf: 'flex-end', marginTop: '0.5rem' }}
                      >
                        <LoopIcon size={12} style={{ marginRight: '6px' }} /> RE-RUN PIPELINE
                      </button>
                    </div>
                  )}
                </div>

                {review.agents.architect.precedent && (
                  <div style={styles.precedentBox} className="tech-panel">
                    <div className="mono-tag" style={{ fontSize: '0.65rem', color: 'var(--color-blush)' }}>
                      [ PRECEDENT STUDY INSPIRATION ]
                    </div>
                    <div style={styles.precedentTitle}>{review.agents.architect.precedent}</div>
                  </div>
                )}
              </div>
            )}

            {['sustainability', 'structural', 'ux'].map((agentName) => {
              if (activeTab !== agentName) return null;
              const agentData = review.agents[agentName];
              return (
                <div key={agentName} style={styles.tabScrollable} className="glass-scroll">
                  <div style={styles.agentHeader}>
                    <h3 style={styles.agentTitle}>{agentName.toUpperCase()} AGENT EVALUATION</h3>
                    <div style={styles.agentScorePill} className="tech-panel">
                      <span className="mono-tag" style={{ fontSize: '0.6rem' }}>RATING:</span>
                      <span style={styles.agentScoreVal}>{agentData.score}/10</span>
                    </div>
                  </div>

                  <div style={styles.sectionBox}>
                    <h4 style={styles.boxTitle} className="mono-tag" style={{ color: '#00ff66' }}>[ CRITICAL STRENGTHS ]</h4>
                    <ul style={styles.list}>
                      {agentData.strengths.map((item, i) => (
                        <li key={i} style={styles.listItem}>
                          <CheckCircle size={14} color="#00ff66" style={styles.listIcon} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={styles.sectionBox}>
                    <h4 style={styles.boxTitle} className="mono-tag" style={{ color: 'var(--color-blush)' }}>[ SYSTEM WEAKNESSES ]</h4>
                    <ul style={styles.list}>
                      {agentData.weaknesses.map((item, i) => (
                        <li key={i} style={styles.listItem}>
                          <AlertTriangle size={14} color="var(--color-blush)" style={styles.listIcon} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {agentData.recommendations && (
                    <div style={styles.sectionBox}>
                      <h4 style={styles.boxTitle} className="mono-tag">[ TECHNICAL RECOMMENDATIONS ]</h4>
                      <ul style={styles.list}>
                        {agentData.recommendations.map((item, i) => (
                          <li key={i} style={styles.listItem}>
                            <ChevronRight size={14} color="var(--color-pink-orchid)" style={styles.listIcon} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {agentData.precedent && (
                    <div style={styles.precedentBox} className="tech-panel">
                      <div className="mono-tag" style={{ fontSize: '0.65rem', color: 'var(--color-blush)' }}>
                        [ PRECEDENT STUDY INSPIRATION ]
                      </div>
                      <div style={styles.precedentTitle}>{agentData.precedent}</div>
                    </div>
                  )}
                </div>
              );
            })}

            {activeTab === 'jury' && (
              <div style={styles.tabScrollable} className="glass-scroll">
                <div style={styles.agentHeader}>
                  <h3 style={{ ...styles.agentTitle, color: 'var(--color-blush)' }}>ARCHITECTURAL JURY PANEL</h3>
                  <div style={{ ...styles.agentScorePill, borderColor: 'var(--color-blush)' }} className="tech-panel">
                    <span className="mono-tag" style={{ color: 'var(--color-blush)', fontSize: '0.65rem' }}>CRITIQUE STAGE</span>
                  </div>
                </div>

                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag" style={{ color: 'var(--color-pink-orchid)' }}>
                    [ CRITICAL QUESTIONS TO ANSWER ]
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    The designer must address these assumptions before competition review or technical sign-off:
                  </p>
                  <div style={styles.questionsGrid}>
                    {review.agents.jury.criticalQuestions.map((q, idx) => (
                      <div key={idx} style={styles.questionCard} className="tech-panel">
                        <div style={styles.questionHead}>
                          <HelpCircle size={14} color="var(--color-pink-orchid)" />
                          <span className="mono-tag" style={{ fontSize: '0.65rem' }}>QUESTION 0{idx + 1}</span>
                        </div>
                        <div style={styles.questionText}>{q}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.sectionBox}>
                  <h4 style={styles.boxTitle} className="mono-tag" style={{ color: 'var(--color-blush)' }}>
                    [ CORE PROJECT RISKS ]
                  </h4>
                  <ul style={styles.list}>
                    {review.agents.jury.mainRisks.map((item, i) => (
                      <li key={i} style={styles.listItem}>
                        <ShieldAlert size={14} color="var(--color-blush)" style={styles.listIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bootContainer: {
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '600px',
    margin: '4rem auto',
    background: 'rgba(25, 10, 19, 0.4)',
    border: '1px solid var(--color-mulberry)'
  },
  bootHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#ffffff'
  },
  bootLogContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minHeight: '180px',
    background: '#090206',
    padding: '1.25rem',
    borderRadius: '2px',
    border: '1px solid rgba(241, 178, 204, 0.05)',
    overflowY: 'auto'
  },
  bootLogLine: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    letterSpacing: '0.02em'
  },
  bootProgressTrack: {
    width: '100%',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  bootProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-berry), var(--color-pink-orchid))',
    transition: 'width 0.2s ease-in-out'
  },
  dashboardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%'
  },
  banner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    padding: '1.5rem 2rem',
    background: 'rgba(42, 17, 32, 0.15)'
  },
  bannerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  projectTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: '1.2'
  },
  projectLoc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  bannerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  overallCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    border: '2px solid var(--color-pink-orchid)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(80, 26, 49, 0.2)',
    boxShadow: 'var(--glow-shadow)',
    textAlign: 'center'
  },
  overallScore: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem'
  },
  actionBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center'
  },
  layoutColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  panelTitle: {
    fontSize: '0.75rem',
    color: 'var(--color-pink-orchid)',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(200, 82, 124, 0.1)',
    paddingBottom: '0.5rem'
  },
  tabsHeader: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    borderBottom: '1px solid rgba(200, 82, 124, 0.1)',
    paddingBottom: '2px'
  },
  tabBtn: {
    padding: '0.6rem 1rem',
    fontSize: '0.7rem',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap'
  },
  tabContentPanel: {
    padding: '2rem',
    minHeight: '500px',
    background: 'rgba(25, 10, 19, 0.2)'
  },
  tabScrollable: {
    maxHeight: '680px',
    overflowY: 'auto'
  },
  sectionHeading: {
    fontSize: '1.1rem',
    letterSpacing: '0.05em',
    color: '#ffffff',
    marginBottom: '1.25rem',
    borderLeft: '3px solid var(--color-pink-orchid)',
    paddingLeft: '0.75rem'
  },
  sectionBox: {
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  boxTitle: {
    fontSize: '0.7rem',
    color: 'var(--color-pink-orchid)',
    marginBottom: '0.25rem'
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'var(--text-primary)'
  },
  listIcon: {
    marginTop: '3px',
    flexShrink: 0
  },
  nextActionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  actionCard: {
    display: 'flex',
    gap: '1.25rem',
    padding: '1rem',
    background: 'rgba(15, 5, 11, 0.4)',
    alignItems: 'center'
  },
  actionNum: {
    fontSize: '1.1rem',
    color: 'var(--color-pink-orchid)',
    fontWeight: '600'
  },
  actionDesc: {
    fontSize: '0.85rem',
    color: '#ffffff',
    lineHeight: '1.4'
  },
  massingCard: {
    padding: '1rem',
    background: 'rgba(15, 5, 11, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '2px solid var(--color-blush)'
  },
  massingDesc: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'var(--text-primary)'
  },
  nanoContainer: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(15, 5, 11, 0.6)',
    borderColor: 'var(--color-mulberry)'
  },
  nanoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(241, 178, 204, 0.1)',
    paddingBottom: '0.75rem',
    marginBottom: '1rem'
  },
  nanoBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  nanoText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)'
  },
  nanoBtn: {
    width: '100%',
    padding: '0.65rem 1rem',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  terminalPanel: {
    background: '#090206',
    border: '1px solid rgba(241, 178, 204, 0.08)',
    borderRadius: '2px',
    padding: '1rem',
    fontFamily: 'var(--font-mono)'
  },
  terminalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.25rem'
  },
  terminalConsole: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    minHeight: '120px'
  },
  terminalLine: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.3'
  },
  terminalLoader: {
    width: '10px',
    height: '10px',
    border: '1px solid var(--color-pink-orchid)',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block'
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  progressBarTrack: {
    width: '100%',
    height: '3px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '1.5px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-berry), var(--color-pink-orchid))',
    transition: 'width 0.1s linear'
  },
  comparisonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap'
  },
  comparisonCard: {
    background: 'rgba(9, 2, 6, 0.8)',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'center'
  },
  comparisonTag: {
    fontSize: '0.55rem',
    color: 'var(--text-muted)'
  },
  comparisonImg: {
    width: '100%',
    height: '110px',
    objectFit: 'contain',
    background: '#040103',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '2px'
  },
  agentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.75rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  agentTitle: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: '0.02em'
  },
  agentScorePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.4rem 0.8rem',
    borderColor: 'var(--color-pink-orchid)',
    background: 'rgba(80, 26, 49, 0.15)'
  },
  agentScoreVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff'
  },
  precedentBox: {
    background: 'rgba(80, 26, 49, 0.1)',
    borderColor: 'var(--color-mulberry)',
    padding: '1.25rem',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  precedentTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff'
  },
  questionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  questionCard: {
    padding: '1rem',
    background: 'rgba(15, 5, 11, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    borderLeft: '2px solid var(--color-pink-orchid)'
  },
  questionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--color-pink-orchid)'
  },
  questionText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#ffffff'
  }
};

if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (min-width: 992px) {
      .dashboard-columns-responsive {
        grid-template-columns: 4fr 5fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
