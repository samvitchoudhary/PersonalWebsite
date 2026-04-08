import type {
  AboutFact,
  ContactLink,
  CookingItem,
  Experience,
  InterestStation,
  Project,
  SkillCategory,
} from "@/types";

export const projects: Project[] = [
  {
    name: "SR 11-7 Model Validation Agent",
    prep: "3 months",
    difficulty: "Advanced",
    ingredients: [
      "FastAPI",
      "Claude Sonnet",
      "LlamaParse",
      "ReportLab",
      "Railway",
    ],
    description:
      "Automated the Federal Reserve's SR 11-7 framework for stress testing model validation. Built async parallel processing pipeline with PDF report generation for a client.",
  },
  {
    name: "HeatMap",
    prep: "Ongoing",
    difficulty: "Advanced",
    ingredients: [
      "React Native",
      "Expo",
      "Supabase",
      "Google Maps API",
    ],
    description:
      "Location-based social photo app with ~15 TestFlight testers. Implemented security hardening, RLS, cursor-based pagination, Realtime subscriptions, and modular services/hooks architecture.",
  },
  {
    name: "Trippy Tacos RAG Chatbot",
    prep: "2 months",
    difficulty: "Intermediate",
    ingredients: [
      "Next.js",
      "LangChain",
      "Google Gemini",
      "Supabase pgvector",
    ],
    description:
      "RAG-powered chatbot with citation rendering, LLM-based metadata extraction, and batched document ingestion for a restaurant client.",
  },
  {
    name: "O9 Supply Chain Test Automation",
    prep: "Internship project",
    difficulty: "Advanced",
    ingredients: ["React", "Vite", "Flask", "Selenium", "Claude Sonnet"],
    description:
      "Built for Mondelēz International. Full-stack test automation platform with UI/branding polish, navigation cleanup, codebase modularization, and documentation.",
  },
  {
    name: "SharedJournal",
    prep: "1 month",
    difficulty: "Intermediate",
    ingredients: ["SwiftUI", "Supabase"],
    description:
      "Collaborative friend memory-keeping iOS app built end-to-end — from schema design through auth, timeline views, and photo handling.",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "Swift",
      "SQL",
      "HTML/CSS",
    ],
  },
  {
    name: "Frameworks",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Flask",
      "FastAPI",
      "SwiftUI",
      "Expo",
    ],
  },
  {
    name: "Data & AI",
    items: [
      "LangChain",
      "Claude API",
      "Gemini",
      "Supabase",
      "pgvector",
      "Selenium",
    ],
  },
  {
    name: "Tools",
    items: ["Git", "Docker", "Railway", "Vercel", "Figma", "LaTeX"],
  },
];

export const aboutFacts: AboutFact[] = [
  { emoji: "🎓", text: "CS @ University of Maryland, Class of 2028" },
  {
    emoji: "👨‍🍳",
    text: "Learned to cook from mom — goal: at least one meal a day",
  },
  { emoji: "🏕️", text: "Eagle Scout & Senior Patrol Leader" },
  {
    emoji: "🎾",
    text: "Tennis team captain — two sectional titles",
  },
  { emoji: "✍️", text: "Daily journaler" },
  { emoji: "🇮🇳", text: "Spends every August with family in India" },
  {
    emoji: "🏆",
    text: "1st place TCNJ hackathon — IoT weather sensor",
  },
];

export const cookingItems: CookingItem[] = [
  {
    title: "GDD Toolkit AI Chatbot",
    status: "Active",
    description:
      "Implementing Profile and Onboarding UI pages with MUI components in a Next.js project.",
  },
  {
    title: "This Portfolio Site!",
    status: "Active",
    description:
      "An interactive illustrated kitchen — the site you're exploring right now.",
  },
  {
    title: "CMSC 132",
    status: "Studying",
    description:
      "Recursive auxiliary methods, Java Collections Framework maps and sets.",
  },
];

export const experiences: Experience[] = [
  {
    role: "Software Engineering Intern",
    org: "Mondelēz International",
    period: "Summer 2024",
    description:
      "Built supply chain test automation platform with React/Flask/Selenium/Claude Sonnet.",
  },
  {
    role: "Software Developer",
    org: "Tree-Plenish",
    period: "2023–2024",
    description: "Full-stack software development for environmental nonprofit.",
  },
  {
    role: "Research Assistant",
    org: "Cambridge University",
    period: "Summer 2023",
    description: "Sentiment analysis research with Dr. WeiWei Sun.",
  },
];

export const interestStations: InterestStation[] = [
  {
    frequency: "98.1 FM",
    title: "COYS Radio",
    description:
      "Watches Tottenham Hotspur every weekend. Would travel to London to see them play.",
  },
  {
    frequency: "101.3 FM",
    title: "Kitchen Confidential",
    description:
      "Passionate about cooking — a skill learned from mom. Cooks at least one meal every day.",
  },
  {
    frequency: "104.7 FM",
    title: "The Journal Hour",
    description:
      "Regular journaling practice — one of the most meaningful personal habits.",
  },
  {
    frequency: "107.9 FM",
    title: "Trailblazer FM",
    description:
      "Eagle Scout who built community garden plots. Led as Senior Patrol Leader.",
  },
];

export const contactLinks: ContactLink[] = [
  {
    emoji: "✉️",
    label: "Email",
    value: "samvit@email.com",
    href: "mailto:samvit@email.com",
  },
  {
    emoji: "💻",
    label: "GitHub",
    value: "github.com/samvit",
    href: "https://github.com/samvit",
  },
  {
    emoji: "🔗",
    label: "LinkedIn",
    value: "linkedin.com/in/samvit",
    href: "https://linkedin.com/in/samvit",
  },
];

export const easterFacts: string[] = [
  "Samvit won first place at a TCNJ hackathon building an IoT weather sensor with real-time data visualization.",
  "His Eagle Scout project involved building community garden plots for the community.",
  "He led his high school tennis team to two sectional titles as captain.",
  "He spends a full month every August visiting family in India.",
  "This entire website is an interactive kitchen illustration. You found the secret timer!",
];
