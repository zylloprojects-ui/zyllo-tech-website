// PortalHeroBanner.jsx - Reusable top hero banner matching the Zyllo Tech admin screenshot
import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

function Stat({ value, label }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-inset ring-white/15 backdrop-blur-[2px]">
      <p className="text-2xl font-extrabold leading-none tabular-nums sm:text-3xl text-white">{value}</p>
      <p className="mt-1.5 truncate text-xs sm:text-sm font-semibold text-white/90">{label}</p>
    </div>
  );
}

export default function PortalHeroBanner({
  greeting,
  subtitle = "Here is your portal workspace at a glance",
  stats = [],
  onRefresh,
}) {
  const [updatedAt, setUpdatedAt] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const now = new Date();
    setUpdatedAt(
      now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  }, []);

  const now = new Date();
  const dayName = now.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase();
  const dateFormatted = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
  const todayLabel = `${dayName}, ${dateFormatted}`;

  const currentHour = now.getHours();
  const dynamicGreeting =
    greeting ||
    (currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening");

  async function handleRefreshClick() {
    setIsRefreshing(true);
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (e) {
        console.warn(e);
      }
    }
    const updated = new Date();
    setUpdatedAt(
      updated.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
    setTimeout(() => setIsRefreshing(false), 500);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101a3a] via-[#173a52] to-[#3089a6] px-5 py-5 text-white shadow-[0_12px_32px_-16px_rgba(16,26,58,0.6)] sm:px-7">
      {/* Background ambient lighting and infinity watermark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-8 -top-20 h-60 w-60 rounded-full bg-[#f7941e]/40 blur-[70px]" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#3089a6]/30 blur-[70px]" />
        <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#1f4693]/40 blur-[70px]" />
        <svg
          viewBox="0 0 200 100"
          fill="none"
          className="absolute -right-4 top-1/2 h-40 w-auto -translate-y-1/2 text-white/[0.07] sm:right-24 sm:h-44"
        >
          <path
            d="M100 50C85 22 55 14 38 28 20 43 20 57 38 72c17 14 47 6 62-22Zm0 0c15 28 45 36 62 22 18-15 18-29 0-44-17-14-47-6-62 22Z"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-white/80">
            <Sparkles className="h-4 w-4 text-[#ffb15c]" aria-hidden="true" />
            {todayLabel}
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
            {dynamicGreeting}
          </h1>
          <p className="mt-1.5 text-base sm:text-lg text-white/90 font-medium">{subtitle}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5">
              {stats.map((s, idx) => (
                <Stat key={idx} {...s} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white/95 ring-1 ring-inset ring-white/20 backdrop-blur-xs">
              {updatedAt ? `Last updated: ${now.getDate()} ${now.toLocaleDateString("en-IN", { month: "short" })}, ${updatedAt}` : "Updating..."}
            </span>
            <button
              type="button"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs backdrop-blur-xs hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
