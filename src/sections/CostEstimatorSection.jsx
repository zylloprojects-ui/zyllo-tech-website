"use client";

import { useState, useMemo } from "react";
import Link from "@/lib/nx/link";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";
import { EXCHANGE_RATE_INR } from "@/data/estimator";

const PLATFORMS = [
  { id: "web", name: "Web Application / SaaS Portal", base: 15000 },
  { id: "mobile", name: "Mobile Application (iOS / Android)", base: 16000 },
  { id: "both", name: "Web & Mobile Ecosystem", base: 26000 },
  { id: "ai", name: "AI / Machine Learning Integration", base: 22000 },
];

const SCOPES = [
  { id: "mvp", name: "MVP (Core Features)", mult: 1.0 },
  { id: "growth", name: "Growth (Scale & Integrations)", mult: 1.35 },
  { id: "enterprise", name: "Full Enterprise Suite", mult: 1.8 },
];

const TIMELINES = [
  { id: "standard", name: "Standard Sprint (8–12 weeks)", mult: 1.0 },
  { id: "expedited", name: "Fast-Track Sprint (4–6 weeks)", mult: 1.2 },
];

export default function CostEstimatorSection() {
  const [platform, setPlatform] = useState(PLATFORMS[0].id);
  const [scope, setScope] = useState(SCOPES[0].id);
  const [timeline, setTimeline] = useState(TIMELINES[0].id);
  const [currency, setCurrency] = useState("INR");

  const calculated = useMemo(() => {
    const selectedPlat = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];
    const selectedScope = SCOPES.find((s) => s.id === scope) || SCOPES[0];
    const selectedTl = TIMELINES.find((t) => t.id === timeline) || TIMELINES[0];

    const base = selectedPlat.base * selectedScope.mult * selectedTl.mult;
    const minUsd = Math.round((base * 0.9) / 500) * 500;
    const maxUsd = Math.round((base * 1.3) / 500) * 500;

    if (currency === "USD") {
      return `$${minUsd.toLocaleString("en-US")} – $${maxUsd.toLocaleString("en-US")}`;
    }

    const minInr = Math.round((minUsd * EXCHANGE_RATE_INR) / 10000) * 10000;
    const maxInr = Math.round((maxUsd * EXCHANGE_RATE_INR) / 10000) * 10000;
    return `₹${minInr.toLocaleString("en-IN")} – ₹${maxInr.toLocaleString("en-IN")}`;
  }, [platform, scope, timeline, currency]);

  return (
    <section className="relative overflow-hidden bg-[#131c2a] py-16 sm:py-20 text-white">
      {/* Background glow effects */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-[#f96706]/15 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-[#3089a6]/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            
            {/* Left info box */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1 text-xs font-semibold text-[#ffb15c]">
                <Calculator className="h-3.5 w-3.5" />
                <span>Interactive Cost Estimator</span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl text-white">
                Estimate Your Project Cost &amp; Timeline
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#c9cfdb]">
                Get an instant baseline investment estimate for your web, mobile, or AI application based on platform scope and launch velocity.
              </p>

              {/* Currency Toggle */}
              <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    currency === "INR"
                      ? "bg-[#f96706] text-white shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    currency === "USD"
                      ? "bg-[#f96706] text-white shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  $ USD
                </button>
              </div>

              {/* Highlighted Result */}
              <div className="mt-6 rounded-2xl border border-[#f96706]/30 bg-gradient-to-br from-[#f96706]/15 to-[#1f4693]/15 p-5 backdrop-blur-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ffb15c] block">
                  Estimated Budget Range:
                </span>
                <div className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {calculated}
                </div>
                <span className="mt-1 text-[11px] text-white/60 block">
                  Indicative estimate. Transparent discovery proposal provided before contract.
                </span>
              </div>
            </div>

            {/* Right configuration fields */}
            <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-[#131c2a] px-3.5 py-2.5 text-sm text-white outline-none transition-all focus:border-[#f96706] focus:ring-2 focus:ring-[#f96706]/30"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#131c2a] text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Scope Level
                    </label>
                    <select
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-[#131c2a] px-3.5 py-2.5 text-sm text-white outline-none transition-all focus:border-[#f96706] focus:ring-2 focus:ring-[#f96706]/30"
                    >
                      {SCOPES.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#131c2a] text-white">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Delivery Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-[#131c2a] px-3.5 py-2.5 text-sm text-white outline-none transition-all focus:border-[#f96706] focus:ring-2 focus:ring-[#f96706]/30"
                    >
                      {TIMELINES.map((t) => (
                        <option key={t.id} value={t.id} className="bg-[#131c2a] text-white">
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/estimator"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f96706] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#f96706]/30 transition-all hover:bg-[#e45a00]"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Open Detailed 5-Step Estimator</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <span>Talk to Engineers</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
