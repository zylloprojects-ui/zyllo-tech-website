// PortalKpiCard.jsx - Bold gradient KPI stat card matching the Zyllo Tech admin theme
import { ArrowUpRight } from "lucide-react";
import Link from "@/lib/nx/link";

export default function PortalKpiCard({
  icon: Icon,
  label,
  value,
  hint,
  from = "#f7941e",
  to = "#f96706",
  chip,
  href,
  onClick,
}) {
  const CardContent = (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 right-6 h-28 w-28 rounded-full bg-white/[0.07]" />
      {Icon && (
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 text-white/15"
          strokeWidth={1.5}
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 ring-1 ring-inset ring-white/30 backdrop-blur-[2px]">
          {Icon && <Icon className="h-5 w-5 text-white" aria-hidden="true" />}
        </span>

        {chip ? (
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-bold text-white ring-1 ring-inset ring-white/25">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
            {chip}
          </span>
        ) : (href || onClick) ? (
          <ArrowUpRight className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" aria-hidden="true" />
        ) : null}
      </div>

      <p className="relative mt-5 text-[36px] sm:text-[42px] font-extrabold leading-none tabular-nums tracking-tight text-white">
        {value}
      </p>
      <p className="relative mt-2.5 text-base sm:text-lg font-bold text-white">{label}</p>
      {hint && <p className="relative mt-1 text-sm sm:text-[15px] text-white/90">{hint}</p>}
    </>
  );

  const containerClasses =
    "group relative block overflow-hidden rounded-2xl p-5 text-white shadow-[0_14px_30px_-16px_rgba(16,26,58,0.55)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_36px_-14px_rgba(16,26,58,0.6)] text-left w-full";

  const style = { backgroundImage: `linear-gradient(135deg, ${from}, ${to})` };

  if (href) {
    return (
      <Link href={href} className={containerClasses} style={style}>
        {CardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={containerClasses} style={style}>
        {CardContent}
      </button>
    );
  }

  return (
    <div className={containerClasses} style={style}>
      {CardContent}
    </div>
  );
}
