// PortalShell.jsx - Universal Portal Layout matching Zyllo Tech admin theme & navbar
import { useState, useRef, useEffect } from "react";
import Image from "@/lib/nx/image";
import Link from "@/lib/nx/link";
import { useNavigate } from "react-router-dom";
import AdminLoading from "@/admin/AdminLoading";
import { useAuth } from "@/lib/auth";
import {
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  LogOut,
  Search,
  Home,
  ShieldCheck,
  Users,
  Clock,
  Briefcase,
  LayoutGrid,
  Mail,
  Globe,
  LogIn,
} from "lucide-react";

const ALL_PORTALS = [
  { id: "admin", name: "Admin Dashboard", href: "/admin", icon: ShieldCheck, badge: "Full Command" },
  { id: "hr", name: "HR Operations", href: "/hr", icon: Users, badge: "Talent & Approvals" },
  { id: "employee", name: "Employee Portal", href: "/employee", icon: Clock, badge: "Punch & Timesheets" },
  { id: "client", name: "Client Workspace", href: "/portal", icon: Briefcase, badge: "Projects & Sprints" },
];

function getAllowedPortals(currentPortalId, userRole = "") {
  const isAdmin = userRole === "admin";
  return ALL_PORTALS.map((p) => {
    if (isAdmin && p.id === "hr") {
      return { ...p, href: "/admin/hr" };
    }
    if (isAdmin && p.id === "employee") {
      return { ...p, href: "/admin/employee" };
    }
    if (isAdmin && p.id === "client") {
      return { ...p, href: "/admin/client" };
    }
    if (currentPortalId === "hr" && p.id === "employee") {
      return { ...p, href: "/hr/employee" };
    }
    if (currentPortalId === "hr" && p.id === "client") {
      return { ...p, href: "/hr/client" };
    }
    if (currentPortalId === "client" && p.id === "employee") {
      return { ...p, href: "/portal/employee" };
    }
    return p;
  }).filter((p) => {
    if (p.id === currentPortalId) return false;
    // In employee portal remove hr and admin
    if (currentPortalId === "employee" && (p.id === "hr" || p.id === "admin")) return false;
    // In client portal remove hr and admin
    if (currentPortalId === "client" && (p.id === "hr" || p.id === "admin")) return false;
    // In hr portal remove admin
    if (currentPortalId === "hr" && p.id === "admin") return false;
    // In admin should have all
    return true;
  });
}

export default function PortalShell({
  portalName = "Portal",
  portalId = "hr",
  user = { name: "Alex Morgan", email: "user@zyllotech.com", role: "employee" },
  navSections = [],
  activeTab = "overview",
  onTabChange,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder,
  onLogout,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const switchingTimeoutRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();

  function handleTabClick(item) {
    if (item.id === activeTab) {
      setSidebarOpen(false);
      return;
    }
    setIsTabSwitching(true);
    if (onTabChange) onTabChange(item.id);
    setSidebarOpen(false);
    if (switchingTimeoutRef.current) clearTimeout(switchingTimeoutRef.current);
    switchingTimeoutRef.current = setTimeout(() => {
      setIsTabSwitching(false);
    }, 280);
  }

  // Close user dropdown on outside click or ESC
  useEffect(() => {
    if (!userMenuOpen) return;
    function handlePointer(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [userMenuOpen]);

  // Ctrl/Cmd + K shortcut for search
  useEffect(() => {
    function handleShortcut(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  async function handleSignOut() {
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

  // Find active item & section for breadcrumb & header
  const allItems = navSections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.id === activeTab) || allItems[0];
  const currentSection = navSections.find((s) => s.items.some((item) => item.id === activeTab));
  const CurrentIcon = currentItem?.icon || LayoutGrid;

  const effectiveUser = {
    name: authUser?.user_metadata?.full_name || authUser?.name || user?.name || (authUser?.email ? authUser.email.split("@")[0] : "Alex Morgan"),
    email: authUser?.email || user?.email || "user@zyllotech.com",
    role: authUser?.role || user?.role || "client",
  };
  const initial = (effectiveUser.name?.[0] || effectiveUser.email?.[0] || "U").toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#f6f7fb] font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0b0e17]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ================= LEFT SIDEBAR (DARK THEME WITH BRAND LOGO) ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] shrink-0 flex-col bg-gradient-to-b from-[#101a3a] via-[#0d1631] to-[#0a1025] text-white shadow-2xl shadow-black/20 transition-transform duration-300 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Ambient Glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#f7941e]/15 blur-[70px]" />
          <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[#3089a6]/15 blur-[80px]" />
        </div>

        {/* Brand Logo Header */}
        <div className="relative flex items-center justify-between px-5 pb-5 pt-6 border-b border-white/10">
          <Link
            href="/"
            className="flex flex-1 items-center gap-2.5 group"
            aria-label="Zyllo Tech Home"
          >
            <Image
              src="/zyllo-icon.png"
              alt="Zyllo Tech"
              width={500}
              height={273}
              className="h-9 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-transform"
            />
            <span className="flex flex-col leading-none">
              <span className="text-[1.35rem] font-extrabold uppercase tracking-tight">
                <span className="bg-gradient-to-b from-[#ffd9a0] via-[#f96706] to-[#c24f05] bg-clip-text text-transparent">
                  Zyllo
                </span>{" "}
                <span className="bg-gradient-to-b from-[#bfe6f2] via-[#3089a6] to-[#2b6f8a] bg-clip-text text-transparent">
                  Tech
                </span>
              </span>
              <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-white/55">
                Software Solutions Pvt Ltd
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav Items List */}
        <nav className="relative flex-1 overflow-y-auto px-3 pb-3 pt-3" aria-label="Portal Navigation">
          <div className="flex flex-col gap-4">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  {section.label}
                </p>
                <div className="mt-1 flex flex-col gap-1">
                  {section.items.map((item) => {
                    const active = activeTab === item.id;
                    const Icon = item.icon || LayoutGrid;

                    if (item.href) {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-all duration-200 ${
                            active
                              ? "bg-gradient-to-r from-[#f7941e] to-[#f96706] text-white shadow-lg shadow-[#f96706]/25 font-bold"
                              : "text-white/80 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <Icon
                              className={`h-5 w-5 shrink-0 transition-colors ${
                                active ? "text-white" : "text-white/60 group-hover:text-[#ffb15c]"
                              }`}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.count !== undefined && (
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                active ? "bg-black/30 text-white" : "bg-white/10 text-white/70"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTabClick(item)}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[15px] font-semibold transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-[#f7941e] to-[#f96706] text-white shadow-lg shadow-[#f96706]/25 font-bold"
                            : "text-white/80 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon
                            className={`h-5 w-5 shrink-0 transition-colors ${
                              active ? "text-white" : "text-white/60 group-hover:text-[#ffb15c]"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              active ? "bg-black/30 text-white" : "bg-white/10 text-white/70"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick Switch Workspace Section */}
            <div className="pt-3 border-t border-white/10">
              <p className="px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/50 mb-1">
                Quick Switch
              </p>
              <div className="flex flex-col gap-1">
                <a
                  href="https://mail.zoho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[14px] font-semibold text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
                  title="Open Zoho Mail in new tab"
                >
                  <div className="flex items-center gap-3 truncate">
                    <Mail className="h-4.5 w-4.5 text-[#f96706]" />
                    <span className="truncate">Zoho Mail</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-white/40 group-hover:text-white" />
                </a>

                {getAllowedPortals(portalId, effectiveUser.role).map((p) => {
                  const PIcon = p.icon;
                  return (
                    <Link
                      key={p.id}
                      href={p.href}
                      className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[14px] font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <PIcon className="h-4.5 w-4.5 text-white/40 group-hover:text-[#f7941e]" />
                        <span className="truncate">{p.name}</span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70" />
                    </Link>
                  );
                })}

                {portalId === "admin" && (
                  <Link
                    href="/login"
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[14px] font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <LogIn className="h-4.5 w-4.5 text-white/40 group-hover:text-[#f7941e]" />
                      <span className="truncate">Login Portal</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70" />
                  </Link>
                )}

                <Link
                  href="/"
                  target="_blank"
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[14px] font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  <div className="flex items-center gap-3 truncate">
                    <Globe className="h-4.5 w-4.5 text-white/40 group-hover:text-[#f7941e]" />
                    <span className="truncate">Public Website</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Bottom User Profile */}
        <div className="relative border-t border-white/10 p-3.5">
          <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f7941e] to-[#3089a6] text-sm font-bold text-white shadow-sm">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold leading-tight text-white truncate">
                {effectiveUser.name}
              </span>
              <span className="block truncate text-xs leading-tight text-white/50 mt-0.5">
                {effectiveUser.email}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* ================= TOP NAVBAR (WHITE THEME MATCHING SCREENSHOT) ================= */}
        <header className="sticky top-0 z-30 bg-white/95 shadow-[0_1px_0_0_#e2e8f0,0_4px_16px_-10px_rgba(16,26,58,0.1)] backdrop-blur-xl">
          <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#173a52] shadow-2xs transition-colors hover:bg-slate-50 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Icon + Breadcrumb + Page Title */}
            <div className="flex min-w-0 items-center gap-3">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f7941e] to-[#f96706] text-white shadow-[0_8px_18px_-8px_rgba(249,103,6,0.7)] sm:flex">
                <CurrentIcon className="h-5 w-5" aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 sm:flex">
                  <span>{portalName}</span>
                  {currentSection && (
                    <>
                      <span aria-hidden="true" className="text-slate-400">/</span>
                      <span>{currentSection.label}</span>
                    </>
                  )}
                </nav>
                <h1 className="truncate text-xl font-extrabold tracking-tight text-[#101a3a] sm:text-2xl">
                  {currentItem?.label || "Overview"}
                </h1>
              </div>
            </div>

            {/* Center: Search Input Matching Screenshot */}
            <div className="relative ml-auto flex max-w-md flex-1 items-center">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder={searchPlaceholder || `Search in ${portalName.toLowerCase()}...`}
                aria-label={`Search in ${portalName}`}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-16 text-sm sm:text-base text-slate-900 outline-none transition-all placeholder:text-slate-500 hover:border-slate-300 focus:border-[#f96706] focus:bg-white focus:ring-4 focus:ring-[#f96706]/15"
              />
              {!searchQuery && (
                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-2xs lg:inline-flex">
                  Ctrl K
                </kbd>
              )}
            </div>

            {/* Right: View Site Button */}
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-2xs transition-all hover:border-[#1f4693]/40 hover:bg-slate-50 hover:text-[#1f4693] sm:flex shrink-0"
            >
              <ExternalLink className="h-4 w-4 text-slate-500" />
              <span>View site</span>
            </Link>

            {/* Right: User Profile Dropdown Pill */}
            <div ref={userMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-2xs transition-all hover:border-[#1f4693]/40 hover:shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1f4693]"
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#f7941e] to-[#1f4693] text-sm font-bold text-white shadow-2xs">
                  {initial}
                  <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#3089a6]" />
                </span>
                <span className="hidden text-left md:block">
                  <span className="block text-[13.5px] font-semibold leading-tight text-[#101a3a]">
                    {effectiveUser.name}
                  </span>
                  <span className="block max-w-[150px] truncate text-xs leading-tight text-slate-600">
                    {effectiveUser.email}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="border-b border-slate-200 px-4 py-3 bg-[#f8fafc]">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-[#101a3a] mt-0.5">{effectiveUser.name}</p>
                    <p className="truncate text-xs text-slate-600">{effectiveUser.email}</p>
                  </div>

                  <div className="p-2 border-b border-slate-200">
                    <p className="px-2 py-1 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      Switch Workspace
                    </p>
                    {getAllowedPortals(portalId, effectiveUser.role).map((p) => {
                      const PIcon = p.icon;
                      return (
                        <Link
                          key={p.id}
                          href={p.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <PIcon className="h-3.5 w-3.5 text-[#f96706]" />
                            <span>{p.name}</span>
                          </div>
                        </Link>
                      );
                    })}

                    {portalId === "admin" && (
                      <Link
                        href="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <LogIn className="h-3.5 w-3.5 text-[#f96706]" />
                          <span>Login Portal</span>
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className="p-1.5">
                    <Link
                      href="/"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#2b303b] transition-colors hover:bg-[#fafbfc]"
                    >
                      <Home className="h-4 w-4 text-[#676b7a]" aria-hidden="true" />
                      Back to Website
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 text-red-500" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT CANVA (LIGHT THEME - FULL WIDTH MATCHING PHOTO 3) ================= */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 text-[15px] sm:text-base text-slate-800">
          {isTabSwitching ? (
            <AdminLoading label={`Loading ${currentItem?.label || "Workspace"}…`} delay={0} />
          ) : (
            <div className="w-full">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
}
