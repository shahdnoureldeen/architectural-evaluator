import React, { useState } from 'react';
import { STRUCTURAL_SYSTEMS, FOUNDATION_TYPES } from '../services/geminiService';

export default function Diagrams({ projectData }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const sysName = STRUCTURAL_SYSTEMS[projectData.structuralSystem] || "Modular stilted system";
  const foundName = FOUNDATION_TYPES[projectData.foundationType] || "Low-impact anchors";
  
  // Define HUD callout points on the holographic/custom image
  // coordinates are percentages (0-100) relative to the center panel
  const nodes = [
    {
      id: "structure",
      title: "SUPERSTRUCTURE / TECTONIC",
      coord: { x: 50, y: 35 },
      lineEnd: { x: 82, y: 22 },
      desc: sysName,
      tip: "Analyzed for dead-load ratios, structural safety, and material efficiency."
    },
    {
      id: "foundation",
      title: "FOUNDATIONAL GRID",
      coord: { x: 48, y: 78 },
      lineEnd: { x: 18, y: 82 },
      desc: foundName,
      tip: "Evaluated against local site soil bearing capacities and settlement risk."
    },
    {
      id: "climatology",
      title: "THERMAL ENVELOPE",
      coord: { x: 32, y: 45 },
      lineEnd: { x: 15, y: 28 },
      desc: projectData.climate ? `Climate: ${projectData.climate}` : "Passive thermal insulation",
      tip: "Optimized for solar orientation, wind flow patterns, and thermal comfort."
    },
    {
      id: "ecology",
      title: "CIRCULAR FEEDSTOCK",
      coord: { x: 62, y: 60 },
      lineEnd: { x: 82, y: 75 },
      desc: projectData.materials ? `Material: ${projectData.materials.split(',')[0]}` : "Recycled building systems",
      tip: "Designed for circular economy lifecycles and reduced carbon footprint."
    }
  ];

  // Center canvas source image (default holographic pavilion vs custom upload)
  const bgImageSrc = projectData.uploadedImage || "/holographic_pavilion.png";

  return (
    <div style={styles.container}>
      <div style={styles.hudHeader}>
        <span className="mono-tag" style={{ color: 'var(--color-pink-orchid)' }}>
          [ TELEMETRY MODEL // {projectData.uploadedImage ? 'CUSTOM DESIGN UPLINK' : 'HOLOGRAPHIC BLUEPRINT'} ]
        </span>
        <div style={styles.hudSub}>
          {projectData.uploadedImage 
            ? "Overlaying interactive structural callouts on your uploaded sketch" 
            : "Interactive structural & environmental node coordinates"}
        </div>
      </div>

      <div style={styles.canvasContainer}>
        {/* Main Canvas Image */}
        <img 
          src={bgImageSrc} 
          alt="Architectural project telemetry design model" 
          style={styles.bgImage}
        />

        {/* Cyber Scanning Overlay */}
        <div className="scan-line" style={{ height: '4px', opacity: '0.45' }}></div>

        {/* SVG overlay for drawing HUD connection lines */}
        <svg style={styles.svgOverlay}>
          {nodes.map((n) => {
            const isHovered = hoveredNode === n.id;
            return (
              <g key={n.id}>
                {/* Connection line */}
                <path
                  d={`M ${n.coord.x}% ${n.coord.y}% L ${n.lineEnd.x}% ${n.lineEnd.y}%`}
                  fill="none"
                  stroke={isHovered ? "var(--color-blush)" : "rgba(200, 82, 124, 0.3)"}
                  strokeWidth={isHovered ? "1.5" : "1"}
                  strokeDasharray={isHovered ? "none" : "2,2"}
                  style={{ transition: 'all 0.3s ease' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Node Points (Rings) */}
        {nodes.map((n) => {
          const isHovered = hoveredNode === n.id;
          return (
            <div
              key={n.id}
              style={{
                ...styles.pulseNode,
                left: `${n.coord.x}%`,
                top: `${n.coord.y}%`,
              }}
              onMouseEnter={() => setHoveredNode(n.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div 
                style={{
                  ...styles.nodeDot,
                  transform: isHovered ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%)',
                  background: isHovered ? '#ffffff' : 'var(--color-pink-orchid)',
                  boxShadow: isHovered ? '0 0 12px #ffffff' : '0 0 8px var(--color-pink-orchid)'
                }}
              ></div>
              <div style={styles.nodeRipple}></div>
            </div>
          );
        })}

        {/* Floating Callout Text Boxes */}
        {nodes.map((n) => {
          const isHovered = hoveredNode === n.id;
          const isLeft = n.lineEnd.x < 50;
          return (
            <div
              key={n.id}
              className="tech-panel"
              style={{
                ...styles.calloutCard,
                left: `${n.lineEnd.x}%`,
                top: `${n.lineEnd.y}%`,
                transform: isLeft ? 'translate(-10%, -50%)' : 'translate(-90%, -50%)',
                borderColor: isHovered ? 'var(--color-pink-orchid)' : 'var(--panel-border)',
                background: isHovered ? 'rgba(80, 26, 49, 0.45)' : 'rgba(25, 10, 19, 0.6)',
                boxShadow: isHovered ? 'var(--glow-shadow)' : 'none'
              }}
              onMouseEnter={() => setHoveredNode(n.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="mono-tag" style={styles.cardTag}>{n.title}</div>
              <div style={styles.cardVal}>{n.desc}</div>
              <div style={styles.cardTip}>{n.tip}</div>
            </div>
          );
        })}
      </div>
      
      <div style={styles.hudFooter}>
        <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>
          SYSTEM: {projectData.uploadedImage ? 'UPLINK INTEGRITY 100%' : 'CALIBRATED // DEFAULT HUD'} // COORD: WGS-84
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '1rem',
    background: 'rgba(15, 5, 11, 0.4)',
    border: '1px solid rgba(200, 82, 124, 0.1)',
    borderRadius: '4px',
    padding: '1.25rem'
  },
  hudHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    borderBottom: '1px solid rgba(200, 82, 124, 0.08)',
    paddingBottom: '0.75rem',
  },
  hudSub: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  canvasContainer: {
    position: 'relative',
    width: '100%',
    height: '420px',
    background: '#090206',
    borderRadius: '2px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(241, 178, 204, 0.05)'
  },
  bgImage: {
    maxHeight: '90%',
    maxWidth: '90%',
    objectFit: 'contain',
    opacity: 0.85,
    filter: 'contrast(1.02) saturate(1.05)'
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 2
  },
  pulseNode: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    cursor: 'pointer'
  },
  nodeDot: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    transition: 'all 0.2s ease-in-out'
  },
  nodeRipple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '1px solid var(--color-pink-orchid)',
    borderRadius: '50%',
    animation: 'pulse-glow 1.8s infinite ease-out',
    pointerEvents: 'none'
  },
  calloutCard: {
    position: 'absolute',
    padding: '0.6rem 0.8rem',
    borderRadius: '2px',
    width: '180px',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    zIndex: 20,
    transition: 'all 0.2s ease-in-out'
  },
  cardTag: {
    fontSize: '0.55rem',
    letterSpacing: '0.08em',
    color: 'var(--color-blush)'
  },
  cardVal: {
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: '1.2'
  },
  cardTip: {
    color: 'var(--text-muted)',
    fontSize: '0.6rem',
    marginTop: '0.2rem',
    lineHeight: '1.3'
  },
  hudFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(200, 82, 124, 0.08)',
    paddingTop: '0.75rem',
  }
};
