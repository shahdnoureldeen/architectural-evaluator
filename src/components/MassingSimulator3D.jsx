import React, { useState } from 'react';
import { Compass, RotateCw, RefreshCw, Layers, Sliders, Eye } from 'lucide-react';

export default function MassingSimulator3D() {
  const [typology, setTypology] = useState('stilted'); // 'stilted', 'stepped', 'subterranean'
  const [rotateX, setRotateX] = useState(65); // pitch: 20 to 85
  const [rotateZ, setRotateZ] = useState(-45); // yaw: -180 to 180
  
  // Sizing controllers
  const [scaleX, setScaleX] = useState(1.0); // Width scale
  const [scaleY, setScaleY] = useState(1.0); // Depth scale
  const [scaleZ, setScaleZ] = useState(1.0); // Height scale
  const [stilts, setStilts] = useState(30);   // Stilt elevation height (for stilted pavilion)
  
  // Toggles
  const [showVectors, setShowVectors] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const resetControls = () => {
    setRotateX(65);
    setRotateZ(-45);
    setScaleX(1.0);
    setScaleY(1.0);
    setScaleZ(1.0);
    setStilts(30);
  };

  // CSS 3D Cube face rendering helper
  const Cube = ({ x, y, z, w, h, d, color = 'var(--color-pink-orchid)', bg = 'rgba(200, 82, 124, 0.08)' }) => {
    // Face styling
    const faceStyle = {
      position: 'absolute',
      border: `1px solid ${color}`,
      background: bg,
      boxShadow: `0 0 10px rgba(241, 178, 204, 0.12)`,
      backfaceVisibility: 'visible',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '6px',
      color: 'rgba(255,255,255,0.2)',
      fontFamily: 'var(--font-mono)'
    };

    return (
      <div 
        style={{
          position: 'absolute',
          width: `${w}px`,
          height: `${h}px`,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${x}px, ${y}px, ${z}px)`
        }}
      >
        {/* Front face */}
        <div style={{ 
          ...faceStyle, 
          width: `${w}px`, 
          height: `${h}px`, 
          transform: `rotateX(0deg) translateZ(${d / 2}px)` 
        }}></div>

        {/* Back face */}
        <div style={{ 
          ...faceStyle, 
          width: `${w}px`, 
          height: `${h}px`, 
          transform: `rotateY(180deg) translateZ(${d / 2}px)` 
        }}></div>

        {/* Left face */}
        <div style={{ 
          ...faceStyle, 
          width: `${d}px`, 
          height: `${h}px`, 
          transform: `rotateY(-90deg) translateZ(${w / 2}px)` 
        }}></div>

        {/* Right face */}
        <div style={{ 
          ...faceStyle, 
          width: `${d}px`, 
          height: `${h}px`, 
          transform: `rotateY(90deg) translateZ(${w / 2}px)` 
        }}></div>

        {/* Top face */}
        <div style={{ 
          ...faceStyle, 
          width: `${w}px`, 
          height: `${d}px`, 
          transform: `rotateX(90deg) translateZ(${h / 2}px)` 
        }}></div>

        {/* Bottom face */}
        <div style={{ 
          ...faceStyle, 
          width: `${w}px`, 
          height: `${d}px`, 
          transform: `rotateX(-90deg) translateZ(${h / 2}px)` 
        }}></div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.simulatorLayout} className="dashboard-columns-responsive">
        {/* Left Column: Viewport */}
        <div className="tech-panel" style={styles.viewportBox}>
          <div className="scan-line" style={{ height: '3px', opacity: 0.15 }}></div>
          <span className="mono-tag" style={styles.viewportTitle}>
            [ CSS-3D VIEWPORT // TYPOLOGY: {typology.toUpperCase()} ]
          </span>

          <div style={styles.viewportContainer}>
            {/* Viewport 3D Canvas wrapper */}
            <div 
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '800px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Ground & Rotational wrapper */}
              <div 
                style={{
                  position: 'relative',
                  width: '300px',
                  height: '300px',
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* 3D Grid Floor */}
                {showGrid && (
                  <div style={styles.gridFloor}>
                    {/* Compass Ring */}
                    <div style={styles.compassRing}>
                      <span className="mono-tag" style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', fontSize: '8px' }}>N</span>
                      <span className="mono-tag" style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', fontSize: '8px' }}>S</span>
                      <span className="mono-tag" style={{ position: 'absolute', left: '2px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: '8px' }}>W</span>
                      <span className="mono-tag" style={{ position: 'absolute', right: '2px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '8px' }}>E</span>
                    </div>
                  </div>
                )}

                {/* --- 3D Cubes based on Typology --- */}
                <div style={{ position: 'absolute', left: '150px', top: '150px', transformStyle: 'preserve-3d' }}>
                  {typology === 'stilted' && (
                    <>
                      {/* Pillars / Columns */}
                      {showGrid && (
                        <>
                          <div style={{ ...styles.stiltColumn, transform: `translate3d(-40px, -40px, 0) rotateX(90deg)`, height: `${stilts}px` }} />
                          <div style={{ ...styles.stiltColumn, transform: `translate3d(40px, -40px, 0) rotateX(90deg)`, height: `${stilts}px` }} />
                          <div style={{ ...styles.stiltColumn, transform: `translate3d(-40px, 40px, 0) rotateX(90deg)`, height: `${stilts}px` }} />
                          <div style={{ ...styles.stiltColumn, transform: `translate3d(40px, 40px, 0) rotateX(90deg)`, height: `${stilts}px` }} />
                        </>
                      )}
                      
                      {/* Main Elevated Pavilion */}
                      <Cube 
                        x={0} 
                        y={0} 
                        z={stilts + (40 * scaleZ) / 2} 
                        w={120 * scaleX} 
                        d={120 * scaleY} 
                        h={40 * scaleZ} 
                        color="var(--color-pink-orchid)"
                        bg="rgba(200, 82, 124, 0.12)"
                      />

                      {/* Secondary R&D module stacked on top */}
                      <Cube 
                        x={-20 * scaleX} 
                        y={-20 * scaleY} 
                        z={stilts + (40 * scaleZ) + (30 * scaleZ) / 2} 
                        w={60 * scaleX} 
                        d={60 * scaleY} 
                        h={30 * scaleZ} 
                        color="#00ff66"
                        bg="rgba(0, 255, 102, 0.08)"
                      />
                    </>
                  )}

                  {typology === 'stepped' && (
                    <>
                      {/* Stepped volumetric blocks (Low, Medium, High) */}
                      {/* Block 1: Large Base */}
                      <Cube 
                        x={-40 * scaleX} 
                        y={0} 
                        z={(30 * scaleZ) / 2} 
                        w={60 * scaleX} 
                        d={120 * scaleY} 
                        h={30 * scaleZ} 
                        color="var(--color-pink-orchid)"
                      />

                      {/* Block 2: Medium Middle */}
                      <Cube 
                        x={10 * scaleX} 
                        y={0} 
                        z={(50 * scaleZ) / 2} 
                        w={40 * scaleX} 
                        d={100 * scaleY} 
                        h={50 * scaleZ} 
                        color="#00ff66"
                      />

                      {/* Block 3: Tall Tower */}
                      <Cube 
                        x={50 * scaleX} 
                        y={0} 
                        z={(80 * scaleZ) / 2} 
                        w={40 * scaleX} 
                        d={80 * scaleY} 
                        h={80 * scaleZ} 
                        color="#a855f7"
                        bg="rgba(168, 85, 247, 0.08)"
                      />
                    </>
                  )}

                  {typology === 'subterranean' && (
                    <>
                      {/* Cliff face backdrop representation */}
                      <div style={styles.cliffFace}></div>

                      {/* Excavated Cave void (drawn as darker dotted cube) */}
                      <Cube 
                        x={0} 
                        y={-30 * scaleY} 
                        z={40 * scaleZ} 
                        w={90 * scaleX} 
                        d={60 * scaleY} 
                        h={60 * scaleZ} 
                        color="var(--color-blush)"
                        bg="rgba(200, 82, 124, 0.02)"
                      />

                      {/* Projection Pavilion cantilevered out */}
                      <Cube 
                        x={0} 
                        y={20 * scaleY} 
                        z={40 * scaleZ} 
                        w={70 * scaleX} 
                        d={60 * scaleY} 
                        h={40 * scaleZ} 
                        color="#00ff66"
                      />
                    </>
                  )}
                </div>

                {/* Animated wind vector streams flowing around the massing */}
                {showVectors && (
                  <div style={styles.windFlowWrapper}>
                    <div style={{ ...styles.windVector, top: '40px', animationDelay: '0s' }}></div>
                    <div style={{ ...styles.windVector, top: '90px', animationDelay: '0.4s' }}></div>
                    <div style={{ ...styles.windVector, top: '150px', animationDelay: '0.8s' }}></div>
                    <div style={{ ...styles.windVector, top: '210px', animationDelay: '1.2s' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Typology Selector */}
          <div className="tech-panel" style={styles.controlBox}>
            <span className="mono-tag" style={styles.boxTitle}>[ CHOOSE TYPOLOGY SCHEMA ]</span>
            <div style={styles.typologyGrid}>
              {[
                { id: 'stilted', name: 'Stilted Pavilion', desc: 'Elevated platform raised on piling grids.' },
                { id: 'stepped', name: 'Stepped Envelope', desc: 'Stepped volumetric modules venting high wind.' },
                { id: 'subterranean', name: 'Subterranean Carve', desc: 'Cantilevered boxes anchored into cliff rock.' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setTypology(t.id); resetControls(); }}
                  style={{
                    ...styles.typeBtn,
                    borderColor: typology === t.id ? 'var(--color-pink-orchid)' : 'var(--panel-border)',
                    background: typology === t.id ? 'rgba(80, 26, 49, 0.25)' : 'rgba(15, 5, 11, 0.4)',
                    display: 'block',
                    width: '100%'
                  }}
                >
                  <span className="mono-tag" style={{ fontWeight: 'bold', fontSize: '0.85rem', color: typology === t.id ? '#ffffff' : 'var(--text-secondary)' }}>
                    {t.name.toUpperCase()}
                  </span>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension sliders */}
          <div className="tech-panel" style={styles.controlBox}>
            <span className="mono-tag" style={styles.boxTitle}>[ PARAMETRIC DIMENSION SLIDERS ]</span>
            <div style={styles.slidersList}>
              <div style={styles.sliderGroup}>
                <div style={styles.sliderLabelRow}>
                  <span className="mono-tag" style={styles.sliderLabel}>VIEWPORT YAW (Z-ROTATION)</span>
                  <span style={styles.sliderVal} className="mono-tag">{rotateZ}°</span>
                </div>
                <input 
                  type="range" min="-180" max="180" value={rotateZ} 
                  onChange={(e) => setRotateZ(parseInt(e.target.value))} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.sliderGroup}>
                <div style={styles.sliderLabelRow}>
                  <span className="mono-tag" style={styles.sliderLabel}>VIEWPORT PITCH (X-ROTATION)</span>
                  <span style={styles.sliderVal} className="mono-tag">{rotateX}°</span>
                </div>
                <input 
                  type="range" min="20" max="85" value={rotateX} 
                  onChange={(e) => setRotateX(parseInt(e.target.value))} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.sliderGroup}>
                <div style={styles.sliderLabelRow}>
                  <span className="mono-tag" style={styles.sliderLabel}>MASSING WIDTH (X-SCALE)</span>
                  <span style={styles.sliderVal} className="mono-tag">{scaleX.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="1.8" step="0.05" value={scaleX} 
                  onChange={(e) => setScaleX(parseFloat(e.target.value))} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.sliderGroup}>
                <div style={styles.sliderLabelRow}>
                  <span className="mono-tag" style={styles.sliderLabel}>MASSING DEPTH (Y-SCALE)</span>
                  <span style={styles.sliderVal} className="mono-tag">{scaleY.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="1.8" step="0.05" value={scaleY} 
                  onChange={(e) => setScaleY(parseFloat(e.target.value))} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.sliderGroup}>
                <div style={styles.sliderLabelRow}>
                  <span className="mono-tag" style={styles.sliderLabel}>MASSING HEIGHT (Z-SCALE)</span>
                  <span style={styles.sliderVal} className="mono-tag">{scaleZ.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="1.8" step="0.05" value={scaleZ} 
                  onChange={(e) => setScaleZ(parseFloat(e.target.value))} 
                  style={styles.rangeInput}
                />
              </div>

              {typology === 'stilted' && (
                <div style={styles.sliderGroup}>
                  <div style={styles.sliderLabelRow}>
                    <span className="mono-tag" style={styles.sliderLabel}>STILT ELEVATION (Z-OFFSET)</span>
                    <span style={styles.sliderVal} className="mono-tag">{stilts}px</span>
                  </div>
                  <input 
                    type="range" min="10" max="60" value={stilts} 
                    onChange={(e) => setStilts(parseInt(e.target.value))} 
                    style={styles.rangeInput}
                  />
                </div>
              )}
            </div>

            <div style={styles.toggleRow}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" checked={showVectors} 
                  onChange={() => setShowVectors(prev => !prev)} 
                  style={styles.checkboxInput}
                />
                <span className="mono-tag" style={{ fontSize: '0.65rem' }}>SHOW WIND FLOW</span>
              </label>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" checked={showGrid} 
                  onChange={() => setShowGrid(prev => !prev)} 
                  style={styles.checkboxInput}
                />
                <span className="mono-tag" style={{ fontSize: '0.65rem' }}>SHOW COMPASS GRID</span>
              </label>
              <button 
                type="button" onClick={resetControls} 
                style={styles.resetBtn} className="mono-tag"
              >
                RESET VIEW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%'
  },
  sectionHeading: {
    fontSize: '1.1rem',
    letterSpacing: '0.05em',
    color: '#ffffff',
    borderLeft: '3px solid var(--color-pink-orchid)',
    paddingLeft: '0.75rem',
    marginBottom: '0.25rem'
  },
  sectionDesc: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    maxWidth: '720px'
  },
  simulatorLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  },
  viewportBox: {
    padding: '1.5rem',
    background: 'rgba(25, 10, 19, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    minHeight: '400px'
  },
  viewportTitle: {
    fontSize: '0.65rem',
    color: 'var(--color-pink-orchid)'
  },
  viewportContainer: {
    width: '100%',
    height: '340px',
    background: '#090206',
    border: '1px solid rgba(241, 178, 204, 0.05)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative'
  },
  gridFloor: {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '300px',
    height: '300px',
    border: '1px solid rgba(0, 255, 102, 0.15)',
    backgroundImage: `linear-gradient(rgba(0, 255, 102, 0.03) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(0, 255, 102, 0.03) 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
    backgroundPosition: 'center center',
    transform: 'translateZ(0)',
    borderRadius: '2px'
  },
  compassRing: {
    position: 'absolute',
    left: '50px',
    top: '50px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '1px dashed rgba(0, 255, 102, 0.08)',
    pointerEvents: 'none'
  },
  stiltColumn: {
    position: 'absolute',
    left: '150px',
    top: '150px',
    width: '1px',
    borderLeft: '1px dashed #00ff66',
    boxShadow: '0 0 4px #00ff66',
    transformOrigin: 'top center'
  },
  cliffFace: {
    position: 'absolute',
    left: '-100px',
    top: '-70px',
    width: '200px',
    height: '10px',
    background: 'rgba(200, 82, 124, 0.03)',
    borderBottom: '1px solid var(--color-blush)',
    boxShadow: '0 0 8px var(--color-blush)',
    transform: 'rotateX(90deg) translateZ(40px)',
    transformOrigin: 'bottom center'
  },
  windFlowWrapper: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    pointerEvents: 'none',
    transform: 'translateZ(20px)',
    transformStyle: 'preserve-3d'
  },
  windVector: {
    position: 'absolute',
    left: '0px',
    width: '30px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #00ff66)',
    boxShadow: '0 0 5px #00ff66',
    animation: 'wind-flow 2s infinite linear'
  },
  controlBox: {
    padding: '1.25rem',
    background: 'rgba(25, 10, 19, 0.15)'
  },
  boxTitle: {
    fontSize: '0.65rem',
    color: 'var(--color-pink-orchid)',
    marginBottom: '0.75rem',
    display: 'block'
  },
  typologyGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  typeBtn: {
    padding: '0.6rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease'
  },
  slidersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  sliderGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  sliderLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem'
  },
  sliderLabel: {
    color: 'var(--text-secondary)'
  },
  sliderVal: {
    color: 'var(--color-pink-orchid)',
    fontWeight: 'bold'
  },
  rangeInput: {
    accentColor: 'var(--color-pink-orchid)',
    cursor: 'pointer',
    height: '3px',
    width: '100%',
    margin: '4px 0'
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.25rem',
    flexWrap: 'wrap',
    borderTop: '1px solid rgba(241, 178, 204, 0.08)',
    paddingTop: '1rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    color: 'var(--text-secondary)'
  },
  checkboxInput: {
    accentColor: 'var(--color-pink-orchid)',
    cursor: 'pointer'
  },
  resetBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-blush)',
    cursor: 'pointer',
    fontSize: '0.65rem',
    marginLeft: 'auto',
    textDecoration: 'underline'
  }
};

// Insert wind vector flow animations dynamically
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes wind-flow {
      0% {
        transform: translate3d(0px, 0, 0);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.8;
      }
      100% {
        transform: translate3d(270px, 0, 0);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
