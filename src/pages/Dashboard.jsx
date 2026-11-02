"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  FileText,
  FolderGit2,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Eye,
  RefreshCw,
  Send,
  Activity,
  Copy,
} from "lucide-react";
import Seo from "@/components/Seo";
import PortalShell from "@/components/PortalShell";
import PortalHeroBanner from "@/components/PortalHeroBanner";
import PortalKpiCard from "@/components/PortalKpiCard";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { getPortalData } from "@/data/portalData";
import {
  fetchEmailTrackerLogs,
  testSmtpConnection,
  simulateCandidateEmailOpen,
} from "@/lib/api/portals";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

  // Email Tracking Audit State
  const [emailLogs, setEmailLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [smtpRecipient, setSmtpRecipient] = useState("haasethabhiram@gmail.com");
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [dashToast, setDashToast] = useState(null);

  async function loadLogs() {
    setIsLoadingLogs(true);
    try {
      const res = await fetchEmailTrackerLogs();
      if (res && res.logs) {
        setEmailLogs(res.logs);
      }
    } catch (e) {}
    setIsLoadingLogs(false);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  async function handleTestSmtp(e) {
    e.preventDefault();
    if (!smtpRecipient.trim()) return;
    setIsSendingTest(true);
    setSmtpStatus(null);
    try {
      const res = await testSmtpConnection(smtpRecipient.trim());
      if (res.success) {
        setSmtpStatus({ success: true, message: res.message || "Test email sent successfully via SMTP!" });
      } else {
        setSmtpStatus({ success: false, message: res.message || "SMTP test failed. Check server configuration." });
      }
    } catch (err) {
      setSmtpStatus({ success: false, message: "Could not send test email: " + err.message });
    }
    setIsSendingTest(false);
  }

  async function handleSimulateOpen(log) {
    await simulateCandidateEmailOpen(log.tracking_id);
    const updated = emailLogs.map((l) =>
      l.tracking_id === log.tracking_id
        ? {
            ...l,
            status: "Opened",
            open_count: (l.open_count || 0) + 1,
            last_opened_at: new Date().toISOString().replace("T", " ").slice(0, 19),
          }
        : l
    );
    setEmailLogs(updated);
    setDashToast(`Candidate open event simulated for ${log.recipient_email}!`);
    setTimeout(() => setDashToast(null), 3500);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    const role = (user.role || user.user_metadata?.role || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const isUserAdmin = role === "admin" || email.includes("admin");
    if (!isUserAdmin) {
      if (role === "hr" || email.includes("hr")) {
        navigate("/hr", { replace: true });
      } else if (role === "employee" || email.includes("employee")) {
        navigate("/employee", { replace: true });
      } else {
        navigate("/portal", { replace: true });
      }
      return;
    }
    supabase.rpc("is_admin").then(({ data }) => {
      if (data === true) setIsAdmin(true);
    }).catch(() => {});
  }, [user, loading, navigate]);

  const portalData = getPortalData();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Administrator";
  const userEmail = user?.email || "admin@zyllotech.com";

  const portals = [
    {
      title: "Admin Control Center",
      href: "/dashboard",
      badge: "Master Command",
      accent: "from-[#1f4693] to-[#3089a6]",
      icon: ShieldCheck,
      description: "Full CMS management, candidate resumes, contact leads, blog posts, and site audit telemetry.",
      metric: "System Normal",
    },
    {
      title: "Client Project Portal",
      href: "/dashboard/client",
      badge: "Sprints & Milestones",
      accent: "from-[#f96706] to-[#f7941e]",
      icon: Briefcase,
      description: "Client sprint telemetry, Figma prototypes, deliverable specs, and live technical support tickets.",
      metric: `${portalData.projects.length} Active Projects`,
    },
    {
      title: "Employee Workspace",
      href: "/dashboard/employee",
      badge: "Clock & Timesheets",
      accent: "from-[#10b981] to-[#059669]",
      icon: Clock,
      description: "Workstation punch clock in/out, monthly attendance logs, digital payslips, and leave requests.",
      metric: "Checked In · Active",
    },
    {
      title: "HR Operations Portal",
      href: "/dashboard/hr",
      badge: "Talent & Approvals",
      accent: "from-[#6366f1] to-[#4f46e5]",
      icon: Users,
      description: "Staff headcount management, one-click leave approvals, daily punch regularization, and HR helpdesk.",
      metric: `${portalData.employees.length} Staff Members`,
    },
  ];

  const dashNavSections = [
    {
      label: "Overview",
      items: [
        { id: "overview", label: "Master Command Hub", icon: LayoutDashboard },
      ],
    },
    {
      label: "Active Portals",
      items: [
        { id: "admin", label: "Admin CMS Control", icon: ShieldCheck, href: "/dashboard" },
        { id: "hr", label: "HR Operations", icon: Users, href: "/dashboard/hr" },
        { id: "employee", label: "Employee Portal", icon: Clock, href: "/dashboard/employee" },
        { id: "client", label: "Client Workspace", icon: Briefcase, href: "/dashboard/client" },
      ],
    },
    {
      label: "Telemetry & Logs",
      items: [
        { id: "smtp", label: "SMTP & Email Tracking", icon: Send },
      ],
    },
  ];

  return (
    <>
      <Seo title="Admin & Unified Control Portal — Zyllo Tech" description="Unified management workspace for Admin, Client, Employee, and HR operations." />

      <PortalShell
        portalName="Command Hub"
        portalId="admin"
        user={{ name: userName, email: userEmail, role: "admin" }}
        navSections={dashNavSections}
        activeTab="overview"
        searchPlaceholder="Search portals, candidate emails, server logs..."
      >
        <div className="space-y-6">
          {/* Hero Banner matching screenshot */}
          <PortalHeroBanner
            greeting={`Good afternoon, ${userName}`}
            subtitle="Unified management workspace for Admin, Client, Employee, and HR operations."
            stats={[
              { value: portalData.projects.length, label: "Active Projects" },
              { value: portalData.employees.length, label: "Staff Members" },
              { value: emailLogs.length, label: "Tracked Emails" },
            ]}
            onRefresh={loadLogs}
          />

          {/* 4 Solid KPI Cards matching photo */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PortalKpiCard
              icon={Briefcase}
              label="Client Projects"
              value={portalData.projects.length}
              hint="100% on schedule"
              chip="2 in sprint"
              href="/dashboard/client"
              from="#f7941e"
              to="#f96706"
            />
            <PortalKpiCard
              icon={Users}
              label="Corporate Staff"
              value={portalData.employees.length}
              hint="Active engineering pods"
              chip="7 staff"
              href="/dashboard/hr"
              from="#1f4693"
              to="#173a52"
            />
            <PortalKpiCard
              icon={Clock}
              label="Attendance Rate"
              value="96.8%"
              hint="Daily check-in logs"
              chip="Verified"
              href="/dashboard/employee"
              from="#3089a6"
              to="#1f6f8b"
            />
            <PortalKpiCard
              icon={Send}
              label="Tracked Emails"
              value={emailLogs.length}
              hint="SMTP pixel telemetry"
              chip="Online"
              from="#173a52"
              to="#3089a6"
            />
          </div>

          {/* Four Core Corporate Portals Grid */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-5 flex items-center gap-2">
              <Compass className="h-6 w-6 text-[#f96706]" />
              Select a Portal to Manage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <Link
                    key={portal.title}
                    to={portal.href}
                    className="group rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#f96706]/40 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${portal.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 text-xs sm:text-sm font-bold text-slate-700">
                          {portal.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#f96706] transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs sm:text-sm">{portal.metric}</span>
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#f96706] group-hover:translate-x-1 transition-transform">
                        Enter Workspace &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Email & Pixel Tracking Telemetry Audit */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-indigo-600" />
                  Email Tracker & Candidate Telemetry Audit
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Live pixel inspection, open events, and SMTP transaction delivery telemetry.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={loadLogs}
                  disabled={isLoadingLogs}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`h-4 w-4 text-indigo-600 ${isLoadingLogs ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <Link
                  to="/dashboard/hr"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700 transition-colors shadow-2xs"
                >
                  <Users className="h-4 w-4" />
                  Open Full HR Mail Desk &rarr;
                </Link>
              </div>
            </div>

            {/* SMTP Test Console */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    SMTP Live Transaction Tester
                  </span>
                  <span className="text-slate-600 text-sm block mt-1">
                    Send an authenticated test dispatch via Nodemailer to verify outgoing mail server connectivity.
                  </span>
                </div>

                <form onSubmit={handleTestSmtp} className="flex flex-wrap items-center gap-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter recipient email..."
                    value={smtpRecipient}
                    onChange={(e) => setSmtpRecipient(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none w-64"
                  />
                  <button
                    type="submit"
                    disabled={isSendingTest}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:opacity-95 px-4 py-2 text-sm sm:text-base font-bold text-white shadow-md disabled:opacity-50 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                    {isSendingTest ? "Sending..." : "Test SMTP Delivery"}
                  </button>
                </form>
              </div>

              {smtpStatus && (
                <div
                  className={`mt-4 p-3 rounded-xl border text-sm font-semibold flex items-center gap-2.5 ${
                    smtpStatus.success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{smtpStatus.message}</span>
                </div>
              )}
            </div>

            {/* Email Logs Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm sm:text-base text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm">
                  <tr>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Subject / Purpose</th>
                    <th className="py-3.5 px-4">Tracking ID</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Views</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {emailLogs.slice(0, 8).map((log) => {
                    const isOpened = log.status === "Opened" || log.open_count > 0;
                    return (
                      <tr key={log.tracking_id || log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-slate-900 block text-base">{log.recipient_name || log.candidate_name || "Recipient"}</span>
                          <span className="text-xs sm:text-sm text-slate-500">{log.recipient_email || log.candidate_email}</span>
                        </td>
                        <td className="py-4 px-4 max-w-xs text-slate-800 truncate font-semibold">
                          {log.subject || "Candidate Notification"}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs sm:text-sm text-indigo-600">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[110px]">{log.tracking_id}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(log.tracking_id);
                                setDashToast(`Copied tracking ID: ${log.tracking_id}`);
                                setTimeout(() => setDashToast(null), 3000);
                              }}
                              className="text-slate-400 hover:text-slate-700 p-1"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isOpened ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              Opened
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-xs sm:text-sm font-bold">
                              <Clock className="h-4 w-4 text-amber-600" />
                              Sent
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center font-extrabold text-slate-900 text-base">
                          {log.open_count || 0}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSimulateOpen(log)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-800 transition-colors shadow-2xs"
                            title="Simulate open pixel request"
                          >
                            <Eye className="h-4 w-4 text-amber-600" />
                            Simulate Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Floating Toast */}
          {dashToast && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-900 shadow-2xl animate-in slide-in-from-bottom-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{dashToast}</span>
            </div>
          )}
        </div>
      </PortalShell>
    </>
  );
}
