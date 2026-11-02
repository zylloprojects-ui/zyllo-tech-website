import {
  Globe,
  Smartphone,
  Sparkles,
  Building2,
  Cloud,
  Palette,
  ShieldCheck,
  CreditCard,
  Bot,
  Radio,
  Network,
  BarChart3,
} from "lucide-react";

export const EXCHANGE_RATE_INR = 83.5;

export const ARCHETYPES = [
  {
    id: "web-saas",
    name: "Web Application / SaaS",
    baseCost: 15000,
    icon: Globe,
    color: "from-[#f96706] to-[#f7941e]",
    description:
      "Multi-tenant cloud platforms, responsive portals, Next.js/React frontends with microservices.",
  },
  {
    id: "mobile-app",
    name: "Mobile App (iOS & Android)",
    baseCost: 16000,
    icon: Smartphone,
    color: "from-[#1f4693] to-[#3089a6]",
    description:
      "Native or Flutter cross-platform apps with offline sync and hardware sensor integration.",
  },
  {
    id: "ai-solution",
    name: "AI & Machine Learning",
    baseCost: 22000,
    icon: Sparkles,
    color: "from-[#9333ea] to-[#c026d3]",
    description:
      "Custom LLM RAG pipelines, vector search, predictive analytics, and workflow automation.",
  },
  {
    id: "enterprise-erp",
    name: "Custom Enterprise Software",
    baseCost: 28000,
    icon: Building2,
    color: "from-[#0891b2] to-[#0284c7]",
    description:
      "Bespoke internal ERPs, supply-chain automation, back-office workflows, and database migration.",
  },
  {
    id: "cloud-devops",
    name: "Cloud Infrastructure & DevOps",
    baseCost: 12000,
    icon: Cloud,
    color: "from-[#059669] to-[#10b981]",
    description:
      "AWS/GCP architecture, Kubernetes containerization, CI/CD pipelines, and high-availability SLA.",
  },
  {
    id: "uiux-prototype",
    name: "UI/UX & Interactive Prototype",
    baseCost: 8000,
    icon: Palette,
    color: "from-[#ea580c] to-[#f59e0b]",
    description:
      "Design research, full design system, interactive clickable Figma prototype, and usability tests.",
  },
];

export const SCALES = [
  {
    id: "mvp",
    name: "MVP / Initial Prototype",
    multiplier: 1.0,
    tag: "Fast Launch",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    description:
      "Focuses on core differentiator features, lean database, and validating product-market fit fast.",
  },
  {
    id: "growth",
    name: "Commercial Production Suite",
    multiplier: 1.35,
    tag: "Scale Ready",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    description:
      "Multi-role permissions, high test coverage, automated CI/CD, analytics, and CRM integrations.",
  },
  {
    id: "enterprise",
    name: "High-Throughput Enterprise",
    multiplier: 1.8,
    tag: "Enterprise SLA",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    description:
      "Zero-downtime clustering, microservices, SOC2/HIPAA compliance, and 99.99% uptime guarantees.",
  },
];

export const FEATURES = [
  {
    id: "auth-rbac",
    name: "User Authentication & RBAC",
    shortName: "Auth & RBAC",
    cost: 1200,
    icon: ShieldCheck,
    description:
      "JWT, multi-factor authentication, OAuth (Google/GitHub/SAML), and granular role permissions.",
  },
  {
    id: "payment-billing",
    name: "Payment Gateways & Subscriptions",
    shortName: "Payment & Billing",
    cost: 1800,
    icon: CreditCard,
    description:
      "Stripe, Razorpay, recurring subscription tiers, invoicing, webhooks, and automatic receipt emails.",
  },
  {
    id: "ai-copilot",
    name: "AI Copilot & Vector Search",
    shortName: "AI Copilot / RAG",
    cost: 3500,
    icon: Bot,
    description:
      "In-app LLM assistant, Qdrant/Pinecone embeddings, semantic document search, and summaries.",
  },
  {
    id: "realtime-sync",
    name: "Real-time WebSockets & Notifications",
    shortName: "Real-time WebSockets",
    cost: 1500,
    icon: Radio,
    description:
      "Live dashboards, instant messaging, notification badges, and real-time state synchronization.",
  },
  {
    id: "integrations",
    name: "Third-Party API & ERP Connectors",
    shortName: "API & ERP Connectors",
    cost: 2200,
    icon: Network,
    description:
      "HubSpot, Salesforce, SAP, QuickBooks, or custom external enterprise REST/SOAP endpoints.",
  },
  {
    id: "admin-analytics",
    name: "Administrative CMS & Analytics",
    shortName: "Admin CMS & Reports",
    cost: 2000,
    icon: BarChart3,
    description:
      "Full back-office dashboard, user audits, exportable CSV/PDF metrics, and system telemetry.",
  },
];

export const TIMELINES = [
  {
    id: "expedited",
    name: "Expedited Sprint (4-6 Weeks)",
    displayName: "Expedited (4–6 Weeks)",
    multiplier: 1.2,
    roadmapText: "4–6 Weeks (High Velocity)",
    tag: "High Velocity",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    description:
      "Dedicated high-capacity engineering pod delivering rapid weekly iterations for tight deadlines.",
  },
  {
    id: "standard",
    name: "Standard Sprints (2-3 Months)",
    displayName: "Standard (2–3 Months)",
    multiplier: 1.0,
    roadmapText: "2–3 Months (4-6 Sprints)",
    tag: "Recommended",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description:
      "Optimal balance of iterative architecture design, bi-weekly reviews, and thorough QA testing.",
  },
  {
    id: "phased",
    name: "Phased Strategic Rollout (4-6 Months)",
    displayName: "Phased (4–6 Months)",
    multiplier: 0.95,
    roadmapText: "4–6 Months (Phased Strategic)",
    tag: "Enterprise Phasing",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    description:
      "Staged enterprise rollout with pilot user testing, regulatory reviews, and phased migrations.",
  },
];

export function calculateEstimate({
  archetypeBase = 15000,
  featureAddons = 1200,
  scaleMultiplier = 1.0,
  timelineMultiplier = 1.0,
  currency = "INR",
}) {
  const baseSubtotal = (archetypeBase + featureAddons) * scaleMultiplier;
  const minUsd = Math.round((baseSubtotal * timelineMultiplier * 0.9) / 500) * 500;
  const maxUsd = Math.round((baseSubtotal * timelineMultiplier * 1.3) / 500) * 500;

  if (currency === "USD") {
    return {
      minUsd,
      maxUsd,
      minFormatted: `$${minUsd.toLocaleString("en-US")}`,
      maxFormatted: `$${maxUsd.toLocaleString("en-US")}`,
      displayStr: `$${minUsd.toLocaleString("en-US")} – $${maxUsd.toLocaleString("en-US")}`,
      currencySymbol: "$",
    };
  }

  const minInr = Math.round((minUsd * EXCHANGE_RATE_INR) / 10000) * 10000;
  const maxInr = Math.round((maxUsd * EXCHANGE_RATE_INR) / 10000) * 10000;

  return {
    minUsd,
    maxUsd,
    minInr,
    maxInr,
    minFormatted: `₹${minInr.toLocaleString("en-IN")}`,
    maxFormatted: `₹${maxInr.toLocaleString("en-IN")}`,
    displayStr: `₹${minInr.toLocaleString("en-IN")} – ₹${maxInr.toLocaleString("en-IN")}`,
    currencySymbol: "₹",
  };
}
