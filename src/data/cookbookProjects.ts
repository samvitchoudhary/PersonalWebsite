export type CookbookProject = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  featured: boolean;
  github?: string;
  live?: string;
  liveNote?: string;
};

export const cookbookProjects: CookbookProject[] = [
  {
    id: "thinkex",
    name: "ThinkEx",
    tagline: "A workspace for how you study, research, and create",
    description:
      "An open-source workspace for source-heavy study and research. Instead of dumping sources into a chat, ThinkEx keeps PDFs, docs, images, folders, and AI chat side by side — arrange them, pick what the AI uses as context, and keep work grounded in your actual materials. A NotebookLM and Obsidian alternative. Released v1.0.0 in January 2026 with 45+ stars on GitHub. I'm a core contributor and maintainer.",
    ingredients: [
      "TypeScript",
      "React 19",
      "TanStack Start",
      "Tailwind CSS v4",
      "Tiptap",
      "Yjs",
      "Cloudflare Workers",
      "Durable Objects",
      "D1",
      "R2",
      "Workers AI",
    ],
    featured: true,
    github: "https://github.com/ThinkEx-OSS/thinkex",
    live: "https://thinkex.app",
  },
  {
    id: "sr-11-7",
    name: "SR 11-7 Model Validation Agent",
    tagline: "Six weeks of compliance review in eight minutes",
    description:
      "An automated validation platform for Federal Reserve SR 11-7 model risk compliance. It compresses a roughly 6-week manual review process into an ~8-minute end-to-end pipeline — an LLM-driven engine scores models against regulatory criteria and auto-generates audit-ready compliance reports with structured evidence citations. Built as a full-stack app with drag-and-drop document upload, real-time progress tracking, and one-click PDF report generation.",
    ingredients: [
      "Python",
      "FastAPI",
      "Claude Sonnet",
      "LlamaParse",
      "ReportLab",
      "Docker",
      "Railway",
    ],
    featured: true,
    github:
      "https://github.com/samvitchoudhary/SR-11-7-Model-Validation-Agent",
  },
  {
    id: "heatmap",
    name: "HeatMap",
    tagline: "Pin your photos to the real world",
    description:
      "A location-based social photo app where users pin photos to real-world map locations. Currently in TestFlight with beta testers. Includes RLS security hardening, cursor-based pagination, Supabase Realtime subscriptions, and a modular services/hooks architecture.",
    ingredients: [
      "TypeScript",
      "React Native",
      "Expo",
      "EAS",
      "Supabase",
      "Google Maps API",
    ],
    featured: false,
    github: "https://github.com/samvitchoudhary/HeatMap",
    liveNote: "Available on TestFlight",
  },
  {
    id: "trippy-tacos",
    name: "Trippy-Tacos RAG Chatbot",
    tagline: "Answers grounded in the source, with citations",
    description:
      "A RAG-powered chatbot built for a restaurant client, featuring citation rendering, LLM-based metadata extraction, and batched document ingestion.",
    ingredients: ["Next.js", "LangChain", "Google Gemini", "Supabase pgvector"],
    featured: false,
  },
  {
    id: "moms-website",
    name: "Mom's Website (Swati's Recipes)",
    tagline: "A recipe blog built for my mom",
    description:
      "A recipe blog I built for my mom, with Supabase handling the database, authentication, and storage. Clean, simple, and deployed on Vercel.",
    ingredients: [
      "React",
      "Vite",
      "Tailwind CSS v4",
      "React Router",
      "Supabase",
    ],
    featured: false,
    github: "https://github.com/samvitchoudhary/Moms_Website",
    live: "https://moms-website-sage.vercel.app",
  },
];

export const INGREDIENT_BULLETS = ["🫙", "🥄", "🌿", "🧄", "✨"] as const;
