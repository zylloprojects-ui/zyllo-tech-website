"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Link from "@/lib/nx/link";
import Seo from "@/components/Seo";
import PortalShell from "@/components/PortalShell";
import PortalHeroBanner from "@/components/PortalHeroBanner";
import PortalKpiCard from "@/components/PortalKpiCard";
import HolidaysCalendar from "@/components/HolidaysCalendar";
import EmployeePortal from "./EmployeePortal";
import ClientPortal from "./ClientPortal";
import {
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_ATTENDANCE,
  INITIAL_HR_TICKETS,
  INITIAL_HOLIDAYS,
  getStoredData,
  setStoredData,
} from "@/data/portalData";
import {
  fetchHrCandidateEmails,
  simulateCandidateEmailOpen,
  sendCandidateEmail,
  INITIAL_CANDIDATE_EMAILS,
} from "@/lib/api/portals";
import {
  Briefcase,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Filter,
  HeartHandshake,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  MailCheck,
  MapPin,
  MessageSquare,
  Network,
  Phone,
  Plus,
  Paperclip,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
  AlertCircle,
  Send,
  Activity,
} from "lucide-react";


// Recruitment Candidates Database matching Photo 4
const CANDIDATE_DATABASE = [
  { id: "CAND-101", name: "Arjun Verma", email: "arjun.verma@example.com", role: "Senior FullStack Engineer (Applied AI Pod)" },
  { id: "CAND-102", name: "Sneha Reddy", email: "sneha.reddy@example.com", role: "DevOps & Cloud Systems Architect" },
  { id: "CAND-103", name: "Vikram Malhotra", email: "vikram.malhotra@example.com", role: "Lead Frontend Engineer (React/Tailwind)" },
  { id: "CAND-104", name: "Ananya Deshmukh", email: "ananya.d@example.com", role: "AI Research & NLP Specialist" },
  { id: "CAND-105", name: "Ramesh Sharma", email: "ramesh.sharma@example.com", role: "Quality Assurance & Test Automation Lead" },
  { id: "CAND-106", name: "Karthik Nair", email: "karthik.nair@example.com", role: "Cybersecurity & Backend Pod Engineer" },
  { id: "CAND-107", name: "Divya Iyer", email: "divya.iyer@example.com", role: "UI/UX Product Designer" },
];

// Presets matching Photo 4 Message Template
const MESSAGE_TEMPLATES = {
  custom: {
    subject: "",
    body: "",
  },
  interview: {
    subject: "Interview Invitation: Technical Pod Discussion at Zyllo Tech",
    body: `<p>Dear {name},</p>
<p>Thank you for your interest in joining <strong>Zyllo Tech Software Solutions Pvt. Ltd.</strong> We reviewed your profile and were impressed by your engineering background and technical portfolio.</p>
<p>We are delighted to invite you for a 45-minute technical pod sync with our solutions architect team.</p>
<p><strong>Format:</strong> Google Meet (Video Conference)<br/><strong>Agenda:</strong> Architecture deep dive, problem solving, and pod culture fit.</p>
<p>Please reply with your preferred time slot:</p>
<ul>
  <li>Slot A: Tomorrow at 2:00 PM IST</li>
  <li>Slot B: Day after tomorrow at 11:30 AM IST</li>
</ul>
<p>Looking forward to speaking with you!</p>
<p>Warm regards,<br/><strong>People &amp; Talent Operations</strong><br/>Zyllo Tech Software Solutions Pvt. Ltd.</p>`,
  },
  shortlist: {
    subject: "Application Update: Shortlisted for Next Evaluation Stage",
    body: `<p>Dear {name},</p>
<p>Congratulations! Your profile has been shortlisted for the next evaluation stage at <strong>Zyllo Tech Software Solutions</strong>.</p>
<p>As the next step, please review the attached role brief and take-home technical challenge. Kindly submit your repository link or solution by the end of this week.</p>
<p>If you have any questions, feel free to reply directly to this thread.</p>
<p>Best regards,<br/><strong>HR Operations Lead</strong><br/>Zyllo Tech Software Solutions Pvt. Ltd.</p>`,
  },
  offer: {
    subject: "Offer of Employment: Welcome to Zyllo Tech Software Solutions",
    body: `<p>Dear {name},</p>
<p>On behalf of the leadership team at <strong>Zyllo Tech Software Solutions Pvt. Ltd.</strong>, we are thrilled to extend an official offer of employment for the engineering pod.</p>
<p>We believe your experience and passion will be instrumental in scaling our high-performance client deliverables.</p>
<p>Please find enclosed your formal offer letter, statutory benefits outline, and appointment schedule. Kindly sign and return the duplicate copy by next Monday.</p>
<p>Congratulations, and welcome aboard!</p>
<p>Warm regards,<br/><strong>Dr. S. K. Roy (CTO) &amp; People Ops</strong><br/>Zyllo Tech Software Solutions Pvt. Ltd.</p>`,
  },
  rejection: {
    subject: "Update regarding your application with Zyllo Tech",
    body: `<p>Dear {name},</p>
<p>Thank you for taking the time to discuss opportunities at <strong>Zyllo Tech Software Solutions</strong>.</p>
<p>While your skills and experience are commendable, we have decided to move forward with other candidates whose profiles align more closely with our current sprint priorities. We will retain your profile in our talent pool for future openings.</p>
<p>We wish you all the best in your career pursuits.</p>
<p>Sincerely,<br/><strong>Talent Acquisition Team</strong><br/>Zyllo Tech Software Solutions Pvt. Ltd.</p>`,
  },
};

export default function HrPortal({ insideAdmin = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployeeSubpage = location.pathname.includes("/hr/employee");
  const isClientSubpage = location.pathname.includes("/hr/client");

  const [activeTab, setActiveTab] = useState("overview"); // overview | employees | teams | leaves | attendance | tickets | recruitment | holidays
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [holidays, setHolidays] = useState([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPod, setSelectedPod] = useState("All");

  // Modal States
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    full_name: "",
    email: "",
    designation: "",
    department: "Engineering & Applied AI Pod",
    phone: "",
    work_location: "Guntur Tech Hub",
  });

  const [activeTicketResponseModal, setActiveTicketResponseModal] = useState(null);
  const [ticketResponseText, setTicketResponseText] = useState("");

  // Candidate Email & Tracking Telemetry States
  const [candidateEmails, setCandidateEmails] = useState(() => INITIAL_CANDIDATE_EMAILS || []);
  const [mailStats, setMailStats] = useState(() => {
    const list = INITIAL_CANDIDATE_EMAILS || [];
    const opened = list.filter((e) => e.open_status === "Opened" || e.open_count > 0).length;
    return {
      total_sent: list.length,
      total_opened: opened,
      open_rate: list.length ? Math.round((opened / list.length) * 100) : 0,
      total_unopened: list.length - opened,
    };
  });
  const [emailStatusFilter, setEmailStatusFilter] = useState("all");
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [emailPreviewModal, setEmailPreviewModal] = useState(null);
  const [isComposeEmailModalOpen, setIsComposeEmailModalOpen] = useState(false);
  const [emailToast, setEmailToast] = useState(null);
  const [isRefreshingEmails, setIsRefreshingEmails] = useState(false);
  const [composeEmailForm, setComposeEmailForm] = useState({
    candidate_name: "",
    candidate_email: "",
    subject: "Next Steps in Your Application with Zyllo Tech",
    message: "",
    tracking_enabled: true,
    attachment_ref: "",
  });
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("custom");

  function handleSelectCandidate(candId) {
    setSelectedCandidateId(candId);
    const found = CANDIDATE_DATABASE.find((c) => c.id === candId);
    if (found) {
      setComposeEmailForm((prev) => {
        let msg = prev.message;
        if (prev.candidate_name && msg) {
          msg = msg.replaceAll(prev.candidate_name, found.name);
        }
        return {
          ...prev,
          candidate_name: found.name,
          candidate_email: found.email,
          message: msg,
        };
      });
    }
  }

  function handleSelectTemplate(tmplKey) {
    setSelectedTemplateKey(tmplKey);
    const tmpl = MESSAGE_TEMPLATES[tmplKey];
    if (tmpl) {
      const name = composeEmailForm.candidate_name || "Candidate";
      setComposeEmailForm((prev) => ({
        ...prev,
        subject: tmpl.subject ? tmpl.subject.replace("{name}", name) : prev.subject,
        message: tmpl.body ? tmpl.body.replaceAll("{name}", name) : "",
      }));
    }
  }

  async function loadCandidateEmails(status = emailStatusFilter) {
    setIsRefreshingEmails(true);
    try {
      const result = await fetchHrCandidateEmails(1, status);
      if (result && result.emails) {
        setCandidateEmails(result.emails);
        if (result.stats) setMailStats(result.stats);
      }
    } catch (e) {
      console.warn("Could not load candidate emails:", e);
    } finally {
      setIsRefreshingEmails(false);
    }
  }

  async function handleSimulateEmailOpen(email) {
    try {
      await simulateCandidateEmailOpen(email.tracking_id);
    } catch (e) {}

    const updated = candidateEmails.map((e) => {
      if (e.tracking_id === email.tracking_id) {
        const newCount = (e.open_count || 0) + 1;
        const now = new Date().toISOString().replace("T", " ").slice(0, 19);
        return {
          ...e,
          open_status: "Opened",
          open_count: newCount,
          first_opened_at: e.first_opened_at || now,
          last_opened_at: now,
        };
      }
      return e;
    });
    setCandidateEmails(updated);
    const totalOpened = updated.filter((e) => e.open_status === "Opened" || e.open_count > 0).length;
    setMailStats({
      total_sent: updated.length,
      total_opened: totalOpened,
      open_rate: updated.length ? Math.round((totalOpened / updated.length) * 100) : 0,
      total_unopened: updated.length - totalOpened,
    });
    setEmailToast(`Tracking Pixel Open event simulated for ${email.candidate_name || email.candidate_email}! Views: ${(email.open_count || 0) + 1}`);
    setTimeout(() => setEmailToast(null), 4000);
  }

  async function handleSendCandidateEmail(e) {
    e.preventDefault();
    if (!composeEmailForm.candidate_email.trim()) return;
    try {
      await sendCandidateEmail(composeEmailForm);
    } catch (err) {}
    await loadCandidateEmails();
    setIsComposeEmailModalOpen(false);
    setEmailToast(`Email successfully sent to ${composeEmailForm.candidate_email}! Pixel tracking is ${composeEmailForm.tracking_enabled ? "Active" : "Disabled"}.`);
    setTimeout(() => setEmailToast(null), 4000);
    setComposeEmailForm({
      candidate_name: "",
      candidate_email: "",
      subject: "Next Steps in Your Application with Zyllo Tech",
      message: "",
      tracking_enabled: true,
      attachment_ref: "",
    });
    setSelectedCandidateId("");
    setSelectedTemplateKey("custom");
  }

  useEffect(() => {
    loadCandidateEmails();
  }, [emailStatusFilter]);

  const fetchEmployeesList = async () => {
    try {
      const token = localStorage.getItem("zyllotech_token") || "demo_jwt_token_hr";
      const res = await fetch("/api/hr/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.employees)) {
          const dbEmployees = data.employees.map((e) => ({
            emp_id: e.employee_id || e.emp_id || `ZYL-EMP-${String(e.id).padStart(4, "0")}`,
            full_name: e.full_name || e.name || "Employee",
            email: e.email,
            designation: e.designation || "Solutions Engineer",
            department: e.department || "Engineering & Applied AI Pod",
            joining_date: e.joining_date
              ? e.joining_date.length > 12
                ? new Date(e.joining_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : e.joining_date
              : "15 Jan 2024",
            manager_name: e.manager_name || "Dr. K. Srinivas (VP of Engineering)",
            phone: e.phone || "+91 98480 00000",
            work_location: e.work_location || "Guntur Tech Hub",
            status: "Approved",
            avatar: (e.full_name || e.name || "EM").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
          }));

          const baseList = getStoredData("zyllotech_portal_employees", INITIAL_EMPLOYEES);
          const emailMap = new Map();
          baseList.forEach((emp) => emailMap.set(emp.email.toLowerCase(), emp));
          dbEmployees.forEach((emp) => emailMap.set(emp.email.toLowerCase(), { ...emailMap.get(emp.email.toLowerCase()), ...emp }));
          const merged = Array.from(emailMap.values());
          setEmployees(merged);
          setStoredData("zyllotech_portal_employees", merged);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch DB employees, falling back to local storage:", err);
    }

    const stored = getStoredData("zyllotech_portal_employees", INITIAL_EMPLOYEES);
    try {
      const rawReg = localStorage.getItem("zyllotech_registered_users");
      if (rawReg) {
        const regUsers = JSON.parse(rawReg);
        const approvedEmployees = regUsers.filter((u) => u.role === "employee" && u.status === "APPROVED");
        const map = new Map();
        stored.forEach((e) => map.set(e.email.toLowerCase(), e));
        approvedEmployees.forEach((u) => {
          map.set(u.email.toLowerCase(), {
            emp_id: u.employee_id || "ZYL-EMP-0001",
            full_name: u.name,
            email: u.email,
            designation: "Solutions Engineer",
            department: "Engineering & Applied AI Pod",
            joining_date: u.approved_at ? new Date(u.approved_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent",
            manager_name: "Dr. K. Srinivas (VP of Engineering)",
            phone: "+91 98480 00000",
            work_location: "Guntur Tech Hub",
            status: "Approved",
            avatar: (u.name || "EM").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
          });
        });
        setEmployees(Array.from(map.values()));
        return;
      }
    } catch (e) {}

    setEmployees(stored);
  };

  useEffect(() => {
    fetchEmployeesList();
    setLeaves(getStoredData("zyllotech_portal_leaves", INITIAL_LEAVES));
    setAttendance(getStoredData("zyllotech_portal_attendance", INITIAL_ATTENDANCE));
    setTickets(getStoredData("zyllotech_portal_hr_tickets", INITIAL_HR_TICKETS));
    setHolidays(getStoredData("zyllotech_portal_holidays", INITIAL_HOLIDAYS));
  }, []);

  function handleApproveLeave(leaveId) {
    const updated = leaves.map((l) => (l.id === leaveId ? { ...l, status: "Approved" } : l));
    setLeaves(updated);
    setStoredData("zyllotech_portal_leaves", updated);
  }

  function handleRejectLeave(leaveId) {
    const updated = leaves.map((l) => (l.id === leaveId ? { ...l, status: "Rejected" } : l));
    setLeaves(updated);
    setStoredData("zyllotech_portal_leaves", updated);
  }

  function handleAddEmployee(e) {
    e.preventDefault();
    if (!newEmpForm.full_name.trim() || !newEmpForm.email.trim()) return;

    const initials = newEmpForm.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newEmp = {
      emp_id: `ZY-EMP-${1040 + employees.length + 1}`,
      email: newEmpForm.email.trim(),
      full_name: newEmpForm.full_name.trim(),
      designation: newEmpForm.designation.trim() || "Software Solutions Engineer",
      department: newEmpForm.department,
      joining_date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      manager_name: "Dr. K. Srinivas (VP of Engineering)",
      phone: newEmpForm.phone.trim() || "+91 98480 00000",
      work_location: newEmpForm.work_location,
      pan_number: "ABCDE" + Math.floor(1000 + Math.random() * 9000) + "F",
      uan_number: "10" + Math.floor(1000000000 + Math.random() * 9000000000),
      bank_name: "HDFC Bank Ltd.",
      bank_account: "••••••••" + Math.floor(1000 + Math.random() * 9000),
      ifsc_code: "HDFC0001248",
      emergency_contact: "Family Contact (+91 98480 11111)",
      status: "Active",
      avatar: initials || "EM",
    };

    const updated = [...employees, newEmp];
    setEmployees(updated);
    setStoredData("zyllotech_portal_employees", updated);
    setIsAddEmpModalOpen(false);
    setNewEmpForm({
      full_name: "",
      email: "",
      designation: "",
      department: "Engineering & Applied AI Pod",
      phone: "",
      work_location: "Guntur Tech Hub",
    });
  }

  function handleResolveTicket(e) {
    e.preventDefault();
    if (!activeTicketResponseModal || !ticketResponseText.trim()) return;

    const updated = tickets.map((t) =>
      t.id === activeTicketResponseModal.id
        ? { ...t, status: "Resolved", hr_response: ticketResponseText.trim() }
        : t
    );
    setTickets(updated);
    setStoredData("zyllotech_portal_hr_tickets", updated);
    setActiveTicketResponseModal(null);
    setTicketResponseText("");
  }

  function handleRegularizeAttendance(attId) {
    const updated = attendance.map((a) =>
      a.id === attId ? { ...a, punch_out: "06:00 PM", work_hours: "9h 00m", status: "Present" } : a
    );
    setAttendance(updated);
    setStoredData("zyllotech_portal_attendance", updated);
  }

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const nameStr = (emp.full_name || emp.name || "").toLowerCase();
    const emailStr = (emp.email || "").toLowerCase();
    const idStr = (emp.emp_id || emp.employee_id || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = nameStr.includes(q) || emailStr.includes(q) || idStr.includes(q);
    const matchesPod = selectedPod === "All" || (emp.department || "").includes(selectedPod);
    return matchesSearch && matchesPod;
  });

  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const pendingTickets = tickets.filter((t) => t.status === "Pending" || t.status === "In Progress");

  const hrNavSections = [
    {
      label: "Overview",
      items: [
        { id: "overview", label: "HR Overview", icon: LayoutGrid },
      ],
    },
    {
      label: "People & Talent",
      items: [
        { id: "employees", label: "All Employees", icon: Users, count: String(employees.length || 7).padStart(2, "0") },
        { id: "teams", label: "Teams & Leads", icon: Network },
        { id: "leaves", label: "Leave Approvals", icon: CalendarCheck, count: String(pendingLeaves.length).padStart(2, "0") },
        { id: "attendance", label: "Attendance", icon: Clock, count: String(attendance.length || 15).padStart(2, "0") },
      ],
    },
    {
      label: "Operations & Desk",
      items: [
        { id: "tickets", label: "HR Help Desk", icon: HeartHandshake, count: String(pendingTickets.length).padStart(2, "0") },
        { id: "holidays", label: "Holidays & Calendar", icon: CalendarDays },
        { id: "emails", label: "Candidate Emails & Tracking", icon: MailCheck, count: String(candidateEmails.length || 34).padStart(2, "0") },
      ],
    },
    {
      label: "Workspaces",
      items: [
        { id: "hr_employee", label: "Employee Portal", href: "/hr/employee", icon: Clock },
        { id: "hr_client", label: "Client Workspace", href: "/hr/client", icon: Briefcase },
      ],
    },
  ];

  const allHrTabs = [
    { id: "overview", label: "HR Overview", icon: LayoutGrid },
    { id: "employees", label: "All Employees", icon: Users, count: String(employees.length || 7).padStart(2, "0") },
    { id: "teams", label: "Teams & Leads", icon: Network },
    { id: "leaves", label: "Leave Approvals", icon: CalendarCheck, count: String(pendingLeaves.length).padStart(2, "0") },
    { id: "attendance", label: "Attendance", icon: Clock, count: String(attendance.length || 15).padStart(2, "0") },
    { id: "tickets", label: "HR Help Desk", icon: HeartHandshake, count: String(pendingTickets.length).padStart(2, "0") },
    { id: "holidays", label: "Holidays & Calendar", icon: CalendarDays },
    { id: "emails", label: "Candidate Emails & Tracking", icon: MailCheck, count: String(candidateEmails.length || 34).padStart(2, "0") },
  ];

  const currentActiveTab = isEmployeeSubpage
    ? "hr_employee"
    : isClientSubpage
    ? "hr_client"
    : activeTab;

  function handleTabChange(tabId) {
    if (isEmployeeSubpage || isClientSubpage) {
      navigate("/hr");
    }
    setActiveTab(tabId);
  }

  const hrHorizontalTabBar = (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f7fb]/95 backdrop-blur-md border-y border-slate-200/80 shadow-2xs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allHrTabs.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`group inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#f96706] to-[#f7941e] text-white shadow-md shadow-[#f96706]/25 ring-2 ring-[#f96706]/20"
                  : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#f96706]"}`} />
              <span>{item.label}</span>
              {item.count && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
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
  );

  const renderTabContent = (
    <div className="space-y-6">
      {/* ================= TAB: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {!insideAdmin && (
            <PortalHeroBanner
              greeting="Good afternoon, Priya"
              subtitle="HR talent management, headcount tracking, and leave approvals desk"
              stats={[
                { value: employees.length, label: "Staff Headcount" },
                { value: pendingLeaves.length, label: "Pending Leaves" },
                { value: attendance.length, label: "Attendance" },
              ]}
              onRefresh={loadCandidateEmails}
            />
          )}

              {/* 4 Solid KPI Cards matching photo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <PortalKpiCard
                  icon={Users}
                  label="Total Headcount"
                  value={employees.length}
                  hint="Active engineering pods"
                  chip={`${employees.length} on-duty`}
                  from="#f7941e"
                  to="#f96706"
                  onClick={() => setActiveTab("employees")}
                />
                <PortalKpiCard
                  icon={Clock}
                  label="Today's Attendance"
                  value={attendance.length}
                  hint="Shifts verified at Guntur Hub"
                  chip="96.8% rate"
                  from="#1f4693"
                  to="#173a52"
                  onClick={() => setActiveTab("attendance")}
                />
                <PortalKpiCard
                  icon={CalendarCheck}
                  label="Leave Approvals"
                  value={pendingLeaves.length}
                  hint={pendingLeaves.length > 0 ? "Awaiting decision" : "All reviewed"}
                  chip={pendingLeaves.length > 0 ? `${pendingLeaves.length} pending` : undefined}
                  from="#3089a6"
                  to="#1f6f8b"
                  onClick={() => setActiveTab("leaves")}
                />
                <PortalKpiCard
                  icon={MailCheck}
                  label="Candidate Emails"
                  value={candidateEmails.length}
                  hint={`${mailStats.open_rate}% open rate`}
                  from="#173a52"
                  to="#3089a6"
                  chip={`${mailStats.total_opened} opened`}
                  onClick={() => setActiveTab("emails")}
                />
              </div>

                {/* Pending Leave Approvals Action Section */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                        <Layers className="h-5 w-5 text-[#f96706]" />
                        Pending Leave Applications Awaiting Decision
                      </h4>
                      <p className="text-sm sm:text-base text-slate-500 mt-1">Approve or reject employee leave requests with one click.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("leaves")}
                      className="text-sm sm:text-base font-bold text-[#f96706] hover:underline"
                    >
                      View all ({leaves.length}) &rarr;
                    </button>
                  </div>

                  {pendingLeaves.length === 0 ? (
                    <div className="p-8 text-center text-sm sm:text-base text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      No pending leave applications. All time-off requests have been reviewed!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingLeaves.map((l) => (
                        <div key={l.id} className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-base sm:text-lg">{l.employee_name}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">{l.leave_type}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-sm sm:text-base text-slate-600 font-medium">{l.start_date} to {l.end_date} ({l.days} days)</span>
                            </div>
                            <p className="text-sm sm:text-base text-slate-700 mt-2">{l.reason}</p>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleApproveLeave(l.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm sm:text-base font-semibold shadow-xs transition-colors"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectLeave(l.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm sm:text-base font-semibold shadow-xs transition-colors"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Engineering Pods Summary Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-5">Engineering Pods & Headcount</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      { name: "Engineering & Applied AI Pod", lead: "Dr. K. Srinivas", count: 8, project: "HyperCloud AI" },
                      { name: "Frontend & Design Pod", lead: "Vikram Rao", count: 6, project: "Design System v4" },
                      { name: "Cloud & Infrastructure Pod", lead: "Sneha Patel", count: 4, project: "Kubernetes Cluster" },
                      { name: "Quality & Testing Pod", lead: "Rahul Varma", count: 4, project: "Automation Suite" },
                      { name: "Mobile App Pod", lead: "Alex Morgan", count: 5, project: "MedPulse Telehealth" },
                      { name: "Executive & People Ops", lead: "Priya Sharma", count: 3, project: "Talent Acquisition" },
                    ].map((pod) => (
                      <div key={pod.name} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col justify-between transition-colors">
                        <div>
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">POD</span>
                          <h5 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{pod.name}</h5>
                          <p className="text-sm sm:text-base text-slate-600 mt-1.5">Lead: <strong className="text-slate-800">{pod.lead}</strong></p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base">
                          <span className="text-slate-600 font-medium">{pod.project}</span>
                          <span className="rounded-full bg-slate-200 px-3 py-1 font-bold text-slate-800 text-xs sm:text-sm">{pod.count} staff</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: EMPLOYEES ================= */}
            {activeTab === "employees" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Employee Master Directory</h3>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">Staff records, department allocations, and statutory PAN/UAN credentials.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddEmpModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md hover:opacity-95"
                  >
                    <Plus className="h-4 w-4" />
                    Register Employee
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employee by name, email, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-slate-400" />
                    <select
                      value={selectedPod}
                      onChange={(e) => setSelectedPod(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm sm:text-base text-slate-800 focus:border-indigo-500 focus:outline-none font-medium"
                    >
                      <option value="All">All Pods</option>
                      <option value="Applied AI">Applied AI</option>
                      <option value="Frontend">Frontend & Design</option>
                      <option value="Cloud">Cloud & Infrastructure</option>
                      <option value="Quality">Quality Engineering</option>
                    </select>
                  </div>
                </div>

                {/* Employee Directory Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm tracking-wider">
                      <tr>
                        <th className="py-4 px-4">Employee</th>
                        <th className="py-4 px-4">Emp ID</th>
                        <th className="py-4 px-4">Department / Pod</th>
                        <th className="py-4 px-4">Designation</th>
                        <th className="py-4 px-4">Joining Date</th>
                        <th className="py-4 px-4">Location</th>
                        <th className="py-4 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.emp_id || emp.employee_id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-[#1f4693] font-bold text-white text-xs shrink-0">
                                {emp.avatar}
                              </span>
                              <div>
                                <p className="font-extrabold text-slate-900 text-base sm:text-lg">{emp.full_name || emp.name}</p>
                                <p className="text-sm text-slate-500">{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-indigo-600 text-sm sm:text-base">{emp.emp_id || emp.employee_id}</td>
                          <td className="py-4 px-4 text-slate-700 text-sm sm:text-base">{emp.department}</td>
                          <td className="py-4 px-4 text-slate-900 font-medium text-sm sm:text-base">{emp.designation}</td>
                          <td className="py-4 px-4 text-slate-600 text-sm sm:text-base font-medium">{emp.joining_date}</td>
                          <td className="py-4 px-4 text-slate-500 text-sm sm:text-base">{emp.work_location}</td>
                          <td className="py-4 px-4">
                            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold">
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB: TEAMS & LEADS ================= */}
            {activeTab === "teams" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                      <Network className="h-6 w-6 text-indigo-600" />
                      Engineering Pods &amp; Team Leads
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                      Team allocations, designated reporting leads, and active pod rosters.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("employees")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors shadow-xs"
                  >
                    <Users className="h-4 w-4 text-indigo-500" />
                    All Employees Directory ({employees.length}) &rarr;
                  </button>
                </div>

                {/* Pods Grid matching /api/hr/teams */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      id: 1,
                      department: "Engineering & Applied AI Pod",
                      manager_name: "Dr. K. Srinivas (VP of Engineering)",
                      member_count: 2,
                      members: ["Alex Morgan", "Ananya Roy"],
                      accent: "border-indigo-500/30 bg-indigo-50 text-indigo-700",
                    },
                    {
                      id: 2,
                      department: "Frontend & Design Pod",
                      manager_name: "Alex Morgan (Lead Engineer)",
                      member_count: 1,
                      members: ["Vikram Rao"],
                      accent: "border-cyan-500/30 bg-cyan-50 text-cyan-700",
                    },
                    {
                      id: 3,
                      department: "Cloud & Infrastructure Pod",
                      manager_name: "Dr. K. Srinivas (VP of Engineering)",
                      member_count: 1,
                      members: ["Sneha Patel"],
                      accent: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
                    },
                    {
                      id: 4,
                      department: "Backend & Security Pod",
                      manager_name: "Alex Morgan (Lead Engineer)",
                      member_count: 1,
                      members: ["Karthik Nair"],
                      accent: "border-amber-500/30 bg-amber-50 text-amber-700",
                    },
                    {
                      id: 5,
                      department: "Engineering Leadership",
                      manager_name: "Dr. S. K. Roy (CTO)",
                      member_count: 1,
                      members: ["Dr. K. Srinivas"],
                      accent: "border-purple-500/30 bg-purple-50 text-purple-700",
                    },
                    {
                      id: 6,
                      department: "People & Culture Operations",
                      manager_name: "Dr. S. K. Roy (CTO)",
                      member_count: 1,
                      members: ["Priya Sharma"],
                      accent: "border-rose-500/30 bg-rose-50 text-rose-700",
                    },
                  ].map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${t.accent}`}>
                            POD #{t.id}
                          </span>
                          <span className="text-sm text-slate-500 font-semibold">
                            {t.member_count} {t.member_count === 1 ? "Member" : "Members"}
                          </span>
                        </div>

                        <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-3.5">{t.department}</h4>

                        {/* Designated Lead */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 mb-3.5">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                            DESIGNATED TEAM LEAD / REPORTING MANAGER
                          </span>
                          <p className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="text-amber-600">★</span>
                            {t.manager_name}
                          </p>
                        </div>

                        {/* Roster */}
                        <div className="mb-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                            POD ROSTER
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {t.members.map((m) => (
                              <span
                                key={m}
                                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs sm:text-sm text-slate-800 font-semibold"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm">
                        <span className="text-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Active Sprint Operations
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPod(t.department.split(" ")[0]);
                            setActiveTab("employees");
                          }}
                          className="text-xs sm:text-sm font-bold text-indigo-600 hover:underline"
                        >
                          View Directory &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: LEAVES ================= */}
            {activeTab === "leaves" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Leave Approvals &amp; Time-Off Management</h3>
                  <p className="text-sm sm:text-base text-slate-500 mt-1">Review employee leave applications, approve or reject with live synchronization.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm tracking-wider">
                      <tr>
                        <th className="py-4 px-4">Employee</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Duration</th>
                        <th className="py-4 px-4">Reason</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaves.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-extrabold text-slate-900 text-base sm:text-lg">{l.employee_name}</td>
                          <td className="py-4 px-4">
                            <span className="text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full inline-block">
                              {l.leave_type}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600 text-sm sm:text-base font-medium">{l.start_date} to {l.end_date} ({l.days}d)</td>
                          <td className="py-4 px-4 text-slate-700 text-sm sm:text-base max-w-xs">{l.reason}</td>
                          <td className="py-4 px-4">
                            <span className={`rounded-full px-3 py-1 text-xs sm:text-sm font-bold ${
                              l.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : l.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {l.status === "Pending" ? (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApproveLeave(l.id)}
                                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectLeave(l.id)}
                                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-xs sm:text-sm font-semibold">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB: ATTENDANCE ================= */}
            {activeTab === "attendance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Daily Attendance &amp; Regularization</h3>
                  <p className="text-sm sm:text-base text-slate-500 mt-1">Company-wide punch telemetry logs with one-click regularization for field visits.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm tracking-wider">
                      <tr>
                        <th className="py-4 px-4">Date</th>
                        <th className="py-4 px-4">Employee ID</th>
                        <th className="py-4 px-4">Punch In</th>
                        <th className="py-4 px-4">Punch Out</th>
                        <th className="py-4 px-4">Hours</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendance.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900 text-sm sm:text-base">{att.date}</td>
                          <td className="py-4 px-4 font-mono font-bold text-indigo-600 text-sm sm:text-base">{att.emp_id}</td>
                          <td className="py-4 px-4 font-mono font-bold text-emerald-700 text-sm sm:text-base">{att.punch_in}</td>
                          <td className="py-4 px-4 font-mono text-slate-500 text-sm sm:text-base">{att.punch_out || "Active Shift"}</td>
                          <td className="py-4 px-4 text-slate-700 text-sm sm:text-base font-medium">{att.work_hours}</td>
                          <td className="py-4 px-4">
                            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold">
                              {att.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {!att.punch_out && (
                              <button
                                type="button"
                                onClick={() => handleRegularizeAttendance(att.id)}
                                className="rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                              >
                                Regularize
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB: HR HELPDESK TICKETS ================= */}
            {activeTab === "tickets" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Employee Helpdesk Tickets</h3>
                  <p className="text-sm sm:text-base text-slate-500 mt-1">Grievances, payroll inquiries, and hardware requests submitted by staff members.</p>
                </div>

                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">{t.category}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-sm text-slate-500 font-medium">{t.created_at}</span>
                            <span className={`text-xs rounded-full px-3 py-0.5 font-bold ${
                              t.priority === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">{t.subject}</h4>
                          <p className="text-sm sm:text-base text-slate-700 mt-1.5 leading-relaxed">{t.description}</p>
                          <p className="text-sm text-slate-500 mt-2">Submitted by: <strong className="text-slate-800">{t.employee_name}</strong> ({t.emp_id})</p>
                        </div>

                        <div className="flex flex-col items-end gap-2.5">
                          <span className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold ${
                            t.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {t.status}
                          </span>
                          {t.status !== "Resolved" && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTicketResponseModal(t);
                                setTicketResponseText(t.hr_response || "");
                              }}
                              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                            >
                              Respond &amp; Resolve
                            </button>
                          )}
                        </div>
                      </div>

                      {t.hr_response && (
                        <div className="pt-3.5 border-t border-slate-100 flex items-start gap-3 bg-emerald-50/70 border border-emerald-200/70 p-4 rounded-xl">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-emerald-800">HR Resolution Note:</span>
                            <p className="text-sm sm:text-base text-slate-800 mt-1">{t.hr_response}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: EMAIL TRACKING & COMMUNICATIONS ================= */}
            {activeTab === "emails" && (
              <div className="space-y-6">
                {/* Header with Zoho Mail, Refresh Tracking, and Compose Button */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-[#f96706]" />
                        Candidate Communications &amp; Email Open Tracking
                      </h3>
                      <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                        1x1 Pixel Detection
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Authorized HR correspondence desk for candidate outreach with real-time open detection and chronological engagement timeline.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href="https://mail.zoho.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#f96706] bg-white px-4 py-2 text-xs font-bold text-[#16133d] shadow-xs transition-all hover:bg-[#f96706] hover:text-white"
                      title="Open Zoho Mail Web Client in new tab"
                    >
                      <Mail className="h-4 w-4 text-[#f96706] group-hover:text-white transition-colors" />
                      <span>Zoho Mail</span>
                      <ExternalLink className="h-3 w-3 opacity-70 group-hover:text-white transition-colors" />
                    </a>

                    <button
                      type="button"
                      onClick={() => loadCandidateEmails(emailStatusFilter)}
                      disabled={isRefreshingEmails}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50"
                      title="Reload tracking telemetry"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRefreshingEmails ? "animate-spin" : ""}`} />
                      <span>Refresh Tracking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsComposeEmailModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2c1b4d] via-[#4d2454] to-[#a23d26] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#2c1b4d]/20 transition-all hover:opacity-95"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Compose Candidate Email</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-slate-600">Total Emails Dispatched</span>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{mailStats.total_sent || candidateEmails.length}</p>
                    <span className="text-xs sm:text-sm text-indigo-600 font-semibold mt-1 block">100% Delivered</span>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-emerald-800">Verified Opens</span>
                    <p className="text-3xl font-extrabold text-emerald-700 mt-1">{mailStats.total_opened}</p>
                    <span className="text-xs sm:text-sm text-emerald-600 font-semibold mt-1 block">Live Pixel Requests</span>
                  </div>

                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-cyan-800">Candidate Open Rate</span>
                    <p className="text-3xl font-extrabold text-cyan-800 mt-1">{mailStats.open_rate}%</p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full" style={{ width: `${Math.min(100, mailStats.open_rate || 0)}%` }} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-amber-800">Awaiting Candidate Open</span>
                    <p className="text-3xl font-extrabold text-amber-800 mt-1">{mailStats.total_unopened}</p>
                    <span className="text-xs sm:text-sm text-amber-600 font-semibold mt-1 block">Pixel Not Yet Pinged</span>
                  </div>
                </div>

                {/* Privacy & Pixel Note Banner */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-sm text-slate-700 flex items-start gap-3.5">
                  <Activity className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-1 text-sm sm:text-base font-bold">Live Pixel Telemetry &amp; Privacy Standards</strong>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Open tracking embeds an invisible 1x1 GIF (<code className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-xs">/api/hr/track/open/:trackingId</code>). When candidate mail clients download images, a real-time HTTP GET request registers timestamp, client user-agent, and view frequency.
                    </p>
                  </div>
                </div>

                {/* Filters, Search & Secondary Zoho Mail Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search candidate, email, or subject..."
                      value={emailSearchQuery}
                      onChange={(e) => setEmailSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEmailStatusFilter("all")}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                          emailStatusFilter === "all"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        All Emails ({candidateEmails.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailStatusFilter("opened")}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                          emailStatusFilter === "opened"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Opened ({mailStats.total_opened})
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailStatusFilter("unopened")}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                          emailStatusFilter === "unopened"
                            ? "bg-amber-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Awaiting Open ({mailStats.total_unopened})
                      </button>
                    </div>

                    <a
                      href="https://mail.zoho.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group hidden sm:inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#f96706] bg-white px-4 py-1.5 text-sm font-bold text-[#16133d] shadow-2xs transition-all hover:bg-[#f96706] hover:text-white"
                      title="Redirect to Zoho Mail Web Client"
                    >
                      <Mail className="h-4 w-4 text-[#f96706] group-hover:text-white transition-colors" />
                      <span>Zoho Mail</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>

                {/* Candidate Communications Table matching Photo 3 */}
                <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs sm:text-sm font-bold tracking-wider">
                        <tr>
                          <th className="py-4 px-4 font-bold">CANDIDATE</th>
                          <th className="py-4 px-4 font-bold">EMAIL SUBJECT</th>
                          <th className="py-4 px-4 font-bold">DELIVERY STATUS</th>
                          <th className="py-4 px-4 font-bold">OPEN STATUS</th>
                          <th className="py-4 px-4 font-bold">DETECTED OPENS</th>
                          <th className="py-4 px-4 font-bold">FIRST / LAST OPEN</th>
                          <th className="py-4 px-4 font-bold">DISPATCHED BY</th>
                          <th className="py-4 px-4 font-bold text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {candidateEmails
                          .filter((em) => {
                            const q = emailSearchQuery.toLowerCase();
                            const matchesSearch =
                              !q ||
                              (em.candidate_name && em.candidate_name.toLowerCase().includes(q)) ||
                              (em.candidate_email && em.candidate_email.toLowerCase().includes(q)) ||
                              (em.subject && em.subject.toLowerCase().includes(q)) ||
                              (em.tracking_id && em.tracking_id.toLowerCase().includes(q));

                            let matchesFilter = true;
                            if (emailStatusFilter === "opened") {
                              matchesFilter = em.open_status === "Opened" || em.open_count > 0;
                            } else if (emailStatusFilter === "unopened") {
                              matchesFilter = em.open_status !== "Opened" && (!em.open_count || em.open_count === 0);
                            }
                            return matchesSearch && matchesFilter;
                          })
                          .map((email) => {
                            const isOpened = email.open_status === "Opened" || (email.open_count && email.open_count > 0);
                            const initials = (email.candidate_name || "C")
                              .split(" ")
                              .filter(Boolean)
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase() || "C";

                            return (
                              <tr key={email.tracking_id || email.id} className="hover:bg-slate-50/70 transition-colors">
                                {/* Column 1: Candidate */}
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f96706] to-[#d65202] text-xs font-bold text-white shadow-2xs">
                                      {initials}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                                        {email.candidate_name || "Applicant"}
                                      </div>
                                      <div className="text-sm text-slate-500 leading-tight mt-0.5">
                                        {email.candidate_email}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Column 2: Subject */}
                                <td className="py-4 px-4 max-w-[260px]">
                                  <div className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight" title={email.subject}>
                                    {email.subject}
                                  </div>
                                  <div className="text-sm text-slate-500 truncate leading-tight mt-0.5" title={email.body_snippet}>
                                    {email.body_snippet || (email.body_html ? email.body_html.replace(/<[^>]*>/g, "").slice(0, 65) : "Direct outreach with pixel...")}
                                  </div>
                                </td>

                                {/* Column 3: Delivery Status */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                    Delivered
                                  </span>
                                </td>

                                {/* Column 4: Open Status */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  {email.tracking_enabled === 0 ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs sm:text-sm font-medium text-slate-600">
                                      Tracking Off
                                    </span>
                                  ) : isOpened ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs sm:text-sm font-bold text-emerald-700">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                      Opened ({email.open_count || 1}x)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3.5 py-1 text-xs sm:text-sm font-bold text-amber-700">
                                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                                      Awaiting Open
                                    </span>
                                  )}
                                </td>

                                {/* Column 5: Detected Opens */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className={`text-sm sm:text-base font-bold ${isOpened ? "text-emerald-700" : "text-slate-400 font-medium"}`}>
                                    {email.open_count || 0} {(email.open_count === 1) ? "read" : "reads"}
                                  </span>
                                </td>

                                {/* Column 6: First / Last Open */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  {email.first_opened_at ? (
                                    <div className="text-xs sm:text-sm">
                                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                        <Eye className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                        <span>{email.first_opened_at}</span>
                                      </div>
                                      {email.last_opened_at && email.last_opened_at !== email.first_opened_at && (
                                        <div className="text-xs text-slate-500 mt-0.5">
                                          Latest: {email.last_opened_at}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-sm italic">—</span>
                                  )}
                                </td>

                                {/* Column 7: Dispatched By */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <div className="text-xs sm:text-sm text-slate-500">
                                    {email.created_at || "Recent"}
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-[#f96706] truncate max-w-[160px]">
                                    {email.sender_name || "Priya Sharma (HR)"}
                                  </div>
                                </td>

                                {/* Column 8: Actions */}
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setEmailPreviewModal(email)}
                                      className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-white hover:bg-orange-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#f96706] transition-colors shadow-2xs"
                                      title="View correspondence"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEmailPreviewModal({ ...email, isTimeline: true })}
                                      className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-white hover:bg-sky-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-sky-700 transition-colors shadow-2xs"
                                      title="View engagement timeline"
                                    >
                                      <Clock className="h-3.5 w-3.5" />
                                      Timeline
                                    </button>
                                    {email.tracking_enabled !== 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSimulateEmailOpen(email)}
                                        className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-amber-700 transition-colors"
                                        title="Simulate candidate open event (triggers 1x1 GIF)"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
                  userRole="hr"
                  onAskHr={(holidayName) => {
                    setEmailToast(`HR memo active & broadcasted for ${holidayName}.`);
                    setTimeout(() => setEmailToast(null), 3500);
                  }}
                  onDateClick={({ formatted, holiday }) => {
                    if (holiday) {
                      setEmailToast(`Selected holiday: ${holiday.name} (${formatted})`);
                    } else {
                      setEmailToast(`Notice: ${formatted} marked as active working shift.`);
                    }
                    setTimeout(() => setEmailToast(null), 3000);
                  }}
                />
              </div>
            )}
        </div>
  );

  return (
    <>
      <Seo
        title={
          isEmployeeSubpage
            ? "Employee Workspace — HR Operations Portal"
            : isClientSubpage
            ? "Client Workspace — HR Operations Portal"
            : "HR Operations Portal — Zyllo Tech"
        }
        description="HR talent management, headcount tracking, leave approvals, and employee helpdesk administration."
      />

      {insideAdmin ? (
        <div className="space-y-6">
          {/* Greetings Hero Banner matching Photo 2 */}
          <PortalHeroBanner
            greeting="Good afternoon, Priya"
            subtitle="HR talent management, headcount tracking, and leave approvals desk"
            stats={[
              { value: employees.length, label: "Staff Headcount" },
              { value: pendingLeaves.length, label: "Pending Leaves" },
              { value: attendance.length, label: "Attendance" },
            ]}
            onRefresh={loadCandidateEmails}
          />

          {/* First photo items displayed on down of greetings in horizontal row (Photo 1) */}
          {hrHorizontalTabBar}

          {/* Down it should open: Active tab view */}
          {renderTabContent}
        </div>
      ) : (
        <PortalShell
          portalName={isEmployeeSubpage ? "Employee Workspace" : isClientSubpage ? "Client Workspace" : "HR Operations"}
          portalId="hr"
          user={{ name: "Priya Sharma", email: "hr@zyllotech.com", role: "hr" }}
          navSections={hrNavSections}
          activeTab={currentActiveTab}
          onTabChange={handleTabChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search employees, leaves, candidates..."
        >
          {isEmployeeSubpage ? (
            <div className="w-full">
              <EmployeePortal insideAdmin={true} />
            </div>
          ) : isClientSubpage ? (
            <div className="w-full">
              <ClientPortal insideAdmin={true} />
            </div>
          ) : (
            renderTabContent
          )}
        </PortalShell>
      )}

        {/* ================= MODAL: ADD EMPLOYEE ================= */}
        {isAddEmpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-indigo-600" />
                  Register New Employee
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddEmpModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newEmpForm.full_name}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, full_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@zyllotech.com"
                      value={newEmpForm.email}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98480 12345"
                      value={newEmpForm.phone}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Pod</label>
                    <select
                      value={newEmpForm.department}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Engineering & Applied AI Pod">Engineering & Applied AI</option>
                      <option value="Frontend & Design Pod">Frontend & Design</option>
                      <option value="Cloud & Infrastructure Pod">Cloud & Infrastructure</option>
                      <option value="Quality Engineering Pod">Quality Engineering</option>
                      <option value="Mobile App Pod">Mobile App Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Software Engineer"
                      value={newEmpForm.designation}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, designation: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location</label>
                  <input
                    type="text"
                    value={newEmpForm.work_location}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, work_location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddEmpModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-md"
                  >
                    Register Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: RESPOND TO TICKET ================= */}
        {activeTicketResponseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  Respond & Resolve HR Ticket
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTicketResponseModal(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <p><span className="text-slate-500">Employee:</span> <strong className="text-slate-900">{activeTicketResponseModal.employee_name}</strong></p>
                <p><span className="text-slate-500">Subject:</span> <strong className="text-slate-900">{activeTicketResponseModal.subject}</strong></p>
                <p className="mt-1 text-slate-600">{activeTicketResponseModal.description}</p>
              </div>

              <form onSubmit={handleResolveTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">HR Resolution Note</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detail the steps taken, dispatch tracking number, or resolution feedback..."
                    value={ticketResponseText}
                    onChange={(e) => setTicketResponseText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTicketResponseModal(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md"
                  >
                    Resolve Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: COMPOSE CANDIDATE EMAIL ================= */}
                {/* ================= MODAL: COMPOSE CANDIDATE EMAIL MATCHING PHOTO 4 ================= */}
        {isComposeEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 my-8 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-[#f96706] shadow-2xs">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Compose Candidate Communication
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Official recruitment communication with transparent open detection
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComposeEmailModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSendCandidateEmail} className="space-y-4">
                {/* Row 1: Select Candidate & Template */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select Existing Candidate (From Database)
                    </label>
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => handleSelectCandidate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                    >
                      <option value="">-- Choose Candidate or type manually below --</option>
                      {CANDIDATE_DATABASE.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.role})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pulls directly from applicant database with applied role.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message Template
                    </label>
                    <select
                      value={selectedTemplateKey}
                      onChange={(e) => handleSelectTemplate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                    >
                      <option value="custom">Custom Message (Blank)</option>
                      <option value="interview">Interview Invitation (Round 1)</option>
                      <option value="shortlist">Shortlisted Candidate Sync</option>
                      <option value="offer">Offer Letter &amp; Statutory Compensation</option>
                      <option value="rejection">Application Status Update</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Quickly fill subject and standard HR template.
                    </p>
                  </div>
                </div>

                {/* Row 2: Candidate Name & Recipient Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Candidate Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun Verma"
                      value={composeEmailForm.candidate_name}
                      onChange={(e) => setComposeEmailForm({ ...composeEmailForm, candidate_name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recipient Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="candidate@example.com"
                      value={composeEmailForm.candidate_email}
                      onChange={(e) => setComposeEmailForm({ ...composeEmailForm, candidate_email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                    />
                  </div>
                </div>

                {/* Row 3: Email Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next Steps in Your Application with Zyllo Tech"
                    value={composeEmailForm.subject}
                    onChange={(e) => setComposeEmailForm({ ...composeEmailForm, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                  />
                </div>

                {/* Row 4: Message Body (HTML Formatted) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Message Body (HTML Formatted) *
                    </label>
                    <span className="text-[11px] font-semibold text-[#f96706] flex items-center gap-1">
                      &lt;/&gt; Supports HTML &amp; styled text
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    placeholder="Type message body or pick a template above..."
                    value={composeEmailForm.message}
                    onChange={(e) => setComposeEmailForm({ ...composeEmailForm, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                  />
                </div>

                {/* Row 5: Attachment Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attachment Reference or File Link (Optional)
                  </label>
                  <div className="relative">
                    <Paperclip className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Job_Description_Senior_FullStack.pdf or URL"
                      value={composeEmailForm.attachment_ref || ""}
                      onChange={(e) => setComposeEmailForm({ ...composeEmailForm, attachment_ref: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:outline-none focus:ring-1 focus:ring-[#f96706]"
                    />
                  </div>
                </div>

                {/* Row 6: Tracking Pixel Card with Switch Toggle matching Photo 4 */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#f96706]" />
                      <span className="text-xs font-bold text-slate-900">
                        Enable Real-time Open Tracking Pixel (1x1 GIF)
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={composeEmailForm.tracking_enabled}
                      onClick={() => setComposeEmailForm((prev) => ({ ...prev, tracking_enabled: !prev.tracking_enabled }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        composeEmailForm.tracking_enabled ? "bg-[#f96706]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          composeEmailForm.tracking_enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    When enabled, injects an invisible tracking pixel to record when the candidate opens the message in their mail reader. Also appends Zyllo Tech HR's confidentiality disclosure.
                  </p>
                </div>

                {/* Footer Buttons Matching Photo 4 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsComposeEmailModalOpen(false)}
                      className="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      Cancel
                    </button>
                    <a
                      href="https://mail.zoho.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-[#f96706] hover:bg-orange-100 transition-colors shadow-2xs"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#f96706]" />
                      <span>Zoho Mail</span>
                      <ExternalLink className="h-3 w-3 text-[#f96706]" />
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2e1d4e] hover:bg-[#3d2766] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Candidate Email</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: PREVIEW EMAIL CORRESPONDENCE & TIMELINE ================= */}
        {emailPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl flex flex-col max-h-[85vh] text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {emailPreviewModal.isTimeline ? (
                      <>
                        <Clock className="h-4 w-4 text-sky-600" />
                        Candidate Engagement Timeline
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 text-[#f96706]" />
                        Candidate Email Correspondence
                      </>
                    )}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Tracking ID: {emailPreviewModal.tracking_id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailPreviewModal(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Email Meta Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4 text-xs space-y-1">
                <div><span className="text-slate-500">To:</span> <strong className="text-slate-900">{emailPreviewModal.candidate_name} &lt;{emailPreviewModal.candidate_email}&gt;</strong></div>
                <div><span className="text-slate-500">Subject:</span> <strong className="text-slate-900">{emailPreviewModal.subject}</strong></div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">
                    Status: {emailPreviewModal.open_status === "Opened" || (emailPreviewModal.open_count > 0) ? `✓ Opened (${emailPreviewModal.open_count || 1} views)` : "⏳ Awaiting Open"}
                  </span>
                  <span className="text-emerald-700 font-semibold">1x1 GIF Tracking Pixel Active</span>
                </div>
              </div>

              {emailPreviewModal.isTimeline ? (
                /* Timeline View */
                <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Email Dispatched to Candidate</div>
                      <div className="text-[11px] text-slate-500">{emailPreviewModal.created_at || "Recent dispatch"}</div>
                      <div className="text-[11px] text-[#f96706] font-semibold mt-0.5">By {emailPreviewModal.sender_name || "Priya Sharma (HR Operations)"}</div>
                    </div>
                  </div>

                  {emailPreviewModal.first_opened_at ? (
                    <>
                      <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-xs mt-0.5">
                          👁
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">First Verified Open Detected</div>
                          <div className="text-[11px] text-emerald-700 font-semibold">{emailPreviewModal.first_opened_at}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">1x1 transparent tracking pixel GET request validated.</div>
                        </div>
                      </div>

                      {emailPreviewModal.last_opened_at && emailPreviewModal.last_opened_at !== emailPreviewModal.first_opened_at && (
                        <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mt-0.5">
                            ↻
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Latest Repeat Read Event</div>
                            <div className="text-[11px] text-indigo-700 font-semibold">{emailPreviewModal.last_opened_at}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">Total engagement count: {emailPreviewModal.open_count} reads.</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-xs mt-0.5">
                        ⏳
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-900">Awaiting Candidate Open</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Candidate has not yet loaded images or opened this email. Click "Simulate Open" below to trigger tracking pixel telemetry.</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Email Body */
                <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 text-neutral-800 text-xs shadow-inner">
                  {emailPreviewModal.body_html ? (
                    <div dangerouslySetInnerHTML={{ __html: emailPreviewModal.body_html }} />
                  ) : (
                    <p>{emailPreviewModal.body_text || "No message body."}</p>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    handleSimulateEmailOpen(emailPreviewModal);
                    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
                    setEmailPreviewModal({
                      ...emailPreviewModal,
                      open_status: "Opened",
                      open_count: (emailPreviewModal.open_count || 0) + 1,
                      first_opened_at: emailPreviewModal.first_opened_at || now,
                      last_opened_at: now,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 text-xs font-bold text-amber-800 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-amber-600" />
                  Simulate Candidate Open Event
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailPreviewModal({ ...emailPreviewModal, isTimeline: !emailPreviewModal.isTimeline })}
                    className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    {emailPreviewModal.isTimeline ? "View Email Message" : "View Engagement Timeline"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailPreviewModal(null)}
                    className="rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= FLOATING TOAST ================= */}
        {emailToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-900 shadow-2xl animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{emailToast}</span>
          </div>
        )}
    </>
  );
}
