"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Link from "@/lib/nx/link";
import Seo from "@/components/Seo";
import PortalShell from "@/components/PortalShell";
import PortalHeroBanner from "@/components/PortalHeroBanner";
import PortalKpiCard from "@/components/PortalKpiCard";
import EmployeePortal from "./EmployeePortal";
import {
  INITIAL_PROJECTS,
  INITIAL_MILESTONES,
  INITIAL_DELIVERABLES,
  INITIAL_MEETING_NOTES,
  INITIAL_CLIENT_TICKETS,
  INITIAL_CLIENT_INQUIRIES,
  getStoredData,
  setStoredData,
} from "@/data/portalData";
import {
  getStoredTrackerProjects,
  updateProjectStatusSync,
  uploadProjectBackupSync,
  updateProjectHostingSync,
} from "@/data/projectTrackerData";
import {
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  FolderGit2,
  Headphones,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Mic,
  Pause,
  Pencil,
  Play,
  Plus,
  Rocket,
  ShieldAlert,
  Sliders,
  Sparkles,
  Users,
  Volume2,
  X,
  Phone,
  Mail,
  ArrowRight,
  Upload,
  HardDrive,
  Server,
  Globe,
  Database,
  ShieldCheck,
  FileArchive,
  Activity,
  FileUp,
  Search,
} from "lucide-react";

export default function ClientPortal({ insideAdmin = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployeeSubpage = location.pathname.includes("/portal/employee");

  const [activeTab, setActiveTab] = useState("overview"); // overview | projects | milestones | deliverables | notes | tickets | inquiries | team
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [meetingNotes, setMeetingNotes] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Ticket modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Technical / API",
    priority: "Normal",
    message: "",
  });

  useEffect(() => {
    const trackerProjects = getStoredTrackerProjects();
    setProjects(trackerProjects);
    setMilestones(getStoredData("zyllotech_portal_milestones", INITIAL_MILESTONES));
    setDeliverables(getStoredData("zyllotech_portal_deliverables", INITIAL_DELIVERABLES));
    setMeetingNotes(getStoredData("zyllotech_portal_meeting_notes", INITIAL_MEETING_NOTES));
    setTickets(getStoredData("zyllotech_portal_client_tickets", INITIAL_CLIENT_TICKETS));
    setInquiries(getStoredData("zyllotech_portal_client_inquiries", INITIAL_CLIENT_INQUIRIES));

    const handleSync = () => {
      setProjects(getStoredTrackerProjects());
    };
    window.addEventListener("zyllotech_projects_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("zyllotech_projects_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  function handleCreateTicket(e) {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;

    const newTicket = {
      id: Date.now(),
      client_email: "user@zyllotech.com",
      client_name: "Alex Morgan",
      project_id: selectedProjectId || (projects[0] && projects[0].id) || "aims",
      subject: ticketForm.subject.trim(),
      category: ticketForm.category,
      priority: ticketForm.priority,
      message: ticketForm.message.trim(),
      status: "In Progress",
      admin_response: "Acknowledged by engineering team. Investigating SLA metrics.",
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    setStoredData("zyllotech_portal_client_tickets", updated);
    setIsTicketModalOpen(false);
    setTicketForm({ subject: "", category: "Technical / API", priority: "Normal", message: "" });
  }

  // Project status update modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("aims");
  const [statusForm, setStatusForm] = useState({
    status: "In Progress",
    progress: 80,
    completion_date: "Nov 2026",
    note: "",
    add_to_notes: true,
  });
  const [statusToast, setStatusToast] = useState("");

  // Backup file upload states
  const [isUploadBackupModalOpen, setIsUploadBackupModalOpen] = useState(false);
  const [uploadBackupProject, setUploadBackupProject] = useState(null);
  const [backupUploadForm, setBackupUploadForm] = useState({
    fileName: "",
    fileSize: "",
    backupWhere: "AWS S3 Vault (ap-south-1)",
    notes: "",
    selectedFile: null,
  });
  const [isUploadingBackup, setIsUploadingBackup] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter & Search states for Active Projects tab
  const [projectFilter, setProjectFilter] = useState("All"); // All | In Progress | Completed
  const [projectSearch, setProjectSearch] = useState("");

  // Hosting & infrastructure details modal states
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  const [hostingModalProject, setHostingModalProject] = useState(null);
  const [hostingModalTab, setHostingModalTab] = useState("specs"); // "specs" | "edit"

  // Edit Hosting Modal states
  const [isEditHostingModalOpen, setIsEditHostingModalOpen] = useState(false);
  const [editHostingProject, setEditHostingProject] = useState(null);
  const [hostingEditForm, setHostingEditForm] = useState({
    hosted: true,
    hostingStatus: "Hosted & Active (Production Cluster)",
    domainName: "",
    hostedUrl: "",
    customDomain: "",
    hostingProvider: "AWS EC2 Cluster + CloudFront CDN",
    serverRegion: "AWS ap-south-1 (Mumbai Region)",
    serverIp: "13.234.112.89",
    domainExpiryDate: "Oct 14, 2028",
    domainAutoRenew: true,
    domainRegistrar: "AWS Route 53",
    sslStatus: "Active & Secure (Let's Encrypt Wildcard 256-bit)",
    sslExpiryDate: "Auto-renews every 90 days",
    uptime: "99.98% High Availability SLA",
    latency: "18ms Average",
    note: "",
  });

  // Wispr Flow Notes States
  const [selectedWisprNote, setSelectedWisprNote] = useState(null);
  const [isLinkWisprModalOpen, setIsLinkWisprModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState("1.0x");
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [wisprNoteForm, setWisprNoteForm] = useState({
    project_id: "aims",
    title: "",
    meeting_date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    attendees: "Alex Morgan (Client), Solutions Architect",
    wispr_flow_url: "https://wisprflow.ai/notes/",
    wispr_flow_id: "",
    audio_duration: "32 min 40 sec",
    summary: "",
    action_items: "",
  });

  function handleLinkWisprNote(e) {
    e.preventDefault();
    if (!wisprNoteForm.title.trim()) return;

    const newNote = {
      id: Date.now(),
      project_id: wisprNoteForm.project_id || "aims",
      client_email: "user@zyllotech.com",
      title: wisprNoteForm.title.trim(),
      meeting_date: wisprNoteForm.meeting_date || new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      attendees: wisprNoteForm.attendees.trim() || "Client Stakeholders, Pod Lead",
      summary: wisprNoteForm.summary.trim() || "Voice note transcribed and summarized by Wispr Flow AI.",
      action_items: wisprNoteForm.action_items.trim() || "Review Wispr Flow transcript and execute sprint priorities.",
      wispr_flow_url: wisprNoteForm.wispr_flow_url.trim() || "https://wisprflow.ai",
      wispr_flow_id: wisprNoteForm.wispr_flow_id.trim() || `WF-${Date.now().toString().slice(-6)}`,
      audio_duration: wisprNoteForm.audio_duration || "32 min",
      ai_confidence: "99.4% STT Accuracy",
      transcript_snippets: [
        { time: "00:02", speaker: "Meeting Host", text: wisprNoteForm.summary.trim() || "Meeting transcribed via Wispr Flow integration." },
        { time: "14:10", speaker: "Engineering Lead", text: wisprNoteForm.action_items.trim() || "Approved action items recorded and scheduled." },
      ],
    };

    const updated = [newNote, ...meetingNotes];
    setMeetingNotes(updated);
    setStoredData("zyllotech_portal_meeting_notes", updated);
    setIsLinkWisprModalOpen(false);
    setStatusToast("Meeting note linked to Wispr Flow successfully!");
    setTimeout(() => setStatusToast(""), 4500);

    setWisprNoteForm({
      project_id: "aims",
      title: "",
      meeting_date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      attendees: "Alex Morgan (Client), Solutions Architect",
      wispr_flow_url: "https://wisprflow.ai/notes/",
      wispr_flow_id: "",
      audio_duration: "32 min 40 sec",
      summary: "",
      action_items: "",
    });
  }

  function getStatusBadgeStyle(status) {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Testing":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Active":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "On Hold":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Review Pending":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "In Progress":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  function openStatusModal(proj) {
    const targetProject = proj || projects[0] || {};
    const projId = targetProject.id || (projects[0] && projects[0].id) || "aims";
    setSelectedProjectId(projId);
    setStatusForm({
      status: targetProject.status || (targetProject.details?.completed ? "Completed" : "In Progress"),
      progress: targetProject.progress ?? targetProject.details?.progress ?? 50,
      completion_date: targetProject.completion_date || targetProject.details?.completionDate || "Nov 2026",
      note: targetProject.last_update_note || "",
      add_to_notes: true,
    });
    setIsStatusModalOpen(true);
  }

  function handleSelectProject(id) {
    setSelectedProjectId(id);
    const proj = projects.find((p) => String(p.id) === String(id));
    if (proj) {
      setStatusForm({
        status: proj.status || (proj.details?.completed ? "Completed" : "In Progress"),
        progress: proj.progress ?? proj.details?.progress ?? 50,
        completion_date: proj.completion_date || proj.details?.completionDate || "Nov 2026",
        note: proj.last_update_note || "",
        add_to_notes: true,
      });
    }
  }

  function handleUpdateProjectStatus(e) {
    e.preventDefault();
    const updatedProjects = updateProjectStatusSync(selectedProjectId, statusForm);
    setProjects(updatedProjects);

    // Optional: Log status update to Sprint Meeting Notes
    if (statusForm.note.trim() && statusForm.add_to_notes) {
      const activeProj = updatedProjects.find((p) => String(p.id) === String(selectedProjectId));
      const projName = activeProj ? (activeProj.title || activeProj.fullName || activeProj.name) : "Client Project";
      const newNote = {
        id: Date.now(),
        project_id: selectedProjectId,
        client_email: "user@zyllotech.com",
        title: `Status Update: ${projName} → ${statusForm.status} (${statusForm.progress}%)`,
        meeting_date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        attendees: "Client PM, Tech Pod Lead, Agile Coach",
        summary: statusForm.note.trim(),
        action_items: `Status set to ${statusForm.status}. Target completion: ${statusForm.completion_date}.`,
      };
      const updatedNotes = [newNote, ...meetingNotes];
      setMeetingNotes(updatedNotes);
      setStoredData("zyllotech_portal_meeting_notes", updatedNotes);
    }

    setIsStatusModalOpen(false);
    setStatusToast(`Project status updated to "${statusForm.status}" (${statusForm.progress}%)! Reflected in Project Tracker.`);
    setTimeout(() => setStatusToast(""), 4500);
  }

  function openUploadBackupModal(proj) {
    const target = proj || projects[0] || {};
    setUploadBackupProject(target);
    const defaultVault = target.details?.backupWhere?.split("&")[0]?.trim() || "AWS S3 Vault (ap-south-1)";
    setBackupUploadForm({
      fileName: "",
      fileSize: "",
      backupWhere: defaultVault,
      notes: "",
      selectedFile: null,
    });
    setUploadProgress(0);
    setIsUploadingBackup(false);
    setIsUploadBackupModalOpen(true);
  }

  function handleBackupFileSelect(file) {
    if (!file) return;
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setBackupUploadForm((prev) => ({
      ...prev,
      selectedFile: file,
      fileName: file.name,
      fileSize: Number(sizeInMb) < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeInMb} MB`,
    }));
  }

  function handleUploadBackupSubmit(e) {
    e.preventDefault();
    if (!uploadBackupProject) return;

    setIsUploadingBackup(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const targetFileName = backupUploadForm.fileName.trim() || `backup-${uploadBackupProject.id}-${new Date().toISOString().slice(0, 10)}.tar.gz`;
      const targetFileSize = backupUploadForm.fileSize.trim() || "24.5 MB Encrypted";

      const updated = uploadProjectBackupSync(uploadBackupProject.id, {
        fileName: targetFileName,
        fileSize: targetFileSize,
        backupWhere: backupUploadForm.backupWhere,
        notes: backupUploadForm.notes,
        uploader: "Client Workspace",
      });

      setProjects(updated);
      setIsUploadingBackup(false);
      setIsUploadBackupModalOpen(false);
      setStatusToast(`Backup archive "${targetFileName}" uploaded and verified successfully!`);
      setTimeout(() => setStatusToast(""), 5000);
    }, 850);
  }

  function cleanDisplayDomain(domain) {
    if (!domain) return "";
    return domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }

  function cleanHostingProvider(provider) {
    if (!provider) return "AWS EC2 Cluster";
    if (provider.includes("CloudFront")) return "AWS + CloudFront CDN";
    if (provider.includes("GCP") || provider.includes("Google")) return "Google Cloud";
    if (provider.includes("Azure")) return "Microsoft Azure";
    if (provider.includes("DigitalOcean")) return "DigitalOcean";
    return provider.split("+")[0].trim();
  }

  function cleanBackupVaultName(vault) {
    if (!vault) return "AWS S3 Vault";
    return vault.split("&")[0].trim();
  }

  function cleanBackupTime(timeStr) {
    if (!timeStr) return "Today 03:00 AM";
    if (timeStr.includes("Just now")) return "Just now (Verified)";
    if (timeStr.includes("Today")) return "Today 03:00 AM";
    return timeStr.split("(")[0].trim();
  }

  function cleanShortDate(dateStr) {
    if (!dateStr) return "Oct 2028";
    const parts = dateStr.split(" ");
    if (parts.length >= 3) {
      const month = parts[0].substring(0, 3);
      const year = parts[parts.length - 1];
      return `${month} ${year}`;
    }
    return dateStr;
  }

  function openHostingModal(proj, tab = "specs") {
    const target = proj || projects[0] || {};
    setHostingModalProject(target);
    setEditHostingProject(target);
    setHostingModalTab(tab);
    setHostingEditForm({
      hosted: target.details?.hosted !== undefined ? target.details.hosted : true,
      hostingStatus:
        target.details?.hostingStatus ||
        (target.details?.hosted ? "Hosted & Active (Production Cluster)" : "Staging & Pre-deployment"),
      domainName: target.details?.domainName || `${target.id || "project"}.zyllotech.com`,
      hostedUrl:
        target.details?.hostedUrl ||
        (target.details?.domainName ? `https://${target.details.domainName}` : `https://${target.id || "project"}.zyllotech.com`),
      customDomain: target.details?.customDomain || "",
      hostingProvider: target.details?.hostingProvider || "AWS EC2 Cluster + CloudFront CDN",
      serverRegion: target.details?.serverRegion || "AWS ap-south-1 (Mumbai Region)",
      serverIp: target.details?.serverIp || "13.234.112.89",
      domainExpiryDate: target.details?.domainExpiryDate || "Oct 14, 2028",
      domainAutoRenew: target.details?.domainAutoRenew !== undefined ? target.details.domainAutoRenew : true,
      domainRegistrar: target.details?.domainRegistrar || "AWS Route 53",
      sslStatus: target.details?.sslStatus || "Active & Secure (Let's Encrypt Wildcard 256-bit)",
      sslExpiryDate: target.details?.sslExpiryDate || "Auto-renews every 90 days",
      uptime: target.details?.uptime || "99.98% High Availability SLA",
      latency: target.details?.latency || "18ms Average",
      note: "",
    });
    setIsHostingModalOpen(true);
  }

  function openEditHostingModal(proj) {
    openHostingModal(proj, "edit");
  }

  function handleUpdateHostingSubmit(e) {
    e.preventDefault();
    if (!editHostingProject) return;

    const updated = updateProjectHostingSync(editHostingProject.id, hostingEditForm);
    setProjects(updated);
    const updatedProj = updated.find((p) => String(p.id) === String(editHostingProject.id));
    if (updatedProj) {
      setHostingModalProject(updatedProj);
      setEditHostingProject(updatedProj);
    }
    setHostingModalTab("specs");
    setStatusToast(`Hosting configuration for "${editHostingProject.title || editHostingProject.fullName || editHostingProject.name}" updated successfully!`);
    setTimeout(() => setStatusToast(""), 5000);
  }

  const clientNavSections = [
    {
      label: "Project Workspace",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "projects", label: "Active Projects", icon: Briefcase, count: projects.length },
        { id: "milestones", label: "Sprint Milestones", icon: FolderGit2, count: milestones.length },
      ],
    },
    {
      label: "Deliverables & Notes",
      items: [
        { id: "deliverables", label: "Deliverables & Specs", icon: FileCheck, count: deliverables.length },
        { id: "notes", label: "Meeting Notes", icon: FileText, count: meetingNotes.length },
      ],
    },
    {
      label: "Support & Team",
      items: [
        { id: "tickets", label: "Support Tickets", icon: LifeBuoy, count: tickets.length },
        { id: "inquiries", label: "Inquiries & Scopes", icon: MessageSquare, count: inquiries.length },
        { id: "team", label: "Dedicated Pod Team", icon: Users },
      ],
    },
    {
      label: "Workspaces",
      items: [
        { id: "client_employee", label: "Employee Portal", href: "/portal/employee", icon: Clock },
      ],
    },
  ];

  const allClientTabs = clientNavSections
    .filter((s) => s.label !== "Workspaces")
    .flatMap((s) => s.items);

  const currentActiveTab = isEmployeeSubpage ? "client_employee" : activeTab;

  function handleTabChange(tabId) {
    if (isEmployeeSubpage) {
      navigate("/portal");
    }
    setActiveTab(tabId);
  }

  const clientHorizontalTabBar = (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f7fb]/95 backdrop-blur-md border-y border-slate-200/80 shadow-2xs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allClientTabs.map((item) => {
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

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === "Completed" && p.status !== "Completed") return false;
    if (projectFilter === "In Progress" && p.status === "Completed") return false;
    if (projectSearch.trim()) {
      const q = projectSearch.toLowerCase();
      const matchTitle = (p.title || p.fullName || "").toLowerCase().includes(q);
      const matchCategory = (p.category || "").toLowerCase().includes(q);
      const matchDesc = (p.description || "").toLowerCase().includes(q);
      const matchDomain = (p.details?.domainName || "").toLowerCase().includes(q);
      const matchTech = (p.tech_stack || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCategory && !matchDesc && !matchDomain && !matchTech) return false;
    }
    return true;
  });

  const renderClientTabContent = (
    <div className="space-y-6">
      {/* ================= TAB: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {!insideAdmin && (
            <PortalHeroBanner
              greeting="Good afternoon, Alex"
              subtitle="Welcome to your Zyllo Tech Enterprise Client Portal"
              stats={[
                { value: projects.length, label: "Active Projects" },
                { value: `${milestones.filter((m) => m.status === "Completed").length} / ${milestones.length}`, label: "Milestones Done" },
                { value: deliverables.length, label: "Deliverables" },
              ]}
              onRefresh={() => {}}
            />
          )}

              {/* 4 Solid KPI Cards matching photo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <PortalKpiCard
                  icon={Briefcase}
                  label="Active Projects"
                  value={projects.length}
                  hint="100% on schedule"
                  chip={`${projects.length} in sprint`}
                  from="#f7941e"
                  to="#f96706"
                  onClick={() => setActiveTab("projects")}
                />
                <PortalKpiCard
                  icon={FolderGit2}
                  label="Sprint Milestones"
                  value={`${milestones.filter((m) => m.status === "Completed").length} / ${milestones.length}`}
                  hint="Sprint 4 in progress"
                  chip="50% done"
                  from="#1f4693"
                  to="#173a52"
                  onClick={() => setActiveTab("milestones")}
                />
                <PortalKpiCard
                  icon={FileCheck}
                  label="Deliverables Ready"
                  value={deliverables.length}
                  hint="All specs signed"
                  chip={`${deliverables.length} verified`}
                  from="#3089a6"
                  to="#1f6f8b"
                  onClick={() => setActiveTab("deliverables")}
                />
                <PortalKpiCard
                  icon={LifeBuoy}
                  label="Support Tickets"
                  value={tickets.length}
                  hint={`${tickets.filter((t) => t.status === "In Progress").length} in progress`}
                  chip="Support active"
                  from="#173a52"
                  to="#3089a6"
                  onClick={() => setActiveTab("tickets")}
                />
              </div>

              {/* Primary Project Featured Card (Clean White Card) */}
              {projects[0] && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs sm:text-sm font-bold text-[#f96706]">
                          {projects[0].category}
                        </span>
                        <button
                          type="button"
                          onClick={() => openStatusModal(projects[0])}
                          title="Click to update project status"
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs sm:text-sm font-bold transition-all hover:scale-105 cursor-pointer ${getStatusBadgeStyle(projects[0].status)}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current opacity-70 animate-pulse" />
                          {projects[0].status}
                          <Pencil className="h-3 w-3 opacity-60 ml-0.5" />
                        </button>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{projects[0].title}</h3>
                      <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">{projects[0].description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => openUploadBackupModal(projects[0])}
                        className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-2.5 text-sm sm:text-base font-bold text-[#f96706] shadow-2xs hover:bg-orange-100 hover:border-orange-300 transition-all cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Backup
                      </button>
                      <button
                        type="button"
                        onClick={() => openStatusModal(projects[0])}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm sm:text-base font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                      >
                        <Pencil className="h-4 w-4 text-[#f96706]" />
                        Update Status
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("milestones")}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f7941e] to-[#f96706] px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
                      >
                        Sprint Milestones
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm sm:text-base text-slate-700 mb-2">
                      <span className="font-bold">Sprint Completion Progress</span>
                      <span className="font-extrabold text-[#f96706]">{projects[0].progress}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#f96706] to-[#3089a6] transition-all duration-500"
                        style={{ width: `${projects[0].progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Latest Update Note if present */}
                  {projects[0].last_update_note && (
                    <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/50 p-3 text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-[#f96706] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Latest Sprint Update{projects[0].last_updated_at ? ` (${projects[0].last_updated_at})` : ""}:</span>{" "}
                        <span>{projects[0].last_update_note}</span>
                      </div>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {projects[0].tech_stack?.map((tech) => (
                      <span key={tech} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Dedicated Hosted & Infrastructure Details and Backup Vault Section */}
                  <div className="mt-5 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/80 via-white to-orange-50/20 p-4 sm:p-5 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-3 mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f96706]/10 text-[#f96706]">
                          <Server className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                            Cloud Infrastructure &amp; Backup Vault
                          </h4>
                          <p className="text-xs text-slate-500">
                            Production cluster endpoints, domain expiration, and verified archive snapshots
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openHostingModal(projects[0], "specs")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                        >
                          <Server className="h-3.5 w-3.5 text-blue-600" />
                          <span>Hosting Center</span>
                          <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[10px] text-blue-600 font-semibold">Specs &amp; Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openUploadBackupModal(projects[0])}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Upload Backup File
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Box 1: Hosted Details */}
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-blue-600" /> Live Domain &amp; Cluster
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            projects[0].details?.hosted ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {projects[0].details?.hosted ? "Hosted & Active" : "Staging"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <a
                            href={projects[0].details?.hostedUrl || (projects[0].details?.domainName ? `https://${projects[0].details?.domainName}` : "#")}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 group truncate"
                          >
                            <span className="truncate">{projects[0].details?.domainName || "aims.enterprise.zyllotech.com"}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded shrink-0">
                            SSL 256-bit
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[11.5px] text-slate-600 pt-1 border-t border-slate-100 gap-2">
                          <span>
                            Provider: <strong className="text-slate-800">{projects[0].details?.hostingProvider?.split("+")[0] || "AWS EC2 Cluster"}</strong>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">
                              Expires: <strong className="text-slate-800">{projects[0].details?.domainExpiryDate || "Oct 14, 2028"}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => openEditHostingModal(projects[0])}
                              className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                              title="Edit hosting configuration"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Box 2: Cloud Backup Details */}
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <HardDrive className="h-3.5 w-3.5 text-emerald-600" /> Backup Vault &amp; Archive
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold">
                            <ShieldCheck className="h-3 w-3" /> Integrity OK
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                            <Database className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{projects[0].details?.backupWhere?.split("&")[0]?.trim() || "AWS S3 Vault"}</span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                            {projects[0].details?.backupSize || "14.8 GB"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[11.5px] text-slate-600 pt-1 border-t border-slate-100 gap-2">
                          <span className="truncate max-w-[210px]" title={projects[0].details?.lastBackupTime}>
                            Last: <strong className="text-slate-800">{projects[0].details?.lastBackupTime || "Today at 03:00 AM IST"}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => openUploadBackupModal(projects[0])}
                            className="text-[11px] font-bold text-[#f96706] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="h-3 w-3" />
                            Upload New File
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout: Recent Deliverables & Recent Tickets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Deliverables */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-[#f96706]" />
                      Recent Deliverables
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab("deliverables")}
                      className="text-sm font-bold text-[#f96706] hover:underline"
                    >
                      View all &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {deliverables.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                        <div>
                          <p className="text-sm sm:text-base font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{item.deliverable_type} · {item.version}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Support Tickets */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <LifeBuoy className="h-5 w-5 text-[#f96706]" />
                      Active Support Tickets
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tickets")}
                      className="text-sm font-bold text-[#f96706] hover:underline"
                    >
                      View all &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tickets.slice(0, 2).map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-orange-600 uppercase tracking-wider">{item.category}</span>
                          <span className={`text-xs sm:text-sm rounded-full px-3 py-0.5 font-bold ${
                            item.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-slate-900">{item.subject}</p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-1">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: ACTIVE PROJECTS ================= */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Header with Search and Filter Tabs */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      All Client Projects
                    </h3>
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-[#f96706]">
                      {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Enterprise systems contracted and delivered by Zyllo Tech software engineering pods.
                  </p>
                </div>

                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-48 sm:w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-500 focus:border-[#f96706] focus:outline-none shadow-2xs"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    {projectSearch && (
                      <button
                        type="button"
                        onClick={() => setProjectSearch("")}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
                    {["All", "In Progress", "Completed"].map((tab) => {
                      const isSel = projectFilter === tab;
                      const count = tab === "All"
                        ? projects.length
                        : projects.filter((p) => (tab === "Completed" ? p.status === "Completed" : p.status !== "Completed")).length;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setProjectFilter(tab)}
                          className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSel
                              ? "bg-white text-slate-900 shadow-2xs font-bold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <span>{tab}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSel ? "bg-orange-100 text-[#f96706]" : "bg-slate-200 text-slate-600"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Empty state if search or filter has no match */}
              {filteredProjects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">No projects found</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    No projects matched your filter &ldquo;{projectFilter}&rdquo;{projectSearch ? ` or search &ldquo;${projectSearch}&rdquo;` : ""}.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setProjectFilter("All"); setProjectSearch(""); }}
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-orange-50 text-[#c24f05] hover:bg-orange-100 border border-orange-200 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.06),0_1px_2px_-1px_rgba(15,23,42,0.06)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Meta: Category Pill + Interactive Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {proj.category || "Enterprise Software"}
                        </span>
                        <button
                          type="button"
                          onClick={() => openStatusModal(proj)}
                          title="Click to change project status"
                          className={`group/badge inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-2xs ${getStatusBadgeStyle(proj.status)}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 animate-pulse" />
                          <span>{proj.status}</span>
                          <Pencil className="h-2.5 w-2.5 opacity-60 group-hover/badge:opacity-100 transition-opacity ml-0.5" />
                        </button>
                      </div>

                      {/* Project Title & Uniform Clamped Description */}
                      <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-[#f96706] transition-colors tracking-tight line-clamp-1" title={proj.title}>
                        {proj.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed h-10" title={proj.description}>
                        {proj.description}
                      </p>

                      {/* Dual-Widget: Live Deployment & Cloud Backup Vault */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Live Domain & Cluster Tile */}
                        <div
                          onClick={() => openHostingModal(proj, "specs")}
                          className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-2.5 hover:border-blue-300 hover:bg-blue-50/90 transition-all cursor-pointer group/tile flex flex-col justify-between"
                          title="Click to view & edit hosting specifications"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                              <Globe className="h-3 w-3 text-blue-600 shrink-0" />
                              {proj.details?.hosted ? "Live Domain" : "Staging"}
                            </span>
                            <span className="text-[10px] text-blue-700 font-semibold bg-white border border-blue-100 px-1.5 py-0.5 rounded shadow-2xs">
                              {proj.details?.sslStatus ? "SSL 256-bit" : "Active"}
                            </span>
                          </div>
                          <div className="mt-1">
                            <a
                              href={proj.details?.hostedUrl || (proj.details?.domainName ? `https://${proj.details?.domainName}` : "#")}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{cleanDisplayDomain(proj.details?.domainName) || `${proj.id}.zyllotech.com`}</span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0 text-slate-400 group-hover/tile:text-blue-600" />
                            </a>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-600 pt-1 border-t border-blue-100">
                            <span className="truncate">{cleanHostingProvider(proj.details?.hostingProvider)}</span>
                            <span className="font-semibold text-slate-700 shrink-0">Exp: {cleanShortDate(proj.details?.domainExpiryDate)}</span>
                          </div>
                        </div>

                        {/* Backup Vault Tile */}
                        <div
                          onClick={() => openUploadBackupModal(proj)}
                          className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-2.5 hover:border-emerald-300 hover:bg-emerald-50/90 transition-all cursor-pointer group/tile flex flex-col justify-between"
                          title="Click to upload a new backup file"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                              <HardDrive className="h-3 w-3 text-emerald-600 shrink-0" />
                              Backup Vault
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-white border border-emerald-100 px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5">
                              <ShieldCheck className="h-2.5 w-2.5" /> OK
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className="text-xs font-bold text-slate-800 truncate block">
                              {cleanBackupVaultName(proj.details?.backupWhere)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-600 pt-1 border-t border-emerald-100">
                            <span className="truncate">{cleanBackupTime(proj.details?.lastBackupTime)}</span>
                            <span className="font-bold text-emerald-700 shrink-0">{proj.details?.backupSize || "Encrypted"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Consistent 1-Line Latest Update Audit Note */}
                      <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                        <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-800">Latest Note:</strong> {proj.last_update_note || "All systems deployed & active in production cluster."}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Sleek Action Footer */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      {/* Sprint Progress & Target Date Header */}
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                        <span>Sprint Progress</span>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#f96706]">{proj.progress}%</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600">Target: <strong className="text-slate-800">{proj.completion_date}</strong></span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-3.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#f96706] to-[#3089a6] rounded-full transition-all duration-300"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>

                      {/* Clean 3-Action Footer */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {/* Unified Hosting Button (with view & edit) */}
                          <button
                            type="button"
                            onClick={() => openHostingModal(proj, "specs")}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                            title="View and edit hosting specifications"
                          >
                            <Server className="h-3.5 w-3.5 text-blue-600" />
                            <span>Hosting</span>
                            <span className="rounded bg-blue-50 px-1 py-0.2 text-[10px] text-blue-600 font-semibold">Specs &amp; Edit</span>
                          </button>

                          {/* Upload Backup Button */}
                          <button
                            type="button"
                            onClick={() => openUploadBackupModal(proj)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                            title="Upload verified project backup"
                          >
                            <Upload className="h-3.5 w-3.5 text-[#f96706]" />
                            <span>Backup</span>
                          </button>
                        </div>

                        {/* Primary Milestones Action Button */}
                        <button
                          type="button"
                          onClick={() => setActiveTab("milestones")}
                          className="inline-flex items-center gap-1 rounded-lg bg-orange-50 hover:bg-[#f96706] border border-orange-200 hover:border-transparent px-3 py-1.5 text-xs font-bold text-[#f96706] hover:text-white transition-all cursor-pointer shadow-2xs"
                        >
                          <span>Milestones</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: MILESTONES ================= */}
          {activeTab === "milestones" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Sprint Milestones & Timeline</h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1">Sprint roadmaps, deliverables criteria, and production cutover schedule.</p>
              </div>

              <div className="space-y-4">
                {milestones.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        m.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : m.status === "In Progress" ? "bg-orange-50 text-orange-600 border border-orange-200" : "bg-slate-100 text-slate-400"
                      }`}>
                        {m.status === "Completed" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-[#f96706] uppercase tracking-wider">{m.phase}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-sm font-medium text-slate-500">Target: {m.due_date}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{m.title}</h4>
                        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">{m.description}</p>
                      </div>
                    </div>

                    <span className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold shrink-0 ${
                      m.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : m.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-500"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: DELIVERABLES ================= */}
          {activeTab === "deliverables" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Project Deliverables & Artifacts</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Verified architecture specifications, Figma prototypes, builds, and QA audit certificates.</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm">
                      <tr>
                        <th className="py-3.5 px-4">Deliverable Title</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Version</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {deliverables.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">{item.title}</td>
                          <td className="py-4 px-4 text-slate-600">{item.deliverable_type}</td>
                          <td className="py-4 px-4"><span className="rounded bg-slate-100 text-slate-700 px-3 py-1 font-bold text-xs sm:text-sm">{item.version}</span></td>
                          <td className="py-4 px-4">
                            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold">
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 text-slate-700 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

            {/* ================= TAB: MEETING NOTES (LINKED TO WISPR FLOW) ================= */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                      <FileText className="h-6 w-6 text-[#f96706]" />
                      Sprint Meeting Notes &amp; Agendas
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                      Recorded sync minutes, architectural decisions, and AI audio transcripts linked directly to Wispr Flow voice-to-text notetaker.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                    <a
                      href="https://wisprflow.ai"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 px-4 py-2.5 text-xs sm:text-sm font-bold text-purple-800 shadow-2xs transition"
                    >
                      <Mic className="h-4 w-4 text-purple-600 animate-pulse" />
                      Open Wispr Flow
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsLinkWisprModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#f96706] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Link Wispr Flow Note
                    </button>
                  </div>
                </div>

                {/* Wispr Flow Integration Callout Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-5 text-white shadow-md border border-purple-800/40">
                  <div className="absolute right-0 top-0 -mt-6 -mr-6 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        <Headphones className="h-6 w-6" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-purple-400/20 border border-purple-300/30 px-2.5 py-0.5 text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                            Wispr Flow Voice AI Sync
                          </span>
                          <span className="text-xs text-purple-300/80">&bull; 99.4% Voice Accuracy</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">
                          Seamless Audio Transcripts &amp; Real-Time Speaker Attribution
                        </h4>
                        <p className="text-xs text-purple-200/90 mt-0.5 max-w-2xl leading-relaxed">
                          Sprint standups and client architecture sessions are captured through Wispr Flow. AI generates instant key takeaways, speaker dialogues, and action items synced into your Client Workspace.
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://wisprflow.ai"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition shrink-0 self-start md:self-auto"
                    >
                      <span>Explore Wispr Flow</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Meeting Notes Cards */}
                <div className="space-y-4">
                  {meetingNotes.map((note) => (
                    <div key={note.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                      {/* Note Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs sm:text-sm font-extrabold text-[#f96706] uppercase tracking-wider">
                              {note.meeting_date}
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <a
                              href={note.wispr_flow_url || "https://wisprflow.ai"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-0.5 text-xs font-bold transition shadow-2xs"
                              title="Open note on Wispr Flow"
                            >
                              <Mic className="h-3.5 w-3.5 text-purple-600" />
                              Linked to Wispr Flow
                              <ExternalLink className="h-3 w-3 opacity-60" />
                            </a>
                            {note.wispr_flow_id && (
                              <span className="text-xs font-semibold text-slate-400">
                                ({note.wispr_flow_id})
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">{note.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            <Clock className="h-3 w-3" />
                            {note.audio_duration || "35 min recorded"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Attendees: {note.attendees}</span>
                        </div>
                      </div>

                      {/* Discussion Summary */}
                      <div>
                        <p className="text-sm sm:text-base font-bold text-slate-900">Discussion Summary:</p>
                        <p className="text-sm sm:text-base text-slate-700 mt-1 leading-relaxed">{note.summary}</p>
                      </div>

                      {/* Action Items */}
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                        <p className="text-sm sm:text-base font-extrabold text-emerald-900">Action Items:</p>
                        <p className="text-sm sm:text-base text-slate-800 mt-1 font-medium">{note.action_items}</p>
                      </div>

                      {/* Wispr Flow Audio & Transcript Action Bar */}
                      <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedWisprNote(note)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs hover:bg-purple-700 transition cursor-pointer"
                            title="Play Wispr Flow Audio Transcript"
                          >
                            <Play className="h-4 w-4 ml-0.5" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-purple-900">Wispr Flow AI Recording</span>
                              <span className="text-purple-300">&bull;</span>
                              <span className="text-xs text-purple-700 font-semibold">{note.audio_duration || "40 min"}</span>
                              <span className="text-purple-300">&bull;</span>
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {note.ai_confidence || "99.4% Accurate"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              ID: <strong className="text-slate-800">{note.wispr_flow_id || "WF-SYNC-2026"}</strong> &bull; Complete speaker transcript &amp; action checklist available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedWisprNote(note)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-bold text-purple-900 shadow-2xs hover:bg-purple-50 transition cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5 text-purple-600" />
                            View Transcript
                          </button>
                          <a
                            href={note.wispr_flow_url || "https://wisprflow.ai"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-2xs"
                          >
                            <span>Open in Wispr Flow</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: SUPPORT TICKETS ================= */}
            {activeTab === "tickets" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Client Support Tickets</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Direct technical helpdesk with Zyllo Tech solutions architects and project engineering leads.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-md hover:opacity-95 transition-opacity"
                  >
                    <Plus className="h-5 w-5" />
                    Open Support Ticket
                  </button>
                </div>

                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs sm:text-sm font-extrabold text-[#f96706] uppercase">{t.category}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-sm text-slate-500">{t.created_at}</span>
                            <span className={`text-xs sm:text-sm rounded-full px-3 py-0.5 font-bold ${
                              t.priority === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{t.subject}</h4>
                          <p className="text-sm sm:text-base text-slate-700 mt-1">{t.message}</p>
                        </div>

                        <span className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold shrink-0 ${
                          t.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      {t.admin_response && (
                        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-start gap-3 bg-emerald-50/70 border border-emerald-200/70 p-4 rounded-xl">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold text-emerald-900 uppercase">Engineering Response:</span>
                            <p className="text-sm sm:text-base text-slate-800 mt-1 font-medium">{t.admin_response}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: INQUIRIES ================= */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Project Inquiries & Cost Estimates</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Historical discovery briefs, architectural estimates, and project scope submissions.</p>
                </div>

                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-extrabold text-[#f96706]">{inq.service}</span>
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-bold">{inq.status}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{inq.name} · <span className="text-slate-500 font-medium">{inq.email}</span></h4>
                      <p className="text-sm sm:text-base text-slate-700">{inq.message}</p>
                      <div className="pt-2 text-sm text-slate-600 flex items-center justify-between border-t border-slate-100">
                        <span>Budget Range: <strong className="text-slate-900">{inq.budget}</strong></span>
                        <span>Date: {inq.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: TEAM CONTACTS ================= */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Dedicated Engineering Pod Contacts</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Your assigned enterprise delivery team, project manager, and technical architects.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Dr. K. Srinivas", role: "VP of Engineering & Solutions Architect", email: "srinivas@zyllotech.com", phone: "+91 98480 11223" },
                    { name: "Priya Sharma", role: "Lead Project Manager & Agile Coach", email: "priya.sharma@zyllotech.com", phone: "+91 98480 22334" },
                    { name: "Vikram Rao", role: "Lead Frontend Engineer (React/Tailwind)", email: "vikram.rao@zyllotech.com", phone: "+91 98480 33445" },
                    { name: "Sneha Patel", role: "DevOps & Cloud Infrastructure Lead", email: "sneha.patel@zyllotech.com", phone: "+91 98480 44556" },
                  ].map((m) => (
                    <div key={m.name} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                      <div className="flex items-center gap-3.5 mb-2.5">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f96706] to-[#1f4693] font-bold text-white text-sm">
                          {m.name.slice(0, 2)}
                        </span>
                        <div>
                          <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{m.name}</h4>
                          <p className="text-sm sm:text-base text-slate-600 font-medium">{m.role}</p>
                        </div>
                      </div>
                      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-2 text-sm sm:text-base text-slate-700">
                        <a href={`mailto:${m.email}`} className="flex items-center gap-2.5 hover:text-[#f96706] transition-colors">
                          <Mail className="h-4 w-4 text-[#f96706]" />
                          <span>{m.email}</span>
                        </a>
                        <a href={`tel:${m.phone}`} className="flex items-center gap-2.5 hover:text-[#f96706] transition-colors">
                          <Phone className="h-4 w-4 text-[#f96706]" />
                          <span>{m.phone}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
  );

  return (
    <>
      <Seo
        title={
          isEmployeeSubpage
            ? "Employee Workspace — Client Portal"
            : "Client Portal — Zyllo Tech"
        }
        description="Enterprise client portal for live sprint tracking, deliverables, and engineering milestones."
      />

      {insideAdmin ? (
        isEmployeeSubpage ? (
          <EmployeePortal insideAdmin={true} />
        ) : (
          <div className="space-y-6">
            {/* Greetings Hero Banner */}
            <PortalHeroBanner
              greeting="Good afternoon, Alex"
              subtitle="Welcome to your Zyllo Tech Enterprise Client Portal"
              stats={[
                { value: projects.length, label: "Active Projects" },
                { value: `${milestones.filter((m) => m.status === "Completed").length} / ${milestones.length}`, label: "Milestones Done" },
                { value: deliverables.length, label: "Deliverables" },
              ]}
              onRefresh={() => {}}
            />

            {/* First photo items displayed on down of greetings in horizontal row */}
            {clientHorizontalTabBar}

            {/* Down it should open: Active tab view */}
            {renderClientTabContent}
          </div>
        )
      ) : (
        <PortalShell
          portalName={isEmployeeSubpage ? "Employee Workspace" : "Client Workspace"}
          portalId="client"
          user={{ name: "Alex Morgan", email: "user@zyllotech.com", role: "client" }}
          navSections={clientNavSections}
          activeTab={currentActiveTab}
          onTabChange={handleTabChange}
          searchPlaceholder="Search deliverables, tickets, milestones..."
        >
          {isEmployeeSubpage ? (
            <div className="w-full">
              <EmployeePortal insideAdmin={true} />
            </div>
          ) : (
            renderClientTabContent
          )}
        </PortalShell>
      )}

        {/* Modal: Open Support Ticket */}
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-[#f96706]" />
                  Open New Support Ticket
                </h3>
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Ticket Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of the issue or question..."
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-[#f96706] focus:outline-none"
                    >
                      <option value="Technical / API">Technical / API</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Cloud / DevOps">Cloud / DevOps</option>
                      <option value="Billing / Invoicing">Billing / Invoicing</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-800 focus:border-[#f96706] focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent (SLA Alert)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full technical context, endpoints, screenshots or logs..."
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-md hover:opacity-95 transition-opacity"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Update Project Status */}
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#f96706] border border-orange-200">
                    <Sliders className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Update Project Status
                    </h3>
                    <p className="text-xs text-slate-500">
                      Modify sprint stage, progress completion, and target milestones.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProjectStatus} className="space-y-4">
                {/* Project Selector */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Select Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 focus:border-[#f96706] focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.fullName || p.name} ({p.status} - {p.progress}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Current Project Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: "In Progress", color: "border-amber-300 bg-amber-50 text-amber-800" },
                      { label: "Testing", color: "border-sky-300 bg-sky-50 text-sky-800" },
                      { label: "Active", color: "border-indigo-300 bg-indigo-50 text-indigo-800" },
                      { label: "Completed", color: "border-emerald-300 bg-emerald-50 text-emerald-800" },
                      { label: "On Hold", color: "border-rose-300 bg-rose-50 text-rose-800" },
                      { label: "Review Pending", color: "border-purple-300 bg-purple-50 text-purple-800" },
                    ].map((st) => (
                      <button
                        key={st.label}
                        type="button"
                        onClick={() => setStatusForm({ ...statusForm, status: st.label })}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                          statusForm.status === st.label
                            ? `${st.color} ring-2 ring-[#f96706] shadow-2xs font-extrabold`
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{st.label}</span>
                        {statusForm.status === st.label && <Check className="h-4 w-4 text-[#f96706]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sprint Progress Range & Number */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    <span>Sprint Progress Completion</span>
                    <span className="font-extrabold text-[#f96706] text-base">{statusForm.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={statusForm.progress}
                      onChange={(e) => setStatusForm({ ...statusForm, progress: Number(e.target.value) })}
                      className="w-full accent-[#f96706] cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={statusForm.progress}
                      onChange={(e) => setStatusForm({ ...statusForm, progress: Math.min(100, Math.max(0, Number(e.target.value))) })}
                      className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center font-bold text-sm text-slate-900 focus:border-[#f96706] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#f96706] to-[#3089a6] transition-all"
                      style={{ width: `${statusForm.progress}%` }}
                    />
                  </div>
                </div>

                {/* Target Completion Date */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 2026, 15 Dec 2026, Q1 2027"
                    value={statusForm.completion_date}
                    onChange={(e) => setStatusForm({ ...statusForm, completion_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Status Update Note */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Status Update Note / Sprint Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe milestones achieved, sprint status, or upcoming cutovers..."
                    value={statusForm.note}
                    onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-[#f96706] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Auto log to meeting notes checkbox */}
                <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={statusForm.add_to_notes}
                    onChange={(e) => setStatusForm({ ...statusForm, add_to_notes: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#f96706]"
                  />
                  <span>Automatically log this update in Sprint Meeting Notes & Agendas</span>
                </label>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-6 py-2.5 text-sm sm:text-base font-bold text-white shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Save Status Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Wispr Flow AI Transcript & Audio Brief */}
        {selectedWisprNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-purple-100 px-6 py-4 bg-purple-50/70">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                    <Mic className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                        Wispr Flow AI Meeting Notes
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {selectedWisprNote.wispr_flow_id || "WF-AI-SYNC"}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      {selectedWisprNote.title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWisprNote(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto">
                {/* Simulated Audio Player */}
                <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-900 shadow hover:bg-purple-50 transition cursor-pointer"
                      >
                        {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </button>
                      <div>
                        <p className="text-xs font-bold text-white">Wispr Flow Audio Recording</p>
                        <p className="text-[11px] text-purple-200">
                          {selectedWisprNote.audio_duration || "42 min 18 sec"} &bull; {selectedWisprNote.ai_confidence || "99.4% STT Precision"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {["1.0x", "1.5x", "2.0x"].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setAudioPlaybackRate(rate)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                            audioPlaybackRate === rate ? "bg-white text-purple-900" : "bg-white/10 text-purple-200 hover:bg-white/20"
                          }`}
                        >
                          {rate}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Waveform Visualization */}
                  <div className="flex items-center gap-1 h-7 px-1 bg-white/5 rounded-lg">
                    {[40, 65, 30, 85, 95, 60, 45, 75, 90, 40, 55, 80, 100, 70, 50, 85, 60, 95, 45, 65, 80, 35, 90, 75, 60, 85, 50, 70, 90, 65, 40, 80, 60, 95, 50, 75].map((h, i) => (
                      <span
                        key={i}
                        className={`w-full rounded-full transition-all duration-300 ${
                          isPlayingAudio && i < 18 ? "bg-purple-400" : "bg-white/30"
                        }`}
                        style={{ height: `${isPlayingAudio ? Math.max(20, (h + (i % 3) * 10) % 100) : h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Executive Summary & Key Decisions */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f96706] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Wispr Flow AI Executive Summary
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Date: {selectedWisprNote.meeting_date}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {selectedWisprNote.summary}
                  </p>
                </div>

                {/* Action Items */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-1.5">
                  <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Action Items &amp; Key Decisions
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {selectedWisprNote.action_items}
                  </p>
                </div>

                {/* Speaker Attribution Transcript Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-purple-600" /> Speaker Dialogue Transcript
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const transcriptText = (selectedWisprNote.transcript_snippets || [])
                          .map((t) => `[${t.time}] ${t.speaker}: ${t.text}`)
                          .join("\n\n");
                        navigator.clipboard?.writeText(transcriptText);
                        setCopiedTranscript(true);
                        setTimeout(() => setCopiedTranscript(false), 2500);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedTranscript ? "Copied!" : "Copy Transcript"}
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {(selectedWisprNote.transcript_snippets && selectedWisprNote.transcript_snippets.length > 0 ? selectedWisprNote.transcript_snippets : [
                      { time: "00:00", speaker: "Meeting Host", text: selectedWisprNote.summary },
                      { time: "15:20", speaker: "Action Desk", text: selectedWisprNote.action_items },
                    ]).map((snippet, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-900">{snippet.speaker}</span>
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                            {snippet.time}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-normal">{snippet.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Wispr Flow App Link */}
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-purple-600 shrink-0" />
                    <span className="text-xs text-purple-950 font-medium">
                      View or query this full audio note in the Wispr Flow web app:
                    </span>
                  </div>
                  <a
                    href={selectedWisprNote.wispr_flow_url || "https://wisprflow.ai"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-1.5 text-xs font-bold transition shrink-0"
                  >
                    <span>Open Wispr Flow</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-3 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setSelectedWisprNote(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Link / Create Wispr Flow Note */}
        {isLinkWisprModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-purple-100 px-6 py-4 bg-purple-50/70">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                    <Mic className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Link Wispr Flow Meeting Note
                    </h3>
                    <p className="text-xs text-slate-500">
                      Connect a Wispr Flow recording URL, transcript, and sprint takeaways
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLinkWisprModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleLinkWisprNote} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meeting Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sprint 5 Architecture & Telemetry Review"
                      value={wisprNoteForm.title}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meeting Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 29 Oct 2026"
                      value={wisprNoteForm.meeting_date}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, meeting_date: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Audio Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 35 min 20 sec"
                      value={wisprNoteForm.audio_duration}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, audio_duration: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wispr Flow Note URL / Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://wisprflow.ai/notes/your-note-id"
                      value={wisprNoteForm.wispr_flow_url}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, wispr_flow_url: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Attendees
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan, VP Eng Srinivas, Priya Sharma"
                      value={wisprNoteForm.attendees}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, attendees: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Discussion Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Executive recap of topics discussed and technical decisions..."
                      value={wisprNoteForm.summary}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, summary: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Action Items
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Key action items, engineering deliverables, and owners..."
                      value={wisprNoteForm.action_items}
                      onChange={(e) => setWisprNoteForm({ ...wisprNoteForm, action_items: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsLinkWisprModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#f96706] px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Save &amp; Link Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Upload Project Backup File */}
        {isUploadBackupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-orange-100 px-6 py-4.5 bg-gradient-to-r from-orange-50/80 to-amber-50/60">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f96706] to-[#f7941e] text-white shadow-sm">
                    <Upload className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Upload Project Backup File
                    </h3>
                    <p className="text-xs text-slate-500">
                      Securely upload codebase archives, database dumps, or application snapshots
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !isUploadingBackup && setIsUploadBackupModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUploadBackupSubmit} className="p-6 space-y-4 overflow-y-auto">
                {/* Project Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Project <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={uploadBackupProject?.id || (projects[0] && projects[0].id)}
                    onChange={(e) => {
                      const found = projects.find((p) => String(p.id) === String(e.target.value));
                      if (found) {
                        setUploadBackupProject(found);
                        const defaultVault = found.details?.backupWhere?.split("&")[0]?.trim() || "AWS S3 Vault (ap-south-1)";
                        setBackupUploadForm((prev) => ({ ...prev, backupWhere: defaultVault }));
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#f96706] focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.fullName || p.name} ({p.details?.hosted ? "Hosted & Live" : "Staging"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Project Telemetry Banner */}
                {uploadBackupProject && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5 text-emerald-600" /> Active Storage Vault:
                      </span>
                      <span className="font-semibold text-slate-700">
                        {uploadBackupProject.details?.backupWhere?.split("&")[0]?.trim() || "AWS S3 Vault"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Last Snapshot: {uploadBackupProject.details?.lastBackupTime || "Daily automated"}</span>
                      <span className="font-bold text-emerald-700">{uploadBackupProject.details?.backupSize || "14.8 GB"}</span>
                    </div>
                  </div>
                )}

                {/* Drag-and-Drop or File Input Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Backup Archive (.tar.gz, .zip, .sql, .dump) <span className="text-rose-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 hover:bg-orange-50/60 transition p-5 text-center cursor-pointer">
                    <input
                      type="file"
                      accept=".tar.gz,.tgz,.zip,.sql,.dump,.bak,.json"
                      onChange={(e) => handleBackupFileSelect(e.target.files?.[0])}
                      className="hidden"
                    />
                    <FileArchive className="h-8 w-8 text-[#f96706] mb-2" />
                    {backupUploadForm.fileName ? (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-extrabold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {backupUploadForm.fileName}
                        </div>
                        <p className="text-[11px] text-slate-500">Size: {backupUploadForm.fileSize} &bull; Click to choose a different archive</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drop backup archive here
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports TAR, GZ, ZIP, SQL DUMP, and Postgres binary formats up to 100 GB
                        </p>
                      </>
                    )}
                  </label>

                  {/* Quick Preset Buttons for Convenience */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] font-bold text-slate-500">Quick presets:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setBackupUploadForm((prev) => ({
                          ...prev,
                          fileName: `${uploadBackupProject?.id || "project"}-db-snapshot-${new Date().toISOString().slice(0, 10)}.sql`,
                          fileSize: "34.2 MB",
                        }))
                      }
                      className="text-[11px] font-semibold text-[#f96706] bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md px-2 py-0.5 transition cursor-pointer"
                    >
                      + Database Dump (.sql)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBackupUploadForm((prev) => ({
                          ...prev,
                          fileName: `${uploadBackupProject?.id || "project"}-full-archive-v${Date.now().toString().slice(-4)}.tar.gz`,
                          fileSize: "68.5 MB",
                        }))
                      }
                      className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md px-2 py-0.5 transition cursor-pointer"
                    >
                      + Full Source Archive (.tar.gz)
                    </button>
                  </div>
                </div>

                {/* Target Storage Vault Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination Cloud Vault
                  </label>
                  <select
                    value={backupUploadForm.backupWhere}
                    onChange={(e) => setBackupUploadForm({ ...backupUploadForm, backupWhere: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#f96706] focus:outline-none"
                  >
                    <option value="AWS S3 Vault (ap-south-1) & GitHub Enterprise Private Archive">
                      AWS S3 Vault (ap-south-1) &amp; GitHub Enterprise Private Archive
                    </option>
                    <option value="AWS S3 Encrypted Sovereign Vault (ap-south-1)">
                      AWS S3 Encrypted Sovereign Vault (ap-south-1)
                    </option>
                    <option value="GitHub Enterprise Private Cloud Vault">
                      GitHub Enterprise Private Cloud Vault
                    </option>
                    <option value="Google Cloud Storage Vault (asia-south1)">
                      Google Cloud Storage Vault (asia-south1)
                    </option>
                    <option value="OCI Sovereign Vault (Air-Gapped Immutable Archive)">
                      OCI Sovereign Vault (Air-Gapped Immutable Archive)
                    </option>
                  </select>
                </div>

                {/* Version & Release Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Backup Notes / Version Scope
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sprint 5 production cutover snapshot with sanitized clinical database & assets."
                    value={backupUploadForm.notes}
                    onChange={(e) => setBackupUploadForm({ ...backupUploadForm, notes: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                  />
                </div>

                {/* Live Upload Progress Indicator */}
                {isUploadingBackup && (
                  <div className="rounded-xl border border-orange-200 bg-orange-50/80 p-3.5 space-y-2 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5 text-[#f96706] animate-bounce" />
                        Encrypting &amp; Uploading Archive to Vault...
                      </span>
                      <span className="text-[#f96706]">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-orange-200/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f96706] to-[#1f4693] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Verifying SHA-256 cryptographic checksum and writing immutable backup manifest...
                    </p>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isUploadingBackup}
                    onClick={() => setIsUploadBackupModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingBackup}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploadingBackup ? "Uploading..." : "Upload & Verify Archive"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Project Hosting & Infrastructure Center (Telemetry & Configuration) */}
        {isHostingModalOpen && hostingModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="border-b border-blue-100 px-6 pt-5 pb-0 bg-gradient-to-r from-blue-50/90 via-slate-50 to-orange-50/40">
                <div className="flex items-start justify-between gap-3 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                      <Server className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          {hostingModalProject.title || hostingModalProject.fullName}
                        </h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          hostingModalProject.details?.hosted ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {hostingModalProject.details?.hosted ? "Hosted & Active" : "Staging"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cloud infrastructure telemetry, live domain routing, and SLA compliance
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHostingModalOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Segmented Control Tabs */}
                <div className="flex items-center gap-4 border-t border-slate-200/60 pt-1">
                  <button
                    type="button"
                    onClick={() => setHostingModalTab("specs")}
                    className={`inline-flex items-center gap-1.5 pb-2.5 pt-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                      hostingModalTab === "specs"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Telemetry &amp; Specifications</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostingModalTab("edit")}
                    className={`inline-flex items-center gap-1.5 pb-2.5 pt-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                      hostingModalTab === "edit"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Configuration</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Telemetry & Specs */}
              {hostingModalTab === "specs" && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Domain & Web Routing */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-blue-600" /> Domain &amp; Web Routing
                      </span>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Live Production URL</span>
                        <a
                          href={hostingModalProject.details?.hostedUrl || (hostingModalProject.details?.domainName ? `https://${hostingModalProject.details?.domainName}` : "#")}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs sm:text-sm font-extrabold text-blue-600 hover:underline flex items-center gap-1 truncate mt-0.5"
                        >
                          <span className="truncate">{hostingModalProject.details?.domainName || `${hostingModalProject.id}.zyllotech.com`}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 block">Domain Expiry</span>
                          <strong className="text-slate-900 font-bold">{hostingModalProject.details?.domainExpiryDate || "Oct 14, 2028"}</strong>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block">Auto-Renew</span>
                          <strong className="text-emerald-700 font-bold">Active (3-Yr Term)</strong>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Server & Datacenter Compute */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Server className="h-3.5 w-3.5 text-[#f96706]" /> Compute &amp; Datacenter
                      </span>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Hosting Provider</span>
                        <strong className="text-xs sm:text-sm text-slate-900 font-extrabold block truncate mt-0.5">
                          {hostingModalProject.details?.hostingProvider || "AWS EC2 Cluster + CloudFront CDN"}
                        </strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 block">Server Region</span>
                          <strong className="text-slate-900 font-bold">{hostingModalProject.details?.serverRegion || "AWS ap-south-1"}</strong>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block">Server IP</span>
                          <strong className="font-mono text-slate-800 font-bold">{hostingModalProject.details?.serverIp || "13.234.112.89"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: SSL Certificate & Security */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> SSL Certificate &amp; Security
                      </span>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Encryption Status</span>
                        <strong className="text-xs sm:text-sm text-emerald-700 font-extrabold block truncate mt-0.5">
                          {hostingModalProject.details?.sslStatus || "Active & Secure (Let's Encrypt Wildcard 256-bit)"}
                        </strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 block">SSL Renewal</span>
                          <strong className="text-slate-800 font-bold">Auto every 90 days</strong>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block">DNSSEC</span>
                          <strong className="text-emerald-700 font-bold">Cryptographically Valid</strong>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: High Availability SLA & Backup Vault */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5 text-purple-600" /> SLA &amp; Backup Vault
                      </span>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Current Backup Location</span>
                        <strong className="font-mono text-xs text-slate-900 block truncate mt-0.5" title={hostingModalProject.details?.backupLocation}>
                          {hostingModalProject.details?.backupLocation || "s3://zyllotech-backups/archive-latest.tar.gz"}
                        </strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 block">Uptime SLA</span>
                          <strong className="text-emerald-700 font-bold">{hostingModalProject.details?.uptime || "99.98% High Availability"}</strong>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block">Latency</span>
                          <strong className="text-slate-800 font-bold">{hostingModalProject.details?.latency || "18ms Average"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Backup Callout Banner */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <HardDrive className="h-4 w-4 text-[#f96706]" /> Need to upload a new backup file archive?
                      </h5>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Last taken: {hostingModalProject.details?.lastBackupTime || "Today at 03:00 AM IST"} ({hostingModalProject.details?.backupSize || "14.8 GB"})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsHostingModalOpen(false);
                        openUploadBackupModal(hostingModalProject);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer shrink-0"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload Backup Now
                    </button>
                  </div>

                  {/* Modal Footer (Specs Tab) */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setHostingModalTab("edit")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5 text-blue-600" />
                      Edit Configuration
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHostingModalOpen(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Edit Configuration Form */}
              {hostingModalTab === "edit" && (
                <form onSubmit={handleUpdateHostingSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Environment Status & Hosted Toggle */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-blue-600" /> Environment Deployment Status
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={hostingEditForm.hosted}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setHostingEditForm((prev) => ({
                              ...prev,
                              hosted: checked,
                              hostingStatus: checked
                                ? "Hosted & Active (Production Cluster)"
                                : "Staging & Pre-deployment",
                            }));
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <span>Active Production Deployment</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Hosting Cluster Status
                        </label>
                        <select
                          value={hostingEditForm.hostingStatus}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, hostingStatus: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="Hosted & Active (Production Cluster)">Hosted &amp; Active (Production Cluster)</option>
                          <option value="Staging & Pre-deployment">Staging &amp; Pre-deployment</option>
                          <option value="Testing & QA Sandbox">Testing &amp; QA Sandbox</option>
                          <option value="Maintenance Mode">Maintenance Mode</option>
                          <option value="Migrating / Provisioning">Migrating / Provisioning</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Hosting Cloud Provider
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.hostingProvider}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, hostingProvider: e.target.value }))}
                          placeholder="e.g. AWS EC2 Cluster + CloudFront CDN"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Domain & URL Settings */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-blue-600" /> Domain &amp; Web Endpoints
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Primary Production Domain
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.domainName}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, domainName: e.target.value }))}
                          placeholder="aims.enterprise.zyllotech.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Live Web URL (https://)
                        </label>
                        <input
                          type="url"
                          value={hostingEditForm.hostedUrl}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, hostedUrl: e.target.value }))}
                          placeholder="https://aims.enterprise.zyllotech.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Custom Client Domain (Optional)
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.customDomain || ""}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, customDomain: e.target.value }))}
                          placeholder="e.g. portal.clientbrand.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Domain Registrar / DNS Provider
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.domainRegistrar}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, domainRegistrar: e.target.value }))}
                          placeholder="AWS Route 53 / Cloudflare"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Domain Expiry Date
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.domainExpiryDate}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, domainExpiryDate: e.target.value }))}
                          placeholder="e.g. Oct 14, 2028 or 2028-10-14"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={hostingEditForm.domainAutoRenew}
                            onChange={(e) => setHostingEditForm((prev) => ({ ...prev, domainAutoRenew: e.target.checked }))}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span>Enable Automatic Domain Renewal</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Server Compute, IP & SSL Security */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Server className="h-3.5 w-3.5 text-[#f96706]" /> Datacenter Compute &amp; SSL Security
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Datacenter / Cloud Region
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.serverRegion}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, serverRegion: e.target.value }))}
                          placeholder="AWS ap-south-1 (Mumbai Region)"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Production Server IP / Gateway
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.serverIp}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, serverIp: e.target.value }))}
                          placeholder="13.234.112.89"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          SSL / TLS Certificate Status
                        </label>
                        <input
                          type="text"
                          value={hostingEditForm.sslStatus}
                          onChange={(e) => setHostingEditForm((prev) => ({ ...prev, sslStatus: e.target.value }))}
                          placeholder="Active & Secure (Let's Encrypt Wildcard 256-bit)"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          High Availability SLA &amp; Latency
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={hostingEditForm.uptime}
                            onChange={(e) => setHostingEditForm((prev) => ({ ...prev, uptime: e.target.value }))}
                            placeholder="99.98% High Availability"
                            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={hostingEditForm.latency}
                            onChange={(e) => setHostingEditForm((prev) => ({ ...prev, latency: e.target.value }))}
                            placeholder="18ms Avg"
                            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change Log / Sprint Remark */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Update Remark / Audit Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={hostingEditForm.note}
                      onChange={(e) => setHostingEditForm((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="e.g. Switched production DNS to Cloudflare & upgraded cluster instance"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      This update will be logged in the project audit history and synced instantly with the Admin Project Tracker.
                    </p>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setHostingModalTab("specs")}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      &larr; Back to Specs
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsHostingModalOpen(false)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {statusToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl text-slate-900 animate-in fade-in duration-200">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">Project Status Updated</p>
              <p className="text-xs text-slate-600">{statusToast}</p>
            </div>
            <button
              type="button"
              onClick={() => setStatusToast("")}
              className="ml-2 rounded-lg p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
    </>
  );
}
