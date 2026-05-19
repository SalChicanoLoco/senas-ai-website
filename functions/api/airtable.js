// functions/api/airtable.js - Cloudflare Pages Worker for NUMARA Meta Brain Integration
// Secures Airtable PAT credentials behind a serverless proxy and implements a high-fidelity Dossier Fallback Mode

const FALLBACK_DOSSIER = [
  {
    id: "rec1",
    fields: {
      Title: "NUMARA Core Framework",
      Title_es: "Estructura Central NUMARA",
      Category: "Systems Architecture",
      Category_es: "Arquitectura de Sistemas",
      Summary: "Reusable state-based modular intelligence engine designed to coordinate multiple models, tools, and visual narratives.",
      Summary_es: "Motor de inteligencia modular basado en estados, diseñado para coordinar múltiples modelos, herramientas y narrativas visuales.",
      Description: "NUMARA Core represents Salvador Sena's central framework for modular intelligence. Rather than building separate tools, NUMARA treats every application and process as a temporary state, mode, or transformation of a reusable, isomorphic core. This system minimizes redundancy and is built using containerized pipelines, serving as the foundational command lattice for all Sena AI Tech LLC software and creative developments.",
      Description_es: "NUMARA Core representa el marco de trabajo central de Salvador Sena para la inteligencia modular. En lugar de construir herramientas aisladas, NUMARA trata cada aplicación y proceso como un estado, modo o transformación temporal de un núcleo reutilizable e isomórfico. Este sistema minimiza la redundancia y está construido utilizando tuberías de contenedores, sirviendo como la red de comando fundamental para todos los desarrollos creativos y de software de Sena AI Tech LLC.",
      AssociatedProjects: "NUMARA Core, NUMARA API, NUMARA App, UOS",
      GitVerificationStatus: "VERIFIED / VERIFICADO",
      SandboxProcesses: "4 sandboxed tasks running / 4 tareas aisladas en ejecución",
      GraphNodeId: "numara_core"
    }
  },
  {
    id: "rec2",
    fields: {
      Title: "Quetzal-Core Distributed Intelligence",
      Title_es: "Inteligencia Distribuida Quetzal-Core",
      Category: "Systems Architecture",
      Category_es: "Arquitectura de Sistemas",
      Summary: "A distributed AI architecture utilizing multi-agent process graphs, neuromorphic memristive simulations, and recursive tuning.",
      Summary_es: "Una arquitectura de IA distribuida que utiliza gráficos de procesos multi-agente, simulaciones neuromórficas memristivas y sintonización recursiva.",
      Description: "Quetzal-Core is the decentralized conceptual engine behind the Sena ecosystem's advanced compute orchestration. Drawing inspiration from biological systems (cellular spawn/teach loops), Quetzal-Core executes sandboxed processes in isolated namespaces. It includes a native hypervisor layer and simulates non-standard neuromorphic structures like virtual memristors to manage process graphs and optimize distributed model coordination across hardware nodes (like the RTX 4090 'Beast').",
      Description_es: "Quetzal-Core es el motor conceptual descentralizado detrás de la orquestación de cómputo avanzada del ecosistema Sena. Inspirándose en sistemas biológicos (bucles de reproducción/enseñanza celular), Quetzal-Core ejecuta procesos aislados en espacios de nombres protegidos. Incluye una capa de hipervisor nativa y simula estructuras neuromórficas no estándar como memristores virtuales para gestionar gráficos de procesos y optimizar la coordinación de modelos distribuidos a través de nodos de hardware (como el nodo de cómputo 'Beast' RTX 4090).",
      AssociatedProjects: "Quetzal-Core, Beast compute node, QHP Protocol",
      GitVerificationStatus: "VERIFIED / VERIFICADO",
      SandboxProcesses: "7 active sandboxes / 7 entornos de arena activos",
      GraphNodeId: "quetzal_core"
    }
  },
  {
    id: "rec3",
    fields: {
      Title: "Public-Interest Grant Assistant",
      Title_es: "Asistente de Subvenciones de Interés Público",
      Category: "Civic & Public-Interest",
      Category_es: "Interés Cívico y Público",
      Summary: "High-utility civic proposal generator designed to secure capital for rural New Mexico communities and sustainable labs.",
      Summary_es: "Generador de propuestas cívicas de alta utilidad diseñado para asegurar capital para comunidades rurales de Nuevo México y laboratorios sostenibles.",
      Description: "The Grant Assistant is a highly practical, near-term strategic tool in the NUMARA suite. It analyzes historical public-interest proposals and helps generate compliant documentation for New Mexico local government projects, specifically aligning with ICIP (Infrastructure Capital Improvement Plan) standards. It bridges AI capabilities with real-world community development and mutual-aid coordination, supporting local schools and regional programs.",
      Description_es: "El Asistente de Subvenciones es una herramienta estratégica sumamente práctica y a corto plazo de la suite NUMARA. Analiza propuestas de interés público históricas y ayuda a generar documentación conforme para proyectos de gobiernos locales de Nuevo México, alineándose específicamente con los estándares del ICIP (Plan de Mejora del Capital de Infraestructura). Une las capacidades de la IA con el desarrollo comunitario del mundo real y la coordinación de ayuda mutua, apoyando a las escuelas locales y programas regionales.",
      AssociatedProjects: "NUMARA Core, NM Socialists Mutual Aid, Aquaponics Living-Lab",
      GitVerificationStatus: "VERIFIED / VERIFICADO",
      SandboxProcesses: "1 active validation run / 1 ejecución de validación activa",
      GraphNodeId: "grant_assistant"
    }
  },
  {
    id: "rec4",
    fields: {
      Title: "Geospatial Preflight QA/QC Pipeline",
      Title_es: "Tubería de Control y Garantía de Calidad Geoespacial Preflight",
      Category: "Geospatial Science",
      Category_es: "Ciencia Geoespacial",
      Summary: "Rigorous standards-compliant geospatial data validator enforcing EPSG, NAD83, and NAVD88 coordinate projections.",
      Summary_es: "Validador riguroso de datos geoespaciales conforme a estándares que impone proyecciones de coordenadas EPSG, NAD83 y NAVD88.",
      Description: "The GIS Preflight QA/QC Pipeline is a Python-based compliance tool for geospatial analytics. It recursively scans and validates vector, raster, and LiDAR files to ensure complete alignment with strict NMGS, NMGIC, and ASPRS standards. Working primarily with UTM Zone 13N (EPSG:6342) projections, it automates projection checking, coordinate system conformity, and spatial data audit trails, making it essential for planning rural housing and water-system integrations.",
      Description_es: "La tubería de Control y Garantía de Calidad GIS Preflight es una herramienta de cumplimiento basada en Python para análisis geoespaciales. Escanea y valida recursivamente archivos vectoriales, ráster y LiDAR para garantizar una alineación completa con los estrictos estándares NMGS, NMGIC y ASPRS. Al trabajar principalmente con proyecciones UTM Zona 13N (EPSG:6342), automatiza la verificación de proyecciones, la conformidad del sistema de coordenadas y las trazas de auditoría de datos espaciales, lo que la hace esencial para planificar viviendas rurales e integraciones de sistemas de agua.",
      AssociatedProjects: "Sena's AI Tech LLC, RGIS sync engine",
      GitVerificationStatus: "VERIFIED / VERIFICADO",
      SandboxProcesses: "0 active pipelines / 0 tuberías activas",
      GraphNodeId: "gis_pipeline"
    }
  },
  {
    id: "rec5",
    fields: {
      Title: "Universum Ordinis Superioris (UOS)",
      Title_es: "Universum Ordinis Superioris (UOS)",
      Category: "Creative Worlds",
      Category_es: "Mundos Creativos",
      Summary: "A rich, speculative science-fiction world and cinematic production pipeline utilizing AI generation and resonance networks.",
      Summary_es: "Un mundo de ciencia ficción rico y especulativo y una tubería de producción cinematográfica que utiliza generación de IA y redes de resonancia.",
      Description: "UOS is both a narrative laboratory and a creative testing ground for Sena AI Tech LLC's visual and media pipelines. Set in a post-cataclysmic cosmic landscape governed by a distributed resonance lattice, UOS functions as an exploratory sandboxed environment. Here, advanced AI generation tools iterate on prestige trailers, photorealistic sci-fi assets, and character models, testing the absolute limits of neural image and video rendering on high-end local nodes.",
      Description_es: "UOS es tanto un laboratorio narrativo como un campo de pruebas creativas para las tuberías visuales y de medios de Sena AI Tech LLC. Ambientado en un paisaje cósmico post-cataclísmico gobernado por una red de resonancia distribuida, UOS funciona como un entorno seguro de exploración. Aquí, herramientas avanzadas de generación de IA iteran en avances de prestigio, activos de ciencia ficción fotorrealistas y modelos de personajes, probando los límites absolutos del renderizado neuronal de imágenes y videos en nodos locales de alto rendimiento.",
      AssociatedProjects: "UOS Media Engine, Beast Image Generator",
      GitVerificationStatus: "VERIFIED / VERIFICADO",
      SandboxProcesses: "2 visual render loops / 2 bucles de renderizado visual",
      GraphNodeId: "uos"
    }
  },
  {
    id: "rec6",
    fields: {
      Title: "Sena's AI Tech LLC Innovation Hub",
      Title_es: "Centro de Innovación de Sena's AI Tech LLC",
      Category: "Speculative R&D",
      Category_es: "I+D Especulativa",
      Summary: "The entrepreneurial umbrella coordinating sustainable field deployments, modular software architectures, and rural tech.",
      Summary_es: "El paraguas empresarial que coordina despliegues de campo sostenibles, arquitecturas de software modulares y tecnología rural.",
      Description: "Sena's AI Tech LLC serves as the operational structure coordinating Salvador Sena's diverse lanes of technology and civic innovation. It focuses on combining cutting-edge computing research (distributed agent swarms, non-Fourier signal processing) with practical community-facing infrastructure, including local sustainable housing designs and hybrid aquaponic installations in northern New Mexico.",
      Description_es: "Sena's AI Tech LLC sirve como la estructura operativa que coordina los diversos campos de tecnología e innovación cívica de Salvador Sena. Se centra en combinar investigación informática de vanguardia (enjambres de agentes distribuidos, procesamiento de señales no de Fourier) con infraestructura práctica orientada a la comunidad, incluyendo diseños de viviendas locales sostenibles e instalaciones acuapónicas híbridas en el norte de Nuevo México.",
      AssociatedProjects: "NUMARA Core, Quetzal-Core, Aquaponics Living-Lab",
      GitVerificationStatus: "VERIFIED / VERIFICADO",
      SandboxProcesses: "2 background system tasks / 2 tareas de sistema en segundo plano",
      GraphNodeId: "sena_llc"
    }
  }
];

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search")?.toLowerCase() || "";
  const categoryParam = url.searchParams.get("category")?.toLowerCase() || "";

  let records = [];
  let isLiveCloud = false;

  const pat = env.AIRTABLE_PAT;
  const baseId = env.AIRTABLE_BASE_ID;
  const tableName = env.AIRTABLE_TABLE_NAME || "MetaBrain";

  // Attempt live connection if secrets exist
  if (pat && baseId) {
    try {
      const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
      const response = await fetch(airtableUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${pat}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.records && Array.isArray(data.records)) {
          records = data.records;
          isLiveCloud = true;
        }
      } else {
        console.warn(`Airtable API responded with status ${response.status}. Entering Fallback Mode.`);
      }
    } catch (err) {
      console.error("Failed to fetch from Airtable cloud. Entering Fallback Mode:", err);
    }
  }

  // Fallback to local Portable Memory Dossier if cloud query didn't yield records
  if (records.length === 0) {
    records = JSON.parse(JSON.stringify(FALLBACK_DOSSIER));
    isLiveCloud = false;
  }

  // Apply serverless search and category filters
  let filteredRecords = records;

  if (categoryParam) {
    filteredRecords = filteredRecords.filter(rec => {
      const cat = rec.fields?.Category?.toLowerCase() || "";
      const catEs = rec.fields?.Category_es?.toLowerCase() || "";
      return cat.includes(categoryParam) || catEs.includes(categoryParam);
    });
  }

  if (searchParam) {
    filteredRecords = filteredRecords.filter(rec => {
      const title = rec.fields?.Title?.toLowerCase() || "";
      const titleEs = rec.fields?.Title_es?.toLowerCase() || "";
      const summary = rec.fields?.Summary?.toLowerCase() || "";
      const summaryEs = rec.fields?.Summary_es?.toLowerCase() || "";
      const description = rec.fields?.Description?.toLowerCase() || "";
      const descriptionEs = rec.fields?.Description_es?.toLowerCase() || "";
      const assoc = rec.fields?.AssociatedProjects?.toLowerCase() || "";

      return title.includes(searchParam) ||
             titleEs.includes(searchParam) ||
             summary.includes(searchParam) ||
             summaryEs.includes(searchParam) ||
             description.includes(searchParam) ||
             descriptionEs.includes(searchParam) ||
             assoc.includes(searchParam);
    });
  }

  // Return the JSON payload with sync status header metadata
  return new Response(JSON.stringify({
    syncSource: isLiveCloud ? "Live Airtable Cloud" : "Local Memory Dossier Fallback",
    connected: isLiveCloud,
    timestamp: new Date().toISOString(),
    count: filteredRecords.length,
    records: filteredRecords
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    }
  });
}

// Handle OPTIONS preflight requests for security
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
