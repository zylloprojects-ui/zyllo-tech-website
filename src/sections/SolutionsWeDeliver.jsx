import {
  BarChart3,
  Boxes,
  Lock,
  Repeat,
  Smartphone,
  Workflow,
} from "lucide-react";

const SOLUTIONS = [
  {
    icon: Workflow,
    title: "Custom Platforms",
    description:
      "Purpose-built web and mobile platforms designed around how your industry actually operates.",
  },
  {
    icon: Repeat,
    title: "System Integration",
    description:
      "Connecting the tools you already use so data moves automatically instead of manually.",
  },
  {
    icon: BarChart3,
    title: "Reporting & Dashboards",
    description:
      "Real-time visibility into the metrics that matter most to your operations and leadership.",
  },
  {
    icon: Lock,
    title: "Compliance & Security",
    description:
      "Architecture built to meet the regulatory and data-protection standards of your sector.",
  },
  {
    icon: Boxes,
    title: "Legacy Modernization",
    description:
      "Rebuilding aging systems into maintainable, scalable software without disrupting operations.",
  },
  {
    icon: Smartphone,
    title: "Field & Mobile Tools",
    description:
      "Apps built for teams working outside the office — on-site, on the road, or on the floor.",
  },
];

export default function SolutionsWeDeliver() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-[#f8fafc] py-5 lg:py-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#1f4693]/[0.08] blur-[110px]" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[#f7941e]/[0.08] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold tracking-[0.2em] text-[#c24f05] uppercase">
            Solutions We Deliver
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
            The building blocks behind every industry engagement
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#475569]">
            Whatever sector you&apos;re in, most projects draw on the same core
            set of capabilities.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-lg"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-50 bg-gradient-to-r from-[#f96706] to-[#1f4693] opacity-40 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-200/60 bg-gradient-to-br from-[#f96706]/15 to-[#1f4693]/15 shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon className="h-5 w-5 text-[#f96706]" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
