import React, { useState, useRef } from 'react';
import { PRESETS, STRUCTURAL_SYSTEMS, FOUNDATION_TYPES, PRESENTATION_ASSETS } from '../services/geminiService';
import { ArrowRight, ArrowLeft, Cpu, Sparkles, Upload, X, FileImage } from 'lucide-react';

export default function ProjectForm({ onSubmit, initialData }) {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState(initialData || {
    title: '',
    type: '',
    scale: '',
    location: '',
    climate: '',
    concept: '',
    materials: '',
    constraints: '',
    structuralSystem: 'lightweight_frame',
    foundationType: 'screw_piles',
    presentationAssets: ['renders'],
    uploadedImage: null
  });

  const handlePresetSelect = (preset) => {
    setFormData({
      ...preset,
      uploadedImage: null // Reset upload on loading presets, so they can test defaults
    });
    setStep(1); // Return to start to inspect values
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (assetKey) => {
    setFormData(prev => {
      const current = prev.presentationAssets || [];
      const updated = current.includes(assetKey)
        ? current.filter(item => item !== assetKey)
        : [...current, assetKey];
      return { ...prev, presentationAssets: updated };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please choose a smaller sketch or rendering.");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      handleInputChange('uploadedImage', imageUrl);
    }
  };

  const removeImage = () => {
    handleInputChange('uploadedImage', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nextStep = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.concept) {
      alert("Please enter at least a Project Title and Design Concept.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={styles.container}>
      {/* Preset Pickers */}
      <div style={styles.presetsSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <Cpu size={14} color="var(--color-pink-orchid)" />
          <span className="mono-tag" style={{ fontSize: '0.7rem' }}>LOAD ECO-STUDIO PRESETS:</span>
        </div>
        <div style={styles.presetsGrid} className="presets-grid-responsive">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="tech-panel interactive"
              style={{
                ...styles.presetCard,
                borderColor: formData.title === p.title ? 'var(--color-pink-orchid)' : 'var(--panel-border)',
                background: formData.title === p.title ? 'rgba(200, 82, 124, 0.15)' : 'var(--panel-bg)'
              }}
              onClick={() => handlePresetSelect(p)}
            >
              <div style={styles.presetTitle}>{p.title}</div>
              <div style={styles.presetMeta} className="mono-tag">{p.type} // {p.location}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-step Form */}
      <form onSubmit={handleSubmit} className="tech-panel" style={styles.formPanel}>
        <div className="scan-line"></div>
        
        {/* Step Indicator */}
        <div style={styles.stepHeader}>
          <span className="mono-tag" style={{ fontSize: '0.8rem', color: 'var(--color-blush)' }}>
            [ SECTION 0{step} / 04 ]
          </span>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div style={styles.stepBody}>
            <h2 style={styles.stepTitle}>PROJECT IDENTITY & VISUALS</h2>
            <p style={styles.stepDesc}>Define the base parameters, scope, and upload your project sketch or rendering to be analyzed.</p>
            
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                placeholder="e.g., Cairo Eco-Insulated Modular Habitats"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={styles.inputRow}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label">Project Typology</label>
                <input
                  type="text"
                  placeholder="e.g., Cultural Center, High-rise Residential"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label">Scale (Area / Feddan / m²)</label>
                <input
                  type="text"
                  placeholder="e.g., 10 Feddan, 50,000 sqm"
                  value={formData.scale}
                  onChange={(e) => handleInputChange('scale', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Custom Image Upload Field */}
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Upload Presentation Image / Plan / Sketch (Optional)</label>
              {!formData.uploadedImage ? (
                <div 
                  style={styles.uploadBox} 
                  onClick={() => fileInputRef.current.click()}
                  className="tech-panel interactive"
                >
                  <Upload size={24} color="var(--color-pink-orchid)" />
                  <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                    Click to upload rendering (PNG, JPG - Max 5MB)
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div style={styles.previewContainer} className="tech-panel">
                  <div style={styles.previewHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileImage size={16} color="var(--color-pink-orchid)" />
                      <span className="mono-tag" style={{ fontSize: '0.7rem' }}>UPLINK_IMAGE.JPG</span>
                    </div>
                    <button type="button" style={styles.removeBtn} onClick={removeImage}>
                      <X size={14} /> Remove
                    </button>
                  </div>
                  <img 
                    src={formData.uploadedImage} 
                    alt="Uploaded blueprint preview" 
                    style={styles.uploadPreview}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={styles.stepBody}>
            <h2 style={styles.stepTitle}>SITE & CLIMATE MATRIX</h2>
            <p style={styles.stepDesc}>Specify the geographical context. The multi-agent jury evaluates structural foundations and solar/wind responses based on these parameters.</p>

            <div className="form-group">
              <label className="form-label">Site Location</label>
              <input
                type="text"
                placeholder="e.g., Sheribin, Daqahlya, Egypt"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Climate & Microclimate Conditions</label>
              <input
                type="text"
                placeholder="e.g., Arid, High solar radiation, River humidity"
                value={formData.climate}
                onChange={(e) => handleInputChange('climate', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={styles.stepBody}>
            <h2 style={styles.stepTitle}>ARCHITECTURE & MATERIAL SYSTEM</h2>
            <p style={styles.stepDesc}>Describe your concept and tectonic strategy. Our Sustainability and Structural agents will analyze carbon metrics and buildability.</p>

            <div className="form-group">
              <label className="form-label">Design Concept & Spatial Narrative</label>
              <textarea
                placeholder="Describe your design narrative, massing layout, and conceptual intent..."
                value={formData.concept}
                onChange={(e) => handleInputChange('concept', e.target.value)}
                className="form-textarea"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tectonic Components & Materials</label>
              <input
                type="text"
                placeholder="e.g., Compressed straw panels, Mycelium blocks, Bamboo joints"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={styles.stepBody}>
            <h2 style={styles.stepTitle}>TECTONICS, SOIL & PRESENTATION MATRIX</h2>
            <p style={styles.stepDesc}>Define the structural skeletons, foundation grids, and presentation deliverables. The panel will cross-reference these for feasibility scoring.</p>

            <div className="form-group" style={styles.inputRow}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label">Superstructure System</label>
                <select
                  value={formData.structuralSystem}
                  onChange={(e) => handleInputChange('structuralSystem', e.target.value)}
                  className="form-input"
                  style={{ background: 'rgba(15, 5, 11, 0.9)' }}
                >
                  {Object.entries(STRUCTURAL_SYSTEMS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label">Foundation Type</label>
                <select
                  value={formData.foundationType}
                  onChange={(e) => handleInputChange('foundationType', e.target.value)}
                  className="form-input"
                  style={{ background: 'rgba(15, 5, 11, 0.9)' }}
                >
                  {Object.entries(FOUNDATION_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checklist of Presentation Deliverables */}
            <div className="form-group">
              <label className="form-label">Presentation Assets Included</label>
              <div style={styles.checkboxGrid}>
                {Object.entries(PRESENTATION_ASSETS).map(([key, name]) => {
                  const isChecked = (formData.presentationAssets || []).includes(key);
                  return (
                    <label key={key} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(key)}
                        style={styles.checkboxInput}
                      />
                      <span style={{ fontSize: '0.8rem', color: isChecked ? '#ffffff' : 'var(--text-secondary)' }}>
                        {name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Site Soil Constraints & Environmental Hazards</label>
              <textarea
                placeholder="e.g., Alluvial clay soil with high settlement risk, seasonal flooding, low fire resistance, local social stigmas..."
                value={formData.constraints}
                onChange={(e) => handleInputChange('constraints', e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div style={styles.formFooter}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="tech-btn" style={styles.navBtn}>
              <ArrowLeft size={14} style={{ marginRight: '6px' }} /> PREVIOUS
            </button>
          ) : (
            <div style={{ flex: 1 }}></div>
          )}

          {step < 4 ? (
            <button type="button" onClick={nextStep} className="tech-btn primary" style={styles.navBtn}>
              NEXT <ArrowRight size={14} style={{ marginLeft: '6px' }} />
            </button>
          ) : (
            <button type="submit" className="tech-btn primary" style={{ ...styles.navBtn, borderColor: 'var(--color-blush)' }}>
              <Sparkles size={14} style={{ marginRight: '6px' }} /> RUN ARCHITECTURAL REVIEW
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1rem 0'
  },
  presetsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  presetsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
  },
  presetCard: {
    textAlign: 'left',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    borderRadius: '4px'
  },
  presetTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#ffffff'
  },
  presetMeta: {
    fontSize: '0.65rem',
    color: 'var(--color-pink-orchid)',
  },
  formPanel: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    background: 'rgba(25, 10, 19, 0.3)'
  },
  stepHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderBottom: '1px solid rgba(241, 178, 204, 0.1)',
    paddingBottom: '1rem'
  },
  progressTrack: {
    width: '100%',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '1px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-berry), var(--color-pink-orchid))',
    transition: 'width 0.3s ease-in-out'
  },
  stepBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    minHeight: '260px'
  },
  stepTitle: {
    fontSize: '1.2rem',
    letterSpacing: '0.05em',
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  stepDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '0.5rem'
  },
  inputRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  uploadBox: {
    width: '100%',
    height: '110px',
    border: '2px dashed var(--panel-border)',
    background: 'rgba(15, 5, 11, 0.4)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '1rem'
  },
  previewContainer: {
    padding: '0.75rem',
    background: 'rgba(15, 5, 11, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-blush)',
    cursor: 'pointer',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  uploadPreview: {
    width: '100%',
    height: '140px',
    objectFit: 'contain',
    background: '#080205',
    borderRadius: '2px',
    border: '1px solid rgba(241, 178, 204, 0.1)'
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '0.6rem',
    background: 'rgba(15, 5, 11, 0.4)',
    padding: '1rem',
    borderRadius: '2px',
    border: '1px solid rgba(200, 82, 124, 0.08)'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  checkboxInput: {
    accentColor: 'var(--color-pink-orchid)',
    cursor: 'pointer'
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(241, 178, 204, 0.1)',
    paddingTop: '1.5rem',
    marginTop: '0.5rem'
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.6rem 1.2rem',
    fontSize: '0.8rem',
  }
};
