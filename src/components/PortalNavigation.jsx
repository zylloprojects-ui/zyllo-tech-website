"use client";

import { useState } from "react";
import Link from "@/lib/nx/link";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserCheck,
  Users,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Image from "@/lib/nx/image";
import { useAuth } from "@/lib/auth";

export default function PortalNavigation({
  currentPortal = "client", // "client" | "employee" | "hr" | "admin"
  user = { name: "Alex Morgan", email: "user@zyllotech.com", role: "client" },
  onLogout,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const portals = [
    {
      id: "client",
      name: "Client Portal",
      href: "/portal",
      icon: Briefcase,
      badge: "Projects & Sprints",
      activeColor: "from-[#f96706] to-[#f7941e]",
    },
    {
      id: "employee",
      name: "Employee Portal",
      href: "/employee",
      icon: Clock,
      badge: "Punch & Timesheets",
      activeColor: "from-[#10b981] to-[#059669]",
    },
    {
      id: "hr",
      name: "HR Operations",
      href: "/hr",
      icon: Users,
      badge: "Talent & Approvals",
      activeColor: "from-[#6366f1] to-[#4f46e5]",
    },
    {
      id: "admin",
      name: "Admin Control",
      href: "/admin",
      icon: ShieldCheck,
      badge: "Full Command",
      activeColor: "from-[#1f4693] to-[#3089a6]",
    },
  ];

  const current = portals.find((p) => p.id === currentPortal) || portals[0];

  async function handleLogoutClick() {
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (e) {}
    try {
      await signOut();
    } catch (e) {}
    try {
      localStorage.removeItem("zyllotech_token");
      localStorage.removeItem("zyllotech_user");
    } catch (e) {}
    try {
      window.dispatchEvent(new Event("zyllotech_auth_change"));
    } catch (e) {}
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Portal Switcher */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block rounded-md bg-white p-1.5 shadow-sm">
              <Image
                src="/zyllo-logo.png"
                alt="Zyllo Tech"
                width={120}
                height={28}
                className="h-6 w-auto"
              />
            </span>
          </Link>

          {/* Quick Portal Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:border-[#f96706]/60 hover:bg-white/10 focus:outline-none"
              aria-expanded={dropdownOpen}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{current.name}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-64 rounded-2xl border border-white/15 bg-[#1e293b] p-2 text-white shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/50 border-b border-white/10">
                  Switch Workspace
                </div>
                <div className="mt-1 space-y-1">
                  {portals.map((p) => {
                    const Icon = p.icon;
                    const isActive = p.id === currentPortal;
                    return (
                      <Link
                        key={p.id}
                        href={p.href}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? "bg-white/15 text-white font-semibold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-[#f96706]" />
                          <span>{p.name}</span>
                        </div>
                        <span className="text-[10px] text-white/50">{p.badge}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-2 border-t border-white/10 pt-1">
                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Public Website</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Quick Portal Pills */}
        <div className="hidden lg:flex items-center gap-2">
          {portals.map((p) => {
            const Icon = p.icon;
            const isActive = p.id === currentPortal;
            return (
              <Link
                key={p.id}
                href={p.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#f96706] to-[#f7941e] text-white shadow-sm font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{p.name.replace(" Portal", "").replace(" Control", "")}</span>
              </Link>
            );
          })}
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{user.name || "Alex Morgan"}</span>
            <span className="text-[11px] text-white/50">{user.email || "user@zyllotech.com"}</span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f96706] to-[#1f4693] text-xs font-bold text-white shadow-sm">
            {(user.name || "AM").slice(0, 2).toUpperCase()}
          </span>

          <button
            type="button"
            onClick={handleLogoutClick}
            title="Sign out"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
