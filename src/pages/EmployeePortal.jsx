"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Link from "@/lib/nx/link";
import Seo from "@/components/Seo";
import PortalShell from "@/components/PortalShell";
import PortalHeroBanner from "@/components/PortalHeroBanner";
import PortalKpiCard from "@/components/PortalKpiCard";
import HolidaysCalendar from "@/components/HolidaysCalendar";
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYSLIPS,
  INITIAL_DOCUMENTS,
  INITIAL_HOLIDAYS,
  INITIAL_HR_TICKETS,
  getStoredData,
  setStoredData,
} from "@/data/portalData";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  HeartHandshake,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPin,
  Paperclip,
  Phone,
  Plus,
  Printer,
  ShieldCheck,
  Smile,
  Timer,
  User,
  Users,
  X,
  CreditCard,
  Building,
  Check,
  Briefcase,
  Lock,
} from "lucide-react";

export default function EmployeePortal({ insideAdmin = false }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // overview | profile | attendance | holidays | leaves | payslips | documents | hr
  const [profile, setProfile] = useState(INITIAL_EMPLOYEES[0]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [hrTickets, setHrTickets] = useState([]);

  // Live Clock & Punch Status
  const [currentTime, setCurrentTime] = useState("");
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchInTime, setPunchInTime] = useState("09:05 AM");

  // Modal States
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leave_type: "Casual Leave",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [isHrTicketModalOpen, setIsHrTicketModalOpen] = useState(false);
  const [hrTicketForm, setHrTicketForm] = useState({
    category: "Payroll & Compensation",
    priority: "Normal",
    subject: "",
    description: "",
  });

  const [activePayslipModal, setActivePayslipModal] = useState(null);

  // Initialize live time
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load persistent state
  useEffect(() => {
    setAttendance(getStoredData("zyllotech_portal_attendance", INITIAL_ATTENDANCE));
    setLeaves(getStoredData("zyllotech_portal_leaves", INITIAL_LEAVES));
    setPayslips(getStoredData("zyllotech_portal_payslips", INITIAL_PAYSLIPS));
    setDocuments(getStoredData("zyllotech_portal_documents", INITIAL_DOCUMENTS));
    setHolidays(getStoredData("zyllotech_portal_holidays", INITIAL_HOLIDAYS));
    setHrTickets(getStoredData("zyllotech_portal_hr_tickets", INITIAL_HR_TICKETS));
  }, []);

  // Authenticated Profile Synchronization
  useEffect(() => {
    async function syncEmployeeProfile() {
      if (insideAdmin) return;
      if (authLoading) return;
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.status === "PENDING") {
        navigate("/login?pending=1");
        return;
      }
      if (user.status === "REJECTED") {
        navigate("/login?rejected=1");
        return;
      }

      try {
        const token = localStorage.getItem("zyllotech_token");
        if (token) {
          const res = await fetch("/api/employee/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.profile) {
              const p = data.profile;
              const formattedDate = p.approved_at
                ? new Date(p.approved_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : p.created_at
                ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "15 Jan 2024";

              setProfile((prev) => ({
                ...prev,
                emp_id: p.employee_id || user.employee_id || prev.emp_id || "ZYL-EMP-0001",
                full_name: p.name || user.name || prev.full_name,
                email: p.email || user.email || prev.email,
                role: p.role || user.role || "Employee",
                status: p.status || user.status || "Approved",
                joining_date: formattedDate,
                avatar: (p.name || user.name || prev.full_name || "EM")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
              }));
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote profile:", err);
      }

      if (user) {
        setProfile((prev) => ({
          ...prev,
          emp_id: user.employee_id || prev.emp_id || "ZYL-EMP-0001",
          full_name: user.name || prev.full_name,
          email: user.email || prev.email,
          role: user.role || "Employee",
          status: user.status || "Approved",
          joining_date: user.approved_at
            ? new Date(user.approved_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : prev.joining_date,
          avatar: (user.name || prev.full_name || "EM")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        }));
      }
    }

    syncEmployeeProfile();
  }, [user, authLoading, insideAdmin, navigate]);

  function handleTogglePunch() {
    if (isPunchedIn) {
      // Punch Out
      setIsPunchedIn(false);
      const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      const updated = attendance.map((a, i) => (i === 0 ? { ...a, punch_out: nowStr, work_hours: "8h 15m" } : a));
      setAttendance(updated);
      setStoredData("zyllotech_portal_attendance", updated);
    } else {
      // Punch In
      setIsPunchedIn(true);
      const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      setPunchInTime(nowStr);
      const todayEntry = {
        id: Date.now(),
        emp_id: profile.emp_id,
        email: profile.email,
        date: new Date().toISOString().substring(0, 10),
        punch_in: nowStr,
        punch_out: null,
        work_hours: "In Progress",
        status: "Present",
      };
      const updated = [todayEntry, ...attendance];
      setAttendance(updated);
      setStoredData("zyllotech_portal_attendance", updated);
    }
  }

  function handleApplyLeave(e) {
    e.preventDefault();
    if (!leaveForm.start_date || !leaveForm.end_date || !leaveForm.reason.trim()) return;

    const start = new Date(leaveForm.start_date);
    const end = new Date(leaveForm.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: Date.now(),
      emp_id: profile.emp_id,
      employee_name: profile.full_name,
      email: profile.email,
      leave_type: leaveForm.leave_type,
      start_date: leaveForm.start_date,
      end_date: leaveForm.end_date,
      days: diffDays > 0 ? diffDays : 1,
      reason: leaveForm.reason.trim(),
      status: "Pending",
      applied_on: new Date().toISOString().substring(0, 10),
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    setStoredData("zyllotech_portal_leaves", updated);
    setIsLeaveModalOpen(false);
    setLeaveForm({ leave_type: "Casual Leave", start_date: "", end_date: "", reason: "" });
  }

  function handleCreateHrTicket(e) {
    e.preventDefault();
    if (!hrTicketForm.subject.trim() || !hrTicketForm.description.trim()) return;

    const newTicket = {
      id: Date.now(),
      emp_id: profile.emp_id,
      employee_name: profile.full_name,
      email: profile.email,
      category: hrTicketForm.category,
      priority: hrTicketForm.priority,
      subject: hrTicketForm.subject.trim(),
      description: hrTicketForm.description.trim(),
      status: "Pending",
      hr_response: null,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updated = [newTicket, ...hrTickets];
    setHrTickets(updated);
    setStoredData("zyllotech_portal_hr_tickets", updated);
    setIsHrTicketModalOpen(false);
    setHrTicketForm({ category: "Payroll & Compensation", priority: "Normal", subject: "", description: "" });
  }

  const empNavSections = [
    {
      label: "Workspace",
      items: [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "profile", label: "My Profile", icon: User },
      ],
    },
    {
      label: "Daily Operations",
      items: [
        { id: "attendance", label: "Attendance & Logs", icon: Clock, count: attendance.length },
        { id: "leaves", label: "Leave Requests", icon: Layers, count: leaves.length },
        { id: "holidays", label: "Holidays Calendar", icon: Calendar, count: holidays.length },
      ],
    },
    {
      label: "Payroll & Support",
      items: [
        { id: "payslips", label: "Salary & Payslips", icon: FileText, count: payslips.length },
        { id: "documents", label: "Documents & Policy", icon: Paperclip, count: documents.length },
        { id: "hr", label: "HR Helpdesk", icon: HelpCircle, count: hrTickets.length },
      ],
    },
  ];

  const allEmpTabs = empNavSections.flatMap((s) => s.items);

  const empHorizontalTabBar = (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f7fb]/95 backdrop-blur-md border-y border-slate-200/80 shadow-2xs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allEmpTabs.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`group inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2 text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#f96706] to-[#f7941e] text-white shadow-md shadow-[#f96706]/25 ring-2 ring-[#f96706]/20"
                  : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#f96706]"}`} />
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  {String(item.count).padStart(2, "0")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderEmpTabContent = (
    <div className="space-y-6">
      {/* ================= TAB: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {!insideAdmin && (
            <PortalHeroBanner
              greeting={`Good afternoon, ${profile.full_name?.split(" ")[0] || "Team Member"}`}
              subtitle={`${profile.designation} · ID: ${profile.emp_id}`}
              stats={[
                { value: profile.emp_id, label: "Employee ID" },
                { value: punchInTime || "09:05 AM", label: "Today Punch" },
                { value: "14 Days", label: "Leaves Left" },
              ]}
              onRefresh={() => {}}
            />
          )}

              {/* 4 Solid KPI Cards matching photo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <PortalKpiCard
                  icon={Clock}
                  label="Today's Punch Status"
                  value={punchInTime || "09:05 AM"}
                  hint={isPunchedIn ? "Punch status: In Progress" : "Shift clocked out"}
                  chip={isPunchedIn ? "Active Shift" : "Shift Ended"}
                  from="#f7941e"
                  to="#f96706"
                  onClick={handleTogglePunch}
                />
                <PortalKpiCard
                  icon={Timer}
                  label="Monthly Attendance"
                  value="98.4%"
                  hint="21 / 22 Working Days"
                  chip="98% on-time"
                  from="#1f4693"
                  to="#173a52"
                  onClick={() => setActiveTab("attendance")}
                />
                <PortalKpiCard
                  icon={Layers}
                  label="Remaining Leaves"
                  value="14 Days"
                  hint="8 Casual · 6 Sick balance"
                  chip="14 available"
                  from="#3089a6"
                  to="#1f6f8b"
                  onClick={() => setActiveTab("leaves")}
                />
                <PortalKpiCard
                  icon={CreditCard}
                  label="Last Net Payslip"
                  value="₹1,46,000"
                  hint="Sep 2026 · Credited"
                  chip="Credited"
                  from="#173a52"
                  to="#3089a6"
                  onClick={() => setActiveTab("payslips")}
                />
              </div>

              {/* Profile Overview Card (Clean White Card) */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7941e] to-[#1f4693] text-2xl font-bold text-white shadow-md">
                      {profile.avatar}
                    </span>
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">{profile.full_name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#f96706]">{profile.designation}</span>
                        <span className="text-slate-300">·</span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-700" title="Official Employee ID">
                          <Lock className="h-3 w-3 text-indigo-500" />
                          <span>{profile.emp_id}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{profile.status || "Approved"}</span>
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">{profile.department} · {profile.work_location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsLeaveModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f7941e] to-[#f96706] px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                      Apply for Leave
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHrTicketModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-2xs"
                    >
                      <HelpCircle className="h-4 w-4 text-[#f96706]" />
                      HR Helpdesk
                    </button>
                  </div>
                </div>
              </div>

                {/* Two Columns: Recent Attendance Log & Upcoming Holidays */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Attendance */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald-600" />
                        Recent Attendance Logs
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab("attendance")}
                        className="text-sm font-bold text-emerald-700 hover:underline"
                      >
                        All logs &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {attendance.slice(0, 4).map((row) => (
                        <div key={row.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                          <div>
                            <p className="text-sm sm:text-base font-bold text-slate-900">{row.date}</p>
                            <p className="text-sm text-slate-500 mt-0.5">In: <strong className="text-slate-700 font-mono">{row.punch_in}</strong> · Out: <strong className="text-slate-700 font-mono">{row.punch_out || "Active Shift"}</strong></p>
                          </div>
                          <div className="text-right">
                            <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs sm:text-sm font-bold border border-emerald-200">
                              {row.work_hours}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Holidays */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        Upcoming Company Holidays
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab("holidays")}
                        className="text-sm font-bold text-emerald-700 hover:underline"
                      >
                        Full Calendar &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {holidays.slice(0, 4).map((h) => (
                        <div key={h.date} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                          <div>
                            <p className="text-sm sm:text-base font-bold text-slate-900">{h.title}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{h.day} · {h.type}</p>
                          </div>
                          <span className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-xs sm:text-sm font-mono text-slate-800 font-bold">
                            {h.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: PROFILE ================= */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Employee Master Profile</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Official corporate records, tax identification numbers, and designated reporting manager.</p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Employee ID</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                          <Lock className="h-2.5 w-2.5" /> Read Only
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-mono font-extrabold text-indigo-950 mt-1">{profile.emp_id}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Legal Name</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.full_name}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Corporate Email</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.email}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Assigned Role</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded">
                          <Lock className="h-2.5 w-2.5" /> Read Only
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 capitalize">{profile.role || "Employee"}</p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Account Status</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-extrabold text-emerald-900 mt-1">{profile.status || "Approved"}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date of Joining / Approval</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.joining_date}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Designation</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.designation}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Department / Pod</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.department}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reporting Manager</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.manager_name}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Work Location</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.work_location}</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Official Phone</span>
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-sm sm:text-base font-extrabold text-emerald-800 uppercase tracking-wider mb-4">Statutory & Bank Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                        <span className="text-xs font-bold text-slate-500 uppercase">Income Tax PAN</span>
                        <p className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-1">{profile.pan_number}</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                        <span className="text-xs font-bold text-slate-500 uppercase">EPF UAN Number</span>
                        <p className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-1">{profile.uan_number}</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                        <span className="text-xs font-bold text-slate-500 uppercase">Salary Bank</span>
                        <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">{profile.bank_name}</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                        <span className="text-xs font-bold text-slate-500 uppercase">Account & IFSC</span>
                        <p className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-1">{profile.bank_account} · {profile.ifsc_code}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm sm:text-base text-slate-700">
                    <span>Emergency Contact: <strong className="text-slate-900">{profile.emergency_contact}</strong></span>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 text-xs sm:text-sm font-bold">Employee Status: Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: ATTENDANCE ================= */}
            {activeTab === "attendance" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Daily Punch & Timesheet Logs</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Real-time attendance telemetry tracked from workstation punch station.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePunch}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-sm transition-colors"
                  >
                    <Clock className="h-5 w-5" />
                    {isPunchedIn ? "Punch Out" : "Punch In"}
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm sm:text-base text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm">
                        <tr>
                          <th className="py-3.5 px-4">Date</th>
                          <th className="py-3.5 px-4">Punch In</th>
                          <th className="py-3.5 px-4">Punch Out</th>
                          <th className="py-3.5 px-4">Effective Hours</th>
                          <th className="py-3.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {attendance.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-4 font-bold text-slate-900">{row.date}</td>
                            <td className="py-4 px-4 text-emerald-700 font-mono font-bold">{row.punch_in}</td>
                            <td className="py-4 px-4 text-slate-600 font-mono">{row.punch_out || "—"}</td>
                            <td className="py-4 px-4"><span className="rounded bg-slate-100 text-slate-700 px-3 py-1 font-bold text-xs sm:text-sm">{row.work_hours}</span></td>
                            <td className="py-4 px-4">
                              <span className={`rounded-full px-3 py-1 font-bold text-xs sm:text-sm ${
                                row.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: HOLIDAYS ================= */}
            {activeTab === "holidays" && (
              <div className="space-y-6">
                <HolidaysCalendar
                  initialYear={2026}
                  initialMonth={10}
                  userRole="employee"
                  onAskHr={(holidayName) => {
                    setHrTicketForm({
                      category: "Workplace & Facilities",
                      priority: "Normal",
                      subject: `Inquiry regarding ${holidayName}`,
                      description: `Hello HR Team,\n\nI would like to inquire about the schedule, compensation, or leave policy for ${holidayName}. Please advise.\n\nThank you,\n${profile.name || "Alex Morgan"}`,
                    });
                    setIsHrTicketModalOpen(true);
                  }}
                  onDateClick={({ formatted, holiday }) => {
                    if (!holiday) {
                      setLeaveForm((prev) => ({
                        ...prev,
                        start_date: formatted,
                        end_date: formatted,
                      }));
                      setIsLeaveModalOpen(true);
                    }
                  }}
                />
              </div>
            )}

            {/* ================= TAB: LEAVES ================= */}
            {activeTab === "leaves" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Leave Applications & Balances</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Apply for time off, view approval feedback from HR Operations lead.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLeaveModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-sm transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Apply for Leave
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs text-center">
                    <p className="text-sm sm:text-base font-bold text-slate-600">Casual Leave (CL)</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-1">8 Days</p>
                    <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1 inline-block">Available Balance</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs text-center">
                    <p className="text-sm sm:text-base font-bold text-slate-600">Sick Leave (SL)</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-cyan-700 mt-1">6 Days</p>
                    <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1 inline-block">Available Balance</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs text-center">
                    <p className="text-sm sm:text-base font-bold text-slate-600">Earned / Privilege (PL)</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mt-1">12 Days</p>
                    <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1 inline-block">Accrued Balance</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {leaves.map((l) => (
                    <div key={l.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">{l.leave_type}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-sm sm:text-base font-bold text-slate-700">{l.start_date} to {l.end_date} ({l.days} days)</span>
                        </div>
                        <p className="text-sm sm:text-base font-medium text-slate-800">{l.reason}</p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Applied on: {l.applied_on}</p>
                      </div>

                      <span className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold shrink-0 ${
                        l.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : l.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: PAYSLIPS ================= */}
            {activeTab === "payslips" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Monthly Salary Statements & Digital Payslips</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">View detailed earnings breakdown, statutory PF/tax deductions, and download official printable slips.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm sm:text-base text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm">
                        <tr>
                          <th className="py-3.5 px-4">Pay Period</th>
                          <th className="py-3.5 px-4">Gross Earnings</th>
                          <th className="py-3.5 px-4">Deductions (PF/Tax)</th>
                          <th className="py-3.5 px-4">Net Take-Home</th>
                          <th className="py-3.5 px-4">Disbursement</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {payslips.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-4 font-bold text-slate-900">{p.month_year}</td>
                            <td className="py-4 px-4 text-slate-800 font-semibold">₹{p.gross_salary.toLocaleString()}</td>
                            <td className="py-4 px-4 text-rose-600 font-mono font-bold">-₹{(p.pf_deduction + p.prof_tax + p.tds_tax).toLocaleString()}</td>
                            <td className="py-4 px-4 font-extrabold text-emerald-700 text-base sm:text-lg">₹{p.net_take_home.toLocaleString()}</td>
                            <td className="py-4 px-4 text-slate-600">{p.payment_date}</td>
                            <td className="py-4 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setActivePayslipModal(p)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                              >
                                <FileText className="h-4 w-4" />
                                View Payslip
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: DOCUMENTS ================= */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Employee Documents & Policies</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Authorized corporate policies, IT NDA agreements, and group medical insurance policies.</p>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                          <Paperclip className="h-5 w-5" />
                        </span>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">{doc.title}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">{doc.doc_type} · {doc.file_size} · Uploaded: {doc.uploaded_at}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${doc.title}...`)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-sm text-slate-700 font-bold shadow-2xs transition-colors shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: HR HELPDESK ================= */}
            {activeTab === "hr" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">HR Operations Helpdesk</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Submit internal grievances, equipment requisitions, and payroll support requests.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHrTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-sm transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Raise HR Ticket
                  </button>
                </div>

                <div className="space-y-4">
                  {hrTickets.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg uppercase">{t.category}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-sm text-slate-500">{t.created_at}</span>
                          </div>
                          <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{t.subject}</h4>
                          <p className="text-sm sm:text-base text-slate-700 mt-1">{t.description}</p>
                        </div>

                        <span className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold shrink-0 ${
                          t.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      {t.hr_response && (
                        <div className="pt-3 border-t border-slate-100 flex items-start gap-3 bg-emerald-50/70 border border-emerald-200/70 p-4 rounded-xl">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold text-emerald-900 uppercase">HR Operations Resolution:</span>
                            <p className="text-sm sm:text-base text-slate-800 mt-1 font-medium">{t.hr_response}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
  );

  return (
    <>
      <Seo title="Employee Portal — Zyllo Tech" description="Employee workspace for clock punch in/out, attendance timesheets, leave applications, and digital payslips." />

      {insideAdmin ? (
        <div className="space-y-6">
          {/* Greetings Hero Banner */}
          <PortalHeroBanner
            greeting={`Good afternoon, ${profile.full_name?.split(" ")[0] || "Team Member"}`}
            subtitle={`${profile.designation} · ID: ${profile.emp_id}`}
            stats={[
              { value: profile.emp_id, label: "Employee ID" },
              { value: punchInTime || "09:05 AM", label: "Today Punch" },
              { value: "14 Days", label: "Leaves Left" },
            ]}
            onRefresh={() => {}}
          />

          {/* First photo items displayed on down of greetings in horizontal row */}
          {empHorizontalTabBar}

          {/* Down it should open: Active tab view */}
          {renderEmpTabContent}
        </div>
      ) : (
        <PortalShell
          portalName="Employee Portal"
          portalId="employee"
          user={{ name: profile.full_name, email: profile.email, role: "employee" }}
          navSections={empNavSections}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchPlaceholder="Search timesheets, leaves, documents..."
        >
          {renderEmpTabContent}
        </PortalShell>
      )}

        {/* ================= MODAL: APPLY LEAVE ================= */}
        {isLeaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Apply for Time Off
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Leave Category</label>
                  <select
                    value={leaveForm.leave_type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Casual Leave">Casual Leave (CL - 8 days balance)</option>
                    <option value="Sick Leave">Sick Leave (SL - 6 days balance)</option>
                    <option value="Earned Leave">Earned / Privilege Leave (PL - 12 days)</option>
                    <option value="Compensatory Off">Compensatory Off (Weekend project deployment)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">From Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.start_date}
                      onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">To Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.end_date}
                      onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Reason for Leave</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide context for HR and reporting manager..."
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsLeaveModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-md transition-colors"
                  >
                    Submit Leave Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: RAISE HR TICKET ================= */}
        {isHrTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  Raise HR Support Ticket
                </h3>
                <button
                  type="button"
                  onClick={() => setIsHrTicketModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateHrTicket} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Ticket Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of the request..."
                    value={hrTicketForm.subject}
                    onChange={(e) => setHrTicketForm({ ...hrTicketForm, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={hrTicketForm.category}
                      onChange={(e) => setHrTicketForm({ ...hrTicketForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Payroll & Compensation">Payroll & Compensation</option>
                      <option value="Equipment & Hardware">Equipment & Hardware</option>
                      <option value="Leaves & Attendance">Leaves & Attendance</option>
                      <option value="Insurance & Benefits">Insurance & Benefits</option>
                      <option value="General HR Inquiry">General HR Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Priority</label>
                    <select
                      value={hrTicketForm.priority}
                      onChange={(e) => setHrTicketForm({ ...hrTicketForm, priority: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Detailed Explanation</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full description of your query or issue..."
                    value={hrTicketForm.description}
                    onChange={(e) => setHrTicketForm({ ...hrTicketForm, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsHrTicketModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-md transition-colors"
                  >
                    Submit to HR Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: PRINTABLE PAYSLIP ================= */}
        {activePayslipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white text-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
              {/* Payslip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <img src="/zyllo-icon.png" alt="Zyllo Tech" className="h-10 w-auto" />
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#101a3a]">ZYLLO TECH SOFTWARE SOLUTIONS PVT. LTD.</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">R V Plaza, Guntur, Andhra Pradesh 522034 · DPIIT-Recognized Startup</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs sm:text-sm font-bold uppercase text-[#f96706]">Salary Statement</span>
                  <p className="text-sm sm:text-base font-extrabold text-neutral-800">{activePayslipModal.month_year}</p>
                </div>
              </div>

              {/* Employee & Bank Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base border-b pb-4 mb-5">
                <div className="space-y-1">
                  <p><span className="text-neutral-500">Employee Name:</span> <strong>{profile.full_name}</strong></p>
                  <p><span className="text-neutral-500">Employee ID:</span> <strong>{profile.emp_id}</strong></p>
                  <p><span className="text-neutral-500">Designation:</span> <strong>{profile.designation}</strong></p>
                  <p><span className="text-neutral-500">Department:</span> <strong>{profile.department}</strong></p>
                </div>
                <div className="space-y-1">
                  <p><span className="text-neutral-500">PAN Number:</span> <strong>{profile.pan_number}</strong></p>
                  <p><span className="text-neutral-500">UAN Number:</span> <strong>{profile.uan_number}</strong></p>
                  <p><span className="text-neutral-500">Bank Account:</span> <strong>{profile.bank_account} ({profile.bank_name})</strong></p>
                  <p><span className="text-neutral-500">Payment Mode:</span> <strong>{activePayslipModal.payment_mode}</strong></p>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base mb-5">
                {/* Earnings */}
                <div className="border rounded-xl p-4 bg-neutral-50">
                  <h4 className="font-extrabold text-[#101a3a] border-b pb-2 mb-2.5 text-base">Earnings (A)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Basic Salary:</span>
                      <strong>₹{activePayslipModal.basic_salary.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">House Rent Allowance (HRA):</span>
                      <strong>₹{activePayslipModal.hra.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Special Allowance:</span>
                      <strong>₹{activePayslipModal.special_allowance.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-extrabold text-neutral-900 text-base">
                      <span>Gross Earnings:</span>
                      <span>₹{activePayslipModal.gross_salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border rounded-xl p-4 bg-neutral-50">
                  <h4 className="font-extrabold text-[#101a3a] border-b pb-2 mb-2.5 text-base">Deductions (B)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Provident Fund (PF):</span>
                      <strong>₹{activePayslipModal.pf_deduction.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Professional Tax (PT):</span>
                      <strong>₹{activePayslipModal.prof_tax.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">TDS / Income Tax:</span>
                      <strong>₹{activePayslipModal.tds_tax.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-extrabold text-red-600 text-base">
                      <span>Total Deductions:</span>
                      <span>₹{(activePayslipModal.pf_deduction + activePayslipModal.prof_tax + activePayslipModal.tds_tax).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary Banner */}
              <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between mb-6 shadow-md gap-3">
                <div>
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-emerald-100 font-bold">Net Take-Home Salary</span>
                  <p className="text-3xl sm:text-4xl font-extrabold">₹{activePayslipModal.net_take_home.toLocaleString()}</p>
                </div>
                <div className="sm:text-right text-sm text-emerald-100">
                  <p>Disbursed on {activePayslipModal.payment_date}</p>
                  <p className="font-bold text-white text-base">Status: Confirmed Paid</p>
                </div>
              </div>

              {/* Actions: Print and Close */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setActivePayslipModal(null)}
                  className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#101a3a] hover:bg-neutral-800 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-md transition-colors"
                >
                  <Printer className="h-5 w-5" />
                  Print Payslip
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
