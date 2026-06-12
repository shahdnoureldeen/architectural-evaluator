import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldAlert, CheckCircle, Percent, Compass, Layout, Grid, AlertTriangle } from 'lucide-react';

export default function SpaceProgram({ projectData }) {
  const [spaces, setSpaces] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('areas'); // 'areas' or 'matrix'
  
  // Adjacency Matrix state: key is `${id1}-${id2}`, value is 'none' | 'direct' | 'secondary' | 'isolated'
  const [adjacency, setAdjacency] = useState({});

  // Inline add space form states
  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState(150);
  const [newCategory, setNewCategory] = useState('R&D');
  const [categories, setCategories] = useState(['R&D', 'Public', 'Operations', 'Admin']);
  const [customCatInput, setCustomCatInput] = useState('');

  // Load default space program index based on project data
  useEffect(() => {
    const title = (projectData?.title || '').toLowerCase();
    const type = (projectData?.type || '').toLowerCase();
    const concept = (projectData?.concept || '').toLowerCase();
    const combined = title + ' ' + type + ' ' + concept;

    let defaultProgram = [];
    let initialAdj = {};

    if (combined.includes('straw') || combined.includes('nile') || combined.includes('delta')) {
      defaultProgram = [
        { id: '1', name: 'Digital Fabrication Laboratory', area: 500, category: 'R&D' },
        { id: '2', name: 'Straw Storage & Curing Silos', area: 450, category: 'Operations' },
        { id: '3', name: 'Bio-Composite Exhibition Gallery', area: 300, category: 'Public' },
        { id: '4', name: 'Agricultural Fiber Shredding Hangar', area: 250, category: 'Operations' },
        { id: '5', name: 'Administrative Control Room', area: 120, category: 'Admin' }
      ];
      // Pre-baked adjacencies
      initialAdj = {
        '1-2': 'secondary',
        '2-1': 'secondary',
        '1-3': 'secondary',
        '3-1': 'secondary',
        '2-4': 'direct',
        '4-2': 'direct',
        '1-5': 'direct',
        '5-1': 'direct',
        '3-4': 'isolated',
        '4-3': 'isolated'
      };
    } else if (combined.includes('mangrove') || combined.includes('sea') || combined.includes('marine')) {
      defaultProgram = [
        { id: '1', name: 'Marine Biology Wet Laboratories', area: 300, category: 'R&D' },
        { id: '2', name: 'Eco-Tourism Boardwalk Pavilion', area: 280, category: 'Public' },
        { id: '3', name: 'Desalination & Solar Battery Cells', area: 150, category: 'Operations' },
        { id: '4', name: 'Intertidal Canopy Research Platform', area: 200, category: 'R&D' },
        { id: '5', name: 'Researcher Rest & Quarters', area: 180, category: 'Admin' }
      ];
      initialAdj = {
        '1-4': 'direct',
        '4-1': 'direct',
        '2-4': 'secondary',
        '4-2': 'secondary',
        '1-3': 'secondary',
        '3-1': 'secondary',
        '1-5': 'direct',
        '5-1': 'direct'
      };
    } else if (combined.includes('quarry') || combined.includes('amphitheater') || combined.includes('mokattam')) {
      defaultProgram = [
        { id: '1', name: 'Main Outdoor Amphitheater Bowl', area: 900, category: 'Public' },
        { id: '2', name: 'Limestone Carving & Sound Gallery', area: 350, category: 'Public' },
        { id: '3', name: 'Acoustic Soundstage & Backstage', area: 220, category: 'R&D' },
        { id: '4', name: 'Mechanical & Lighting Storage Vaults', area: 200, category: 'Operations' },
        { id: '5', name: 'Ticket Office & Entrance Lounge', area: 120, category: 'Admin' }
      ];
      initialAdj = {
        '1-2': 'direct',
        '2-1': 'direct',
        '1-3': 'direct',
        '3-1': 'direct',
        '3-4': 'secondary',
        '4-3': 'secondary',
        '1-5': 'secondary',
        '5-1': 'secondary'
      };
    } else {
      defaultProgram = [
        { id: '1', name: `${projectData?.type || 'Core'} Main Activity Hub`, area: 400, category: 'R&D' },
        { id: '2', name: 'Public Reception & Exhibition Foyer', area: 200, category: 'Public' },
        { id: '3', name: 'Operations & Technical Service Room', area: 250, category: 'Operations' },
        { id: '4', name: 'Director Suite & Admin Cells', area: 100, category: 'Admin' }
      ];
    }

    setSpaces(defaultProgram);
    setAdjacency(initialAdj);
  }, [projectData]);

  // Handle dynamic category creation
  const handleCreateCategory = (e) => {
    e.preventDefault();
    const trimmed = customCatInput.trim();
    if (!trimmed) return;
    
    // Capitalize first letter or keep uppercase
    const formatted = trimmed.length > 3 ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed.toUpperCase();
    
    if (!categories.includes(formatted)) {
      setCategories(prev => [...prev, formatted]);
    }
    setNewCategory(formatted);
    setCustomCatInput('');
  };

  // Handle adding custom spaces
  const handleAddSpace = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSpace = {
      id: Date.now().toString(),
      name: newName,
      area: parseInt(newArea) || 50,
      category: newCategory
    };

    setSpaces(prev => [...prev, newSpace]);
    setNewName('');
    setNewArea(150);
  };

  // Handle deleting space
  const handleDeleteSpace = (id) => {
    setSpaces(prev => prev.filter(space => space.id !== id));
    // Clean up associated adjacencies
    setAdjacency(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (key.startsWith(`${id}-`) || key.endsWith(`-${id}`)) {
          delete updated[key];
        }
      });
      return updated;
    });
  };

  // Handle space area slider changes
  const handleAreaChange = (id, value) => {
    setSpaces(prev => prev.map(space => 
      space.id === id ? { ...space, area: parseInt(value) || 10 } : space
    ));
  };

  // Cycle relationship state on cell click
  const handleCellClick = (id1, id2) => {
    if (id1 === id2) return; // Self-adjacency is irrelevant
    
    const currentVal = adjacency[`${id1}-${id2}`] || 'none';
    let nextVal = 'none';

    if (currentVal === 'none') nextVal = 'direct';
    else if (currentVal === 'direct') nextVal = 'secondary';
    else if (currentVal === 'secondary') nextVal = 'isolated';
    else if (currentVal === 'isolated') nextVal = 'none';

    setAdjacency(prev => ({
      ...prev,
      [`${id1}-${id2}`]: nextVal,
      [`${id2}-${id1}`]: nextVal // Sync symmetric coordinate
    }));
  };

  const themeColors = [
    'var(--color-pink-orchid)', // Magenta/Pink
    '#00ff66',                  // Neon Green
    'var(--color-blush)',       // Blush Red/Pink
    '#a855f7',                  // Purple
    '#00d4ff',                  // Cyan / Neon Blue
    '#ffaa00',                  // Amber / Orange
    '#ff0055',                  // Bright Red
    '#e2ff00'                   // Lime Green
  ];

  // Category color coding
  const getCategoryColor = (cat) => {
    if (cat === 'Public') return 'var(--color-pink-orchid)';
    if (cat === 'Operations') return 'var(--color-blush)';
    if (cat === 'R&D') return '#00ff66';
    if (cat === 'Admin') return '#a855f7';

    // Hash-code to pick a theme color for custom categories
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
      hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % themeColors.length;
    return themeColors[index];
  };

  // Adjacency Cell icon/color
  const getCellDisplay = (val) => {
    switch(val) {
      case 'direct':
        return { char: '●', color: 'var(--color-pink-orchid)', label: 'Direct' };
      case 'secondary':
        return { char: '○', color: '#00ff66', label: 'Secondary' };
      case 'isolated':
        return { char: '✖', color: 'var(--color-blush)', label: 'Isolated' };
      default:
        return { char: '·', color: 'rgba(255,255,255,0.15)', label: 'None' };
    }
  };

  // Live validation logic for adjacencies
  const getConflicts = () => {
    const conflicts = [];
    for (let i = 0; i < spaces.length; i++) {
      for (let j = i + 1; j < spaces.length; j++) {
        const s1 = spaces[i];
        const s2 = spaces[j];
        const relation = adjacency[`${s1.id}-${s2.id}`] || 'none';

        if (relation === 'direct') {
          // Conflict 1: Public directly adjacent to Operations (Noise, Safety, dust)
          if ((s1.category === 'Public' && s2.category === 'Operations') || 
              (s2.category === 'Public' && s1.category === 'Operations')) {
            conflicts.push({
              id: `${s1.id}-${s2.id}-noise`,
              type: 'Acoustic / Zoning Clash',
              desc: `Direct adjacency between "${s1.name}" and "${s2.name}" introduces industrial noise (>75 dB) and air particles into visitor zones. Consider separating them via a buffer zone (Secondary) or isolating them.`
            });
          }
          // Conflict 2: Admin directly adjacent to heavy Operations (Logistics congestion)
          if ((s1.category === 'Admin' && s2.category === 'Operations') || 
              (s2.category === 'Admin' && s1.category === 'Operations')) {
            conflicts.push({
              id: `${s1.id}-${s2.id}-logistic`,
              type: 'Operational Safety Interference',
              desc: `Connecting administrative cells ("${s1.name}") directly to operations ("${s2.name}") crosses public staff flow with machinery loading tracks. Provide structural separation.`
            });
          }
        }
        
        if (relation === 'isolated') {
          // If user specifically requested isolation, check that it doesn't have indirect clash issues
          // Just a status confirmation (no warning)
        }
      }
    }
    return conflicts;
  };

  const conflictsList = getConflicts();

  // Program calculations
  const totalUsableArea = spaces.reduce((acc, curr) => acc + curr.area, 0);
  const circulationLoss = Math.round(totalUsableArea * 0.15);
  const totalGrossFloorArea = totalUsableArea + circulationLoss;

  // Estimate land allocation ratio based on project scale
  let scaleSqM = 10000;
  if (projectData?.scale) {
    const numbers = projectData.scale.match(/\d+[\d,']*/g);
    if (numbers && numbers.length > 0) {
      const parsedNum = parseInt(numbers[numbers.length - 1].replace(/[,']/g, ''));
      if (parsedNum > 100) scaleSqM = parsedNum;
      else if (projectData.scale.toLowerCase().includes('feddan')) {
        scaleSqM = parseFloat(numbers[0]) * 4200;
      }
    }
  }
  const landAllocationRatio = Math.round((totalGrossFloorArea / scaleSqM) * 1000) / 10;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h3 style={styles.sectionHeading}>ARCHITECTURAL PROGRAM PLANNER</h3>
          <p style={styles.sectionDesc}>
            Manage spatial sizes and design relationship constraints. Use the sub-tabs below to configure rooms or map adjacency matrices.
          </p>
        </div>
        
        {/* Sub-Tabs selector */}
        <div style={styles.subTabsContainer}>
          <button
            onClick={() => setActiveSubTab('areas')}
            style={{
              ...styles.subTabBtn,
              borderColor: activeSubTab === 'areas' ? 'var(--color-pink-orchid)' : 'transparent',
              color: activeSubTab === 'areas' ? '#ffffff' : 'var(--text-muted)',
              background: activeSubTab === 'areas' ? 'rgba(80, 26, 49, 0.15)' : 'transparent'
            }}
            className="mono-tag"
          >
            <Layout size={12} style={{ marginRight: '6px' }} /> Areas & Bubble Grid
          </button>
          <button
            onClick={() => setActiveSubTab('matrix')}
            style={{
              ...styles.subTabBtn,
              borderColor: activeSubTab === 'matrix' ? 'var(--color-pink-orchid)' : 'transparent',
              color: activeSubTab === 'matrix' ? '#ffffff' : 'var(--text-muted)',
              background: activeSubTab === 'matrix' ? 'rgba(80, 26, 49, 0.15)' : 'transparent'
            }}
            className="mono-tag"
          >
            <Grid size={12} style={{ marginRight: '6px' }} /> Adjacency Matrix
          </button>
        </div>
      </div>

      {/* Program Telemetry Stats */}
      <div style={styles.statBanner} className="tech-panel">
        <div className="scan-line" style={{ height: '2px', opacity: 0.15 }}></div>
        <div style={styles.statBox}>
          <Layout size={16} color="var(--color-pink-orchid)" style={{ marginBottom: '4px' }} />
          <span className="mono-tag" style={styles.statLabel}>NET USABLE AREA</span>
          <span style={styles.statVal}>{totalUsableArea.toLocaleString()} m²</span>
        </div>
        <div style={styles.statBox}>
          <Compass size={16} color="var(--color-blush)" style={{ marginBottom: '4px' }} />
          <span className="mono-tag" style={styles.statLabel}>CIRCULATION (+15%)</span>
          <span style={styles.statVal}>{circulationLoss.toLocaleString()} m²</span>
        </div>
        <div style={styles.statBox}>
          <Percent size={16} color="#00ff66" style={{ marginBottom: '4px' }} />
          <span className="mono-tag" style={styles.statLabel}>LAND FOOTPRINT</span>
          <span style={styles.statVal}>{landAllocationRatio}%</span>
        </div>
        <div style={{ ...styles.statBox, borderColor: 'var(--color-pink-orchid)' }}>
          <div className="pulse-dot active" style={{ marginBottom: '4px' }}></div>
          <span className="mono-tag" style={{ ...styles.statLabel, color: 'var(--color-pink-orchid)' }}>GROSS FLOOR AREA</span>
          <span style={{ ...styles.statVal, color: '#ffffff' }}>{totalGrossFloorArea.toLocaleString()} m²</span>
        </div>
      </div>

      {activeSubTab === 'areas' && (
        <div style={styles.layoutColumns} className="dashboard-columns-responsive">
          {/* Left Column: Form & Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleAddSpace} className="tech-panel" style={styles.formBox}>
              <span className="mono-tag" style={styles.boxTitle}>[ ADD SPACE ENVELOPE ]</span>
              <div style={styles.formFields}>
                <div style={{ flex: 2, minWidth: '180px' }}>
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Space Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Raw Processing Silo, Public Foyer"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '95px' }}>
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', background: '#090206' }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1.2, minWidth: '130px' }}>
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Create Category</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input
                      type="text"
                      placeholder="e.g., Services"
                      value={customCatInput}
                      onChange={(e) => setCustomCatInput(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="tech-btn primary"
                      style={{ padding: '0 0.5rem', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Add Category"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Area ({newArea} m²)</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={newArea}
                    onChange={(e) => setNewArea(parseInt(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  />
                </div>
                <button type="submit" className="tech-btn primary" style={styles.addBtn}>
                  <Plus size={14} /> ADD
                </button>
              </div>
            </form>

            <div className="tech-panel" style={styles.tableBox}>
              <span className="mono-tag" style={styles.boxTitle}>[ PROGRAM INDEX & AREA CONTROLLER ]</span>
              <div style={styles.spacesScroll} className="glass-scroll">
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tr}>
                      <th style={styles.thLeft}>SPACE NAME</th>
                      <th style={styles.th}>CATEGORY</th>
                      <th style={styles.th}>AREA (sqm)</th>
                      <th style={styles.thAction}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {spaces.map((space) => (
                      <tr key={space.id} style={styles.trBody}>
                        <td style={styles.tdName}>{space.name}</td>
                        <td style={styles.td}>
                          <span 
                            className="mono-tag" 
                            style={{ 
                              fontSize: '0.6rem', 
                              color: getCategoryColor(space.category),
                              borderColor: getCategoryColor(space.category),
                              borderWidth: '1px',
                              borderStyle: 'solid',
                              padding: '1px 6px',
                              borderRadius: '2px',
                              background: 'rgba(15, 5, 11, 0.4)'
                            }}
                          >
                            {space.category}
                          </span>
                        </td>
                        <td style={styles.tdSlider}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                              type="range" 
                              min="20" 
                              max="1200" 
                              step="10"
                              value={space.area} 
                              onChange={(e) => handleAreaChange(space.id, e.target.value)}
                              style={{ accentColor: 'var(--color-pink-orchid)', width: '80px', height: '2px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', minWidth: '42px', textAlign: 'right' }}>
                              {space.area} m²
                            </span>
                          </div>
                        </td>
                        <td style={styles.tdAction}>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteSpace(space.id)}
                            style={styles.deleteBtn}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Block Diagram */}
          <div className="tech-panel" style={styles.diagramBox}>
            <span className="mono-tag" style={styles.boxTitle}>[ VISUAL SPATIAL BUBBLE GRID ]</span>
            <p style={styles.diagramDesc}>
              Interactive block size map proportional to space areas. Hovering displays the spatial envelopes.
            </p>

            <div style={styles.blockGridContainer} className="glass-scroll">
              <div style={styles.blockGrid}>
                {spaces.map((space) => {
                  const flexBasis = Math.max(160, Math.min(480, Math.round(space.area * 0.95)));
                  return (
                    <div
                      key={space.id}
                      className="tech-panel"
                      style={{
                        ...styles.spaceBlock,
                        flexBasis: `${flexBasis}px`,
                        borderColor: getCategoryColor(space.category),
                        background: `rgba(${space.category === 'Public' ? '200, 82, 124' : space.category === 'Operations' ? '241, 178, 204' : space.category === 'R&D' ? '0, 255, 102' : '168, 85, 247'}, 0.08)`
                      }}
                    >
                      <div className="scan-line" style={{ height: '1.5px', opacity: 0.1 }}></div>
                      <div style={styles.blockContent}>
                        <span className="mono-tag" style={{ fontSize: '0.55rem', color: getCategoryColor(space.category), opacity: 0.8 }}>
                          [{space.category.toUpperCase()}]
                        </span>
                        <div style={styles.blockName}>{space.name}</div>
                        <div style={styles.blockArea} className="mono-tag">{space.area} m²</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.legendBar} style={{ display: 'flex', gap: '0.75rem 1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.75rem', borderTop: '1px solid rgba(241, 178, 204, 0.08)', paddingTop: '0.75rem' }}>
              {categories.map(cat => (
                <div key={cat} style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, background: getCategoryColor(cat) }}></div>
                  <span className="mono-tag" style={{ fontSize: '0.6rem' }}>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'matrix' && (
        <div style={styles.matrixContainer} className="tech-panel">
          <div className="scan-line" style={{ height: '2px', opacity: 0.1 }}></div>
          <span className="mono-tag" style={styles.boxTitle}>[ SPACE PROGRAM ADJACENCY MATRIX ]</span>
          <p style={styles.diagramDesc}>
            Click intersections to specify adjacency constraints. Relationships sync symmetrically.
          </p>

          <div style={styles.matrixGridScroll} className="glass-scroll">
            <table style={styles.matrixTable}>
              <thead>
                <tr>
                  <th style={styles.matrixThCorner}>SPACE RELATIONSHIP</th>
                  {spaces.map((s, idx) => (
                    <th key={s.id} style={styles.matrixColTh}>
                      <div style={styles.verticalThWrapper}>
                        <span className="mono-tag" style={styles.verticalThText}>
                          {idx + 1}. {s.name.substring(0, 16)}...
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spaces.map((s1, rIdx) => (
                  <tr key={s1.id} style={styles.matrixTr}>
                    <td style={styles.matrixRowHeader}>
                      <span className="mono-tag" style={{ color: getCategoryColor(s1.category), marginRight: '6px' }}>
                        {rIdx + 1}
                      </span>
                      {s1.name}
                    </td>
                    {spaces.map((s2, cIdx) => {
                      const isSelf = s1.id === s2.id;
                      const rel = adjacency[`${s1.id}-${s2.id}`] || 'none';
                      const cell = getCellDisplay(rel);

                      return (
                        <td 
                          key={s2.id} 
                          onClick={() => !isSelf && handleCellClick(s1.id, s2.id)}
                          style={{
                            ...styles.matrixTd,
                            background: isSelf ? 'rgba(255,255,255,0.03)' : 'transparent',
                            cursor: isSelf ? 'default' : 'pointer'
                          }}
                          title={isSelf ? 'Self' : `Adjacency between "${s1.name}" and "${s2.name}": ${cell.label}`}
                        >
                          {!isSelf ? (
                            <span style={{ color: cell.color, fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {cell.char}
                            </span>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.05)' }}>\</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix Legend */}
          <div style={styles.matrixLegend}>
            {[
              { val: 'direct', label: '● Direct Adjacency (Immediate link)' },
              { val: 'secondary', label: '○ Secondary Adjacency (Connected corridor)' },
              { val: 'none', label: '· Faint (Neutral / Unconnected)' },
              { val: 'isolated', label: '✖ Required Isolation (Zoning separation)' }
            ].map(item => {
              const cell = getCellDisplay(item.val);
              return (
                <div key={item.val} style={styles.matrixLegendItem}>
                  <span style={{ color: cell.color, fontSize: '1rem', fontWeight: 'bold', marginRight: '4px' }}>
                    {cell.char}
                  </span>
                  <span className="mono-tag" style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Conflict alerts */}
          <div style={styles.conflictsSection}>
            <span className="mono-tag" style={{ color: conflictsList.length > 0 ? 'var(--color-blush)' : '#00ff66', fontSize: '0.7rem' }}>
              [ AGENT VERIFICATION CODES // {conflictsList.length} CONFLICTS FLAGGED ]
            </span>
            {conflictsList.length > 0 ? (
              <div style={styles.conflictsList}>
                {conflictsList.map((c) => (
                  <div key={c.id} style={styles.conflictCard}>
                    <div style={styles.conflictTitle}>
                      <AlertTriangle size={12} color="var(--color-blush)" />
                      <span className="mono-tag" style={{ fontSize: '0.65rem', color: 'var(--color-blush)' }}>{c.type}</span>
                    </div>
                    <p style={styles.conflictDesc}>{c.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.cleanValidation}>
                <CheckCircle size={14} color="#00ff66" />
                <span className="mono-tag" style={{ fontSize: '0.7rem', color: '#00ff66' }}>
                  ZONING VERIFIED: NO PROXIMITY CONFLICTS DETECTED.
                </span>
              </div>
            )}
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
    gap: '1.5rem',
    width: '100%'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  subTabsContainer: {
    display: 'flex',
    background: 'rgba(15, 5, 11, 0.4)',
    border: '1px solid rgba(241, 178, 204, 0.08)',
    borderRadius: '4px',
    padding: '2px'
  },
  subTabBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.68rem',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center'
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
  statBanner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
    padding: '1.25rem',
    background: 'rgba(25, 10, 19, 0.25)',
    borderColor: 'var(--color-mulberry)'
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
    textAlign: 'center',
    padding: '0.5rem',
    borderRadius: '2px',
    border: '1px solid rgba(241, 178, 204, 0.05)',
    background: 'rgba(15, 5, 11, 0.4)'
  },
  statLabel: {
    fontSize: '0.55rem',
    color: 'var(--text-muted)'
  },
  statVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff'
  },
  layoutColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  },
  formBox: {
    padding: '1.25rem',
    background: 'rgba(25, 10, 19, 0.15)',
    borderColor: 'rgba(241, 178, 204, 0.1)'
  },
  boxTitle: {
    fontSize: '0.65rem',
    color: 'var(--color-pink-orchid)',
    marginBottom: '0.75rem',
    display: 'block'
  },
  formFields: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  addBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.75rem',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '1px'
  },
  tableBox: {
    padding: '1.25rem',
    background: 'rgba(25, 10, 19, 0.15)'
  },
  spacesScroll: {
    maxHeight: '260px',
    overflowY: 'auto',
    border: '1px solid rgba(241, 178, 204, 0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem',
    textAlign: 'left'
  },
  tr: {
    borderBottom: '1px solid rgba(241, 178, 204, 0.1)',
    background: 'rgba(15, 5, 11, 0.7)'
  },
  thLeft: {
    padding: '0.6rem 0.8rem',
    color: 'var(--text-muted)',
    fontSize: '0.6rem',
    fontFamily: 'var(--font-mono)'
  },
  th: {
    padding: '0.6rem 0.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.6rem',
    fontFamily: 'var(--font-mono)'
  },
  thAction: {
    width: '40px'
  },
  trBody: {
    borderBottom: '1px solid rgba(241, 178, 204, 0.05)',
    background: 'rgba(25, 10, 19, 0.1)',
    transition: 'background 0.2s ease'
  },
  tdName: {
    padding: '0.6rem 0.8rem',
    color: '#ffffff',
    fontWeight: '500'
  },
  td: {
    padding: '0.6rem 0.5rem'
  },
  tdSlider: {
    padding: '0.4rem 0.5rem'
  },
  tdAction: {
    padding: '0.4rem 0.8rem',
    textAlign: 'right'
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-blush)',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    padding: '4px'
  },
  diagramBox: {
    padding: '1.25rem',
    background: 'rgba(25, 10, 19, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  diagramDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem'
  },
  blockGridContainer: {
    minHeight: '520px',
    maxHeight: '680px',
    overflowY: 'auto',
    border: '1px solid rgba(241, 178, 204, 0.08)',
    background: '#090206',
    padding: '1.5rem',
    borderRadius: '2px'
  },
  blockGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'stretch'
  },
  spaceBlock: {
    flexGrow: 1,
    minWidth: '180px',
    minHeight: '130px',
    border: '1px solid',
    borderRadius: '4px',
    padding: '1.25rem',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  blockContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    height: '100%',
    justifyContent: 'space-between'
  },
  blockName: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: '1.4'
  },
  blockArea: {
    fontSize: '0.9rem',
    color: '#ffffff',
    fontWeight: 'bold',
    opacity: 0.9,
    alignSelf: 'flex-end',
    background: 'rgba(0,0,0,0.3)',
    padding: '2px 8px',
    borderRadius: '2px'
  },
  legendBar: {
    display: 'flex',
    gap: '1.25rem',
    justifyContent: 'center',
    marginTop: '0.75rem',
    borderTop: '1px solid rgba(241, 178, 204, 0.08)',
    paddingTop: '0.75rem'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legendDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  },
  // Matrix Styles
  matrixContainer: {
    padding: '1.5rem',
    background: 'rgba(25, 10, 19, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  matrixGridScroll: {
    width: '100%',
    overflowX: 'auto',
    border: '1px solid rgba(241, 178, 204, 0.08)',
    background: '#090206',
    borderRadius: '2px',
    padding: '1rem'
  },
  matrixTable: {
    borderCollapse: 'collapse',
    fontSize: '0.75rem',
    color: '#ffffff',
    margin: '0 auto',
    minWidth: '600px'
  },
  matrixThCorner: {
    padding: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.62rem',
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(241, 178, 204, 0.08)',
    borderRight: '1px solid rgba(241, 178, 204, 0.08)',
    width: '200px',
    textAlign: 'left'
  },
  matrixColTh: {
    width: '45px',
    height: '90px',
    position: 'relative',
    verticalAlign: 'bottom',
    borderBottom: '1px solid rgba(241, 178, 204, 0.08)'
  },
  verticalThWrapper: {
    transform: 'rotate(-45deg)',
    transformOrigin: 'left bottom',
    position: 'absolute',
    left: '12px',
    bottom: '8px',
    width: '120px',
    whiteSpace: 'nowrap',
    textAlign: 'left'
  },
  verticalThText: {
    fontSize: '0.58rem',
    color: 'var(--text-muted)'
  },
  matrixTr: {
    borderBottom: '1px solid rgba(241, 178, 204, 0.05)'
  },
  matrixRowHeader: {
    padding: '0.6rem 0.8rem',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    color: '#ffffff',
    fontSize: '0.78rem',
    borderRight: '1px solid rgba(241, 178, 204, 0.08)',
    width: '200px',
    textAlign: 'left'
  },
  matrixTd: {
    width: '45px',
    height: '35px',
    textAlign: 'center',
    verticalAlign: 'middle',
    borderRight: '1px solid rgba(241, 178, 204, 0.05)',
    userSelect: 'none',
    transition: 'background 0.2s ease'
  },
  matrixLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    borderTop: '1px solid rgba(241, 178, 204, 0.08)',
    paddingTop: '0.75rem',
    marginTop: '0.5rem'
  },
  matrixLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  conflictsSection: {
    marginTop: '1.5rem',
    borderTop: '1px solid rgba(200, 82, 124, 0.1)',
    paddingTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  conflictsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  conflictCard: {
    padding: '0.8rem 1rem',
    background: 'rgba(42, 17, 32, 0.1)',
    borderLeft: '2px solid var(--color-blush)',
    borderRadius: '2px'
  },
  conflictTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '0.25rem'
  },
  conflictDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  cleanValidation: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(9, 26, 15, 0.4)',
    border: '1px solid rgba(0, 255, 102, 0.15)',
    borderRadius: '2px',
    padding: '0.65rem 0.85rem'
  }
};
