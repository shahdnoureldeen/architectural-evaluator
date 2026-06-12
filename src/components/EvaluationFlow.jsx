import React, { useState, useEffect } from 'react';

export default function EvaluationFlow() {
  const [activeNode, setActiveNode] = useState(null);

  // Nodes for the 5 specialized evaluation agents
  const agents = [
    { id: 'arch', name: 'ARCHITECT', task: 'Form, Massing & Circulation', x: 220, y: 50 },
    { id: 'sust', name: 'SUSTAINABILITY', task: 'Carbon & Passive Design', x: 100, y: 120 },
    { id: 'struct', name: 'STRUCTURAL', task: 'Feasibility & Foundation', x: 340, y: 120 },
    { id: 'ux', name: 'USER EXP', task: 'Human Scale & Comfort', x: 130, y: 250 },
    { id: 'jury', name: 'JURY PANEL', task: 'Harsh Critique & Risk', x: 310, y: 250 }
  ];

  return (
    <div style={styles.container} className="tech-panel">
      <div className="scan-line" style={{ height: '3px', opacity: 0.3 }}></div>
      
      <svg viewBox="0 0 440 340" style={styles.svg}>
        {/* Glow Filters */}
        <defs>
          <filter id="glow-magenta" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Connecting Lines & Data Flows --- */}
        {/* Input to Core */}
        <line x1="40" y1="180" x2="220" y2="180" stroke="rgba(200, 82, 124, 0.2)" strokeWidth="1" />
        <path
          d="M 40 180 L 220 180"
          fill="none"
          stroke="var(--color-pink-orchid)"
          strokeWidth="1.5"
          strokeDasharray="6,15"
          className="svg-flow-path"
        />

        {/* Core to Agents */}
        {agents.map((agent) => (
          <g key={`lines-${agent.id}`}>
            <line
              x1="220"
              y1="180"
              x2={agent.x}
              y2={agent.y}
              stroke={activeNode === agent.id ? "var(--color-blush)" : "rgba(200, 82, 124, 0.15)"}
              strokeWidth={activeNode === agent.id ? "1.5" : "1"}
              style={{ transition: 'stroke 0.3s ease' }}
            />
            <path
              d={`M 220 180 L ${agent.x} ${agent.y}`}
              fill="none"
              stroke="var(--color-pink-orchid)"
              strokeWidth="1"
              strokeDasharray="4,10"
              className="svg-flow-path-reverse"
              opacity={activeNode === agent.id ? 1 : 0.4}
            />
          </g>
        ))}

        {/* --- CENTRAL CORE NODE --- */}
        <g 
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setActiveNode('core')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <circle
            cx="220"
            cy="180"
            r="32"
            fill="rgba(42, 17, 32, 0.85)"
            stroke={activeNode === 'core' ? "var(--color-blush)" : "var(--color-magenta)"}
            strokeWidth="1.5"
            filter="url(#glow-magenta)"
            style={{ transition: 'all 0.3s ease' }}
          />
          <circle
            cx="220"
            cy="180"
            r="26"
            fill="none"
            stroke="var(--color-pink-orchid)"
            strokeWidth="0.5"
            strokeDasharray="2,4"
            style={{ animation: 'spin 12s linear infinite' }}
          />
          <text
            x="220"
            y="177"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            letterSpacing="0.05em"
          >
            SYNTHESIS
          </text>
          <text
            x="220"
            y="187"
            textAnchor="middle"
            fill="var(--color-blush)"
            fontSize="6.5"
            fontFamily="var(--font-mono)"
          >
            ENGINE
          </text>
        </g>

        {/* --- SATELLITE AGENT NODES --- */}
        {agents.map((agent) => {
          const isSelected = activeNode === agent.id;
          return (
            <g
              key={agent.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveNode(agent.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {/* Outer boundary circle */}
              <circle
                cx={agent.x}
                cy={agent.y}
                r="18"
                fill="rgba(15, 5, 11, 0.9)"
                stroke={isSelected ? "var(--color-blush)" : "rgba(200, 82, 124, 0.4)"}
                strokeWidth="1"
                style={{ transition: 'all 0.3s ease' }}
              />
              <circle
                cx={agent.x}
                cy={agent.y}
                r="3"
                fill={isSelected ? "#ffffff" : "var(--color-pink-orchid)"}
                filter={isSelected ? "url(#glow-magenta)" : "none"}
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Node labels */}
              <text
                x={agent.x}
                y={agent.y > 180 ? agent.y + 24 : agent.y - 22}
                textAnchor="middle"
                fill={isSelected ? "#ffffff" : "var(--text-secondary)"}
                fontSize="8"
                fontWeight="500"
                fontFamily="var(--font-mono)"
                letterSpacing="0.05em"
                style={{ transition: 'fill 0.3s ease' }}
              >
                [{agent.name}]
              </text>
              
              {/* Hover Node Details */}
              {isSelected && (
                <g>
                  <rect
                    x={agent.x - 70}
                    y={agent.y > 180 ? agent.y + 30 : agent.y - 48}
                    width="140"
                    height="16"
                    fill="var(--color-plum-darkest)"
                    stroke="var(--color-pink-orchid)"
                    strokeWidth="0.5"
                    rx="1"
                  />
                  <text
                    x={agent.x}
                    y={agent.y > 180 ? agent.y + 40 : agent.y - 38}
                    textAnchor="middle"
                    fill="var(--color-blush)"
                    fontSize="7"
                    fontFamily="var(--font-body)"
                  >
                    {agent.task}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* --- INPUT & OUTPUT ENDPOINTS --- */}
        {/* Input Node */}
        <g>
          <rect
            x="8"
            y="162"
            width="54"
            height="36"
            fill="rgba(15, 5, 11, 0.6)"
            stroke="rgba(200, 82, 124, 0.2)"
            strokeWidth="1"
            rx="2"
          />
          <text x="35" y="176" textAnchor="middle" fill="var(--text-secondary)" fontSize="7" fontFamily="var(--font-mono)">
            PROJECT
          </text>
          <text x="35" y="186" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="var(--font-mono)">
            INPUT
          </text>
          <circle cx="35" cy="192" r="1.5" fill="var(--color-pink-orchid)" />
        </g>

        {/* Output Node (Report representation) */}
        <g>
          {/* Connection lines from satellites to output */}
          <path d="M 340 120 L 400 180 M 310 250 L 400 180" stroke="rgba(200, 82, 124, 0.15)" strokeWidth="1" />
          
          <rect
            x="378"
            y="162"
            width="54"
            height="36"
            fill="rgba(42, 17, 32, 0.3)"
            stroke="var(--color-magenta)"
            strokeWidth="1.5"
            filter="url(#glow-magenta)"
            rx="2"
          />
          <text x="405" y="176" textAnchor="middle" fill="var(--color-blush)" fontSize="7" fontFamily="var(--font-mono)">
            REVIEW
          </text>
          <text x="405" y="186" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="var(--font-mono)">
            REPORT
          </text>
          <circle cx="405" cy="192" r="1.5" fill="#00ff66" style={{ animation: 'pulse-glow 1.5s infinite' }} />
        </g>
      </svg>

      <div style={styles.consoleBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulse-dot active" style={{ width: '6px', height: '6px' }}></div>
          <span className="mono-tag" style={{ fontSize: '0.6rem', color: '#ffffff' }}>
            STATUS: STANDBY // STACK: ONLINE
          </span>
        </div>
        <span className="mono-tag" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
          MODE: INGESTION
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '440px',
    background: 'rgba(25, 10, 19, 0.3)',
    borderColor: 'var(--panel-border)',
    borderRadius: '4px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    overflow: 'hidden',
    position: 'relative'
  },
  svg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible'
  },
  consoleBar: {
    borderTop: '1px solid rgba(200, 82, 124, 0.1)',
    paddingTop: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

// Insert custom animation rules for SVG flow lines
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes svg-flow {
      to {
        stroke-dashoffset: -20;
      }
    }
    @keyframes svg-flow-rev {
      to {
        stroke-dashoffset: 20;
      }
    }
    .svg-flow-path {
      animation: svg-flow 1.2s linear infinite;
    }
    .svg-flow-path-reverse {
      animation: svg-flow-rev 1.6s linear infinite;
    }
  `;
  document.head.appendChild(styleEl);
}
