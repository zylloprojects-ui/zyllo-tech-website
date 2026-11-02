import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Building2, ShoppingCart, Heart, GraduationCap, Truck, Factory, Gamepad2, Home, Plane, Radio, Tv, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead, { breadcrumbSchema, SITE_URL } from "@/components/SEOHead";
import PageHero from "@/components/PageHero";

const industryGuides = [
  {
    icon: Building2,
    label: "Banking & FinTech",
    slug: "digital-banking-platform-implementation-guide",
    desc: "KYC automation, payment integration, and OWASP-compliant architecture",
    color: "text-blue-700",
    bg: "bg-blue-50 border border-blue-200/80",
  },
  {
    icon: ShoppingCart,
    label: "Retail & E-Commerce",
    slug: "headless-commerce-architecture-retail",
    desc: "Headless commerce, inventory sync, and flash-sale engineering at scale",
    color: "text-[#c24f05]",
    bg: "bg-orange-50 border border-orange-200/80",
  },
  {
    icon: Heart,
    label: "Healthcare",
    slug: "fhir-patient-portal-implementation",
    desc: "FHIR-compliant patient portals, telehealth, and HIPAA security controls",
    color: "text-rose-700",
    bg: "bg-rose-50 border border-rose-200/80",
  },
  {
    icon: GraduationCap,
    label: "EdTech & LMS",
    slug: "lms-scaling-edtech-implementation",
    desc: "Video infrastructure, adaptive learning, and live virtual classrooms",
    color: "text-amber-800",
    bg: "bg-amber-50 border border-amber-200/80",
  },
  {
    icon: Truck,
    label: "Logistics & Fleet",
    slug: "fleet-tracking-iot-cloud-implementation",
    desc: "Real-time IoT fleet tracking, route optimisation, and driver apps",
    color: "text-teal-700",
    bg: "bg-teal-50 border border-teal-200/80",
  },
  {
    icon: Factory,
    label: "Manufacturing",
    slug: "predictive-maintenance-manufacturing-implementation",
    desc: "Predictive maintenance ML, MES integration, and IoT sensor pipelines",
    color: "text-slate-700",
    bg: "bg-slate-100 border border-slate-300/80",
  },
  {
    icon: Gamepad2,
    label: "Gaming & Entertainment",
    slug: "game-backend-architecture-scaling",
    desc: "Low-latency game backends, matchmaking, and in-game economy systems",
    color: "text-purple-700",
    bg: "bg-purple-50 border border-purple-200/80",
  },
  {
    icon: Home,
    label: "Real Estate",
    slug: "proptech-crm-project-management",
    desc: "PropTech CRM, construction project tracking, and buyer portals",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border border-emerald-200/80",
  },
  {
    icon: Plane,
    label: "Travel & Hospitality",
    slug: "hotel-booking-engine-travel-implementation",
    desc: "Booking engines, channel manager integration, and loyalty systems",
    color: "text-sky-700",
    bg: "bg-sky-50 border border-sky-200/80",
  },
  {
    icon: Radio,
    label: "Telecom & IT Services",
    slug: "telecom-customer-portal-billing-automation",
    desc: "Self-service portals, billing automation, and BSS/OSS integration",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border border-indigo-200/80",
  },
  {
    icon: Tv,
    label: "Media & Publishing",
    slug: "headless-cms-migration-media-publishing",
    desc: "Headless CMS migration, paywall implementation, and content delivery",
    color: "text-pink-700",
    bg: "bg-pink-50 border border-pink-200/80",
  },
  {
    icon: Leaf,
    label: "Agriculture & Environment",
    slug: "iot-farm-monitoring-agritech-implementation",
    desc: "IoT farm monitoring, supply chain traceability, and sustainability reporting",
    color: "text-green-700",
    bg: "bg-green-50 border border-green-200/80",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Technical Resources & Industry Software Implementation Guides | Zyllo Tech"
        description="Free engineering playbooks and implementation blueprints for Banking, Healthcare, E-Commerce, EdTech, Logistics, Manufacturing, Gaming, Real Estate, Travel, Telecom, Media, and AgriTech software development."
        canonical="/resources"
        keywords="software implementation guide India, banking software architecture, healthcare FHIR guide, edtech LMS development, logistics fleet tracking, manufacturing IoT, headless commerce guide, free tech resources India"
        structuredData={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Resources", url: `${SITE_URL}/resources` },
        ])}
      />
      <PageHero
        title="Resources Hub"
        description="Practical implementation guides, engineering playbooks, and industry blueprints — written by the engineers who build these systems."
        breadcrumbLabel="Resources"
        eyebrow="Resources"
      />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Industry Implementation Guides */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c24f05] mb-3">
                <BookOpen size={12} />
                Implementation Blueprints
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Industry-Specific Engineering Guides
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Deep technical guides written by our engineers who have built production systems in each of these sectors. Use them to understand the architecture, evaluate vendors, or plan your own implementation.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {industryGuides.map((guide, i) => (
                <motion.div
                  key={guide.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/blog/${guide.slug}`}
                    className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-[#f96706]/50 hover:shadow-md transition-all h-full"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${guide.bg} ${guide.color}`}>
                      <guide.icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-foreground group-hover:text-[#c24f05] transition-colors leading-snug mb-1">
                        {guide.label}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {guide.desc}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#c24f05] group-hover:text-[#f96706]">
                        Read guide <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-2xl bg-muted/60 border border-border p-10 text-center"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Don't see your industry?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              We work across more sectors than we've listed here. Reach out and we'll share relevant case studies and technical approaches for your specific domain.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get in Touch
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
