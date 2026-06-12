import React from 'react';

// ==========================================
// 1. STRUCTURAL CHART (Load & Stress Matrix)
// ==========================================
export function StructuralChart({ projectData }) {
  const system = projectData?.structuralSystem || 'lightweight_frame';
  const foundation = projectData?.foundationType || 'screw_piles';
  const location = (projectData?.location || '').toLowerCase();
  const constraints = (projectData?.constraints || '').toLowerCase();
  const materials = (projectData?.materials || '').toLowerCase();

  const isSoftSoil = location.includes('delta') || location.includes('sheribin') || location.includes('daqahlya') || location.includes('floodplain') || location.includes('silt') || constraints.includes('soft') || constraints.includes('alluvial');
  const isQuarry = location.includes('quarry') || location.includes('cliff') || location.includes('mountain') || constraints.includes('cliff') || constraints.includes('rocky');

  // Dynamic parameters based on structural system
  let deadLoadMax = 12; // kNm
  let sysLabel = "Lightweight Frame";
  let stressPeakY = 160;

  if (system === 'heavy_frame') {
    deadLoadMax = 48;
    sysLabel = "Heavy steel/concrete skeleton";
    stressPeakY = 110;
  } else if (system === 'load_bearing') {
    deadLoadMax = 32;
    sysLabel = "Load-bearing bio-composite/masonry shell";
    stressPeakY = 130;
  } else if (system === 'subterranean_carving') {
    deadLoadMax = 8;
    sysLabel = "Subterranean cliff carving & excavation";
    stressPeakY = 180;
  } else if (system === 'floating_pontoon') {
    deadLoadMax = 22;
    sysLabel = "Floating pontoon deck platform";
    stressPeakY = 150;
  }

  // Settlement risk based on foundation + soil
  let settlementRisk = 12; // mm (safe default)
  let soilWarning = false;
  let foundLabel = "Helical steel screw piles";

  if (foundation === 'shallow_raft') {
    foundLabel = "Shallow concrete raft foundation";
    settlementRisk = isSoftSoil ? 58 : 22;
    if (isSoftSoil) soilWarning = true;
  } else if (foundation === 'deep_piles') {
    foundLabel = "Deep concrete friction piles";
    settlementRisk = isSoftSoil ? 8 : 4;
  } else if (foundation === 'screw_piles') {
    foundLabel = "Helical steel screw piles";
    settlementRisk = isSoftSoil ? 14 : 6;
  } else if (foundation === 'bedrock_pins') {
    foundLabel = "Bedrock anchoring pins & tension bolts";
    settlementRisk = isQuarry ? 2 : (isSoftSoil ? 45 : 18);
    if (isSoftSoil) soilWarning = true;
  } else if (foundation === 'floating_mooring') {
    foundLabel = "Tension anchor mooring lines";
    settlementRisk = 5;
  }

  // SVG Coordinates calculations
  const sizeX = 320;
  const sizeY = 200;

  // Generate path coordinates for Bending Moment (hanging curve)
  // Higher deadLoadMax makes the curve hang deeper
  const momentAmp = (deadLoadMax / 50) * 80;
  const momentPath = `M 40 100 Q 160 ${100 + momentAmp} 280 100`;

  // Generate path coordinates for Shear Stress (peaks at columns/points)
  const shearPath = system === 'floating_pontoon' 
    ? `M 40 100 C 80 70, 120 130, 160 100 C 200 70, 240 130, 280 100` // Oscillating wave
    : `M 40 100 L 90 100 L 90 ${stressPeakY - 20} L 100 ${stressPeakY + 20} L 100 100 L 220 100 L 220 ${stressPeakY - 20} L 230 ${stressPeakY + 20} L 230 100 L 280 100`;

  // Settlement curve
  const setRiskAmp = (settlementRisk / 60) * 90;
  const settlementPath = `M 40 160 Q 160 ${160 + setRiskAmp} 280 160`;

  return (
    <div style={styles.chartContainer}>
      <div style={styles.statBanner}>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>MAX DEAD LOAD</span>
          <span style={{ ...styles.statVal, color: deadLoadMax > 30 ? 'var(--color-blush)' : '#00ff66' }}>
            {deadLoadMax} kNm
          </span>
        </div>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>EST. SETTLEMENT</span>
          <span style={{ ...styles.statVal, color: soilWarning ? 'var(--color-blush)' : '#00ff66' }}>
            {settlementRisk} mm
          </span>
        </div>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>SAFETY FACTOR</span>
          <span style={{ ...styles.statVal, color: soilWarning ? 'var(--color-blush)' : '#00ff66' }}>
            {soilWarning ? '1.1 (CRITICAL)' : '2.8 (NOMINAL)'}
          </span>
        </div>
      </div>

      <div style={styles.svgWrapper}>
        <svg viewBox={`0 0 ${sizeX} ${sizeY}`} style={styles.svg}>
          {/* Grid lines */}
          <line x1="40" y1="40" x2="280" y2="40" stroke="rgba(241, 178, 204, 0.05)" strokeWidth="1" />
          <line x1="40" y1="100" x2="280" y2="100" stroke="rgba(241, 178, 204, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="40" y1="160" x2="280" y2="160" stroke="rgba(241, 178, 204, 0.05)" strokeWidth="1" />
          <line x1="95" y1="40" x2="95" y2="180" stroke="rgba(241, 178, 204, 0.05)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="225" y1="40" x2="225" y2="180" stroke="rgba(241, 178, 204, 0.05)" strokeWidth="1" strokeDasharray="2,2" />

          {/* Bending Moment Curve */}
          <path d={momentPath} fill="none" stroke="var(--color-pink-orchid)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px var(--color-pink-orchid))' }} />
          
          {/* Shear Stress Curve */}
          <path d={shearPath} fill="none" stroke="var(--color-blush)" strokeWidth="1.5" strokeDasharray="2,1" />

          {/* Critical Settlement Limit (Dashed Red Line) */}
          <line x1="40" y1="175" x2="280" y2="175" stroke="var(--color-blush)" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
          <text x="282" y="177" fill="var(--color-blush)" fontSize="6" fontFamily="var(--font-mono)">LIMIT</text>

          {/* Settlement Risk Line */}
          <path d={settlementPath} fill="none" stroke={soilWarning ? 'var(--color-blush)' : '#00ff66'} strokeWidth="1.5" />

          {/* Chart Nodes / Labels */}
          <text x="40" y="30" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)">0.0m SPAN</text>
          <text x="280" y="30" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="end">12.0m SPAN</text>
          <text x="160" y="93" fill="var(--color-pink-orchid)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">GRAVITY SHEAR AXIS</text>
          <text x="160" y="153" fill="var(--text-muted)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">FOUNDATION SETTLEMENT PROFILE</text>
        </svg>
      </div>

      <div style={styles.chartLegend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--color-pink-orchid)' }}></div>
          <span style={styles.legendText}>Bending Moment</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--color-blush)', border: '1px dashed #fff' }}></div>
          <span style={styles.legendText}>Shear Force</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: soilWarning ? 'var(--color-blush)' : '#00ff66' }}></div>
          <span style={styles.legendText}>Soil Settlement</span>
        </div>
      </div>

      {soilWarning && (
        <div style={styles.alertPanel}>
          <span className="mono-tag" style={{ color: 'var(--color-blush)', fontSize: '0.65rem', fontWeight: 'bold' }}>
            ⚠️ CRITICAL GEOLOGICAL RISK MET:
          </span>
          <p style={styles.alertText}>
            Proposing a <strong>{foundLabel}</strong> on soft saturated silt/clay creates severe differential settlement risk. Upgrade foundation type to helical piles or deep friction concrete piles.
          </p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. CIRCULARITY CHART (Material Sankey Flow)
// ==========================================
export function CircularityChart({ projectData }) {
  const materials = (projectData?.materials || '').toLowerCase();
  const concept = (projectData?.concept || '').toLowerCase();
  const combinedText = materials + ' ' + concept;

  // Determine circularity metrics based on organic material keywords
  const isOrganic = combinedText.includes('straw') || combinedText.includes('mycelium') || combinedText.includes('bamboo') || combinedText.includes('clay') || combinedText.includes('lime') || combinedText.includes('timber') || combinedText.includes('wood') || combinedText.includes('bio') || combinedText.includes('recycled') || combinedText.includes('earth');

  const sequesteredPct = isOrganic ? 88 : 22;
  const wastePct = isOrganic ? 12 : 78;
  const recoveryPct = isOrganic ? 92 : 35;
  const landfillPct = isOrganic ? 8 : 65;

  const sizeX = 320;
  const sizeY = 200;

  // Dynamic flow path coordinates (Sankey-style bezier curves)
  // Input node starts at X=40, Y=100
  // Sequestered path curves up to X=180, Y=60
  // Waste path curves down to X=180, Y=140
  const seqStroke = (sequesteredPct / 100) * 40;
  const wasteStroke = (wastePct / 100) * 40;
  
  const seqPath = `M 40 100 C 100 100, 120 60, 180 60`;
  const wastePath = `M 40 100 C 100 100, 120 140, 180 140`;

  // Recovery loop path (loops back from Sequestered node at X=180, Y=60 to Input at X=40, Y=100)
  const loopPath = `M 180 60 C 120 10, 60 10, 40 70`;

  return (
    <div style={styles.chartContainer}>
      <div style={styles.statBanner}>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>CARBON SEQUESTRATION</span>
          <span style={{ ...styles.statVal, color: isOrganic ? '#00ff66' : 'var(--color-blush)' }}>
            {sequesteredPct}%
          </span>
        </div>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>RECOVERY INDEX</span>
          <span style={{ ...styles.statVal, color: isOrganic ? '#00ff66' : 'var(--color-blush)' }}>
            {recoveryPct}%
          </span>
        </div>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>LANDFILL LOAD</span>
          <span style={{ ...styles.statVal, color: isOrganic ? '#00ff66' : 'var(--color-blush)' }}>
            {landfillPct}%
          </span>
        </div>
      </div>

      <div style={styles.svgWrapper}>
        <svg viewBox={`0 0 ${sizeX} ${sizeY}`} style={styles.svg}>
          {/* Arrow markers */}
          <defs>
            <marker id="flowArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(241, 178, 204, 0.4)" />
            </marker>
            <marker id="greenArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#00ff66" />
            </marker>
          </defs>

          {/* Raw Feedstock Input Node */}
          <rect x="15" y="80" width="50" height="40" fill="rgba(42, 17, 32, 0.85)" stroke="var(--color-pink-orchid)" strokeWidth="1" />
          <text x="40" y="98" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="var(--font-mono)" textAnchor="middle">RAW</text>
          <text x="40" y="108" fill="var(--color-pink-orchid)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">INPUT</text>

          {/* Flow Curves */}
          <path d={seqPath} fill="none" stroke="rgba(0, 255, 102, 0.25)" strokeWidth={Math.max(2, seqStroke)} />
          <path d={wastePath} fill="none" stroke="rgba(200, 82, 124, 0.25)" strokeWidth={Math.max(2, wasteStroke)} />

          {/* Flow animation segments */}
          <path d={seqPath} fill="none" stroke="#00ff66" strokeWidth="1" strokeDasharray="4,12" className="svg-flow-path" />
          <path d={wastePath} fill="none" stroke="var(--color-pink-orchid)" strokeWidth="1" strokeDasharray="4,12" className="svg-flow-path" />

          {/* Sequestered Node */}
          <circle cx="180" cy="60" r="16" fill="rgba(9, 26, 15, 0.9)" stroke="#00ff66" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px #00ff66)' }} />
          <text x="180" y="63" fill="#00ff66" fontSize="6.5" fontWeight="bold" fontFamily="var(--font-mono)" textAnchor="middle">SINK</text>

          {/* Waste / Landfill Node */}
          <circle cx="180" cy="140" r="16" fill="rgba(25, 10, 19, 0.9)" stroke="var(--color-pink-orchid)" strokeWidth="1" />
          <text x="180" y="143" fill="var(--color-pink-orchid)" fontSize="6.5" fontWeight="bold" fontFamily="var(--font-mono)" textAnchor="middle">LOSS</text>

          {/* Circular Recovery Loop */}
          <path d={loopPath} fill="none" stroke="rgba(0, 255, 102, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#greenArrow)" />
          <text x="110" y="25" fill="#00ff66" fontSize="6.5" fontFamily="var(--font-mono)" textAnchor="middle">CIRCULAR RECOVERY ({recoveryPct}%)</text>

          {/* Exit paths to right */}
          <line x1="196" y1="60" x2="260" y2="60" stroke="#00ff66" strokeWidth="1" strokeDasharray="2,2" />
          <text x="264" y="63" fill="#00ff66" fontSize="6.5" fontFamily="var(--font-mono)">BUILDING CAP ({sequesteredPct}%)</text>

          <line x1="196" y1="140" x2="260" y2="140" stroke="var(--color-blush)" strokeWidth="1" strokeDasharray="2,2" />
          <text x="264" y="143" fill="var(--color-blush)" fontSize="6.5" fontFamily="var(--font-mono)">LANDFILL ({landfillPct}%)</text>
        </svg>
      </div>

      <div style={styles.chartLegend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#00ff66' }}></div>
          <span style={styles.legendText}>Carbon Sequestration</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--color-pink-orchid)' }}></div>
          <span style={styles.legendText}>Process Dissipation</span>
        </div>
      </div>

      {!isOrganic && (
        <div style={{ ...styles.alertPanel, borderColor: 'var(--color-blush)', background: 'rgba(42, 17, 32, 0.15)' }}>
          <span className="mono-tag" style={{ color: 'var(--color-blush)', fontSize: '0.65rem', fontWeight: 'bold' }}>
            ⚠️ HIGH CARBON METRIC FLAGGED:
          </span>
          <p style={styles.alertText}>
            The current design specifications rely heavily on synthetic or non-circular raw materials (concrete/steel). Consider introducing local bio-composites like compressed agricultural panels to raise structural carbon storage.
          </p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. THERMODYNAMIC CHART (Ventilation & Solar)
// ==========================================
export function ThermodynamicChart({ projectData }) {
  const climate = (projectData?.climate || '').toLowerCase();
  
  const isDesert = climate.includes('arid') || climate.includes('desert') || climate.includes('hot') || climate.includes('summer');

  // SVG parameters
  const sizeX = 320;
  const sizeY = 200;

  // Ambient heat wave (sine curve peaking at mid-day)
  // Arid climates peak higher
  const heatPeak = isDesert ? 45 : 100; // lower values on screen = higher on chart
  const heatPath = `M 40 140 C 90 140, 110 ${heatPeak}, 160 ${heatPeak} C 210 ${heatPeak}, 230 140, 280 140`;

  // Solar Radiation Curve (bell shape)
  const solarPeak = isDesert ? 30 : 75;
  const solarPath = `M 40 160 C 80 160, 100 ${solarPeak}, 160 ${solarPeak} C 220 ${solarPeak}, 240 160, 280 160`;

  // Passive Ventilation Wave (turbulent noise)
  const ventPath = `M 40 90 L 65 75 L 90 110 L 115 80 L 140 115 L 165 65 L 190 100 L 215 70 L 240 95 L 265 85 L 280 110`;

  return (
    <div style={styles.chartContainer}>
      <div style={styles.statBanner}>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>PEAK SOL RADIATION</span>
          <span style={{ ...styles.statVal, color: isDesert ? 'var(--color-blush)' : '#00ff66' }}>
            {isDesert ? '980 W/m²' : '620 W/m²'}
          </span>
        </div>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>CONVECTIVE AIRFLOW</span>
          <span style={{ ...styles.statVal, color: '#00ff66' }}>
            3.4 m/s
          </span>
        </div>
        <div style={styles.statBox}>
          <span className="mono-tag" style={styles.statLabel}>THERMAL COMFORT</span>
          <span style={{ ...styles.statVal, color: isDesert ? 'var(--color-blush)' : '#00ff66' }}>
            {isDesert ? 'MARGINAL (HOT)' : 'OPTIMAL'}
          </span>
        </div>
      </div>

      <div style={styles.svgWrapper}>
        <svg viewBox={`0 0 ${sizeX} ${sizeY}`} style={styles.svg}>
          {/* Backdrop grid */}
          <line x1="40" y1="40" x2="280" y2="40" stroke="rgba(241, 178, 204, 0.05)" strokeWidth="1" />
          <line x1="40" y1="100" x2="280" y2="100" stroke="rgba(241, 178, 204, 0.08)" strokeWidth="1" />
          <line x1="40" y1="160" x2="280" y2="160" stroke="rgba(241, 178, 204, 0.05)" strokeWidth="1" />
          <line x1="160" y1="40" x2="160" y2="170" stroke="rgba(241, 178, 204, 0.08)" strokeWidth="1" strokeDasharray="2,2" />

          {/* Solar Radiation Curve */}
          <path d={solarPath} fill="none" stroke="var(--color-blush)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 5px var(--color-blush))' }} />

          {/* Temperature Wave */}
          <path d={heatPath} fill="none" stroke="var(--color-pink-orchid)" strokeWidth="1.5" />

          {/* Wind Ventilation Wave */}
          <path d={ventPath} fill="none" stroke="#00ff66" strokeWidth="1.25" strokeDasharray="3,2" />

          {/* Labels */}
          <text x="40" y="175" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)">06:00 HRS</text>
          <text x="160" y="175" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">12:00 MIDDAY</text>
          <text x="280" y="175" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="end">18:00 HRS</text>
          
          <text x="165" y={solarPeak - 5} fill="var(--color-blush)" fontSize="6" fontFamily="var(--font-mono)">SOLAR ANGLE MAXIMUM</text>
          <text x="200" y="130" fill="var(--color-pink-orchid)" fontSize="6" fontFamily="var(--font-mono)">THERMAL GRADIENT RISE</text>
        </svg>
      </div>

      <div style={styles.chartLegend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--color-blush)' }}></div>
          <span style={styles.legendText}>Solar Insulation</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--color-pink-orchid)' }}></div>
          <span style={styles.legendText}>Thermal Heat Load</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#00ff66', border: '1px dashed #fff' }}></div>
          <span style={styles.legendText}>Ventilation Convection</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. SHARED STYLING TOKENS
// ==========================================
const styles = {
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    width: '100%',
    padding: '0.5rem 0.25rem'
  },
  statBanner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    width: '100%'
  },
  statBox: {
    padding: '0.4rem 0.5rem',
    background: 'rgba(15, 5, 11, 0.4)',
    border: '1px solid rgba(241, 178, 204, 0.05)',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.15rem'
  },
  statLabel: {
    fontSize: '0.5rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em'
  },
  statVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  svgWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle, rgba(80, 26, 49, 0.05) 0%, transparent 80%)'
  },
  svg: {
    width: '100%',
    maxHeight: '180px',
    overflow: 'visible'
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.25rem',
    flexWrap: 'wrap',
    borderTop: '1px solid rgba(241, 178, 204, 0.08)',
    paddingTop: '0.75rem',
    marginTop: '0.25rem'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legendColor: {
    width: '10px',
    height: '4px',
    borderRadius: '1px'
  },
  legendText: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)'
  },
  alertPanel: {
    background: 'rgba(25, 10, 19, 0.4)',
    border: '1px solid var(--color-blush)',
    borderRadius: '2px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  alertText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  }
};
