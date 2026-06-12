/**
 * Service to handle Gemini API calls for architectural reviews.
 * Includes a robust, context-sensitive fallback engine to generate 
 * highly detailed simulated reviews if no API Key is provided.
 */

// Paste your Google Gemini API Key here to enable live AI evaluations for all users automatically
export const HARDCODED_API_KEY = process.env.GEMINI_API_KEY;

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
    uploadedImage: null,
    image: "/holographic_pavilion.png",
    refinedImage: "/holographic_refined.png"
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
    uploadedImage: null,
    image: "/mangrove_canopy.png",
    refinedImage: "/mangrove_refined.png"
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
    uploadedImage: null,
    image: "/quarry_amphitheater.png",
    refinedImage: "/quarry_refined.png"
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
  const activeKey = (HARDCODED_API_KEY && HARDCODED_API_KEY !== "PASTE_YOUR_GEMINI_API_KEY_HERE")
    ? HARDCODED_API_KEY
    : apiKey;

  if (activeKey && activeKey.trim().length > 10) {
    try {
      return await callRealGeminiAPI(projectData, activeKey);
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
  const modelName = "gemini-2.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const sysSystem = STRUCTURAL_SYSTEMS[projectData.structuralSystem] || projectData.structuralSystem || "Lightweight timber/bamboo skeleton";
  const sysFound = FOUNDATION_TYPES[projectData.foundationType] || projectData.foundationType || "Helical steel screw piles";
  const sysAssets = (projectData.presentationAssets || []).map(a => PRESENTATION_ASSETS[a] || a).join(', ') || "3D Renderings";

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
    "overallScore": number,
    "scoreJustifications": {
      "concept": "string",
      "spatial": "string",
      "sustainability": "string",
      "structural": "string",
      "innovation": "string",
      "presentation": "string"
    },
    "agentDebates": [
      {
        "agents": "string",
        "argument": "string"
      }
    ]
  },
  "nextActions": ["string"]
}

STRICT INSTRUCTIONS FOR GEOGRAPHICAL ADHERENCE:
1. Evaluate ONLY the specific site conditions and geography provided in the user's location and constraints.
2. DO NOT invent geographical features (like islands, water channels, bridge crossings, or cliffs) if they are not explicitly written in the user's site input.
3. If the user's site is on the mainland, describe land parcels and roads. If the site is coastal, describe intertidal/marine features. Adhere strictly to this context.

STRICT INSTRUCTIONS FOR ENVIRONMENTAL DATA:
1. Pull or simulate hyper-local environmental data: e.g. the prevailing North-Western wind patterns of the Daqahlya region, the low bearing capacity of Delta alluvial soils (typically 40-60 kPa), solar angles at Egypt's Delta latitude (around 31° N), etc.

STRICT INSTRUCTIONS FOR SCORING & TRANSPARENCY:
1. Under "scoreJustifications", provide a concrete 1-2 sentence explanation for each score. For example, explain exactly why they lost or gained points (e.g. "Squeezing an 8,000 sqm dedicated production area into 2 available flat mainland parcels creates severe circulation bottlenecks, restricting safe public access").
2. Under "agentDebates", provide exactly 2 dialogue-like debates between agents (e.g. Structural Agent vs. Sustainability Agent arguing over rammed earth loads on alluvial clay).
3. "nextActions" must contain quantitative next steps (e.g., specifying structural grids like 6m x 6m, U-value thresholds like 0.18 W/m²K, or windbreak heights).

STRICT INSTRUCTIONS FOR MULTIMODAL IMAGE ANALYSIS:
1. If an image/sketch is uploaded in the parts, you MUST perform a detailed analysis of the visual drawing or rendering.
2. Reference specific shapes, geometries, materials, openings, or roof profiles visible in the image. Do NOT give generic templates.
3. In the Architect Agent evaluation:
   - Identify the primary architectural form visible (e.g., dome, rectangular frame, circular pavilion, canopy).
   - Under strengths, praise specific elements shown in the rendering (e.g., "The circular deck form promotes centralized gathering").
   - Under weaknesses, critique specific visual vulnerabilities or structural weaknesses visible (e.g., "Lack of diagonal bracing on stilted columns").
   - In "massingEdits", suggest 3 adjustments to the exact shape seen in the image.
4. Under "scoreJustifications.presentation", explain your score based on the details, section cuts, and drawings visible in the upload.
  `;

  const userPrompt = `
Review this project:
Title: ${projectData.title || "Untitled"}
Project Type: ${projectData.type || "Recycling & Community"}
Scale: ${projectData.scale || "10 Feddan"}
Location: ${projectData.location || "Daqahlya, Egypt"}
Climate: ${projectData.climate || "Arid"}
Design Concept: ${projectData.concept || "Recycling agricultural waste"}
Materials: ${projectData.materials || "Bio-composites"}
Constraints & Soil Conditions: ${projectData.constraints || "Soft soil"}
Superstructure System: ${sysSystem}
Foundation Type: ${sysFound}
Presentation Assets Provided: ${sysAssets}
Custom Rendering Uploaded: ${projectData.uploadedImage ? 'Yes' : 'No'}
  `;

  const parts = [{ text: userPrompt }];
  if (projectData.uploadedImageBase64 && projectData.uploadedImageMimeType) {
    parts.push({
      inlineData: {
        mimeType: projectData.uploadedImageMimeType,
        data: projectData.uploadedImageBase64
      }
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: parts
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
  
  // Defensive markdown code-fence scrubbing
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, "");
    cleanText = cleanText.replace(/\s*```$/i, "");
  }
  
  return JSON.parse(cleanText);
}

// Client-side mock evaluation engine with strict context filters and justifications
export function generateMockReview(projectData) {
  try {
    const { 
      title, type, scale, location, climate, concept, 
      materials, constraints, structuralSystem, foundationType, 
      presentationAssets, uploadedImage 
    } = projectData || {};

    // Defensive string mappings to prevent toLowerCase() crashes on undefined parameters
    const titleStr = title || "Untitled Project";
    const typeStr = type || "Multifunctional Complex";
    const scaleStr = scale || "Unspecified Scale";
    const locationStr = location || "Unspecified Location";
    const climateStr = climate || "Arid Climate";
    const conceptStr = concept || "Architectural design intervention";
    const materialsStr = materials || "Local materials";
    const constraintsStr = constraints || "Standard geological constraints";

    const rawText = (locationStr + " " + conceptStr + " " + constraintsStr).toLowerCase();
    
    const hasIsland = rawText.includes("island") || rawText.includes("floodplain island");
    const hasWater = rawText.includes("water") || rawText.includes("sea") || rawText.includes("river") || rawText.includes("marine") || rawText.includes("lake") || hasIsland;
    const hasQuarry = rawText.includes("quarry") || rawText.includes("cliff") || rawText.includes("mountain");
    const hasMainlandOnly = !hasIsland && !hasQuarry;
    const matchesStraw = rawText.includes("straw") || materialsStr.toLowerCase().includes("straw");

    let siteType = "mainland";
    if (hasIsland) siteType = "island";
    else if (hasQuarry) siteType = "quarry";

    // Precedents adjusted by context
    let pArchitect = "Ningbo History Museum by Wang Shu (Mainland recycling context)";
    let pSustainability = "The ICD/ITKE Pavilions (Stuttgart)";
    let pStructural = "Modular framing systems by KieranTimberlake";
    
    if (siteType === "island") {
      pArchitect = "The Bamboo Research Station by Ibuku";
      pStructural = "Makoko Floating School by NLÉ (Adaptive water tectonics)";
    } else if (siteType === "quarry") {
      pArchitect = "The Steilneset Memorial by Peter Zumthor";
      pSustainability = "Earthships by Michael Reynolds";
      pStructural = "Tension grid structures by Frei Otto";
    }

    // --- 2. Structural & Soil Calculations ---
    let structuralPenalties = 0;
    let structuralWarnings = [];
    let structuralStrengths = [];

    const systemName = STRUCTURAL_SYSTEMS[structuralSystem] || "Stilted Frame";
    const foundationName = FOUNDATION_TYPES[foundationType] || "Shallow Footings";

    if (siteType === "island" || (hasWater && siteType === "mainland")) {
      // Saturated alluvial Delta/waterfront soils
      if (foundationType === 'shallow_raft') {
        structuralPenalties += 2.5;
        structuralWarnings.push(`HIGH SETTLEMENT HAZARD: Proposing a ${foundationName} on Delta alluvial soil (bearing capacity ~45 kPa) creates high differential settlement risk without piling.`);
      } else if (foundationType === 'bedrock_pins') {
        structuralPenalties += 2.0;
        structuralWarnings.push(`ANCHORING ERROR: Bedrock pins cannot grip saturated silt. Friction piles or helical screw piles are required.`);
      } else if (foundationType === 'screw_piles' || foundationType === 'floating_mooring') {
        structuralStrengths.push(`HYDROLOGICAL CONFORMITY: Using ${foundationName} handles seasonal water flow and respects Delta silt geology.`);
      } else if (foundationType === 'deep_piles') {
        structuralStrengths.push(`HEAVY ANCHORING: Deep friction piles successfully lock loads into the underlying sandy layers.`);
      }

      if (structuralSystem === 'heavy_frame') {
        structuralPenalties += 1.0;
        structuralWarnings.push(`DEAD LOAD WARNING: A ${systemName} adds heavy structural load on soft Delta silt, increasing seismic shear risks.`);
      } else if (structuralSystem === 'lightweight_frame') {
        structuralStrengths.push(`MATERIAL DISPLACEMENT: Lightweight framing reduces dead weight to under 12 kN/m², ideal for soft clays.`);
      }
    } else if (siteType === "quarry") {
      // Rocky cliffside
      if (foundationType === 'screw_piles') {
        structuralPenalties += 2.0;
        structuralWarnings.push(`PENETRATION FAILURE: Helical screw piles are incompatible with solid limestone cliffs, requiring extensive drilling.`);
      } else if (foundationType === 'bedrock_pins') {
        structuralStrengths.push(`ROCK ANCHORING MATRIX: Bedrock pins secure structural frames directly into cliff limestone strata.`);
      }
    } else {
      // Flat Mainland Soil
      if (foundationType === 'shallow_raft') {
        structuralStrengths.push(`MAINLAND STABILITY: Placed on flat agricultural clay, a shallow concrete raft distributes low-density modular loads adequately.`);
      } else if (foundationType === 'screw_piles') {
        structuralStrengths.push(`SOIL RESPECT: Helical piles bypass weak topsoil layers with zero excavation.`);
      }
      if (structuralSystem === 'heavy_frame') {
        structuralPenalties += 0.5;
        structuralWarnings.push(`OVER-ENGINEERED SHELL: Placing heavy steel/concrete frames on agricultural mainland parcels increases carbon footprint unnecessarily.`);
      }
    }

    // --- 3. Score Calculations & Justifications ---
    const assetCount = (presentationAssets || []).length;
    let presentationScore = 5.0; 
    let presentationStrengths = [];
    let presentationWeaknesses = [];

    if (uploadedImage) {
      presentationScore += 1.5;
      presentationStrengths.push(`CUSTOM DRAWINGS INTEGRATED: Custom project drawings/renderings are uploaded, allowing callout overlays.`);
    } else {
      presentationWeaknesses.push(`NO PLAN UPLOADED: Lacks customized rendering uplinks. Review utilizes generic layouts.`);
    }

    if (assetCount >= 4) {
      presentationScore += 3.0;
      presentationStrengths.push(`COMPREHENSIVE INDEX: Exploded axonometrics and sections describe both material details and overall massing.`);
    } else if (assetCount >= 2) {
      presentationScore += 1.5;
      presentationStrengths.push(`BASIC DELIVERABLES: Initial plans and rendering visualizations provide typological clarity.`);
      presentationWeaknesses.push(`DETAILS MISSING: Exposing assembly joints requires exploded axonometrics and detailed sections.`);
    } else {
      presentationScore -= 1.0;
      presentationWeaknesses.push(`MINIMAL INDEX: Submission lacks technical layout details, making scale analysis arbitrary.`);
    }

    const conceptScore = Math.min(9.5, Math.max(6.0, 7.0 + (conceptStr.length % 20) / 10));
    const sustainabilityScore = Math.min(9.5, Math.max(5.5, 7.5 + (materialsStr.toLowerCase().includes("recycled") || materialsStr.toLowerCase().includes("bio") || matchesStraw ? 1.0 : 0)));
    const baseStructuralScore = 8.5 - structuralPenalties + (structuralStrengths.length * 0.5);
    const structuralScoreVal = Math.min(9.8, Math.max(4.0, baseStructuralScore));
    const spatialScore = Math.min(9.5, Math.max(5.5, 6.8 + (typeStr.length % 25) / 10));
    const innovationScore = Math.min(9.8, Math.max(6.0, 7.2 + (materialsStr.length % 15) / 10));
    const presentationScoreVal = Math.min(10.0, Math.max(4.0, presentationScore));
    
    const overallScore = Math.round(((conceptScore + sustainabilityScore + structuralScoreVal + spatialScore + innovationScore + presentationScoreVal) / 6) * 10) / 10;

    // --- 4. Mathematical Score Justifications ---
    const justifyConcept = `Recycling agricultural waste directly targets the Daqahlya 'Black Cloud' window, but lacks programmatic crop-rotation specifications for the 10 off-harvest months.`;
    
    const justifySpatial = siteType === "island"
      ? `Zoning programmatic loops between the mainland and the floodplain island creates a poetic narrative, but increases material transport transitions by 15% across the river channel.`
      : `Squeezing a high-volume processing facility into the mainland flat parcels restricts safe visitor routes, creating a circulation bottleneck near the loading bays.`;

    const justifySustainability = `Compressed straw provides excellent thermal insulation ($U$-value of $0.18 \\text{ W/m}^2\\text{K}$), but lack of biodegradable spec for the binder resin threatens overall material lifecycle loop.`;
    
    const justifyStructural = siteType === "island"
      ? `The alluvial clay's low bearing capacity ($45 \\text{ kPa}$) requires stilted helical piles; choosing ${foundationName} without friction grids causes differential settlement.`
      : `Flat agricultural clay parcels support lightweight modular frames, but choosing ${foundationName} without subsoil piles leads to a 20mm differential settlement under heavy load.`;

    const justifyInnovation = `Using digital fabrication to curate custom, interlocking organic bio-composite panels introduces a high-tech regionalism to Delta agricultural zones.`;

    const justifyPresentation = `Provided ${assetCount} deliverables. Rating reflects ${assetCount >= 4 ? 'comprehensive exploded details and 3D renderings' : 'lack of detailed sections and axonometric assembly profiles'} to evaluate scale.`;

    // --- 5. Dynamic Agent Debate Panel ---
    const debate1 = {
      agents: "Structural Agent vs. Sustainability Agent",
      argument: siteType === "quarry"
        ? "The Sustainability Agent prefers heavy rammed earth walls for thermal mass, but the Structural Agent warns that cliffside seismic acceleration profiles require lightweight tensile skeletons to avoid cantilever shear failure."
        : "The Sustainability Agent suggests heavy earth-silt plaster coatings for insulation, but the Structural Agent flags that adding mass to stilted structures on Delta alluvial clay (bearing capacity 45 kPa) will cause settlement without piling."
    };

    const debate2 = {
      agents: "User Experience (UX) Agent vs. Architect Agent",
      argument: `The Architect Agent designs high-clearance, open-plan digital fabrication bays, but the UX Agent flags that raw straw processing creates particulate dust (>150 µg/m³) and noise (>85 dB), which will pollute visitor spaces without a sealed spatial buffer.`
    };

    // --- 6. Dynamic Context-Adherent Agreements & Weaknesses ---
    let areasOfAgreement = [
      "Utilizing local agricultural waste as a carbon-sink tectonic matches the regional material crisis.",
      "Zoning clean R&D spaces away from raw material delivery paths is programmatically correct."
    ];
    let areasOfConflict = [
      "Structural requirement for lightweight stilted foundations conflicts with the architectural desire for solid massing.",
      "Industrial safety hazards (dust, noise) conflict with public user experience accessibility goals."
    ];

    if (siteType === "island") {
      areasOfAgreement.push("Zoning between the mainland factory and the island testing grounds separates heavy logistics from public zones.");
      areasOfConflict.push("Developing the floodplain island introduces environmental hazards, contradicting the project's zero-impact ecological goals.");
    } else if (siteType === "quarry") {
      areasOfAgreement.push("Carving directly into quarry walls takes advantage of the limestone's high thermal mass.");
      areasOfConflict.push("Cliff stability risks conflict with the structural requirement for open community seating spans.");
    } else {
      areasOfAgreement.push("Locating the facility strictly on flat mainland parcels simplifies logistics and truck access.");
      areasOfConflict.push("Squeezing both industrial shredders and retail shops on mainland parcels creates high circulation friction.");
    }

    // --- 7. Quantitative Next Actions ---
    const nextActions = [
      `Optimize the structural grid to a $6.0\\text{m} \\times 6.0\\text{m}$ span using helical steel screw piles to distribute the $12 \\text{ kN/m}^2$ dead load of the bio-composite panels.`,
      `Specify $300\\text{mm}$ thick compressed straw panels to target a $U$-value of $0.18 \\text{ W/m}^2\\text{K}$, aligning with Egypt's hot-climate thermal codes.`,
      siteType === "island"
        ? `Conduct a site-wide hydrological model to set finished floor levels (FFL) at least $1.2\\text{m}$ above the 50-year Nile flood level.`
        : `Dimension a $4.5\\text{m}$ wide elevated pedestrian boardwalk to completely isolate visitor pathways from heavy agricultural machinery corridors.`,
      `Design a series of $3.5\\text{m}$ tall local casuarina windbreak strips along the North-Western site boundary to screen prevailing delta winds and filter organic dust.`,
      `Formulate a natural mycelium binder matrix cured at $28^\\circ\\text{C}$ to replace synthetic polyurethane adhesives, maintaining 100% circular biodegradability.`
    ];

    // --- 8. Form & Massing Edits ---
    let massingEdits = [
      {
        title: "Stepped-Roof Volumetric Breaks",
        description: "Break the main processing hangar into modular stepped-roof envelopes. This redirects prevailing north-western delta winds downward to naturally exhaust hot air and dust while providing clerestory daylighting."
      },
      {
        title: "Elevated Pedestrian Void Corridors",
        description: `Incorporate public access walks as floating stilted loops raised 1.5m above the ground level. This forms structural voids ${siteType === 'island' ? 'that allow flooding water to flow' : 'for ventilation and separates visitors from transport paths'}.`
      },
      {
        title: "Bifurcated Tectonic Joints",
        description: "Avoid monolithic concrete corners. Use modular, interlocking joint connections made of engineered framing and bio-composite infills to allow thermal expansion without cracking."
      }
    ];

    return {
      projectUnderstanding: {
        type: typeStr,
        site: `${locationStr} (${climateStr})`,
        goals: `Establish a structural tectonic system matching the local context of "${titleStr}" while incorporating high-performance environmental systems.`,
        challenges: `Resolving the foundation requirements of the site, maintaining material integrity under local weathering, and balancing public and operational circulation.`
      },
      agents: {
        architect: {
          strengths: [
            `Clear spatial narrative transition matching the programmatic layout of ${typeStr}.`,
            `Thoughtful translation of localized concepts into a recognizable architectural language.`,
            `Effective zoning that partitions industrial/development spaces from public exhibition areas.`
          ],
          weaknesses: [
            `Potential scale dispersion over the ${scaleStr} area, which could lead to isolated, under-utilized spatial zones.`,
            siteType === "island" 
              ? "The bridge threshold between mainland and island remains programmatic rather than structurally integrated."
              : "Zoning the entire program onto flat land parcels creates tight circulation boundaries.",
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
            siteType === "island"
              ? "Is the structural intrusion into a sensitive ecological boundary (such as the floodplain island) justified by its educational output?"
              : "Does placing high-volume agricultural recycling next to public retail zones on flat mainland parcels violate zoning and safety guidelines?",
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
        areasOfAgreement: areasOfAgreement,
        areasOfConflict: areasOfConflict,
        priorityImprovements: [
          "Integrate crop-rotation and secondary fiber feedstocks (bagasse, cotton stalks) for continuous annual production.",
          siteType === "island"
            ? "Elevate all pavilions on helical steel screw piles to minimize site soil footprint and flood exposure."
            : "Optimize traffic flow and build elevated visitor corridors to isolate heavy truck delivery loops.",
          "Utilize local clay-lime composites to coat the panels, providing natural fire retardancy and water resistance."
        ],
        conceptScore: Math.round(conceptScore * 10) / 10,
        spatialScore: Math.round(spatialScore * 10) / 10,
        sustainabilityScore: Math.round(sustainabilityScore * 10) / 10,
        structuralScore: Math.round(structuralScoreVal * 10) / 10,
        innovationScore: Math.round(innovationScore * 10) / 10,
        presentationScore: Math.round(presentationScoreVal * 10) / 10,
        overallScore: overallScore,
        scoreJustifications: {
          concept: justifyConcept,
          spatial: justifySpatial,
          sustainability: justifySustainability,
          structural: justifyStructural,
          innovation: justifyInnovation,
          presentation: justifyPresentation
        },
        agentDebates: [debate1, debate2]
      },
      nextActions: nextActions
    };
  } catch (err) {
    console.error("Critical error in mock engine fallback, executing hardcoded safety review:", err);
    // Hardcoded fallback review that is structurally identical to prevent any rendering crash
    return {
      projectUnderstanding: {
        type: projectData?.type || "Recycling & R&D Center",
        site: projectData?.location || "Egypt",
        goals: "Perform comprehensive multi-agent architectural review.",
        challenges: "Resolving foundation grids on soft soil and regional weathering."
      },
      agents: {
        architect: {
          strengths: ["Clear zoning separation of industrial and public retail blocks."],
          weaknesses: ["Scale dispersion over the site area creates isolated zones."],
          opportunities: ["Use stepped-roof profiles to control north light and hot air venting."],
          precedent: "Ningbo History Museum by Wang Shu",
          score: 8.0,
          massingEdits: [
            { title: "Stepped-Roof Volumetric Breaks", description: "Vents hot air." },
            { title: "Elevated Pedestrian Boardwalks", description: "Avoids vehicle crossover." },
            { title: "Bifurcated Interlocking Joints", description: "Controls thermal shifts." }
          ]
        },
        sustainability: {
          strengths: ["High carbon sequestration potential using raw agricultural feedstocks."],
          weaknesses: ["Hygrothermal degradation under seasonal river humidity patterns."],
          recommendations: ["Treat panels with natural borate salts and specify bio-resins."],
          precedent: "The ICD/ITKE Pavilions (Stuttgart)",
          score: 8.2
        },
        structural: {
          strengths: ["Lightweight frames minimize structural loads on weak alluvial clays."],
          weaknesses: ["Soft soil bearing capacity (45 kPa) requires screw piles to prevent settlement."],
          recommendations: ["Anchor superstructure onto steel helical piles on a 6m x 6m grid."],
          precedent: "Makoko Floating School by NLÉ",
          score: 7.8
        },
        ux: {
          strengths: ["Tactile warmth of organic bio-composites provides acoustic comfort."],
          weaknesses: ["Crossover traffic between visitors and delivery logistics."],
          recommendations: ["Raise public walkways 1.5m above the logistics grid."],
          score: 8.0
        },
        jury: {
          criticalQuestions: ["How does the factory remain productive off-season?", "Are fire containment silos included?"],
          mainRisks: ["Rapid panel rot due to water contact", "Community rejection of straw aesthetics"]
        }
      },
      directorSummary: {
        areasOfAgreement: ["Tectonic drive using bio-composites is correct.", "Stilted design helps prevent water damage."],
        areasOfConflict: ["Heavy concrete shell desires conflict with soft clay bearing capacities."],
        priorityImprovements: ["Elevate frames on helical piles.", "Separate logistics from public walkway loops."],
        conceptScore: 8.0,
        spatialScore: 8.0,
        sustainabilityScore: 8.2,
        structuralScore: 7.8,
        innovationScore: 8.5,
        presentationScore: 8.0,
        overallScore: 8.1,
        scoreJustifications: {
          concept: "Strong concept targeting delta waste smog.",
          spatial: "Modularity matches local rural typologies.",
          sustainability: "Insulation lowers cooling loads.",
          structural: "Helical piles bypass soft alluvial clay.",
          innovation: "Digital composite fabrication.",
          presentation: "Provides renders and details."
        },
        agentDebates: [
          { agents: "Structural vs. Sustainability", argument: "Heavy rammed earth facades will sink into Delta clay." },
          { agents: "UX vs. Architect", argument: "Machinery sound levels are too high for unsealed galleries." }
        ]
      },
      nextActions: [
        "Optimize structural grid to a $6.0\\text{m} \\times 6.0\\text{m}$ span using screw piles.",
        "Specify $300\\text{mm}$ thick panels to target a $U$-value of $0.18 \\text{ W/m}^2\\text{K}$."
      ]
    };
  }
}

export function getPollinationsImageUrl(projectData, massingEdits) {
  const title = projectData?.title || "Architectural design";
  const location = projectData?.location || "";
  const concept = projectData?.concept || "";
  const materials = projectData?.materials || "";
  const editsText = (massingEdits || [])
    .map((e, idx) => `Edit ${idx+1}: ${e.title} - ${e.description}`)
    .join(". ");

  const basePrompt = `An architectural rendering of the refined design for: ${title} ${location ? 'located in ' + location : ''}. Concept: ${concept}. Materials: ${materials}. Massing upgrades: ${editsText}. Professional 3D architectural visualization, realistic materials, photorealistic, daytime, beautiful outdoor environment, architectural award winning style.`;
  
  const cleanPrompt = encodeURIComponent(basePrompt.trim());
  const seed = Math.abs(title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000;
  
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=512&height=512&seed=${seed}&nologo=true`;
}
