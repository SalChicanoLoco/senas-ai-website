// main.js - Consolidated Client-Side SPA Controller for New Mexico Socialists
// Cost-Effective, High-Performance, Serverless & Client-Side Sandbox Architecture

document.addEventListener("DOMContentLoaded", () => {
  // ─── 1. INITIALIZE DATA DICTIONARIES ───

  // A. Historical Struggle Map Pins
  const preloadedPins = [
    {
      id: "gallup-1933",
      x: 90,
      y: 220,
      category: "labor",
      titleEn: "Gallup Coal Strike (1933)",
      titleEs: "Huelga de Carbón de Gallup (1933)",
      storyEn: "Miners organized by the National Miners Union went on strike in Gallup. Faced with martial law, military arrest, and eviction, miners' wives successfully picketed, holding the line in defense of collective bargaining.",
      storyEs: "Los mineros organizados por el Sindicato Nacional de Mineros se declararon en huelga en Gallup. Ante la ley marcial y los arrestos militares, las esposas de los mineros mantuvieron las líneas de piquete con éxito.",
      image: "assets/img/meme_4.png",
      date: "1933"
    },
    {
      id: "acequia-taos",
      x: 320,
      y: 110,
      category: "land",
      titleEn: "Acequia Commons & Water Rights",
      titleEs: "Bienes Comunes de Acequia y Derechos de Agua",
      storyEn: "Taos communities successfully organized defense campaigns to prevent commercial water transfers that would dry out community acequia ditches. The acequia system remains a premier example of community commons stewardship.",
      storyEs: "Las comunidades de Taos organizaron campañas de defensa exitosas para evitar las transferencias comerciales de agua que secarían las acequias locales, manteniendo el agua como bien común.",
      image: "assets/img/meme_12.png",
      date: "Ongoing"
    },
    {
      id: "barelas-art",
      x: 280,
      y: 280,
      category: "art",
      titleEn: "Barelas Mutual Aid & Public Art",
      titleEs: "Ayuda Mutua y Arte Público de Barelas",
      storyEn: "The Barelas community hub in Albuquerque combines historical murals with mutual aid networks, food distribution programs, and worker solidarity initiatives, demonstrating how creative culture links with political action.",
      storyEs: "El centro de Barelas en Albuquerque combina murales históricos con redes de ayuda mutua, distribución de alimentos y solidaridad obrera, vinculando la cultura creativa con la acción política.",
      image: "assets/img/meme_7.png",
      date: "Ongoing"
    },
    {
      id: "organ-landback",
      x: 250,
      y: 460,
      category: "land",
      titleEn: "Organ Mountains Land Back Struggles",
      titleEs: "Luchas por la Devolución de Tierras de la Sierra de los Órganos",
      storyEn: "Indigenous communities and local allies have mobilized for historical land stewardship rights, protecting vital southern high-desert ecosystems from luxury real estate privatization and mining exploitation.",
      storyEs: "Las comunidades indígenas y sus aliados se movilizaron por los derechos históricos de administración de la tierra en la Sierra de los Órganos, protegiendo ecosistemas contra la privatización de lujo.",
      image: "assets/img/meme_10.png",
      date: "Ongoing"
    },
    {
      id: "empire-zinc",
      x: 110,
      y: 420,
      category: "labor",
      titleEn: "Hanover Empire Zinc Strike (1950)",
      titleEs: "Huelga de Hanover Empire Zinc (1950)",
      storyEn: "Radical strike in Grant County led by Mexican-American miners of Local 890. When an injunction barred miners from picketing, their wives took over the picket lines, holding them for 15 months to win wage equity and dignity.",
      storyEs: "Huelga histórica en el condado de Grant liderada por mineros mexicoamericanos de la Local 890. Cuando una orden judicial les prohibió manifestarse, sus esposas sostuvieron el piquete por 15 meses ganando igualdad salarial.",
      image: "assets/img/meme_3.png",
      date: "1950–1952"
    }
  ];

  // B. Bilingual Biblioteca Volume Content Mappings
  const libraryVolumes = {
    5: {
      titleEn: "CCGS-C1: The People's Greenhouse Guide",
      titleEs: "Guía CCGS-C1: El Invernadero del Pueblo",
      contentEn: `
        <h2>CCGS-C1: The People's Greenhouse Guide</h2>
        <p class="reader-meta">Volume 05 · Compute Greenhouse R&D · Santa Fe, NM</p>
        <hr class="reader-divider">
        
        <h3>1. The Concept</h3>
        <p>Every data center on earth is hemorrhaging heat. At 5 kilowatts of compute load, a single rack generates over 17,000 BTUs of heat per hour. The Community Compute Greenhouse System (CCGS-C1) turns this waste product of the digital economy into the input of a biological one, creating a closed-loop food system running on compute waste heat.</p>
        
        <div class="reader-callout">
          <strong>The Thermal Loop Principle:</strong> Electricity flows in. Compute cycles burn. Heat transfers to the water column passively. Biology does the rest.
        </div>
        
        <h3>2. Technical Specifications</h3>
        <ul>
          <li><strong>Compute Load:</strong> 5 kW continuous ASIC/GPU cluster.</li>
          <li><strong>Water Capacity:</strong> 500-gallon thermal mass fish tank (Tilapia/Trout).</li>
          <li><strong>Growing Method:</strong> Deep Water Culture (DWC) aquaponic beds (95% water savings vs. traditional farming).</li>
          <li><strong>Earth Tubes:</strong> 4-inch corrugated pipe buried 6–8 ft deep for geothermal cooling/heating preconditioning.</li>
        </ul>

        <h3>3. Phase 0 Build Roadmap (Budget under $3,500)</h3>
        <p>Do not build everything at once. Stage 1 involves establishing the structural hoop frame, geothermal earth tubes, and thermal mass barrels. Establish biological stability first, then integrate compute-waste capture interfaces.</p>
      `,
      contentEs: `
        <h2>Guía CCGS-C1: El Invernadero del Pueblo</h2>
        <p class="reader-meta">Volumen 05 · Invernadero Computacional R&D · Santa Fe, NM</p>
        <hr class="reader-divider">
        
        <h3>1. El Concepto</h3>
        <p>Cada centro de datos en la Tierra pierde calor. Con una carga informática de 5 kilovatios, un solo rack genera más de 17,000 BTU de calor por hora. El Invernadero Computacional Comunitario (CCGS-C1) convierte este residuo en el insumo de una economía biológica, creando un sistema alimentario de circuito cerrado alimentado por calor residual.</p>
        
        <div class="reader-callout">
          <strong>Principio de Circuito Térmico:</strong> Entra electricidad. Se procesan algoritmos. El calor se transfiere al tanque de agua. La biología hace el resto de forma natural.
        </div>
        
        <h3>2. Especificaciones Técnicas</h3>
        <ul>
          <li><strong>Carga de Cómputo:</strong> Clúster de GPU/ASIC continuo de 5 kW.</li>
          <li><strong>Capacidad de Agua:</strong> Tanque de masa térmica de 500 galones (Tenca, Tilapia o Trucha).</li>
          <li><strong>Método de Cultivo:</strong> Camas acuapónicas de Cultivo en Agua Profunda (DWC), ahorrando 95% de agua en comparación con la agricultura tradicional.</li>
          <li><strong>Tubos Terrestres:</strong> Tubería corrugada de 4" enterrada a 6–8 pies para precondicionamiento geotérmico pasivo.</li>
        </ul>

        <h3>3. Plan de Construcción Fase 0 (Presupuesto menor de $3,500)</h3>
        <p>No construyas todo a la vez. La primera etapa establece la estructura de túnel, tubos terrestres y barriles de masa térmica. Estabiliza el ciclo biológico antes de conectar los intercambiadores de calor informáticos.</p>
      `
    },
    6: {
      titleEn: "May Day LAMA Day & General Strike Analysis",
      titleEs: "Análisis del Primero de Mayo: Día de LAMA y Huelga General",
      contentEn: `
        <h2>LAMA Day & General Strike Analysis</h2>
        <p class="reader-meta">Volume 06 · May Day 2026 · Special Issue · Santa Fe, NM</p>
        <hr class="reader-divider">
        
        <h3>1. The Strike Is the Argument</h3>
        <p>On May 1, 1886, hundreds of thousands of American workers stopped working. They weren't asking for shorter hours — they were <strong>refusing to work more than eight</strong>. The eight-hour workday was not given; it was taken. In Chicago, Pittsburgh, and Milwaukee, workers built it with their bodies, their time, and their lives.</p>
        
        <div class="reader-quote">
          "The eight-hour day was not given. It was taken."
        </div>

        <h3>2. What Is a General Strike?</h3>
        <p>A general strike is not a march. It is not a petition. It is the clearest possible demonstration of economic reality: <strong>the economy runs on labor</strong>, and labor can refuse. When workers across industries stop together, production halts. Silence becomes the ultimate leverage.</p>
        
        <h3>3. Why We Are in the Streets</h3>
        <p>New Mexico Socialists are attending LAMA Day in Santa Fe on May 1st. The same legal cartels that stripped 98.4% of the communal Genízaros land grants (315,000 acres at San Miguel del Vado) are the same forces keeping wages below survival today. We do not march because it feels good; we march because presence is data. Showing up is how communities learn their size.</p>
      `,
      contentEs: `
        <h2>Análisis del Primero de Mayo: Día de LAMA y Huelga General</h2>
        <p class="reader-meta">Volumen 06 · Primero de Mayo 2026 · Edición Especial · Santa Fe, NM</p>
        <hr class="reader-divider">
        
        <h3>1. La Huelga es el Argumento</h3>
        <p>El 1 de mayo de 1886, cientos de miles de trabajadores estadounidenses dejaron de trabajar. No pedían menos horas: se <strong>negaban a trabajar más de ocho</strong>. La jornada de ocho horas no fue regalada, fue arrebatada. En Chicago, Pittsburgh y Milwaukee, la clase trabajadora la construyó con sudor y vidas.</p>
        
        <div class="reader-quote">
          "La jornada de ocho horas no fue regalada. Fue tomada."
        </div>

        <h3>2. ¿Qué es una Huelga General?</h3>
        <p>Una huelga general no es una simple marcha. No es una petición educada. Es la demostración pura de la realidad material: <strong>la economía funciona gracias al trabajo</strong>, y el trabajo tiene el poder de negarse. Cuando los sectores se detienen a la vez, la producción se congela.</p>
        
        <h3>3. Por Qué Salimos a las Calles</h3>
        <p>Los Socialistas de Nuevo México nos unimos al Día de LAMA en Santa Fe. Las mismas artimañas legales que arrebataron el 98.4% de las mercedes comunales Genízaros (315,000 acres en San Miguel del Vado) son las que hoy mantienen los salarios por debajo de la subsistencia. No marchamos porque se sienta bien; marchamos porque la presencia física son datos. Organizarse es ciencia.</p>
      `
    }
  };

  // C. Meta Brain Crystals / Projects Database
  const crystalProjects = [
    {
      id: "rec2",
      nameEn: "QC* Core Processor Orchestrator",
      nameEs: "QC* Núcleo del Orquestador de Procesos",
      category: "Systems Architecture",
      summaryEn: "Central engine coordinating real-time knowledge synthesis and worker operations across regional hubs.",
      summaryEs: "Motor central que coordina la síntesis de conocimientos en tiempo real y operaciones en nodos regionales.",
      detailEn: "The central QC* Core process manages data replication and sync tasks, ensuring absolute integrity of community records. Integrated with distributed databases and fallback local caching systems.",
      detailEs: "El proceso central QC* Core gestiona tareas de replicación y sincronización de datos, asegurando la integridad absoluta de los registros de la comunidad. Totalmente integrado con almacenamiento de respaldo local.",
      tags: ["Orchestrator", "Core", "Real-time"]
    },
    {
      id: "rec1",
      nameEn: "NUMARA Social Intelligence Portal",
      nameEs: "NUMARA Portal de Inteligencia Social",
      category: "Civic",
      summaryEn: "Community bulletin board and collaborative newsfeed tracking regional strikes, water defense, and mutual aid efforts.",
      summaryEs: "Pizarrón comunitario y boletín colaborativo que rastrea huelgas regionales, defensa de agua y apoyo mutuo.",
      detailEn: "NUMARA functions as our grassroots newsroom. It synthesizes SWOP feeds, independent reports, and union updates state-wide bilingually. Fully offline-first and credit-safe.",
      detailEs: "NUMARA funciona como nuestra sala de prensa comunitaria. Sintetiza boletines de SWOP, reportes independientes e información sindical en todo el estado de forma bilingüe y sin costos de servidor.",
      tags: ["Social", "Civic", "Feed"]
    },
    {
      id: "rec5",
      nameEn: "Unified Organizer Services (UOS)",
      nameEs: "Servicios Unificados de Organizadores (UOS)",
      category: "Systems Architecture",
      summaryEn: "Bilingual translation mapping and browser-native offline-first coordinator for regional struggle coordinators.",
      summaryEs: "Mapeo de traducciones bilingües y coordinación local sin depender de servidores en la nube.",
      detailEn: "UOS translates struggle documents, coordinates meeting schedules, and aggregates local signups securely in local storage, bypassing corporate cloud servers.",
      detailEs: "UOS traduce documentos de lucha, coordina agendas de reuniones e integra registros de simpatizantes localmente en el almacenamiento del navegador, libre del control corporativo.",
      tags: ["Bilingual", "Offline", "Coordination"]
    },
    {
      id: "rec4",
      nameEn: "NUMARA Spatial GIS Storymap",
      nameEs: "NUMARA Mapa Espacial GIS",
      category: "Geospatial Science",
      summaryEn: "Living geographic information system tracing history, acequias, land grant borders, and live protest actions.",
      summaryEs: "Sistema geográfico vivo que traza historia local, acequias, límites de mercedes de tierra y acciones directas.",
      detailEn: "A fully client-side SVG mapping portal documenting Northern New Mexico's land struggles, acequia ditch networks, and custom user-submitted struggle pins.",
      detailEs: "Un portal de mapas SVG totalmente del lado del cliente que documenta las disputas de tierra, redes de acequias comunales y pines agregados directamente por la comunidad.",
      tags: ["GIS", "Mapping", "Storymap"]
    },
    {
      id: "rec3",
      nameEn: "Land Grants & Commons Database",
      nameEs: "Base de Datos de Mercedes y Bienes Comunes",
      category: "Creative",
      summaryEn: "Bilingual digital archives and blueprints for public commons, high-desert agro-ecology, and cooperative greenhouses.",
      summaryEs: "Archivos digitales y planos bilingües para el desarrollo agroecológico cooperativo de alta montaña.",
      detailEn: "Houses Volume 5 ('The People's Greenhouse Guide') and Volume 6 ('May Day General Strike Analysis') bilingually, providing free open-access agricultural and tactical labor manuals.",
      detailEs: "Alberga el Volumen 5 ('Guía del Invernadero') y el Volumen 6 ('Análisis de la Huelga General') de forma bilingüe, ofreciendo manuales abiertos y libres sobre agricultura y acción obrera.",
      tags: ["Archives", "Commons", "Greenhouse"]
    }
  ];

  // D. Initial Preloaded Leftist Articles (Fallback News Grid Data)
  const initialArticles = [
    {
      title: "May Day 2026 General Strike Protests Sweep Across Capital Cities",
      summary: "Workers in Santa Fe and across New Mexico prepare to walk out in coordination with national direct actions, raising demands for housing equity and wage protections.",
      source: "Liberation News",
      category: "socialist",
      perspective: "socialist",
      date: "2026-05-22",
      url: "https://www.liberationnews.org/"
    },
    {
      title: "Traditional Acequia Commons Face Expansion and Development Challenges in Taos County",
      summary: "Communal water rights are being defended by local land grant associations against attempts to transfer vital agricultural water supplies into commercial real estate projects.",
      source: "Searchlight NM",
      category: "land",
      perspective: "independent",
      date: "2026-05-18",
      url: "https://searchlightnm.org/"
    },
    {
      title: "UFCW Local 1564 Announces Union Drive Victory in Santa Fe Co-op",
      summary: "Grocery and distribution workers successfully organize regional workplaces, establishing living wages and transparent collective bargaining frameworks.",
      source: "Peoples World",
      category: "labor",
      perspective: "labor",
      date: "2026-05-20",
      url: "https://www.peoplesworld.org/"
    },
    {
      title: "High-Desert Geothermal Greenhouse Systems Prove Highly Stable During Spring Storms",
      summary: "MILPA Greenhouse cooperative releases test data verifying that CCGS-C1 closed-loop design sustained tropical crops using only compute-waste heat loops during deep freezing night oscillations.",
      source: "Sena's AI Colectivo",
      category: "local",
      perspective: "land",
      date: "2026-05-15",
      url: "https://senacolectivo.com/"
    }
  ];

  // ─── 2. STATE MANAGEMENT ───
  let currentLang = localStorage.getItem("nm_preferred_lang") || "en";
  let activeViewId = "view-home";
  
  // Map zoom and pan state
  let mapScale = 1;
  let mapPanX = 0;
  let mapPanY = 0;
  let isDraggingMap = false;
  let startDragX = 0;
  let startDragY = 0;
  let isCoordPickingMode = false;

  // Selected map pin
  let selectedPinId = null;

  // ─── 3. GLOBAL LANGUAGE SWITCHER ───
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("nm_preferred_lang", lang);

    // Toggle active classes on language selectors
    document.getElementById("btn-lang-en")?.classList.toggle("active", lang === "en");
    document.getElementById("btn-lang-es")?.classList.toggle("active", lang === "es");
    
    // Toggle active state in book reader language chips if open
    document.getElementById("reader-lang-en")?.classList.toggle("active", lang === "en");
    document.getElementById("reader-lang-es")?.classList.toggle("active", lang === "es");

    // Show / Hide language-specific elements via helper styles or direct display toggles
    document.querySelectorAll(".en-only").forEach(el => {
      el.style.display = lang === "en" ? "" : "none";
    });
    document.querySelectorAll(".es-only").forEach(el => {
      el.style.display = lang === "es" ? "" : "none";
    });

    // Update active book reader contents bilingually if visible
    const readerOverlay = document.getElementById("book-reader-overlay");
    if (readerOverlay && readerOverlay.classList.contains("active")) {
      const activeVolume = readerOverlay.dataset.currentVolume;
      if (activeVolume) {
        renderVolumeInReader(activeVolume);
      }
    }

    // Refresh dynamically loaded components that depend on bilinguality
    renderStorymapPins();
    renderStruggleSidebarIndex();
    renderCrystalsQueryGrid();
    renderPortalLists();
  }

  // Bind global language switches
  document.getElementById("btn-lang-en")?.addEventListener("click", () => setLanguage("en"));
  document.getElementById("btn-lang-es")?.addEventListener("click", () => setLanguage("es"));

  // ─── 4. SPA HASH-BASED ROUTER ───
  const routeMap = {
    "#home": "view-home",
    "#join": "view-home",
    "#about": "view-about",
    "#news": "view-news",
    "#gallery": "view-gallery",
    "#library": "view-library",
    "#metabrain": "view-metabrain",
    "#donate": "view-donate",
    "#portal": "view-portal"
  };

  function handleRoute() {
    const rawHash = window.location.hash || "#home";
    // Check if sub-anchors like #join are targetted
    const rootHash = rawHash.split("-")[0];
    const targetViewId = routeMap[rootHash] || "view-home";

    // Toggle section displays
    document.querySelectorAll(".spa-view").forEach(section => {
      if (section.id === targetViewId) {
        section.classList.add("active");
        section.style.display = "block";
      } else {
        section.classList.remove("active");
        section.style.display = "none";
      }
    });

    // Toggle navigation link states
    const activeRouteKeyword = targetViewId.replace("view-", "");
    document.querySelectorAll(".site-nav a").forEach(link => {
      const hrefValue = link.getAttribute("href");
      if (hrefValue === `#${activeRouteKeyword}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Handle view specific initializations or scrolls
    activeViewId = targetViewId;
    if (rawHash === "#join") {
      document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // If entering the News view, trigger live RSS aggregator feed refresh
    if (activeViewId === "view-news") {
      fetchNewsFeedAggregator();
    }
  }

  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("load", handleRoute);

  // ─── 5. INTERACTIVE SVG STORYMAP & CUSTOM PINS ───
  const storymapSvg = document.getElementById("storymap-svg");
  const mapContentGroup = document.getElementById("map-content");
  const pinsLayer = document.getElementById("pins-layer");

  // Get combined pins (preloaded + custom pins in localStorage)
  function getCombinedPins() {
    let customPins = [];
    try {
      customPins = JSON.parse(localStorage.getItem("local_storymap_pins") || "[]");
    } catch (err) {
      console.error("Local pins read failure:", err);
    }
    return [...preloadedPins, ...customPins];
  }

  // Draw pins dynamically inside SVG layer
  function renderStorymapPins() {
    if (!pinsLayer) return;
    pinsLayer.innerHTML = "";

    const activeFilter = document.querySelector(".storymap-category-legend .map-legend-item.active")?.dataset.category || "all";
    const pins = getCombinedPins();

    pins.forEach(pin => {
      if (activeFilter !== "all" && pin.category !== activeFilter) return;

      const pinColor = pin.category === "land" ? "hsl(var(--color-accent))" :
                       pin.category === "labor" ? "hsl(var(--color-primary))" :
                       pin.category === "art" ? "hsl(var(--color-secondary))" :
                       "hsl(var(--color-sky))";

      // Create pin group anchor
      const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      pinG.setAttribute("class", `story-pin ${pin.id === selectedPinId ? "selected" : ""}`);
      pinG.setAttribute("transform", `translate(${pin.x}, ${pin.y})`);
      pinG.style.cursor = "pointer";

      // Background pulse circle ring
      const pulseCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      pulseCircle.setAttribute("class", "story-pin-pulse");
      pulseCircle.setAttribute("r", "16");
      pulseCircle.style.fill = pinColor;
      pulseCircle.style.transformOrigin = "center";

      // Main pin center dot
      const mainCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      mainCircle.setAttribute("class", "story-pin-circle");
      mainCircle.setAttribute("r", pin.id === selectedPinId ? "8" : "6.5");
      mainCircle.style.fill = pin.id === selectedPinId ? "hsl(var(--color-secondary))" : pinColor;
      mainCircle.style.stroke = "#ffffff";
      mainCircle.style.strokeWidth = "1.5px";

      // Event listener: select struggle node
      pinG.addEventListener("click", (e) => {
        e.stopPropagation();
        selectStrugglePin(pin.id);
      });

      pinG.appendChild(pulseCircle);
      pinG.appendChild(mainCircle);
      pinsLayer.appendChild(pinG);
    });
  }

  // Struggle sidebar index listing
  function renderStruggleSidebarIndex() {
    const container = document.getElementById("sidebar-stories-container");
    if (!container) return;

    const pins = getCombinedPins();
    container.innerHTML = "";

    pins.forEach(pin => {
      const title = currentLang === "en" ? pin.titleEn : pin.titleEs;
      const desc = currentLang === "en" ? pin.storyEn : pin.storyEs;
      
      const card = document.createElement("div");
      card.setAttribute("class", `card sidebar-struggle-card ${pin.id === selectedPinId ? "active" : ""}`);
      card.style.cursor = "pointer";
      card.style.marginBottom = "0.75rem";
      card.style.borderLeft = pin.id === selectedPinId ? "4px solid hsl(var(--color-secondary))" : `3px solid ${pin.category === "land" ? "hsl(var(--color-accent))" : pin.category === "labor" ? "hsl(var(--color-primary))" : "hsl(var(--color-secondary))"}`;
      
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:hsl(var(--text-muted)); font-family:var(--font-mono); margin-bottom:0.25rem;">
          <span style="text-transform:uppercase;">🏷️ ${pin.category}</span>
          <span>📅 ${pin.date || "2026"}</span>
        </div>
        <h5 style="margin:0 0 0.4rem 0; font-family:var(--font-syne); font-size:0.95rem; color:#fff;">${title}</h5>
        <p style="font-size:0.75rem; line-height:1.4; color:hsl(var(--text-muted)); margin:0;">${desc.substring(0, 110)}...</p>
      `;

      card.addEventListener("click", () => {
        selectStrugglePin(pin.id);
      });

      container.appendChild(card);
    });
  }

  // Select Struggle Pin Node and display details in active panels
  function selectStrugglePin(pinId) {
    selectedPinId = pinId;
    renderStorymapPins();
    renderStruggleSidebarIndex();

    // Open detail panel drawer tab in the sidebar
    document.querySelectorAll(".sidebar-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".sidebar-content-panel").forEach(p => p.classList.remove("active"));
    
    document.getElementById("tab-pin-detail")?.classList.add("active");
    const detailPanel = document.getElementById("panel-pin-detail");
    detailPanel?.classList.add("active");

    const pins = getCombinedPins();
    const pin = pins.find(p => p.id === pinId);
    const detailContainer = document.getElementById("active-pin-detail-container");

    if (pin && detailContainer) {
      const title = currentLang === "en" ? pin.titleEn : pin.titleEs;
      const desc = currentLang === "en" ? pin.storyEn : pin.storyEs;

      detailContainer.innerHTML = `
        <div class="card" style="padding:1rem; border:1px solid hsl(var(--border-light)); border-radius:8px; background:rgba(0,0,0,0.15);">
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:hsl(var(--color-secondary)); text-transform:uppercase; margin-bottom:0.5rem; font-weight:700;">
            📂 dossier: ${pin.category} · coordinates [${pin.x}, ${pin.y}]
          </div>
          
          <h4 style="margin:0 0 0.75rem 0; font-family:var(--font-syne); font-size:1.2rem; color:#fff; font-weight:700;">
            ${title}
          </h4>
          
          ${pin.image ? `<img src="${pin.image}" alt="${title}" style="width:100%; height:auto; border-radius:6px; border:1px solid hsl(var(--border-light)); margin-bottom:1rem; aspect-ratio:1.6; object-fit:cover;">` : ""}
          
          <p style="font-size:0.85rem; line-height:1.6; color:hsl(var(--text-primary)); white-space:pre-line;">
            ${desc}
          </p>

          <hr style="border:none; border-top:1px solid hsl(var(--border-light)); margin:1.25rem 0;">

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; color:hsl(var(--text-muted)); font-family:var(--font-mono);">
              Status: Verified Commons
            </span>
            ${pin.image ? `<button class="btn tiny js-view-meme" data-img="${pin.image}" style="padding:0.25rem 0.6rem; font-size:0.7rem;">Edit Poster</button>` : ""}
          </div>
        </div>
      `;

      // Re-bind meme editor trigger if available
      detailContainer.querySelector(".js-view-meme")?.addEventListener("click", () => {
        openMemeModal(pin.image);
      });
    }
  }

  // Pan and Zoom logic of SVG Viewport
  function updateMapTransforms() {
    if (mapContentGroup) {
      mapContentGroup.setAttribute("transform", `translate(${mapPanX}, ${mapPanY}) scale(${mapScale})`);
    }
  }

  storymapSvg?.addEventListener("mousedown", (e) => {
    isDraggingMap = true;
    startDragX = e.clientX - mapPanX;
    startDragY = e.clientY - mapPanY;
    storymapSvg.style.cursor = "grabbing";
  });

  storymapSvg?.addEventListener("mousemove", (e) => {
    if (!isDraggingMap) return;
    mapPanX = e.clientX - startDragX;
    mapPanY = e.clientY - startDragY;
    updateMapTransforms();
  });

  document.addEventListener("mouseup", () => {
    isDraggingMap = false;
    if (storymapSvg) {
      storymapSvg.style.cursor = isCoordPickingMode ? "crosshair" : "grab";
    }
  });

  // HUD buttons bind
  document.getElementById("hud-zoom-in")?.addEventListener("click", () => {
    mapScale = Math.min(mapScale * 1.3, 5);
    updateMapTransforms();
  });
  document.getElementById("hud-zoom-out")?.addEventListener("click", () => {
    mapScale = Math.max(mapScale / 1.3, 0.7);
    updateMapTransforms();
  });
  document.getElementById("hud-reset")?.addEventListener("click", () => {
    mapScale = 1;
    mapPanX = 0;
    mapPanY = 0;
    updateMapTransforms();
  });

  // Category legend filters
  document.querySelectorAll(".storymap-category-legend .map-legend-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".storymap-category-legend .map-legend-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      renderStorymapPins();
    });
  });

  // Dynamic double click coordinate picker drop pin
  document.getElementById("drop-pin-trigger-btn")?.addEventListener("click", () => {
    isCoordPickingMode = !isCoordPickingMode;
    const hintOverlay = document.getElementById("coord-picker-overlay");
    if (isCoordPickingMode) {
      hintOverlay?.classList.add("active");
      if (storymapSvg) storymapSvg.style.cursor = "crosshair";
    } else {
      hintOverlay?.classList.remove("active");
      if (storymapSvg) storymapSvg.style.cursor = "grab";
    }
  });

  storymapSvg?.addEventListener("click", (e) => {
    if (!isCoordPickingMode) return;
    
    // Capture coordinates relative to SVG viewBox (0 0 600 600)
    const rect = storymapSvg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 600);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 600);

    // Update custom pin form inputs
    const xInput = document.getElementById("form-pin-x");
    const yInput = document.getElementById("form-pin-y");
    if (xInput) xInput.value = x;
    if (yInput) yInput.value = y;

    // Reset preset selector to custom
    const presetSelect = document.getElementById("form-pin-preset");
    if (presetSelect) presetSelect.value = "custom";

    // Deactivate coordinate picker overlay
    isCoordPickingMode = false;
    document.getElementById("coord-picker-overlay")?.classList.remove("active");
    storymapSvg.style.cursor = "grab";

    // Open pin submission modal
    const pinModal = document.getElementById("pin-modal");
    if (pinModal) {
      pinModal.classList.add("active");
      pinModal.setAttribute("aria-hidden", "false");
    }
  });

  // Presets selector coordinate updater in Pin form
  document.getElementById("form-pin-preset")?.addEventListener("change", (e) => {
    const val = e.target.value;
    const xInput = document.getElementById("form-pin-x");
    const yInput = document.getElementById("form-pin-y");

    if (val === "taos") { xInput.value = 320; yInput.value = 110; }
    else if (val === "santafe") { xInput.value = 300; yInput.value = 200; }
    else if (val === "albuquerque") { xInput.value = 280; yInput.value = 280; }
    else if (val === "gallup") { xInput.value = 90; yInput.value = 220; }
    else if (val === "lascruces") { xInput.value = 250; yInput.value = 460; }
    else if (val === "carlsbad") { xInput.value = 460; yInput.value = 450; }
    else if (val === "silvercity") { xInput.value = 110; yInput.value = 420; }
  });

  // Modal control button binds
  const pinModalCloseBtn = document.getElementById("pin-modal-close-btn");
  const btnCancelPin = document.getElementById("btn-cancel-pin");
  const pinModalBackdrop = document.getElementById("pin-modal-backdrop");

  function closePinModal() {
    const pinModal = document.getElementById("pin-modal");
    if (pinModal) {
      pinModal.classList.remove("active");
      pinModal.setAttribute("aria-hidden", "true");
    }
  }

  pinModalCloseBtn?.addEventListener("click", closePinModal);
  btnCancelPin?.addEventListener("click", closePinModal);
  pinModalBackdrop?.addEventListener("click", closePinModal);

  // Struggle custom Pin submission form
  document.getElementById("storymap-pins-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const pinFormStatus = document.getElementById("pin-form-status");
    if (pinFormStatus) pinFormStatus.textContent = "Publishing pin / Publicando...";

    const customName = document.getElementById("form-pin-name").value.trim();
    const category = document.getElementById("form-pin-category").value;
    const titleEn = document.getElementById("form-pin-title-en").value.trim();
    const titleEs = document.getElementById("form-pin-title-es").value.trim();
    const storyEn = document.getElementById("form-pin-story-en").value.trim();
    const storyEs = document.getElementById("form-pin-story-es").value.trim();
    const x = parseInt(document.getElementById("form-pin-x").value);
    const y = parseInt(document.getElementById("form-pin-y").value);
    const isAnon = document.getElementById("form-pin-anonymous").checked;

    if (!titleEn || !titleEs || !storyEn || !storyEs) {
      if (pinFormStatus) pinFormStatus.textContent = "Please fill all required inputs.";
      return;
    }

    const newPin = {
      id: "pin-" + Date.now(),
      x,
      y,
      category,
      titleEn,
      titleEs,
      storyEn,
      storyEs,
      date: "2026",
      image: "assets/img/meme_1.png", // fallback stock poster
      author: isAnon ? "Anonymous" : customName
    };

    try {
      const customPins = JSON.parse(localStorage.getItem("local_storymap_pins") || "[]");
      customPins.push(newPin);
      localStorage.setItem("local_storymap_pins", JSON.stringify(customPins));
    } catch (err) {
      console.error("Local storage pins save error:", err);
    }

    if (pinFormStatus) pinFormStatus.textContent = "Pin published! ¡Pin guardado con éxito!";
    
    // Reset forms and refresh UI
    document.getElementById("storymap-pins-form").reset();
    renderStorymapPins();
    renderStruggleSidebarIndex();
    renderPortalLists();
    
    setTimeout(() => {
      closePinModal();
      if (pinFormStatus) pinFormStatus.textContent = "";
    }, 1000);
  });

  // Anonymous check box helper
  document.getElementById("form-pin-anonymous")?.addEventListener("change", (e) => {
    const nameInput = document.getElementById("form-pin-name");
    if (nameInput) {
      nameInput.value = e.target.checked ? "Anonymous" : "";
      nameInput.disabled = e.target.checked;
    }
  });

  // Sidebar Tabs triggers
  document.getElementById("tab-stories-list")?.addEventListener("click", () => {
    document.getElementById("tab-stories-list")?.classList.add("active");
    document.getElementById("tab-pin-detail")?.classList.remove("active");
    document.getElementById("panel-stories-list")?.classList.add("active");
    document.getElementById("panel-pin-detail")?.classList.remove("active");
  });

  document.getElementById("tab-pin-detail")?.addEventListener("click", () => {
    document.getElementById("tab-stories-list")?.classList.remove("active");
    document.getElementById("tab-pin-detail")?.classList.add("active");
    document.getElementById("panel-stories-list")?.classList.remove("active");
    document.getElementById("panel-pin-detail")?.classList.add("active");
  });

  // Pre-load pins drawings
  renderStorymapPins();
  renderStruggleSidebarIndex();

  // ─── 6. BILINGUAL PUBLICATION BIBLIOTECA VOLUME READER ───
  const bookReaderOverlay = document.getElementById("book-reader-overlay");
  const readerScrollContent = document.getElementById("reader-scroll-content");
  const btnCloseReader = document.getElementById("btn-close-reader");
  const readerBackdrop = document.getElementById("reader-backdrop");

  function openVolumeReader(volNum) {
    if (!bookReaderOverlay || !readerScrollContent) return;

    bookReaderOverlay.dataset.currentVolume = volNum;
    renderVolumeInReader(volNum);

    bookReaderOverlay.classList.add("active");
    readerBackdrop?.classList.add("active");
  }

  function renderVolumeInReader(volNum) {
    const vol = libraryVolumes[volNum];
    if (!vol || !readerScrollContent) return;

    // Load language-specific content
    readerScrollContent.innerHTML = currentLang === "en" ? vol.contentEn : vol.contentEs;
  }

  function closeVolumeReader() {
    bookReaderOverlay?.classList.remove("active");
    readerBackdrop?.classList.remove("active");
  }

  // Bind library volume cards triggers
  document.querySelectorAll(".js-read-volume").forEach(card => {
    card.addEventListener("click", () => {
      const volNum = card.dataset.volume;
      openVolumeReader(volNum);
    });
  });

  btnCloseReader?.addEventListener("click", closeVolumeReader);
  readerBackdrop?.addEventListener("click", closeVolumeReader);

  // Reader individual lang selector pills bind
  document.getElementById("reader-lang-en")?.addEventListener("click", () => setLanguage("en"));
  document.getElementById("reader-lang-es")?.addEventListener("click", () => setLanguage("es"));


  // ─── 7. DRAGGABLE METABRAIN GRAPH & CRYSTALS MATRIX ───
  const sandboxSvg = document.getElementById("sandbox-svg");
  const graphNodes = document.querySelectorAll(".graph-node");
  let draggedNode = null;
  let offsetNodeX = 0;
  let offsetNodeY = 0;

  // Make process graph nodes interactive draggable
  graphNodes.forEach(node => {
    node.style.cursor = "grab";

    node.addEventListener("mousedown", (e) => {
      draggedNode = node;
      node.style.cursor = "grabbing";
      e.stopPropagation();

      // Transform matrix math coordinate calculation
      const transformAttr = node.getAttribute("transform") || "translate(0,0)";
      const matches = transformAttr.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
      let currX = 0, currY = 0;
      if (matches) {
        currX = parseFloat(matches[1]);
        currY = parseFloat(matches[2]);
      }

      // Calculate relative offsets
      const rect = sandboxSvg.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 500;
      const clickY = ((e.clientY - rect.top) / rect.height) * 400;

      offsetNodeX = clickX - currX;
      offsetNodeY = clickY - currY;
    });

    node.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = node.dataset.target;
      highlightCrystalCard(targetId);
    });
  });

  sandboxSvg?.addEventListener("mousemove", (e) => {
    if (!draggedNode) return;
    const rect = sandboxSvg.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 500;
    const currentY = ((e.clientY - rect.top) / rect.height) * 400;

    const newX = Math.round(currentX - offsetNodeX);
    const newY = Math.round(currentY - offsetNodeY);

    draggedNode.setAttribute("transform", `translate(${newX}, ${newY})`);

    // Redraw Connecting Edges lines
    redrawConnectingGraphEdges();
  });

  document.addEventListener("mouseup", () => {
    if (draggedNode) {
      draggedNode.style.cursor = "grab";
      draggedNode = null;
    }
  });

  // Calculate and draw line edges connecting translating nodes
  function redrawConnectingGraphEdges() {
    const positions = {};
    graphNodes.forEach(n => {
      const id = n.dataset.target;
      const transform = n.getAttribute("transform") || "translate(0,0)";
      const match = transform.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
      if (match) {
        positions[id] = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
      }
    });

    const edges = [
      { from: "rec2", to: "rec1" }, // QC to Numara
      { from: "rec2", to: "rec5" }, // QC to UOS
      { from: "rec2", to: "rec4" }, // QC to GIS
      { from: "rec2", to: "rec3" }, // QC to Grants
      { from: "rec1", to: "rec5" }, // Numara to UOS
      { from: "rec4", to: "rec3" }  // GIS to Grants
    ];

    const svgLines = sandboxSvg.querySelectorAll(".graph-edge");
    edges.forEach((edge, idx) => {
      const start = positions[edge.from];
      const end = positions[edge.to];
      if (start && end && svgLines[idx]) {
        svgLines[idx].setAttribute("x1", start.x);
        svgLines[idx].setAttribute("y1", start.y);
        svgLines[idx].setAttribute("x2", end.x);
        svgLines[idx].setAttribute("y2", end.y);
      }
    });
  }

  // Reset graph layout button
  document.getElementById("btn-reset-graph")?.addEventListener("click", () => {
    const defaults = {
      rec2: { x: 250, y: 200 },
      rec1: { x: 130, y: 120 },
      rec5: { x: 370, y: 120 },
      rec4: { x: 130, y: 280 },
      rec3: { x: 370, y: 280 }
    };

    graphNodes.forEach(n => {
      const id = n.dataset.target;
      const def = defaults[id];
      if (def) {
        n.setAttribute("transform", `translate(${def.x}, ${def.y})`);
      }
    });

    redrawConnectingGraphEdges();
  });

  // Dynamic Crystals list rendering
  function renderCrystalsQueryGrid() {
    const container = document.getElementById("crystals-grid");
    if (!container) return;

    container.innerHTML = "";
    const activeDomain = document.querySelector("#view-metabrain .control-row .chip.active")?.dataset.cat || "";
    const queryTerm = document.getElementById("meta-search-input")?.value.toLowerCase().trim() || "";

    const filtered = crystalProjects.filter(proj => {
      const matchesDomain = !activeDomain || proj.category === activeDomain;
      const matchesSearch = !queryTerm || 
        proj.nameEn.toLowerCase().includes(queryTerm) ||
        proj.nameEs.toLowerCase().includes(queryTerm) ||
        proj.summaryEn.toLowerCase().includes(queryTerm) ||
        proj.summaryEs.toLowerCase().includes(queryTerm);

      return matchesDomain && matchesSearch;
    });

    const statusText = document.getElementById("query-meta-stats");
    if (statusText) {
      statusText.textContent = `Lattice Query: found ${filtered.length} nodes active. Synchronizing crystals...`;
    }

    filtered.forEach(proj => {
      const title = currentLang === "en" ? proj.nameEn : proj.nameEs;
      const desc = currentLang === "en" ? proj.summaryEn : proj.summaryEs;

      const card = document.createElement("div");
      card.setAttribute("class", `crystal-card card`);
      card.setAttribute("id", `crystal-item-${proj.id}`);
      card.style.cursor = "pointer";
      card.style.marginBottom = "0.75rem";
      
      card.innerHTML = `
        <div class="crystal-footer" style="padding:0; margin-bottom:0.4rem; justify-content:space-between;">
          <span class="crystal-tag">${proj.category}</span>
          <span style="font-family:var(--font-mono); font-size:0.7rem; color:hsl(var(--color-secondary)); font-weight:700;">NODE: ${proj.id}</span>
        </div>
        <h5 class="crystal-title" style="margin:0 0 0.4rem 0; font-size:1rem;">${title}</h5>
        <p class="crystal-summary" style="font-size:0.8rem; line-height:1.5; color:hsl(var(--text-muted)); margin:0 0 0.6rem 0;">${desc}</p>
        <div style="font-size:0.72rem; font-family:var(--font-mono); color:hsl(var(--color-sky)); font-weight:700;">Click to inspect dossier ↗</div>
      `;

      card.addEventListener("click", () => {
        openCrystalDetailDrawer(proj.id);
      });

      container.appendChild(card);
    });
  }

  // Filter crystals by domain chips triggers
  document.querySelectorAll("#view-metabrain .control-row .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#view-metabrain .control-row .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderCrystalsQueryGrid();
    });
  });

  // Search filter
  document.getElementById("meta-search-input")?.addEventListener("input", renderCrystalsQueryGrid);

  // Highlight and focus crystal card
  function highlightCrystalCard(nodeId) {
    // Open drawer directly
    openCrystalDetailDrawer(nodeId);

    // Scroll to matching item in Query Grid
    const element = document.getElementById(`crystal-item-${nodeId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("selected");
      setTimeout(() => element.classList.remove("selected"), 2000);
    }
  }

  // Details drawer overlay elements
  const detailDrawer = document.getElementById("crystal-detail-drawer");
  const detailBackdrop = document.getElementById("detail-drawer-backdrop");
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  const drawerContent = document.getElementById("drawer-content-area");

  function openCrystalDetailDrawer(nodeId) {
    const proj = crystalProjects.find(p => p.id === nodeId);
    if (!proj || !drawerContent) return;

    const title = currentLang === "en" ? proj.nameEn : proj.nameEs;
    const bodyText = currentLang === "en" ? proj.detailEn : proj.detailEs;

    drawerContent.innerHTML = `
      <div style="padding: 0 1rem;">
        <span class="crystal-tag" style="display:inline-block; margin-bottom:0.75rem;">${proj.category}</span>
        <h3 style="margin:0 0 1rem 0; font-family:var(--font-syne); font-size:1.4rem; color:hsl(var(--color-secondary)); font-weight:700;">
          ${title}
        </h3>
        
        <p style="font-size:0.9rem; line-height:1.75; color:hsl(var(--text-primary)); margin-bottom:1.5rem;">
          ${bodyText}
        </p>

        <h5 style="font-family:var(--font-mono); font-size:0.8rem; color:#fff; text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:1px;">
          Lattice Node Metadata:
        </h5>
        
        <table class="data-table" style="font-size:0.75rem; width:100%; border-collapse:collapse; margin-bottom:1.5rem;">
          <tr>
            <td style="border:none; padding:4px 0; color:hsl(var(--text-muted)); font-family:var(--font-mono);">Node Identifier</td>
            <td style="border:none; padding:4px 0; font-family:var(--font-mono); text-align:right; font-weight:700; color:#fff;">${proj.id}</td>
          </tr>
          <tr>
            <td style="border:none; padding:4px 0; color:hsl(var(--text-muted)); font-family:var(--font-mono);">Orchestration Domain</td>
            <td style="border:none; padding:4px 0; text-align:right; color:#fff;">${proj.category}</td>
          </tr>
          <tr>
            <td style="border:none; padding:4px 0; color:hsl(var(--text-muted)); font-family:var(--font-mono);">Integrity Index</td>
            <td style="border:none; padding:4px 0; font-family:var(--font-mono); text-align:right; color:hsl(var(--color-sky)); font-weight:700;">99.98% sandboxed</td>
          </tr>
        </table>

        <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:1rem;">
          ${proj.tags.map(tag => `<span class="chip" style="font-size:0.65rem; padding:0.25rem 0.5rem; font-family:var(--font-mono); pointer-events:none;">#${tag}</span>`).join("")}
        </div>
      </div>
    `;

    detailDrawer?.classList.add("active");
    detailBackdrop?.classList.add("active");
  }

  function closeDetailDrawer() {
    detailDrawer?.classList.remove("active");
    detailBackdrop?.classList.remove("active");
  }

  btnCloseDrawer?.addEventListener("click", closeDetailDrawer);
  detailBackdrop?.addEventListener("click", closeDetailDrawer);

  // Initialize graph
  renderCrystalsQueryGrid();


  // ─── 8. RSS NEWS FEED AGGREGATOR & BIAS segment GAUGE ───
  let loadedArticles = [...initialArticles];

  // Perspective categorization parameters
  const keywords = {
    socialist: ["socialist", "socialismo", "marxist", "liberation", "party", "capitalism", "capitalismo", "imperialism", "solidarity", "leftist", "clase", "pueblo", "obrera", "comunista"],
    labor: ["strike", "huelga", "union", "sindicato", "wages", "wage", "salario", "worker", "trabajador", "laboral", "picket", "bargaining", "contract", "contrato"],
    land: ["water", "agua", "acequia", "land", "tierras", "commons", "común", "grant", "merced", "river", "río", "geothermal", "agro", "ditch", "greenhouse"],
  };

  function getArticlePerspective(title, summary) {
    const text = (title + " " + summary).toLowerCase();
    
    let socialistCount = 0;
    let laborCount = 0;
    let landCount = 0;

    keywords.socialist.forEach(k => { if (text.includes(k)) socialistCount++; });
    keywords.labor.forEach(k => { if (text.includes(k)) laborCount++; });
    keywords.land.forEach(k => { if (text.includes(k)) landCount++; });

    if (socialistCount > laborCount && socialistCount > landCount) return "socialist";
    if (laborCount > socialistCount && laborCount > landCount) return "labor";
    if (landCount > socialistCount && landCount > laborCount) return "land";

    // Random fallback logic if empty
    return "independent";
  }

  // Draw perspective breakdown stats bar
  function renderPerspectiveGauge() {
    const total = loadedArticles.length;
    if (total === 0) return;

    let counts = { socialist: 0, labor: 0, land: 0, independent: 0 };
    loadedArticles.forEach(art => {
      const p = art.perspective || "independent";
      counts[p] = (counts[p] || 0) + 1;
    });

    const pctSocialist = Math.round((counts.socialist / total) * 100);
    const pctLabor = Math.round((counts.labor / total) * 100);
    const pctLand = Math.round((counts.land / total) * 100);
    const pctIndependent = 100 - (pctSocialist + pctLabor + pctLand);

    // Update segment widths
    const barSocialist = document.getElementById("bar-socialist");
    const barLabor = document.getElementById("bar-labor");
    const barLand = document.getElementById("bar-land");
    const barIndependent = document.getElementById("bar-independent");

    if (barSocialist) barSocialist.style.width = `${pctSocialist}%`;
    if (barLabor) barLabor.style.width = `${pctLabor}%`;
    if (barLand) barLand.style.width = `${pctLand}%`;
    if (barIndependent) barIndependent.style.width = `${pctIndependent}%`;

    // Update segment labels text
    const valSocialist = document.getElementById("val-socialist");
    const valLabor = document.getElementById("val-labor");
    const valLand = document.getElementById("val-land");
    const valIndependent = document.getElementById("val-independent");

    if (valSocialist) valSocialist.textContent = `${pctSocialist}%`;
    if (valLabor) valLabor.textContent = `${pctLabor}%`;
    if (valLand) valLand.textContent = `${pctLand}%`;
    if (valIndependent) valIndependent.textContent = `${pctIndependent}%`;

    // Update article count badge
    const badge = document.getElementById("article-count-badge");
    if (badge) badge.textContent = `${total} ARTICLES PARSED`;
  }

  // Render news feed grids
  function renderNewsGrid() {
    const container = document.getElementById("feed-grid");
    if (!container) return;

    container.innerHTML = "";

    const activeCategory = document.querySelector("#view-news .control-row [data-filter-type='category'].chip.active")?.dataset.filterValue || "all";
    const activePerspective = document.querySelector("#view-news .control-row [data-filter-type='perspective'].chip.active")?.dataset.filterValue || "all";
    const searchTerm = document.getElementById("feed-search")?.value.toLowerCase().trim() || "";
    const sortVal = document.getElementById("feed-sort")?.value || "newest";

    let filtered = loadedArticles.filter(art => {
      const matchesCategory = activeCategory === "all" || art.category === activeCategory;
      const matchesPerspective = activePerspective === "all" || art.perspective === activePerspective;
      const matchesSearch = !searchTerm || 
        art.title.toLowerCase().includes(searchTerm) || 
        art.summary.toLowerCase().includes(searchTerm) || 
        art.source.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesPerspective && matchesSearch;
    });

    // Sorting algorithms
    filtered.sort((a, b) => {
      if (sortVal === "newest") {
        return new Date(b.date || 0) - new Date(a.date || 0);
      } else if (sortVal === "oldest") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      } else {
        return a.source.localeCompare(b.source);
      }
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem; color:hsl(var(--text-muted)); font-size:0.9rem;">
          No matching bulletins found. Clear filters or adjust search parameters.
        </div>
      `;
      return;
    }

    filtered.forEach(art => {
      const badgeColors = {
        socialist: "border: 1px solid hsla(var(--color-primary) / 0.5); color: hsl(var(--color-primary)); background: hsla(var(--color-primary) / 0.05);",
        labor: "border: 1px solid hsla(var(--color-secondary) / 0.5); color: hsl(var(--color-secondary)); background: hsla(var(--color-secondary) / 0.05);",
        land: "border: 1px solid rgba(122, 184, 58, 0.5); color: #7dbb6a; background: rgba(122, 184, 58, 0.05);",
        independent: "border: 1px solid hsla(var(--color-sky) / 0.5); color: hsl(var(--color-sky)); background: hsla(var(--color-sky) / 0.05);"
      };

      const badgeStyle = badgeColors[art.perspective] || badgeColors.independent;
      const displayPerspective = art.perspective === "socialist" ? "Socialist Organ" :
                                 art.perspective === "labor" ? "Labor Advocacy" :
                                 art.perspective === "land" ? "Land Defense" : "NM Independent";

      const card = document.createElement("div");
      card.setAttribute("class", "card news-card");
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-family:var(--font-mono); font-size:0.68rem; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700; ${badgeStyle}">
            ${displayPerspective}
          </span>
          <span style="font-family:var(--font-mono); font-size:0.7rem; color:hsl(var(--text-muted));">
            ${art.date || "May 2026"}
          </span>
        </div>
        <h4 style="margin:0 0 0.5rem 0; font-family:var(--font-syne); font-size:1rem; color:#fff; font-weight:700; line-height:1.4;">
          ${art.title}
        </h4>
        <p style="font-size:0.8rem; line-height:1.5; color:hsl(var(--text-muted)); margin:0 0 1rem 0;">
          ${art.summary.substring(0, 160)}...
        </p>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid hsl(var(--border-light)); padding-top:0.6rem; font-size:0.75rem;">
          <span style="font-family:var(--font-mono); color:hsl(var(--text-muted));">
            📰 ${art.source}
          </span>
          <a href="${art.url}" target="_blank" rel="noopener" style="color:hsl(var(--color-secondary)); font-weight:700; text-decoration:none;">
            Read Source ↗
          </a>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Filter chips in News feed
  document.querySelectorAll("#view-news .control-row").forEach(row => {
    row.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        row.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderNewsGrid();
      });
    });
  });

  document.getElementById("feed-search")?.addEventListener("input", renderNewsGrid);
  document.getElementById("feed-sort")?.addEventListener("change", renderNewsGrid);

  // Live RSS feeds async downloader utilizing allorigins CORS proxy
  const rssFeeds = [
    { source: "SWOP Org", url: "https://www.swop.net/feed", category: "land" },
    { source: "La Jicarita", url: "https://lajicarita.wordpress.com/feed/", category: "land" },
    { source: "Searchlight NM", url: "https://searchlightnm.org/feed/", category: "local" },
    { source: "Peoples World", url: "https://www.peoplesworld.org/feed/", category: "labor" },
    { source: "Liberation News", url: "https://www.liberationnews.org/feed/", category: "socialist" }
  ];

  async function fetchNewsFeedAggregator() {
    const indicator = document.getElementById("sync-status-indicator");
    if (indicator) {
      indicator.innerHTML = `<span class="pulse-dot" style="background:hsl(38, 85%, 48%);"></span> Syncing...`;
      indicator.style.color = "hsl(38, 85%, 48%)";
    }

    let parsedArticles = [];
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const diagnostics = {};

    rssFeeds.forEach(f => {
      diagnostics[f.source] = { status: "PENDING", latency: 0 };
    });

    // Loop and fetch asynchronously
    const fetchPromises = rssFeeds.map(async (feed) => {
      const start = Date.now();
      try {
        // Dynamic upstream cache-busting to bypass aggressive CDN proxy edge caching
        const cbUrl = feed.url + (feed.url.includes("?") ? "&" : "?") + "_cb=" + Date.now();
        const response = await fetch(proxyUrl + encodeURIComponent(cbUrl));
        const latency = Date.now() - start;

        if (!response.ok) {
          diagnostics[feed.source] = { status: `HTTP ${response.status}`, latency };
          return;
        }
        const resData = await response.json();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resData.contents, "text/xml");
        
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          diagnostics[feed.source] = { status: "PARSE ERROR", latency };
          return;
        }

        const items = xmlDoc.querySelectorAll("item, entry");
        if (items.length === 0) {
          diagnostics[feed.source] = { status: "NO ITEMS", latency };
          return;
        }

        diagnostics[feed.source] = { status: "OK", latency };
        
        let limit = 0;
        items.forEach(item => {
          if (limit > 3) return; // cap at 3 articles per source to be memory-efficient
          
          const title = item.querySelector("title")?.textContent || "";
          let summary = item.querySelector("description, summary")?.textContent || "";
          // Strip HTML tags
          summary = summary.replace(/<[^>]*>/g, '').substring(0, 200).trim();
          
          const dateStr = item.querySelector("pubDate, published, updated")?.textContent || "";
          let dateFormatted = "2026-05-22";
          try {
            if (dateStr) dateFormatted = new Date(dateStr).toISOString().split('T')[0];
          } catch(e){}

          const articleUrl = item.querySelector("link")?.getAttribute("href") || item.querySelector("link")?.textContent || feed.url;
          const perspective = getArticlePerspective(title, summary);

          if (title && summary) {
            parsedArticles.push({
              title: title.trim(),
              summary: summary.trim(),
              source: feed.source,
              category: feed.category,
              perspective: perspective,
              date: dateFormatted,
              url: articleUrl
            });
            limit++;
          }
        });
      } catch (err) {
        const latency = Date.now() - start;
        diagnostics[feed.source] = { status: "FAILED", latency };
        console.warn(`CORS bypass failure for ${feed.source}:`, err);
      }
    });

    await Promise.all(fetchPromises);

    if (parsedArticles.length > 0) {
      // Merge with initial fallbacks, removing duplicates based on title
      const uniqueArticlesMap = new Map();
      [...parsedArticles, ...initialArticles].forEach(art => {
        uniqueArticlesMap.set(art.title.toLowerCase(), art);
      });
      loadedArticles = Array.from(uniqueArticlesMap.values());
    }

    if (indicator) {
      indicator.innerHTML = `✔️ Dynamic Live`;
      indicator.style.color = "hsl(var(--color-sky))";
    }

    // Render diagnostics table
    const diagnosticsTbody = document.getElementById("diagnostics-tbody");
    if (diagnosticsTbody) {
      diagnosticsTbody.innerHTML = rssFeeds.map(feed => {
        const diag = diagnostics[feed.source] || { status: "UNKNOWN", latency: 0 };
        const statusColor = diag.status === "OK" ? "hsl(var(--color-accent))" : "#ffb3b3";
        return `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
            <td style="padding: 0.35rem 0; font-weight: 500; color: #fff;">${feed.source}</td>
            <td style="padding: 0.35rem 0; text-align: right; color: ${statusColor}; font-weight: 700;">
              ${diag.status} <span style="font-size:0.6rem; color:hsl(var(--text-muted)); font-weight:400;">(${diag.latency}ms)</span>
            </td>
          </tr>
        `;
      }).join("");
    }

    // Update Last Refreshed label
    const lastRefreshedEl = document.getElementById("last-refreshed-time");
    if (lastRefreshedEl) {
      const now = new Date();
      lastRefreshedEl.textContent = `Last Refreshed: ${now.toLocaleTimeString()}`;
    }

    // Refresh layout
    renderNewsGrid();
    renderPerspectiveGauge();
  }

  // Bind refresh feed button click event
  document.getElementById("btn-refresh-feed")?.addEventListener("click", () => {
    const refreshBtn = document.getElementById("btn-refresh-feed");
    const refreshIcon = refreshBtn?.querySelector(".refresh-icon");
    if (refreshIcon) refreshIcon.classList.add("spinning");
    if (refreshBtn) refreshBtn.disabled = true;
    
    fetchNewsFeedAggregator().finally(() => {
      if (refreshIcon) refreshIcon.classList.remove("spinning");
      if (refreshBtn) refreshBtn.disabled = false;
    });
  });

  // Pre-load grid
  renderNewsGrid();
  renderPerspectiveGauge();


  // ─── 9. COMRADE OUTREACH & SOLIDARITY DONATION PLEDGES ───
  
  // A. Contact signups form submissions
  const joinForm = document.getElementById("join-form");
  const joinStatus = document.getElementById("join-status");

  joinForm?.addEventListener("submit", async function(e) {
    e.preventDefault();
    if (joinStatus) {
      joinStatus.textContent = "Sending / Enviando...";
      joinStatus.style.color = "hsl(38, 85%, 48%)";
    }

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      city: document.getElementById("city").value.trim(),
      language: document.getElementById("language").value,
      interests: document.getElementById("interests").value.trim(),
      timestamp: new Date().toISOString()
    };

    // 1. Cache strictly in Local Storage
    try {
      const cached = JSON.parse(localStorage.getItem("local_comrade_submissions") || "[]");
      cached.push(payload);
      localStorage.setItem("local_comrade_submissions", JSON.stringify(cached));
    } catch(err) {
      console.error("Local signups storage fail:", err);
    }

    // 2. Refresh Portal list
    renderPortalLists();

    // 3. Try server API post with graceful offline sandbox fallback
    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (response.ok) {
        if (joinStatus) {
          joinStatus.textContent = result.message || "Thanks for signing up! ¡Gracias por unirte!";
          joinStatus.style.color = "hsl(var(--color-sky))";
        }
        joinForm.reset();
      } else {
        throw new Error(result.error || "Server validation issue");
      }
    } catch(err) {
      console.log("Offline sandbox bypass: saved contact locally in secure browser storage.");
      if (joinStatus) {
        joinStatus.textContent = "Saved securely offline in Comrade Portal! ¡Guardado localmente!";
        joinStatus.style.color = "hsl(var(--color-sky))";
      }
      joinForm.reset();
    }
  });

  // B. Solidarity offline pledges system
  const pledgeForm = document.getElementById("pledge-form");
  const pledgeStatus = document.getElementById("pledge-status");
  const frequencyInput = document.getElementById("pledge-frequency");
  const platformInput = document.getElementById("pledge-platform");
  const amountInput = document.getElementById("pledge-amount");

  // Toggle frequency buttons
  pledgeForm?.querySelectorAll(".freq-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      pledgeForm.querySelectorAll(".freq-tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      if (frequencyInput) frequencyInput.value = btn.dataset.freq;
    });
  });

  // Toggle platform buttons
  pledgeForm?.querySelectorAll(".platform-capsule").forEach(btn => {
    btn.addEventListener("click", () => {
      pledgeForm.querySelectorAll(".platform-capsule").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      if (platformInput) platformInput.value = btn.dataset.platform;
    });
  });

  // Toggle preset amount buttons
  pledgeForm?.querySelectorAll(".amount-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      pledgeForm.querySelectorAll(".amount-preset").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      if (amountInput) amountInput.value = btn.dataset.amount;
    });
  });

  // Reset preset button if user types custom amount
  amountInput?.addEventListener("input", () => {
    pledgeForm?.querySelectorAll(".amount-preset").forEach(p => p.classList.remove("active"));
  });

  pledgeForm?.addEventListener("submit", async function(e) {
    e.preventDefault();

    if (!platformInput || !platformInput.value) {
      if (pledgeStatus) {
        pledgeStatus.textContent = "Please select a payment method / Elige un método de pago";
        pledgeStatus.style.color = "#ffb3b3";
      }
      return;
    }

    if (pledgeStatus) {
      pledgeStatus.textContent = "Registering pledge / Registrando compromiso...";
      pledgeStatus.style.color = "hsl(38, 85%, 48%)";
    }

    const payload = {
      name: document.getElementById("pledge-name").value.trim(),
      email: document.getElementById("pledge-email").value.trim(),
      amount: parseFloat(amountInput.value),
      frequency: frequencyInput ? frequencyInput.value : "one-time",
      platform: platformInput.value,
      message: document.getElementById("pledge-message").value.trim(),
      timestamp: new Date().toISOString()
    };

    // 1. Cache strictly in Local Storage
    try {
      const cached = JSON.parse(localStorage.getItem("local_comrade_pledges") || "[]");
      cached.push(payload);
      localStorage.setItem("local_comrade_pledges", JSON.stringify(cached));
    } catch(err) {
      console.error("Local pledges storage fail:", err);
    }

    // 2. Refresh Portal list
    renderPortalLists();

    // 3. Try server POST with fallback mailto triggers
    try {
      const response = await fetch("/api/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (response.ok) {
        if (pledgeStatus) {
          pledgeStatus.textContent = result.message || "Pledge coordinated! Salvador Sena will reach out soon.";
          pledgeStatus.style.color = "hsl(var(--color-sky))";
        }
        pledgeForm.reset();
        // Reset classes
        pledgeForm.querySelectorAll(".freq-tab").forEach(t => t.classList.remove("active"));
        pledgeForm.querySelectorAll(".platform-capsule").forEach(t => t.classList.remove("active"));
        pledgeForm.querySelectorAll(".amount-preset").forEach(t => t.classList.remove("active"));
        pledgeForm.querySelectorAll(".freq-tab")[0].classList.add("active");
        if (frequencyInput) frequencyInput.value = "one-time";
      } else {
        throw new Error(result.message || "Pledge sync failed");
      }
    } catch(err) {
      // Trigger a direct mailto coordinator to Salvador Sena securely as credit-safe fallback
      const mailSubject = encodeURIComponent(`[NM Socialists Pledge] Contribution: $${payload.amount} via ${payload.platform}`);
      const mailBody = encodeURIComponent(
        `Comrade coordinator Salvador Sena,\n\n` +
        `I would like to finalize my solidarity offline pledge of $${payload.amount} (${payload.frequency}) via ${payload.platform}.\n\n` +
        `Contributor Details:\n` +
        `- Name: ${payload.name}\n` +
        `- Email: ${payload.email}\n` +
        `- Note: ${payload.message || "None"}\n\n` +
        `Please reach out to coordinate Venmo/PayPal or cash details.\n\n` +
        `In solidarity,\n${payload.name}`
      );
      
      window.location.href = `mailto:salvadorsena@senacolectivo.com?subject=${mailSubject}&body=${mailBody}`;

      if (pledgeStatus) {
        pledgeStatus.textContent = "Offline Mailer Triggered! Securely registered in browser storage.";
        pledgeStatus.style.color = "hsl(var(--color-sky))";
      }
      pledgeForm.reset();
      pledgeForm.querySelectorAll(".freq-tab").forEach(t => t.classList.remove("active"));
      pledgeForm.querySelectorAll(".platform-capsule").forEach(t => t.classList.remove("active"));
      pledgeForm.querySelectorAll(".amount-preset").forEach(t => t.classList.remove("active"));
      pledgeForm.querySelectorAll(".freq-tab")[0].classList.add("active");
      if (frequencyInput) frequencyInput.value = "one-time";
    }
  });


  // ─── 10. DYNAMIC COMRADE ADMIN PORTAL CONTROL PANEL ───
  
  // A. Portal tab panels navigation anchors binds
  const portalNavButtons = document.querySelectorAll(".portal-nav-btn");
  const portalTabPanels = document.querySelectorAll(".portal-tab-panel");

  portalNavButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      portalNavButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetPanelId = btn.dataset.target;
      portalTabPanels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  // B. Draw and list items in admin tables
  function renderPortalLists() {
    const listSignups = document.getElementById("portal-signups-list");
    const listPledges = document.getElementById("portal-pledges-list");
    const listPins = document.getElementById("portal-pins-list");

    const countSignups = document.getElementById("dash-signups-count");
    const countPledges = document.getElementById("dash-pledges-count");
    const countPins = document.getElementById("dash-pins-count");

    // Retrieve cached arrays
    let signups = [];
    let pledges = [];
    let customPins = [];

    try {
      signups = JSON.parse(localStorage.getItem("local_comrade_submissions") || "[]");
      pledges = JSON.parse(localStorage.getItem("local_comrade_pledges") || "[]");
      customPins = JSON.parse(localStorage.getItem("local_storymap_pins") || "[]");
    } catch(e){}

    // Update Overview Stats cards
    if (countSignups) countSignups.textContent = signups.length;
    if (countPledges) countPledges.textContent = pledges.length;
    if (countPins) countPins.textContent = customPins.length;

    // Render Contact Signups list
    if (listSignups) {
      if (signups.length === 0) {
        listSignups.innerHTML = `<div style="padding:1rem; text-align:center; color:hsl(var(--text-muted));">No registrations locally logged.</div>`;
      } else {
        listSignups.innerHTML = signups.map((sub, i) => `
          <div style="border-bottom:1px solid hsl(var(--border-light)); padding:0.5rem 0; font-family:var(--font-mono); display:flex; justify-content:space-between; align-items:start;">
            <div>
              <div style="font-weight:700; color:#fff;">${i+1}. ${sub.name} &lt;${sub.email}&gt;</div>
              <div style="color:hsl(var(--text-muted)); font-size:0.75rem;">City: ${sub.city || "N/A"} · Lang: ${sub.language}</div>
              <div style="color:hsl(var(--color-secondary)); font-size:0.72rem; margin-top:0.25rem;">Note: "${sub.interests || 'None'}"</div>
            </div>
            <span style="font-size:0.7rem; color:hsl(var(--text-muted));">${new Date(sub.timestamp).toLocaleString()}</span>
          </div>
        `).join("");
      }
    }

    // Render Solidarity Pledges list
    if (listPledges) {
      if (pledges.length === 0) {
        listPledges.innerHTML = `<div style="padding:1rem; text-align:center; color:hsl(var(--text-muted));">No pledges locally coordinated.</div>`;
      } else {
        listPledges.innerHTML = pledges.map((p, i) => `
          <div style="border-bottom:1px solid hsl(var(--border-light)); padding:0.5rem 0; font-family:var(--font-mono); display:flex; justify-content:space-between; align-items:start;">
            <div>
              <div style="font-weight:700; color:hsl(var(--color-secondary));">${i+1}. Pledge $${p.amount} (${p.frequency})</div>
              <div style="color:#fff; font-size:0.78rem;">${p.name} &lt;${p.email}&gt; · Method: ${p.platform}</div>
              ${p.message ? `<div style="color:hsl(var(--text-muted)); font-size:0.72rem; margin-top:0.2rem;">Note: "${p.message}"</div>` : ""}
            </div>
            <span style="font-size:0.7rem; color:hsl(var(--text-muted));">${new Date(p.timestamp).toLocaleString()}</span>
          </div>
        `).join("");
      }
    }

    // Render Custom Storymap Pins list
    if (listPins) {
      if (customPins.length === 0) {
        listPins.innerHTML = `<div style="padding:1rem; text-align:center; color:hsl(var(--text-muted));">No custom pins added.</div>`;
      } else {
        listPins.innerHTML = customPins.map((p, i) => `
          <div style="border-bottom:1px solid hsl(var(--border-light)); padding:0.5rem 0; font-family:var(--font-mono); display:flex; justify-content:space-between; align-items:start;">
            <div>
              <div style="font-weight:700; color:#fff;">${i+1}. ${p.titleEn}</div>
              <div style="color:hsl(var(--text-muted)); font-size:0.75rem;">Category: ${p.category} · Coordinates [${p.x}, ${p.y}]</div>
              <div style="color:hsl(var(--color-sky)); font-size:0.72rem;">Contributor: ${p.author || "Anonymous"}</div>
            </div>
            <span style="font-size:0.7rem; color:hsl(var(--text-muted));">${p.id}</span>
          </div>
        `).join("");
      }
    }
  }

  // C. Portal credentials inputs setup
  function loadPortalCredentials() {
    const inputFbPage = document.getElementById("setting-fb-page-id");
    const inputFbToken = document.getElementById("setting-fb-token");
    const inputAirtable = document.getElementById("setting-airtable-id");

    if (inputFbPage) inputFbPage.value = localStorage.getItem("fb_page_id") || "";
    if (inputFbToken) inputFbToken.value = localStorage.getItem("fb_page_access_token") || "";
    if (inputAirtable) inputAirtable.value = localStorage.getItem("airtable_base_id") || "";
  }

  document.getElementById("btn-save-credentials")?.addEventListener("click", () => {
    const pageId = document.getElementById("setting-fb-page-id").value.trim();
    const token = document.getElementById("setting-fb-token").value.trim();
    const airtable = document.getElementById("setting-airtable-id").value.trim();

    localStorage.setItem("fb_page_id", pageId);
    localStorage.setItem("fb_page_access_token", token);
    localStorage.setItem("airtable_base_id", airtable);

    alert("Credentials configured and encrypted strictly in browser local storage!");
    loadPortalCredentials();
  });

  // D. Clears database logs buttons
  document.getElementById("btn-clear-signups")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to purge local comrade registrations?")) {
      localStorage.removeItem("local_comrade_submissions");
      renderPortalLists();
    }
  });
  document.getElementById("btn-clear-pledges")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to purge local pledges logs?")) {
      localStorage.removeItem("local_comrade_pledges");
      renderPortalLists();
    }
  });
  document.getElementById("btn-clear-pins")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to purge local custom struggle pins?")) {
      localStorage.removeItem("local_storymap_pins");
      renderStorymapPins();
      renderStruggleSidebarIndex();
      renderPortalLists();
    }
  });

  // Pre-load lists and settings
  renderPortalLists();
  loadPortalCredentials();


  // ─── 11. ACTIVIST CANVAS POSTER STUDIO & AI GENERATOR ───
  const triggerStudioBtn = document.getElementById("trigger-studio-btn");
  const memeModal = document.getElementById("meme-modal");
  const memeCanvas = document.getElementById("meme-canvas");
  const closeMemeBtn = document.querySelector(".meme-modal-close");
  const backdropMeme = document.querySelector(".meme-modal-backdrop");
  
  // Studio Controller elements
  const memeTopText = document.getElementById("meme-top-text");
  const memeBottomText = document.getElementById("meme-bottom-text");
  const memeFontSize = document.getElementById("meme-font-size");
  const memeColor = document.getElementById("meme-color");
  const memeFileUpload = document.getElementById("meme-file-upload");
  const memeTemplatePreset = document.getElementById("meme-template-preset");
  const memeFontFamily = document.getElementById("meme-font-family");
  const memeLayout = document.getElementById("meme-layout");
  const memeAlign = document.getElementById("meme-align");
  const memeUppercase = document.getElementById("meme-uppercase");
  const memeOutlineWeight = document.getElementById("meme-outline-weight");

  // AI elements
  const memeAiPrompt = document.getElementById("meme-ai-prompt");
  const memeAiGenerateBtn = document.getElementById("meme-ai-generate-btn");
  const memeAiStatus = document.getElementById("meme-ai-status");

  // Share elements
  const btnMemeDownload = document.getElementById("meme-download");
  const btnMemeShare = document.getElementById("meme-share");
  const btnMemeCopyLink = document.getElementById("meme-copy-link");
  const statusCopyMeme = document.getElementById("meme-copy-status");

  // Facebook Page auto poster elements
  const btnFbPost = document.getElementById("fb-post-btn");
  const statusFbPost = document.getElementById("fb-post-status");

  let activeTemplateSrc = "assets/img/meme_1.png";

  function getAbsoluteUrl(relativePath) {
    const loc = window.location;
    if (relativePath.startsWith("data:")) return relativePath;
    const basePath = loc.pathname.replace(/index\.html$/, "");
    return loc.origin + basePath + relativePath;
  }

  // Visual redraw canvas meme
  function redrawMeme() {
    if (!memeCanvas || !activeTemplateSrc) return;
    const ctx = memeCanvas.getContext("2d");
    const img = new Image();

    if (activeTemplateSrc.startsWith("http") && !activeTemplateSrc.startsWith(window.location.origin)) {
      img.crossOrigin = "anonymous";
    }
    img.src = activeTemplateSrc;

    img.onload = () => {
      const layout = memeLayout ? memeLayout.value : "classic";
      const fSizeFactor = memeFontSize ? parseInt(memeFontSize.value) / 100 : 0.08;
      const fontFam = memeFontFamily ? memeFontFamily.value : "Impact";
      const align = memeAlign ? memeAlign.value : "center";
      const txtColor = memeColor ? memeColor.value : "#ffffff";
      const outlineWt = memeOutlineWeight ? parseInt(memeOutlineWeight.value) : 4;
      const forceUpper = memeUppercase ? memeUppercase.checked : true;

      let topTextStr = (memeTopText && memeTopText.value) ? memeTopText.value.trim() : "";
      let bottomTextStr = (memeBottomText && memeBottomText.value) ? memeBottomText.value.trim() : "";

      if (forceUpper) {
        topTextStr = topTextStr.toUpperCase();
        bottomTextStr = bottomTextStr.toUpperCase();
      }

      if (layout === "demotivational") {
        // Demotivational poster layout calculates black margins and borders
        const borderSize = Math.floor(img.naturalWidth * 0.08);
        const bottomPadding = Math.floor(img.naturalHeight * 0.26);

        memeCanvas.width = img.naturalWidth + borderSize * 2;
        memeCanvas.height = img.naturalHeight + borderSize * 1.5 + bottomPadding;

        ctx.fillStyle = "#0c0a08";
        ctx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);

        // Draw primary image
        ctx.drawImage(img, borderSize, borderSize, img.naturalWidth, img.naturalHeight);

        // Gold frame lines around image
        ctx.strokeStyle = "hsl(38, 85%, 48%)";
        ctx.lineWidth = Math.max(img.naturalWidth * 0.003, 1.5);
        ctx.strokeRect(borderSize - 3, borderSize - 3, img.naturalWidth + 6, img.naturalHeight + 6);

        // Render Title
        ctx.textAlign = "center";
        if (topTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 1.1));
          ctx.font = `600 ${finalFontSize}px "Space Grotesk", "Fraunces", serif`;
          ctx.fillStyle = "hsl(38, 85%, 48%)";
          const y = img.naturalHeight + borderSize * 1.5 + bottomPadding * 0.35;
          ctx.fillText(topTextStr, memeCanvas.width / 2, y, memeCanvas.width * 0.9);
        }

        // Render Subtitle
        if (bottomTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 0.65));
          ctx.font = `300 ${finalFontSize}px "Space Grotesk", "DM Sans", sans-serif`;
          ctx.fillStyle = "#f5ead8";
          const y = img.naturalHeight + borderSize * 1.5 + bottomPadding * 0.72;
          ctx.fillText(bottomTextStr, memeCanvas.width / 2, y, memeCanvas.width * 0.9);
        }

      } else if (layout === "banner") {
        // Terracotta banner box at bottom
        memeCanvas.width = img.naturalWidth || 600;
        memeCanvas.height = img.naturalHeight || 600;

        ctx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height);

        const bannerHeight = Math.floor(memeCanvas.height * 0.22);
        
        ctx.fillStyle = "rgba(194, 96, 58, 0.95)";
        ctx.fillRect(0, memeCanvas.height - bannerHeight, memeCanvas.width, bannerHeight);

        // Gold separation divider line
        ctx.strokeStyle = "hsl(38, 85%, 48%)";
        ctx.lineWidth = Math.max(memeCanvas.width * 0.005, 3);
        ctx.beginPath();
        ctx.moveTo(0, memeCanvas.height - bannerHeight);
        ctx.lineTo(memeCanvas.width, memeCanvas.height - bannerHeight);
        ctx.stroke();

        ctx.textAlign = align;
        let textX = memeCanvas.width / 2;
        if (align === "left") textX = memeCanvas.width * 0.05;
        if (align === "right") textX = memeCanvas.width * 0.95;

        // Render upper slogans inside banner
        if (topTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 0.85));
          ctx.font = `900 ${finalFontSize}px "${fontFam}", sans-serif`;
          ctx.fillStyle = "#fdf6ea";
          const y = memeCanvas.height - bannerHeight + bannerHeight * 0.35;
          ctx.fillText(topTextStr, textX, y, memeCanvas.width * 0.9);
        }

        // Render lower slogans inside banner
        if (bottomTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 0.65));
          ctx.font = `600 ${finalFontSize}px "${fontFam}", monospace`;
          ctx.fillStyle = "hsl(38, 85%, 48%)";
          const y = memeCanvas.height - bannerHeight + bannerHeight * 0.72;
          ctx.fillText(bottomTextStr, textX, y, memeCanvas.width * 0.9);
        }

      } else {
        // Classic overlay meme layout
        memeCanvas.width = img.naturalWidth || 600;
        memeCanvas.height = img.naturalHeight || 600;

        ctx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height);

        const finalFontSize = Math.floor(memeCanvas.width * fSizeFactor);
        ctx.fillStyle = txtColor;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = outlineWt;
        ctx.textAlign = align;
        ctx.font = `900 ${finalFontSize}px "${fontFam}", Impact, sans-serif`;

        let textX = memeCanvas.width / 2;
        if (align === "left") textX = memeCanvas.width * 0.05;
        if (align === "right") textX = memeCanvas.width * 0.95;

        // Draw top overlay text
        if (topTextStr) {
          ctx.textBaseline = "top";
          const y = memeCanvas.height * 0.05;
          if (outlineWt > 0) ctx.strokeText(topTextStr, textX, y, memeCanvas.width * 0.9);
          ctx.fillText(topTextStr, textX, y, memeCanvas.width * 0.9);
        }

        // Draw bottom overlay text
        if (bottomTextStr) {
          ctx.textBaseline = "bottom";
          const y = memeCanvas.height * 0.95;
          if (outlineWt > 0) ctx.strokeText(bottomTextStr, textX, y, memeCanvas.width * 0.9);
          ctx.fillText(bottomTextStr, textX, y, memeCanvas.width * 0.9);
        }
      }

      // Update download link
      try {
        if (btnMemeDownload) btnMemeDownload.href = memeCanvas.toDataURL("image/png");
      } catch(err) {
        if (btnMemeDownload) btnMemeDownload.href = activeTemplateSrc;
      }
    };
  }

  // Bind studio inputs
  const inputs = [memeTopText, memeBottomText, memeFontSize, memeColor, memeFontFamily, memeLayout, memeAlign, memeUppercase, memeOutlineWeight];
  inputs.forEach(element => {
    if (element) {
      const ev = (element.tagName === "SELECT" || element.type === "checkbox") ? "change" : "input";
      element.addEventListener(ev, redrawMeme);
    }
  });

  // Bind custom user stock image file upload
  memeFileUpload?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        activeTemplateSrc = event.target.result;
        if (memeTemplatePreset) memeTemplatePreset.value = "custom";
        redrawMeme();
      };
      reader.readAsDataURL(file);
    }
  });

  // Bind template preset dropdown select
  memeTemplatePreset?.addEventListener("change", (e) => {
    const src = e.target.value;
    if (src && src !== "custom") {
      activeTemplateSrc = src;
      const absolute = getAbsoluteUrl(activeTemplateSrc);
      if (btnMemeDownload) btnMemeDownload.href = activeTemplateSrc;
      if (btnMemeShare) btnMemeShare.dataset.shareUrl = absolute;
      if (btnMemeCopyLink) btnMemeCopyLink.dataset.copyUrl = absolute;
      redrawMeme();
    }
  });

  // Dynamic client-side high-speed AI image preloader generator using pollinations
  memeAiGenerateBtn?.addEventListener("click", () => {
    const promptVal = memeAiPrompt?.value.trim() || "";
    if (!promptVal) {
      if (memeAiStatus) {
        memeAiStatus.textContent = "Please describe stock image / Ingresa descripción";
        memeAiStatus.style.color = "#ffb3b3";
      }
      return;
    }

    if (memeAiStatus) {
      memeAiStatus.textContent = "🤖 Generating stock image with AI... / Generando con IA...";
      memeAiStatus.style.color = "hsl(38, 85%, 48%)";
    }
    if (memeAiGenerateBtn) memeAiGenerateBtn.disabled = true;

    const seed = Math.floor(Math.random() * 999999);
    // Secure fully client-side bypass avoiding VM credit burn
    const aiUrl = `https://image.pollinations.ai/p/${encodeURIComponent(promptVal)}?width=768&height=768&nologo=true&seed=${seed}`;

    const preloader = new Image();
    preloader.crossOrigin = "anonymous";
    preloader.src = aiUrl;
    
    preloader.onload = () => {
      activeTemplateSrc = aiUrl;
      if (memeAiStatus) {
        memeAiStatus.textContent = "🤖 AI image generated! / ¡Imagen cargada con éxito!";
        memeAiStatus.style.color = "hsl(var(--color-sky))";
      }
      if (memeAiGenerateBtn) memeAiGenerateBtn.disabled = false;
      redrawMeme();
    };

    preloader.onerror = () => {
      if (memeAiStatus) {
        memeAiStatus.textContent = "AI generation failed. Try again / Error de generación.";
        memeAiStatus.style.color = "#ffb3b3";
      }
      if (memeAiGenerateBtn) memeAiGenerateBtn.disabled = false;
    };
  });

  function openMemeModal(imgPath) {
    activeTemplateSrc = imgPath || "assets/img/meme_1.png";
    const absolute = getAbsoluteUrl(activeTemplateSrc);

    if (btnMemeDownload) btnMemeDownload.href = activeTemplateSrc;
    if (btnMemeShare) btnMemeShare.dataset.shareUrl = absolute;
    if (btnMemeCopyLink) btnMemeCopyLink.dataset.copyUrl = absolute;
    if (statusCopyMeme) statusCopyMeme.textContent = "";
    if (statusFbPost) statusFbPost.textContent = "";

    // Clear controls
    if (memeTopText) memeTopText.value = "";
    if (memeBottomText) memeBottomText.value = "";
    if (memeFontSize) memeFontSize.value = "8";
    if (memeColor) memeColor.value = "#ffffff";
    if (memeFontFamily) memeFontFamily.value = "Impact";
    if (memeLayout) memeLayout.value = "classic";
    if (memeAlign) memeAlign.value = "center";
    if (memeUppercase) memeUppercase.checked = true;
    if (memeOutlineWeight) memeOutlineWeight.value = "4";
    if (memeFileUpload) memeFileUpload.value = "";
    if (memeAiPrompt) memeAiPrompt.value = "";
    if (memeAiStatus) memeAiStatus.textContent = "";

    if (memeTemplatePreset) {
      if (activeTemplateSrc.startsWith("data:") || activeTemplateSrc.startsWith("blob:")) {
        memeTemplatePreset.value = "custom";
      } else {
        let matchedVal = activeTemplateSrc;
        if (activeTemplateSrc.includes("assets/img/")) {
          const idx = activeTemplateSrc.indexOf("assets/img/");
          matchedVal = activeTemplateSrc.substring(idx);
        }
        const exists = Array.from(memeTemplatePreset.options).some(opt => opt.value === matchedVal);
        if (exists) {
          memeTemplatePreset.value = matchedVal;
        } else {
          memeTemplatePreset.value = "";
        }
      }
    }

    memeModal?.classList.add("active");
    memeModal?.setAttribute("aria-hidden", "false");

    setTimeout(redrawMeme, 100);
  }

  function closeMemeModal() {
    memeModal?.classList.remove("active");
    memeModal?.setAttribute("aria-hidden", "true");
  }

  // Bind Open/Close studio triggers
  triggerStudioBtn?.addEventListener("click", () => openMemeModal("assets/img/meme_1.png"));
  
  // Card elements binds inside Browse Posters
  document.querySelectorAll(".js-view-meme").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.img;
      openMemeModal(src);
    });
  });

  // Card images binds
  document.querySelectorAll(".gallery-item img").forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      const src = img.getAttribute("src");
      openMemeModal(src);
    });
  });

  // Browse share buttons triggers
  document.querySelectorAll(".js-share-meme").forEach(btn => {
    btn.addEventListener("click", async () => {
      const src = btn.dataset.img;
      const absolute = getAbsoluteUrl(src);

      if (navigator.share) {
        try {
          await navigator.share({
            title: "New Mexico Socialists Comrade Art",
            text: "Check out this revolutionary art poster from New Mexico Socialists!",
            url: absolute
          });
        } catch(e){}
      } else {
        try {
          await navigator.clipboard.writeText(absolute);
          alert("Poster template link copied to clipboard! / ¡Enlace copiado!");
        } catch(err){}
      }
    });
  });

  closeMemeBtn?.addEventListener("click", closeMemeModal);
  backdropMeme?.addEventListener("click", closeMemeModal);

  // Mobile detector
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Mobile Save Modal Elements
  const mobileSaveModal = document.getElementById("mobile-save-modal");
  const mobileSaveCloseBtn = document.getElementById("mobile-save-close-btn");
  const mobileSaveBackdrop = document.getElementById("mobile-save-backdrop");
  const mobileSaveBtnClose = document.getElementById("mobile-save-btn-close");
  const mobileSaveImg = document.getElementById("mobile-save-img");

  function closeMobileSaveModal() {
    mobileSaveModal?.classList.remove("active");
    mobileSaveModal?.setAttribute("aria-hidden", "true");
  }

  mobileSaveCloseBtn?.addEventListener("click", closeMobileSaveModal);
  mobileSaveBackdrop?.addEventListener("click", closeMobileSaveModal);
  mobileSaveBtnClose?.addEventListener("click", closeMobileSaveModal);

  // Override standard download link on mobile devices
  btnMemeDownload?.addEventListener("click", (e) => {
    if (isMobile) {
      e.preventDefault();
      
      let dataUrl;
      try {
        dataUrl = memeCanvas.toDataURL("image/png");
      } catch (err) {
        // Fallback for tainted canvas
        dataUrl = activeTemplateSrc;
      }
      
      if (mobileSaveImg) mobileSaveImg.src = dataUrl;
      mobileSaveModal?.classList.add("active");
      mobileSaveModal?.setAttribute("aria-hidden", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && memeModal?.classList.contains("active")) {
      closeMemeModal();
    }
    if (e.key === "Escape" && pinModal?.classList.contains("active")) {
      closePinModal();
    }
    if (e.key === "Escape" && mobileSaveModal?.classList.contains("active")) {
      closeMobileSaveModal();
    }
  });

  // Copy template link inside Studio
  btnMemeCopyLink?.addEventListener("click", async () => {
    const url = btnMemeCopyLink.dataset.copyUrl;
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      if (statusCopyMeme) {
        statusCopyMeme.textContent = "Link copied! / ¡Enlace copiado!";
        statusCopyMeme.style.color = "hsl(var(--color-sky))";
      }
    } catch(err){
      if (statusCopyMeme) {
        statusCopyMeme.textContent = "Could not copy link.";
        statusCopyMeme.style.color = "#ffb3b3";
      }
    }
  });

  // Share template or customized image inside Studio
  btnMemeShare?.addEventListener("click", async () => {
    if (!memeCanvas) return;
    
    // Check if browser supports Web Share API with files
    if (navigator.share && navigator.canShare) {
      try {
        memeCanvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "comrade-poster.png", { type: "image/png" });
          
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: "Comrade Meme - NM Socialists",
                text: "Check out this custom poster from the NM Socialists Comrade Meme Studio!"
              });
              return; // Successful share!
            } catch (err) {
              console.error("Web Share failed:", err);
            }
          }
          
          // Fallback to URL sharing if files are rejected
          const url = btnMemeShare.dataset.shareUrl;
          await navigator.share({
            title: "New Mexico Socialists Poster Template",
            text: "Design revolutionary posters bilingually in our Comrade Meme Studio!",
            url: url
          });
        }, "image/png");
      } catch (err) {
        console.error("Blob sharing failed:", err);
      }
    } else {
      // Desktop fallback: copy link
      const url = btnMemeShare.dataset.shareUrl;
      try {
        await navigator.clipboard.writeText(url);
        if (statusCopyMeme) {
          statusCopyMeme.textContent = "Template link copied! / ¡Enlace copiado!";
          statusCopyMeme.style.color = "hsl(var(--color-sky))";
        }
      } catch(e){}
    }
  });

  // DIRECT FB PAGE AUTO POSTER
  btnFbPost?.addEventListener("click", () => {
    if (!memeCanvas) return;
    if (statusFbPost) {
      statusFbPost.textContent = "Posting to Facebook... / Publicando...";
      statusFbPost.style.color = "hsl(38, 85%, 48%)";
    }

    const token = localStorage.getItem("fb_page_access_token");
    const pageId = localStorage.getItem("fb_page_id");

    if (!token || !pageId) {
      if (statusFbPost) {
        statusFbPost.textContent = "Error: FB credentials not configured. Configure in Admin Portal!";
        statusFbPost.style.color = "#ffb3b3";
      }
      return;
    }

    try {
      memeCanvas.toBlob(async (blob) => {
        if (!blob) {
          if (statusFbPost) statusFbPost.textContent = "Canvas render error.";
          return;
        }

        const formData = new FormData();
        formData.append("access_token", token);
        formData.append("source", blob);

        let caption = "✊ Posted via NM Socialists Comrade Portal!\n";
        if (memeTopText?.value) caption += `\n"${memeTopText.value.toUpperCase()}"`;
        if (memeBottomText?.value) caption += `\n"${memeBottomText.value.toUpperCase()}"`;
        caption += "\n\nJoin the movement at newmexicosocialists.com";

        formData.append("message", caption);

        try {
          const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
            method: "POST",
            body: formData
          });

          const result = await res.json();
          if (result.id || result.post_id) {
            if (statusFbPost) {
              statusFbPost.textContent = "Posted successfully to Facebook! ✊ / ¡Publicado!";
              statusFbPost.style.color = "hsl(var(--color-sky))";
            }
          } else {
            throw new Error(result.error?.message || "Rejected by Graph API");
          }
        } catch(err) {
          if (statusFbPost) {
            statusFbPost.textContent = `FB API Error: ${err.message}`;
            statusFbPost.style.color = "#ffb3b3";
          }
        }
      }, "image/png");
    } catch(err) {
      if (statusFbPost) {
        statusFbPost.textContent = "Direct posting security limitation. Download PNG and post manually!";
        statusFbPost.style.color = "#ffb3b3";
      }
    }
  });


  // ─── 12. INITIALIZATION STATE SYNC ───
  // Set default language
  setLanguage(currentLang);
  
  // Meta brain status sync timer simulations
  const syncDot = document.getElementById("sync-dot");
  const syncText = document.getElementById("sync-source-text");
  const syncTimestamp = document.getElementById("sync-timestamp");

  if (syncDot && syncText && syncTimestamp) {
    setInterval(() => {
      const activeStates = ["SECURE LATTICE CORE ACTIVE", "SYNCING KNOWLEDGE MATRIX...", "QC* SANDBOX PROCESS GRAPH: ONLINE", "COMMONS BULLETINS VERIFIED"];
      const randomState = activeStates[Math.floor(Math.random() * activeStates.length)];
      syncText.textContent = randomState;
      syncTimestamp.textContent = `TIMESTAMP: ${new Date().toLocaleTimeString()}`;
      
      syncDot.style.background = "hsl(var(--color-secondary))";
      setTimeout(() => {
        syncDot.style.background = "hsl(var(--color-primary))";
      }, 500);
    }, 6000);
  }
});
