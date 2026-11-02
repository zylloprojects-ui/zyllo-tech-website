export const COMPANY_KNOWLEDGE = {
  name: "Zyllo Tech",
  fullName: "Zyllo Tech Software Solutions Private Limited",
  location: "Guntur, Andhra Pradesh, India (Delivering remotely to global clients)",
  turnaroundTime: "We respond to all consultation inquiries within 1 business day.",
  phone: "+91 70757 73680",
  whatsappUrl:
    "https://wa.me/917075773680?text=Hello%20Zyllo%20Tech%2C%20I%20would%20like%20to%20discuss%20a%20project.",
  email: "info@zyllotech.com",
};

/**
 * Deterministic verified AI response engine ported from the production backend.
 * Provides instant, zero-latency answers grounded in verified company offerings.
 */
export function getVerifiedAnswer(rawQuery) {
  const query = (rawQuery || "").trim().toLowerCase();
  if (!query) return null;

  // 1. Cost / Pricing / Rates / Budget / Estimation / Quote
  if (
    query.includes("cost") ||
    query.includes("price") ||
    query.includes("pricing") ||
    query.includes("quote") ||
    query.includes("budget") ||
    query.includes("how much") ||
    query.includes("estimate") ||
    query.includes("rate") ||
    query.includes("calculator")
  ) {
    return {
      reply:
        "We tailor pricing directly to your technical architecture rather than using rigid boilerplate packages. Indicative MVPs typically range from ₹5,00,000 to ₹15,00,000 ($10,000–$25,000), while enterprise software scales with dedicated pods or sprint milestones. You can model your exact scope using our interactive Smart Cost Estimator.",
      quickActions: [
        { label: "🧮 Open Cost Estimator", href: "/estimator" },
        { label: "💬 Chat on WhatsApp", href: COMPANY_KNOWLEDGE.whatsappUrl, external: true },
        { label: "📅 Book Discovery Call", href: "/contact" },
      ],
    };
  }

  // 2. Contact / Talk to human / WhatsApp / Call / Phone
  if (
    query.includes("contact") ||
    query.includes("talk") ||
    query.includes("human") ||
    query.includes("call") ||
    query.includes("phone") ||
    query.includes("whatsapp") ||
    query.includes("reach out") ||
    query.includes("email") ||
    query.includes("support") ||
    query.includes("touch")
  ) {
    return {
      reply:
        "You can connect directly with our engineering leadership through WhatsApp at +91 70757 73680, email us at info@zyllotech.com, or submit an inquiry through our contact page. We reply within one business day.",
      quickActions: [
        { label: "💬 WhatsApp (+91 70757 73680)", href: COMPANY_KNOWLEDGE.whatsappUrl, external: true },
        { label: "📩 Contact Page", href: "/contact" },
        { label: "🧮 Get an Estimate", href: "/estimator" },
      ],
    };
  }

  // 3. AI / Machine Learning / LLM / RAG / Automation
  if (
    query.includes("ai") ||
    query.includes("machine learning") ||
    query.includes("llm") ||
    query.includes("gpt") ||
    query.includes("rag") ||
    query.includes("copilot") ||
    query.includes("vector") ||
    query.includes("automation") ||
    query.includes("bot")
  ) {
    return {
      reply:
        "Zyllo Tech builds enterprise AI solutions including private LLM RAG pipelines, semantic vector search (Qdrant, Pinecone), in-app AI copilots, intelligent OCR, and automated document triage with zero data leakage.",
      quickActions: [
        { label: "🤖 AI Solutions", href: "/services/ai-solutions" },
        { label: "🧮 Estimate AI Project", href: "/estimator" },
        { label: "💼 View Portfolio", href: "/portfolio" },
      ],
    };
  }

  // 4. Mobile Apps / iOS / Android / Flutter / React Native
  if (
    query.includes("mobile") ||
    query.includes("app") ||
    query.includes("ios") ||
    query.includes("android") ||
    query.includes("flutter") ||
    query.includes("react native") ||
    query.includes("phone app")
  ) {
    return {
      reply:
        "Yes! We build native and cross-platform mobile applications using Flutter, React Native, Swift (iOS), and Kotlin (Android). Our apps feature 60fps performance, offline data synchronization, biometric authentication, and end-to-end App Store & Play Store publishing.",
      quickActions: [
        { label: "📱 Mobile App Development", href: "/services/mobile-app-development" },
        { label: "🧮 Calculate Mobile App Cost", href: "/estimator" },
        { label: "💬 Inquire on WhatsApp", href: COMPANY_KNOWLEDGE.whatsappUrl, external: true },
      ],
    };
  }

  // 5. Web Development / SaaS / Frontend / Backend / Full Stack
  if (
    query.includes("web") ||
    query.includes("website") ||
    query.includes("saas") ||
    query.includes("react") ||
    query.includes("next.js") ||
    query.includes("node") ||
    query.includes("frontend") ||
    query.includes("backend") ||
    query.includes("portal")
  ) {
    return {
      reply:
        "We build high-performance web applications and multi-tenant SaaS platforms using React, Next.js, Node.js, Python, PostgreSQL, and modern microservices. Architected for sub-second speeds, enterprise security, and seamless scale.",
      quickActions: [
        { label: "🌐 Web Development", href: "/services/web-development" },
        { label: "💼 Explore Case Studies", href: "/portfolio" },
        { label: "🧮 Web Project Estimator", href: "/estimator" },
      ],
    };
  }

  // 6. Cloud / DevOps / Infrastructure / AWS / GCP / Kubernetes
  if (
    query.includes("cloud") ||
    query.includes("devops") ||
    query.includes("aws") ||
    query.includes("azure") ||
    query.includes("gcp") ||
    query.includes("docker") ||
    query.includes("kubernetes") ||
    query.includes("ci/cd")
  ) {
    return {
      reply:
        "We deliver cloud infrastructure and DevOps automation across AWS, GCP, and Azure. Capabilities include Kubernetes containerization, Terraform IaC, automated zero-downtime CI/CD pipelines, and high-availability SLA monitoring.",
      quickActions: [
        { label: "☁️ Cloud Solutions", href: "/services/cloud-solutions" },
        { label: "📅 Schedule Discovery", href: "/contact" },
      ],
    };
  }

  // 7. Location / Where are you / Office / Remote / Guntur / India
  if (
    query.includes("where") ||
    query.includes("location") ||
    query.includes("office") ||
    query.includes("guntur") ||
    query.includes("india") ||
    query.includes("remote") ||
    query.includes("address") ||
    query.includes("headquarter")
  ) {
    return {
      reply:
        "Zyllo Tech is headquartered in Guntur, Andhra Pradesh, India. We deliver remotely to global clients across North America, Europe, the GCC, and India via synchronous video standups, bi-weekly staging demos, and dedicated Slack/WhatsApp channels.",
      quickActions: [
        { label: "🏢 About Zyllo Tech", href: "/about" },
        { label: "📍 View Office Details", href: "/contact" },
      ],
    };
  }

  // 8. Careers / Jobs / Hiring / Apply / Internships
  if (
    query.includes("career") ||
    query.includes("job") ||
    query.includes("hiring") ||
    query.includes("apply") ||
    query.includes("intern") ||
    query.includes("vacancy") ||
    query.includes("join")
  ) {
    return {
      reply:
        "We are actively hiring engineering, UI/UX, and QA talent! You can explore open roles including Full Stack Developers, QA Engineers, and Cloud Specialists and apply directly with your resume on our Careers page.",
      quickActions: [
        { label: "💼 View Open Roles", href: "/careers" },
        { label: "🏢 Life at Zyllo Tech", href: "/about" },
      ],
    };
  }

  // 9. Portfolio / Case Studies / Clients / Past Work
  if (
    query.includes("portfolio") ||
    query.includes("case study") ||
    query.includes("case studies") ||
    query.includes("project") ||
    query.includes("work") ||
    query.includes("client") ||
    query.includes("track record")
  ) {
    return {
      reply:
        "Our track record includes enterprise fintech systems, healthcare platforms, automated SaaS products, and predictive AI pipelines built for clients globally. Check out our detailed case studies in our Portfolio.",
      quickActions: [
        { label: "🚀 View Portfolio", href: "/portfolio" },
        { label: "🧮 Model Your Project", href: "/estimator" },
      ],
    };
  }

  // 10. General / Services overview
  if (
    query.includes("service") ||
    query.includes("offer") ||
    query.includes("what do you do") ||
    query.includes("help") ||
    query.includes("about") ||
    query.includes("zyllo")
  ) {
    return {
      reply:
        "Zyllo Tech is an enterprise software engineering company delivering Custom Software, Web Applications, Mobile Apps (iOS/Android), Practical AI/ML Solutions, Cloud Architecture, and UI/UX Design.",
      quickActions: [
        { label: "🛠️ All Services", href: "/services" },
        { label: "🧮 Cost Estimator", href: "/estimator" },
        { label: "📩 Contact Us", href: "/contact" },
      ],
    };
  }

  // Fallback for any other query
  return {
    reply: `Here are the key resources and engineering capabilities at Zyllo Tech related to "${rawQuery}". How can our team assist you?`,
    quickActions: [
      { label: "🛠️ Browse Services", href: "/services" },
      { label: "🧮 Project Cost Estimator", href: "/estimator" },
      { label: "💬 WhatsApp Engineering Lead", href: COMPANY_KNOWLEDGE.whatsappUrl, external: true },
      { label: "📩 Contact Form", href: "/contact" },
    ],
  };
}
