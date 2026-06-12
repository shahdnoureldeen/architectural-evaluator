import React from 'react';

export default function ScoreChart({ scores }) {
  // Map dimensions to chart labels
  const data = [
    { label: "CONCEPT", val: scores.conceptScore || 7.0 },
    { label: "SPATIAL", val: scores.spatialScore || 7.0 },
    { label: "SUSTAINABILITY", val: scores.sustainabilityScore || 7.0 },
    { label: "STRUCTURE", val: scores.structuralScore || 7.0 },
    { label: "INNOVATION", val: scores.innovationScore || 7.0 },
    { label: "PRESENTATION", val: scores.presentationScore || 7.0 }
  ];

  const size = 320;
  const center = size / 2;
  const radius = size * 0.38;

  // Hexagon math: angles for 6 vertices
  const getCoordinates = (index, value) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2; // Offset by 90deg to point straight up
    const r = (value / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid lines (hexagons at levels 2, 4, 6, 8, 10)
  const gridLevels = [2, 4, 6, 8, 10];
  const gridPolygons = gridLevels.map(level => {
    const points = Array.from({ length: 6 }).map((_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(' ');
    return { level, points };
  });

  // Coordinates for axes lines
  const axesLines = Array.from({ length: 6 }).map((_, i) => {
    const start = { x: center, y: center };
    const end = getCoordinates(i, 10);
    return { start, end };
  });

  // Coordinates for the actual scores polygon
  const scorePoints = data.map((d, i) => {
    const { x, y } = getCoordinates(i, d.val);
    return `${x},${y}`;
  }).join(' ');

  // Label positions (slightly offset from grid boundary)
  const labelPositions = data.map((d, i) => {
    const angle = (Math.PI / 3) * indexToAngleIndex(i) - Math.PI / 2;
    const offsetRadius = radius + 22;
    const x = center + offsetRadius * Math.cos(angle);
    const y = center + offsetRadius * Math.sin(angle);
    
    // Adjust text alignment based on position
    let textAnchor = "middle";
    if (Math.cos(angle) > 0.1) textAnchor = "start";
    else if (Math.cos(angle) < -0.1) textAnchor = "end";

    return { label: d.label, val: d.val, x, y, textAnchor };
  });

  function indexToAngleIndex(i) {
    return i;
  }

  return (
    <div style={styles.container}>
      <div style={styles.chartWrapper}>
        <svg viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
          {/* Radial Grid Hexagons */}
          {gridPolygons.map((grid, idx) => (
            <polygon
              key={idx}
              points={grid.points}
              fill="none"
              stroke="rgba(200, 82, 124, 0.12)"
              strokeWidth="1"
            />
          ))}

          {/* Radar Axes */}
          {axesLines.map((axis, idx) => (
            <line
              key={idx}
              x1={axis.start.x}
              y1={axis.start.y}
              x2={axis.end.x}
              y2={axis.end.y}
              stroke="rgba(200, 82, 124, 0.12)"
              strokeWidth="1"
              strokeDasharray="2,3"
            />
          ))}

          {/* Concentric grid numbers */}
          {gridLevels.map((level, idx) => {
            const { x, y } = getCoordinates(0, level);
            return (
              <text
                key={idx}
                x={x - 8}
                y={y + 11}
                fill="var(--text-muted)"
                fontSize="7"
                fontFamily="var(--font-mono)"
              >
                {level}
              </text>
            );
          })}

          {/* Filled Scores Area */}
          <polygon
            points={scorePoints}
            fill="rgba(200, 82, 124, 0.25)"
            stroke="var(--color-pink-orchid)"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(241, 178, 204, 0.45))' }}
          />

          {/* Dots on Vertices */}
          {data.map((d, i) => {
            const { x, y } = getCoordinates(i, d.val);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="var(--color-blush)"
                  stroke="var(--color-berry)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="var(--color-pink-orchid)"
                  strokeWidth="0.5"
                  opacity="0.5"
                  style={{ animation: 'pulse-glow 1.5s infinite' }}
                />
              </g>
            );
          })}

          {/* Labels */}
          {labelPositions.map((p, idx) => (
            <g key={idx}>
              <text
                x={p.x}
                y={p.y}
                textAnchor={p.textAnchor}
                fill="var(--text-primary)"
                fontSize="8"
                fontWeight="500"
                fontFamily="var(--font-mono)"
                letterSpacing="0.05em"
              >
                {p.label}
              </text>
              <text
                x={p.x}
                y={p.y + 10}
                textAnchor={p.textAnchor}
                fill="var(--color-pink-orchid)"
                fontSize="9"
                fontWeight="600"
                fontFamily="var(--font-mono)"
              >
                {p.val.toFixed(1)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Numerical scorecard underneath */}
      <div style={styles.scorecardGrid}>
        {data.map((item, idx) => (
          <div key={idx} style={styles.scoreItem} className="tech-panel">
            <span className="mono-tag" style={styles.scoreLabel}>{item.label}</span>
            <span style={styles.scoreVal}>{item.val.toFixed(1)}<span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/10</span></span>
          </div>
        ))}
      </div>

      {/* Score Justifications */}
      {scores.scoreJustifications && (
        <div style={styles.justificationsSection}>
          <div className="mono-tag" style={styles.justTitle}>[ RATING TRANSCRIPTS // JUSTIFICATION ]</div>
          <div style={styles.justList}>
            {Object.entries(scores.scoreJustifications).map(([key, text]) => (
              <div key={key} style={styles.justItem}>
                <span className="mono-tag" style={styles.justLabel}>{key}</span>
                <span style={styles.justText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%'
  },
  chartWrapper: {
    width: '100%',
    maxWidth: '320px',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle, rgba(80, 26, 49, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    padding: '1rem'
  },
  svg: {
    width: '100%',
    height: '100%',
    overflow: 'visible'
  },
  scorecardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.50rem',
    width: '100%',
    marginTop: '0.5rem'
  },
  scoreItem: {
    padding: '0.5rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
    textAlign: 'center',
    borderRadius: '2px',
    background: 'rgba(15, 5, 11, 0.3)'
  },
  scoreLabel: {
    fontSize: '0.55rem',
    opacity: 0.8
  },
  scoreVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff'
  },
  justificationsSection: {
    width: '100%',
    background: 'rgba(15, 5, 11, 0.4)',
    border: '1px solid rgba(200, 82, 124, 0.08)',
    borderRadius: '2px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  justTitle: {
    fontSize: '0.65rem',
    color: 'var(--color-pink-orchid)',
    borderBottom: '1px solid rgba(200, 82, 124, 0.08)',
    paddingBottom: '0.4rem',
    marginBottom: '0.2rem'
  },
  justList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  justItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    textAlign: 'left'
  },
  justLabel: {
    fontSize: '0.55rem',
    color: 'var(--color-blush)',
    letterSpacing: '0.05em'
  },
  justText: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  }
};
