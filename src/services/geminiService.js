/**
 * Service to handle Gemini API calls for architectural reviews.
 * Includes a robust, context-sensitive fallback engine to generate 
 * highly detailed simulated reviews if no API Key is provided.
 */

// Preset project templates to make it easy for the user to try the app
export const PRESETS = [
  {
    title: "Nile Delta Straw Bio-Composite Center",
    type: "Recycling & R&D Center",
    scale: "10 Feddan (~42,000 m²)",
    location: "Sheribin, Daqahlya, Egypt",
    climate: "Arid / Semi-Arid (Hot Summers, Nile Floodplain Humidity)",
    concept: "Transforming agricultural rice straw waste into modular bio-composite panels to eliminate the 'Black Cloud' smog and introduce a local digital-ecological vernacular.",
    materials: "Compressed rice straw blocks, mycelium binder, local clay/lime coatings.",
    constraints: "Alluvial floodplain soil (very low bearing capacity), high seasonal flooding, extreme summer heat, high flammability of dry straw, and social stigma around rural materials.",
    structuralSystem: "lightweight_frame", // Lightweight timber/bamboo skeleton
    foundationType: "screw_piles",       // Helical steel screw piles
    presentationAssets: ["renders", "sections", "axonometric"],
    uploadedImage: null
  },
  {
    title: "Red Sea Mangrove Regeneration Canopy",
    type: "Eco-Tourism & Marine Research Station",
    scale: "2.5 Feddan (~10,500 m²)",
    location: "Hurghada, Red Sea, Egypt",
    climate: "Hyper-Arid Marine (Intense UV, High Salinity, Strong Winds)",
    concept: "An elevated modular research canopy that floats above the intertidal mangrove forest, researching marine restoration while offering low-impact eco-tourism.",
    materials: "Recycled ocean plastics, structural salt-resistant bamboo, lightweight tensioned fabric sails, solar desalination stills.",
    constraints: "Extreme corrosion from salt water, tidal fluctuations, preserving fragile marine habitats, and high wind loading on canvas structures.",
    structuralSystem: "floating_pontoon", // Floating pontoon deck platform
    foundationType: "floating_mooring",   // Tension anchor mooring lines
    presentationAssets: ["renders", "axonometric"],
    uploadedImage: null
  },
  {
    title: "Mokattam Quarry Cultural Amphitheater",
    type: "Community Arts & Performance Center",
    scale: "5 Feddan (~21,000 m²)",
    location: "Mokattam Hills, Cairo, Egypt",
    climate: "Arid Desert (Hot Days, Cold Nights, Dusty Wind)",
    concept: "Carving a public cultural hub directly into the abandoned limestone cliffs, utilizing the thermal mass of the mountain for passive cooling and acoustic insulation.",
    materials: "Excavated limestone blocks, rammed earth, native desert vegetation roofs.",
    constraints: "Cliffside structural stability, seismic hazards, pedestrian access up steep terrain, dust storms, and lack of municipal water connection.",
    structuralSystem: "subterranean_carving", // Subterranean cliff carving & excavation
    foundationType: "bedrock_pins",          // Bedrock anchoring pins & tension bolts
    presentationAssets: ["sections", "physical_model"],
    uploadedImage: null
  }
];

export const STRUCTURAL_SYSTEMS = {
  lightweight_frame: "Lightweight timber/bamboo skeleton",
  heavy_frame: "Heavy steel/concrete columns & beams",
  load_bearing: "Load-bearing bio-composite/masonry shell",
  floating_pontoon: "Floating pontoon deck platform",
  subterranean_carving: "Subterranean cliff carving & excavation"
};

export const FOUNDATION_TYPES = {
  screw_piles: "Helical steel screw piles",
  deep_piles: "Deep concrete friction piles",
  shallow_raft: "Shallow concrete raft foundation",
  bedrock_pins: "Bedrock anchoring pins & tension bolts",
  floating_mooring: "Tension anchor mooring lines"
};

export const PRESENTATION_ASSETS = {
  renders: "3D Renderings & Visualizations",
  sections: "Technical Sections & Details",
  axonometric: "Exploded Axonometric Diagrams",
  physical_model: "Physical Scale Model",
  material_swatches: "Material Swatches & Texture Maps"
};

export async function generateArchitecturalReview(projectData, apiKey) {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await callRealGeminiAPI(projectData, apiKey);
    } catch (error) {
      console.error("Gemini API call failed, falling back to simulation engine:", error);
      const mockResult = generateMockReview(projectData);
      mockResult.apiError = true;
      return mockResult;
    }
  } else {
    // Artificial delay to simulate thinking agents
    await new Promise((resolve) => setTimeout(resolve, 3500));
    return generateMockReview(projectData);
  }
}

async function callRealGeminiAPI(projectData, apiKey) {
  const modelName = "gemini-1.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const sysSystem = STRUCTURAL_SYSTEMS[projectData.structuralSystem] || projectData.structuralSystem;
  const sysFound = FOUNDATION_TYPES[projectData.foundationType] || projectData.foundationType;
  const sysAssets = (projectData.presentationAssets || []).map(a => PRESENTATION_ASSETS[a] || a).join(', ');

  const systemPrompt = `
You are ARCHITECTURAL BRAIN, an advanced multi-agent architectural design studio.
Analyze the user's project parameters and return a JSON object matching this exact schema:
{
  "projectUnderstanding": {
    "type": "string",
    "site": "string",
    "goals": "string",
    "challenges": "string"
  },
  "agents": {
    "architect": {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "opportunities": ["string"],
      "precedent": "string",
      "score": number,
      "massingEdits": [
        {
          "title": "string",
          "description": "string"
        }
      ]
    },
    "sustainability": {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"],
      "score": number
    },
    "structural": {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"],
      "score": number
    },
    "ux": {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"],
      "score": number
    },
    "jury": {
      "criticalQuestions": ["string"],
      "mainRisks": ["string"]
    }
  },
  "directorSummary": {
    "areasOfAgreement": ["string"],
    "areasOfConflict": ["string"],
    "priorityImprovements": ["string"],
    "conceptScore": number,
    "spatialScore": number,
    "sustainabilityScore": number,
    "structuralScore": number,
    "innovationScore": number,
    "presentationScore": number,
    "overallScore": number
  },
  "nextActions": ["string"]
}

Critical Instructions:
1. Evaluate their Superstructure System and Foundation Type in relation to site constraints.
2. Under the "architect" agent object, evaluate the "massingEdits" (provide exactly 3 suggested geometric adjustments to improve their form, ventilation, or spatial layout).
3. If they choose an incompatible match (e.g., shallow raft on soft mud), penalize their Structural score and detail the hazards.
4. Evaluate their Presentation Score based on assets.
5. Reference architectural precedents matching their tectonics.
  `;

  const userPrompt = `
Review this project:
Title: ${projectData.title}
Project Type: ${projectData.type}
Scale: ${projectData.scale}
Location: ${projectData.location}
Climate: ${projectData.climate}
Design Concept: ${projectData.concept}
Materials: ${projectData.materials}
Constraints & Soil Conditions: ${projectData.constraints}
Superstructure System: ${sysSystem}
Foundation Type: ${sysFound}
Presentation Assets Provided: ${sysAssets}
Custom Rendering Uploaded: ${projectData.uploadedImage ? 'Yes' : 'No'}
  `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

// Client-side mock evaluation engine with structural compatibility logic
function generateMockReview(projectData) {
  const { 
    title, type, scale, location, climate, concept, 
    materials, constraints, structuralSystem, foundationType, 
    presentationAssets, uploadedImage 
  } = projectData;

  const matchesStraw = concept.toLowerCase().includes("straw") || materials.toLowerCase().includes("straw");
  const matchesMangrove = concept.toLowerCase().includes("mangrove") || location.toLowerCase().includes("sea") || location.toLowerCase().includes("mangrove");
  const matchesQuarry = location.toLowerCase().includes("quarry") || location.toLowerCase().includes("mokattam");
  const matchesFloodplain = constraints.toLowerCase().includes("floodplain") || constraints.toLowerCase().includes("alluvial") || location.toLowerCase().includes("sheribin") || location.toLowerCase().includes("delta");

  let pArchitect = "Ningbo History Museum by Wang Shu";
  let pSustainability = "The ICD/ITKE Pavilions (Stuttgart)";
  let pStructural = "Makoko Floating School by NLÉ";
  
  if (matchesMangrove) {
    pArchitect = "The Coral Reef Resort by Vincent Callebaut";
    pSustainability = "Eco-Machine Wetlands by John Todd";
    pStructural = "Bamboo structures by IBuku";
  } else if (matchesQuarry) {
    pArchitect = "The Steilneset Memorial by Peter Zumthor";
    pSustainability = "Earthships by Michael Reynolds";
    pStructural = "Tension grid structures by Frei Otto";
  }

  // --- 1. Structural Soil-Foundation Alignment Check ---
  let structuralPenalties = 0;
  let structuralWarnings = [];
  let structuralStrengths = [];

  const systemName = STRUCTURAL_SYSTEMS[structuralSystem] || "Stilted Frame";
  const foundationName = FOUNDATION_TYPES[foundationType] || "Shallow Footings";

  if (matchesFloodplain || matchesMangrove) {
    if (foundationType === 'shallow_raft') {
      structuralPenalties += 2.5;
      structuralWarnings.push(`HIGH SETTLEMENT HAZARD: Proposing a ${foundationName} on weak, saturated alluvial soil poses a severe risk of differential settlement and structural cracking.`);
    } else if (foundationType === 'bedrock_pins') {
      structuralPenalties += 2.0;
      structuralWarnings.push(`BEDROCK PIN INCOMPATIBILITY: Proposing ${foundationName} in a silt-dominated floodplain is ineffective as solid bedrock is deep beneath alluvial layers.`);
    } else if (foundationType === 'screw_piles' || foundationType === 'floating_mooring') {
      structuralStrengths.push(`SOIL-FOUNDATION ALIGNMENT: Utilizing ${foundationName} is highly appropriate, bypassing unstable topsoil layers and preserving local site hydrology.`);
    } else if (foundationType === 'deep_piles') {
      structuralStrengths.push(`HEAVY STABILITY: Using ${foundationName} ensures absolute anchoring into deep, load-bearing strata for heavy processing loads.`);
    }

    if (structuralSystem === 'heavy_frame') {
      structuralPenalties += 1.0;
      structuralWarnings.push(`DEAD LOAD CONCERN: A ${systemName} increases foundation loads on saturated silts, raising the risk of lateral spread during seismic cycles.`);
    } else if (structuralSystem === 'lightweight_frame' || structuralSystem === 'floating_pontoon') {
      structuralStrengths.push(`LIGHTWEIGHT INFILTRATION: The ${systemName} is ideal, reducing overall structural weight and site disturbance.`);
    }
  } else if (matchesQuarry) {
    if (foundationType === 'screw_piles') {
      structuralPenalties += 2.0;
      structuralWarnings.push(`PENETRATION ERROR: Helical screw piles cannot easily penetrate solid limestone bedrock, requiring hydraulic drilling and high energy.`);
    } else if (foundationType === 'bedrock_pins') {
      structuralStrengths.push(`ROCK ANCHORING SYNERGY: Utilizing bedrock pin anchors is excellent, transferring loads directly into the mountain's limestone structure.`);
    } else if (foundationType === 'shallow_raft') {
      structuralStrengths.push(`STABLE BEARING: Placed directly on cleared limestone bedrock, a shallow raft provides a highly stable, load-distributing foundation.`);
    }
  }

  if (structuralWarnings.length === 0) {
    structuralWarnings.push(`Minor lateral shear stability risks under wind loads depending on panel connections.`);
  }
  if (structuralStrengths.length === 0) {
    structuralStrengths.push(`Modular structural system allows for rapid prefabrication and high quality control.`);
  }

  // --- 2. Presentation Score Calculations ---
  const assetCount = (presentationAssets || []).length;
  let presentationScore = 5.0; 
  let presentationStrengths = [];
  let presentationWeaknesses = [];

  if (uploadedImage) {
    presentationScore += 1.5;
    presentationStrengths.push(`CUSTOM DRAWINGS INCLUDED: The designer submitted custom project sketches/renderings, enabling precise mapping of interactive callout coordinates.`);
  } else {
    presentationWeaknesses.push(`MISSING SITE VISUALIZATIONS: No custom renderings or plans were uploaded. The panel is reviewing based on generic material templates.`);
  }

  if (assetCount >= 4) {
    presentationScore += 3.0;
    presentationStrengths.push(`COMPREHENSIVE SCHEMATICS: Exploded axonometrics, 3D renderings, and details provide full clarity of both form and assembly logic.`);
  } else if (assetCount >= 2) {
    presentationScore += 1.5;
    presentationStrengths.push(`KEY DELIVERABLES PRESENT: Basic visual assets are available, helping communicate programmatic zoning.`);
    presentationWeaknesses.push(`EXPLODED TECTIONIC DETAIL MISSING: Additional axonometric and material details are highly recommended to communicate connection logic.`);
  } else {
    presentationScore -= 1.0;
    presentationWeaknesses.push(`MINIMAL PRESENTATION ASSETS: Lacks crucial drawings. At a minimum, technical sections and exploded schematics should be added to evaluate spatial scale.`);
  }

  const assetListText = (presentationAssets || []).map(a => PRESENTATION_ASSETS[a]).join(', ');
  if (assetCount > 0) {
    presentationStrengths.push(`Technical communication is supported by the submission of: ${assetListText}.`);
  }

  // --- 3. Geometric Massing Edits ---
  let massingEdits = [
    {
      title: "Stepped-Roof Volumetric Breaks",
      description: "Break the main processing hangar into modular stepped-roof envelopes. This redirects prevailing north winds downward to naturally exhaust hot air and dust while providing clerestory daylighting."
    },
    {
      title: "Elevated Pedestrian Void Corridors",
      description: "Incorporate public access walks as floating stilted loops raised 1.5m above the ground level. This forms structural voids that allow flooding water to flow unhindered, preventing hydrodynamic drag."
    },
    {
      title: "Bifurcated Tectonic Joints",
      description: "Avoid monolithic concrete corners. Use modular, interlocking joint connections made of engineered framing and bio-composite infills to allow thermal expansion without cracking."
    }
  ];

  if (matchesMangrove) {
    massingEdits = [
      {
        title: "Aerodynamic Canopy Slits",
        description: "Add structural slits and tension cables in the membrane roofs to reduce wind lift. This channels strong marine wind currents smoothly over the structure rather than loading columns."
      },
      {
        title: "Hexagonal Floating Cluster Modules",
        description: "Group the research bays into decentralized hexagonal clusters. Floating modules dynamically adapt to tidal cycles, minimizing shoreline habitat intrusion."
      },
      {
        title: "Elevated Solar Evaporator Voids",
        description: "Integrate hollow cavities inside structural bamboo columns to house passive solar desalination stills, saving layout footprint."
      }
    ];
  } else if (matchesQuarry) {
    massingEdits = [
      {
        title: "Cliffside Subterranean Terracing",
        description: "Terrace the amphitheater directly along the natural limestone contours. Excavating step profiles matches gravity pathways and naturally insulates spaces against desert wind cycles."
      },
      {
        title: "Acoustic Reflection Folds",
        description: "Introduce modular rammed earth reflector panels angled at 15 degrees. This reflects stage sound waves evenly across the cliff amphitheater without needing electronic amplification."
      },
      {
        title: "Wind-Scoop Shadow Portals",
        description: "Carve deep shadow portals along the southern cliff face to capture cool downward quarry drafts, acting as a passive air conditioner."
      }
    ];
  }

  // --- 4. Core Score Calculation ---
  const conceptScore = Math.min(9.5, Math.max(6.0, 6.5 + (concept.length % 30) / 10));
  const sustainabilityScore = Math.min(9.5, Math.max(5.5, 7.0 + (materials.toLowerCase().includes("recycled") || materials.toLowerCase().includes("bio") || matchesStraw ? 1.5 : 0)));
  const baseStructuralScore = 8.0 - structuralPenalties + (structuralStrengths.length * 0.5);
  const structuralScoreVal = Math.min(9.8, Math.max(4.0, baseStructuralScore));
  const spatialScore = Math.min(9.5, Math.max(6.0, 7.0 + (type.length % 20) / 10));
  const innovationScore = Math.min(9.8, Math.max(6.0, 7.5 + (materials.length % 15) / 10));
  const presentationScoreVal = Math.min(10.0, Math.max(4.0, presentationScore));
  
  const overallScore = Math.round(((conceptScore + sustainabilityScore + structuralScoreVal + spatialScore + innovationScore + presentationScoreVal) / 6) * 10) / 10;

  return {
    projectUnderstanding: {
      type: type || "Multifunctional Complex",
      site: `${location || "Unspecified Site"} (${climate || "Generic Climate"})`,
      goals: `Establish a structural tectonic system matching the local context of "${title}" while incorporating high-performance environmental systems.`,
      challenges: `Resolving the foundation requirements of the site, maintaining material integrity under local weathering, and balancing public and operational circulation.`
    },
    agents: {
      architect: {
        strengths: [
          `Clear spatial narrative transition matching the programmatic layout of ${type}.`,
          `Thoughtful translation of localized concepts into a recognizable architectural language.`,
          `Effective zoning that partitions industrial/development spaces from public exhibition areas.`
        ],
        weaknesses: [
          `Potential scale dispersion over the ${scale || "site"} area, which could lead to isolated, under-utilized spatial zones.`,
          `The threshold between zones remains programmatic rather than structurally integrated.`,
          `Risk of the main facilities feeling monolithic without modular break-downs in the massing.`
        ],
        opportunities: [
          `Implement an inhabited structural node system expressing the building materials as a spatial centerpiece.`,
          `Use stepped-roof profiles to control lighting levels and naturally ventilate high-volume spaces.`,
          `Design the primary link across the site as a functional gallery demonstrating material capacities.`
        ],
        precedent: pArchitect,
        score: Math.round(spatialScore * 10) / 10,
        massingEdits: massingEdits
      },
      sustainability: {
        strengths: [
          `High carbon sequestration potential based on the proposed organic/recycled components.`,
          `Excellent thermal insulating capabilities due to the dense fiber-matrix compositions.`,
          `Significant reduction in transport-related carbon emissions by focusing on regional site-specific feedstocks.`
        ],
        weaknesses: [
          `Hygrothermal degradation risks under the humid microclimate of the Nile/coastal site, which may lead to rapid decay if untreated.`,
          `Lack of specificity regarding non-toxic binders, leaving open the risk of formaldehyde or synthetic chemical emissions.`,
          `Energy footprint of the digital fabrication equipment could offset passive design carbon credits if not powered by on-site renewables.`
        ],
        recommendations: [
          `Utilize natural biocides (such as borate salts or lime washes) and local bio-resins or mycelium cultures for curing the panels.`,
          `Create a phytoremediation buffer canal along the site boundary to purify processing runoff.`,
          `Integrate solar chimneys to exhaust organic dust and heat from fabrication zones.`
        ],
        precedent: pSustainability,
        score: Math.round(sustainabilityScore * 10) / 10
      },
      structural: {
        strengths: structuralStrengths,
        weaknesses: structuralWarnings,
        recommendations: [
          `Utilize low-impact helical screw piles or floating pontoon foundations to bypass unstable surface soil layers.`,
          `Develop a hybrid tectonic skeleton (e.g. lightweight steel or engineered bamboo) to house the bio-composite panels as structural infill.`,
          `Integrate tension cables anchored to stable sub-strata to stabilize lightweight roofs against high-velocity winds.`
        ],
        precedent: pStructural,
        score: Math.round(structuralScoreVal * 10) / 10
      },
      ux: {
        strengths: [
          `Fibrous and acoustic properties of the modules provide high interior comfort and noise dampening.`,
          `The inclusion of live R&D labs demystifies material science and offers an engaging educational promenade.`
        ],
        weaknesses: [
          `Direct physical intersection of heavy supply transport routes and pedestrian visitor corridors.`,
          `Possible public reluctance or psychological stigma toward using structures composed of agricultural waste/organic scrap.`,
          `Inadequate shading and climate buffers along long outdoor exhibition paths.`
        ],
        recommendations: [
          `Raise pedestrian walkways above the industrial delivery plane using lightweight timber board walks.`,
          `Elevate the architectural finish of the bio-composites with digital milling textures to make them look premium and highly technological.`,
          `Incorporate microclimate pockets (wind-catching pavilions) along public circuits.`
        ],
        score: Math.round(conceptScore * 10) / 10
      },
      jury: {
        criticalQuestions: [
          `How will the facility remain productive during off-harvest seasons when raw material processing is idle?`,
          `Is the structural intrusion into a sensitive ecological boundary (such as the floodplain/mangrove) justified by its educational output?`,
          `What is the fire compartmentation strategy given the massive amounts of highly flammable materials stored on site?`
        ],
        mainRisks: [
          `Rapid material degradation due to direct moisture exposure and Nile Delta humidity.`,
          `Economic isolation if local communities do not adopt the prefabricated systems for their own builds.`,
          `Flooding/topographic inundation destroying prototype structures in the lower terraces.`
        ]
      }
    },
    directorSummary: {
      areasOfAgreement: [
        "A tectonic driven by local materials is the core value of the project.",
        "Zoning between mainland production and island/outdoor testing is appropriate.",
        "Using lightweight modules is highly beneficial for the fragile site soil conditions."
      ],
      areasOfConflict: [
        "Architectural desire for heavy monolithic form conflicts with structural/environmental requirements for lightweight, stilted modular systems.",
        "The public UX goal of accessibility conflicts with the industrial safety hazards of the processing labs."
      ],
      priorityImprovements: [
        "Integrate crop-rotation and secondary fiber feedstocks (bagasse, cotton stalks) for continuous annual production.",
        "Elevate all pavilions on helical steel screw piles to minimize site soil footprint and flood exposure.",
        "Utilize local clay-lime composites to coat the panels, providing natural fire retardancy and water resistance."
      ],
      conceptScore: Math.round(conceptScore * 10) / 10,
      spatialScore: Math.round(spatialScore * 10) / 10,
      sustainabilityScore: Math.round(sustainabilityScore * 10) / 10,
      structuralScore: Math.round(structuralScoreVal * 10) / 10,
      innovationScore: Math.round(innovationScore * 10) / 10,
      presentationScore: Math.round(presentationScoreVal * 10) / 10,
      overallScore: overallScore
    },
    nextActions: [
      "Design an active, inhabited pedestrian bridge that showcases bio-composite structural spans over the water boundary.",
      "Incorporate an automated sprinkler system and separate storage cells to mitigate dry straw stockpiling fire risks.",
      "Conduct dynamic hygrothermal laboratory testing of the bio-composite panels to establish Egyptian Delta weathering resistance.",
      "Establish an open-source structural module detail using engineered bamboo frames and bio-resin infills.",
      "Develop a wetland park landscape strategy featuring native reeds to filter graywater from industrial sorting."
    ]
  };
}
