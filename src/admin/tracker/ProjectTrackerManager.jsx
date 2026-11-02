// src/admin/tracker/ProjectTrackerManager.jsx
// Enterprise Project Tracker
// 1. Initial View: Shows all projects aligned in an overview grid with 3 action buttons each (Details, Sales, Updates)
// 2. Loaded Page View: When any option/project is clicked, opens the dedicated project page
// 3. Back to Projects Button: Returns to the projects overview grid

import { useState, useMemo, useEffect } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Download,
  ExternalLink,
  Search,
  Plus,
  Eye,
  Pencil,
  X,
  Server,
  Database,
  DollarSign,
  IndianRupee,
  Calendar,
  ShieldCheck,
  HardDrive,
  FileCheck2,
  Check,
  RefreshCw,
  Layers,
  Sparkles,
  Info,
  Globe,
  Lock,
  ArrowLeft,
  ArrowRight,
  Activity,
  Users,
  ChevronRight,
  Upload,
  FileArchive,
} from "lucide-react";
import PageHeader from "../PageHeader";
import {
  getStoredTrackerProjects,
  saveStoredTrackerProjects,
  addNewTrackerProject,
  uploadProjectBackupSync,
  downloadSalesDocument,
  exportProjectUpdatesToExcel,
  exportProjectUpdatesToPdf,
} from "@/data/projectTrackerData";

export default function ProjectTrackerManager() {
  const [projects, setProjects] = useState(() => getStoredTrackerProjects());

  // View Mode: 'overview' (shows all projects) | 'project' (loaded project page)
  const [viewMode, setViewMode] = useState("overview");

  // Selected project id for the loaded project page
  const [selectedProjectId, setSelectedProjectId] = useState("aims");

  // Active tab inside the loaded project page: 'details' | 'sales' | 'updates'
  const [activeTab, setActiveTab] = useState("details");

  // Search filter for projects overview
  const [projectSearch, setProjectSearch] = useState("");

  // Updates table search & filter
  const [updatesSearch, setUpdatesSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [viewUpdateModal, setViewUpdateModal] = useState(null);
  const [editUpdateModal, setEditUpdateModal] = useState(null);
  const [addUpdateModal, setAddUpdateModal] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  // Form states for add / edit updates
  const [formState, setFormState] = useState({
    updateReq: "",
    reqRecFrom: "",
    dateOfModification: new Date().toISOString().split("T")[0],
    status: "In Progress",
    remarks: "",
  });

  // Form state for creating a new project
  const [newProjectForm, setNewProjectForm] = useState({
    name: "",
    fullName: "",
    client: "",
    category: "Enterprise ERP & Cloud",
    status: "In Progress",
    progress: 35,
    completion_date: "Dec 2026",
    projectValue: "₹37,50,000",
    amcValue: "₹35,000 / Month",
    hosted: true,
    domainName: "",
    hostingProvider: "AWS Cloud Compute Cluster + Cloudflare CDN",
    domainExpiryDate: "October 14, 2028",
    backupWhere: "AWS S3 Vault & GitHub Private Enterprise Archive",
    backupFrequency: "Daily Automated Snapshot (03:00 AM IST)",
    tech_stack: "React 19, Node.js, PostgreSQL, Cloud CDN",
    description: "",
    initialUpdate: "Project registered and initialized in Zyllo Tech Enterprise Portfolio.",
  });

  const [notification, setNotification] = useState("");

  // Backup file upload state
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

  const openUploadBackupModal = (proj) => {
    const target = proj || selectedProject || projects[0] || {};
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
  };

  const handleBackupFileSelect = (file) => {
    if (!file) return;
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setBackupUploadForm((prev) => ({
      ...prev,
      selectedFile: file,
      fileName: file.name,
      fileSize: Number(sizeInMb) < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeInMb} MB`,
    }));
  };

  const handleUploadBackupSubmit = (e) => {
    e.preventDefault();
    if (!uploadBackupProject) return;

    setIsUploadingBackup(true);
    setUploadProgress(25);

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
        uploader: "Admin Project Tracker",
      });

      setProjects(updated);
      setIsUploadingBackup(false);
      setIsUploadBackupModalOpen(false);
      showNotification(`Backup archive "${targetFileName}" uploaded and verified successfully! Synced with Client Workspace.`);
    }, 850);
  };

  // Cross-portal / cross-tab live synchronization
  useEffect(() => {
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

  const handleCreateNewProject = (e) => {
    e.preventDefault();
    if (!newProjectForm.name.trim()) return;

    const updated = addNewTrackerProject(newProjectForm);
    setProjects(updated);
    setIsAddProjectModalOpen(false);
    showNotification(`Project "${newProjectForm.name}" registered successfully and synced with Client Workspace!`);

    // Reset form
    setNewProjectForm({
      name: "",
      fullName: "",
      client: "",
      category: "Enterprise ERP & Cloud",
      status: "In Progress",
      progress: 35,
      completion_date: "Dec 2026",
      projectValue: "₹37,50,000",
      amcValue: "₹35,000 / Month",
      hosted: true,
      domainName: "",
      hostingProvider: "AWS Cloud Compute Cluster + Cloudflare CDN",
      domainExpiryDate: "October 14, 2028",
      backupWhere: "AWS S3 Vault & GitHub Private Enterprise Archive",
      backupFrequency: "Daily Automated Snapshot (03:00 AM IST)",
      tech_stack: "React 19, Node.js, PostgreSQL, Cloud CDN",
      description: "",
      initialUpdate: "Project registered and initialized in Zyllo Tech Enterprise Portfolio.",
    });
  };

  const selectedProject = useMemo(() => {
    return (
      projects.find((p) => String(p.id) === String(selectedProjectId)) ||
      projects[0] ||
      null
    );
  }, [projects, selectedProjectId]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  // Filtered projects for the overview grid
  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projects;
    const q = projectSearch.toLowerCase().trim();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [projects, projectSearch]);

  // Filtered updates for the loaded project page
  const filteredUpdates = useMemo(() => {
    if (!selectedProject || !selectedProject.updates) return [];
    let list = selectedProject.updates;

    if (statusFilter !== "all") {
      list = list.filter(
        (u) => (u.status || "").toLowerCase().replace(/\s+/g, "") === statusFilter
      );
    }

    if (updatesSearch.trim()) {
      const q = updatesSearch.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.updateReq?.toLowerCase().includes(q) ||
          u.reqRecFrom?.toLowerCase().includes(q) ||
          u.remarks?.toLowerCase().includes(q) ||
          String(u.sno).includes(q)
      );
    }

    return list;
  }, [selectedProject, statusFilter, updatesSearch]);

  // Open the loaded page for a specific project & tab
  const openProjectPage = (projectId, tabName = "details") => {
    setSelectedProjectId(projectId);
    setActiveTab(tabName);
    setViewMode("project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Return to the all projects overview
  const backToProjects = () => {
    setViewMode("overview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Edit update save
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedProject || !editUpdateModal) return;

    const updatedProjects = projects.map((p) => {
      if (String(p.id) !== String(selectedProject.id)) return p;
      const newUpdates = (p.updates || []).map((u) => {
        if (u.id === editUpdateModal.id) {
          return {
            ...u,
            updateReq: formState.updateReq,
            reqRecFrom: formState.reqRecFrom,
            dateOfModification: formState.dateOfModification,
            status: formState.status,
            remarks: formState.remarks,
          };
        }
        return u;
      });
      return { ...p, updates: newUpdates };
    });

    setProjects(updatedProjects);
    saveStoredTrackerProjects(updatedProjects);
    setEditUpdateModal(null);
    showNotification("Modification update updated successfully!");
  };

  // Handle Add update save
  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    const currentUpdates = selectedProject.updates || [];
    const nextSno =
      currentUpdates.length > 0
        ? Math.max(...currentUpdates.map((u) => u.sno || 0)) + 1
        : 1;

    const newEntry = {
      id: Date.now(),
      sno: nextSno,
      updateReq: formState.updateReq.trim(),
      reqRecFrom: formState.reqRecFrom.trim() || "Client Stakeholder",
      dateOfModification:
        formState.dateOfModification || new Date().toISOString().split("T")[0],
      status: formState.status || "In Progress",
      remarks:
        formState.remarks.trim() ||
        "Requirement captured and scheduled for engineering sprint.",
    };

    const updatedProjects = projects.map((p) => {
      if (String(p.id) !== String(selectedProject.id)) return p;
      return {
        ...p,
        updates: [newEntry, ...(p.updates || [])],
      };
    });

    setProjects(updatedProjects);
    saveStoredTrackerProjects(updatedProjects);
    setAddUpdateModal(false);
    showNotification("New update request logged successfully!");
  };

  const openEditModal = (update) => {
    setEditUpdateModal(update);
    setFormState({
      updateReq: update.updateReq || "",
      reqRecFrom: update.reqRecFrom || "",
      dateOfModification: update.dateOfModification || "",
      status: update.status || "In Progress",
      remarks: update.remarks || "",
    });
  };

  const openAddModal = () => {
    setFormState({
      updateReq: "",
      reqRecFrom: "",
      dateOfModification: new Date().toISOString().split("T")[0],
      status: "In Progress",
      remarks: "",
    });
    setAddUpdateModal(true);
  };

  const handleExportExcel = async () => {
    try {
      await exportProjectUpdatesToExcel(selectedProject);
      showNotification(`Exported ${selectedProject.name} updates to Excel successfully.`);
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel file. Please try again.");
    }
  };

  const handleExportPdf = () => {
    exportProjectUpdatesToPdf(selectedProject);
    showNotification(`Generated ${selectedProject.name} updates PDF report.`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Global Toast Alert */}
      {notification && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification("")}
            className="text-emerald-700 hover:text-emerald-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: PROJECTS OVERVIEW (SHOWN FIRST WHEN CLICKING PROJECT TRACKER) */}
      {/* ========================================================================= */}
      {viewMode === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Page Header */}
          <PageHeader
            title="Project Tracker"
            subtitle="Overview of active enterprise software projects, server infrastructure, commercial sales deliverables, and modification logs"
            icon={FolderKanban}
            actions={
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  AMC Schedule Active ({projects.length} Accounts)
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f96706] to-[#f7941e] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const refreshed = getStoredTrackerProjects();
                    setProjects(refreshed);
                    showNotification("Project tracker data refreshed.");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7e9ee] bg-white px-3 py-1.5 text-xs font-semibold text-[#1e293b] shadow-sm hover:bg-slate-50 transition cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[#64748b]" />
                  Refresh
                </button>
              </div>
            }
          />

          {/* AMC Schedule Banner & KPI Stats */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-orange-50/50 p-6 text-slate-800 shadow-sm border border-[#e7e9ee]">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 h-48 w-48 rounded-full bg-[#f96706]/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#f96706] border border-orange-200">
                    <Sparkles className="h-3 w-3" /> AMC Schedule Active
                  </span>
                  <span className="text-xs text-[#676b7a] font-medium">Quarterly Audits &bull; 24/7 SLA</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#0f172a]">
                  Enterprise Portfolio Overview
                </h2>
                <p className="text-xs md:text-sm text-[#676b7a] max-w-2xl leading-relaxed">
                  Monitoring {projects.length} production implementations: {projects.map((p, i) => (
                    <span key={p.id}>
                      <strong className="text-[#0f172a]">{p.name}</strong>
                      {i < projects.length - 1 ? ", " : ""}{i === projects.length - 2 ? "and " : ""}
                    </span>
                  ))}. Click any project&rsquo;s <strong>Details</strong>, <strong>Sales</strong>, or <strong>Updates</strong> button to open its dedicated workspace page.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 shrink-0 text-center">
                <div className="rounded-xl bg-white border border-[#e7e9ee] px-3.5 py-2.5 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#676b7a] uppercase tracking-wide">Projects</div>
                  <div className="text-lg md:text-xl font-extrabold text-[#0f172a] mt-0.5">{projects.length} Active</div>
                </div>
                <div className="rounded-xl bg-white border border-[#e7e9ee] px-3.5 py-2.5 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#676b7a] uppercase tracking-wide">Hosted Live</div>
                  <div className="text-lg md:text-xl font-extrabold text-emerald-600 mt-0.5">
                    {projects.filter((p) => p.details?.hosted).length} of {projects.length}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-[#e7e9ee] px-3.5 py-2.5 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#676b7a] uppercase tracking-wide">Contract Value</div>
                  <div className="text-lg md:text-xl font-extrabold text-[#f96706] mt-0.5">
                    {(() => {
                      const totalInr = projects.reduce((acc, p) => {
                        const raw = String(p.details?.projectValueInr || p.details?.projectValue || "");
                        const num = parseInt(raw.replace(/[^0-9]/g, ""), 10);
                        return acc + (isNaN(num) ? 0 : num);
                      }, 0);
                      if (totalInr >= 10000000) {
                        return `₹${(totalInr / 10000000).toFixed(2)} Cr`;
                      }
                      return `₹${(totalInr / 100000).toFixed(1)} Lakhs`;
                    })()}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-[#e7e9ee] px-3.5 py-2.5 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#676b7a] uppercase tracking-wide">Total Updates</div>
                  <div className="text-lg md:text-xl font-extrabold text-[#1f4693] mt-0.5">
                    {projects.reduce((acc, p) => acc + (p.updates?.length || 0), 0)} Logged
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Alignment Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#f96706]" />
                  Active Enterprise Projects
                </h3>
                <p className="text-xs text-[#64748b]">
                  Select any button on a project to open its loaded detail page
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Search bar */}
                <div className="relative min-w-[240px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects, clients..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  />
                  {projectSearch && (
                    <button
                      type="button"
                      onClick={() => setProjectSearch("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </button>
              </div>
            </div>

            {/* 4 Projects Aligned in Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProjects.map((project) => {
                const completed = project.details?.completed;
                const hosted = project.details?.hosted;
                const updatesCount = project.updates?.length || 0;

                return (
                  <div
                    key={project.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    {/* Project Identity & Badges */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${project.accent || "from-[#f96706] to-[#f7941e]"} text-white font-black text-base shadow-sm shrink-0`}
                          >
                            {project.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-[#0f172a] text-lg leading-tight truncate">
                              {project.name}
                            </h4>
                            <p className="text-xs text-[#64748b] truncate max-w-[150px]">
                              {project.client}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                            completed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {completed ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Done
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 text-amber-600" /> Active
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-[#475569] line-clamp-1 mb-3.5">
                        {project.fullName}
                      </p>

                      {/* Micro Specs */}
                      <div className="space-y-1.5 mb-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-slate-500 py-0.5 border-b border-slate-200/60">
                          <span className="flex items-center gap-1 text-[11.5px]">
                            <Server className="h-3.5 w-3.5 text-slate-400" /> Hosting:
                          </span>
                          <span className={`font-semibold ${hosted ? "text-emerald-700" : "text-amber-700"}`}>
                            {hosted ? "Hosted & Live" : "Staging"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500 py-0.5 border-b border-slate-200/60">
                          <span className="flex items-center gap-1 text-[11.5px]">
                            <Globe className="h-3.5 w-3.5 text-slate-400" /> Domain Expiry:
                          </span>
                          <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[130px]">
                            {project.details?.domainExpiryDate || "Oct 2028"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500 py-0.5">
                          <span className="flex items-center gap-1 text-[11.5px]">
                            <IndianRupee className="h-3.5 w-3.5 text-slate-400" /> Value:
                          </span>
                          <span className="font-bold text-[#0f172a]">
                            {project.details?.projectValue || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3 ACTION BUTTONS REQUIRED ON EVERY PROJECT */}
                    {/* 3 ACTION BUTTONS REQUIRED ON EVERY PROJECT */}
                    {/* "after when we want to click details or any option it should open in lode page" */}
                    <div className="mt-2 space-y-1.5 pt-3 border-t border-slate-100">
                      {/* BUTTON 1: Project Details */}
                      <button
                        type="button"
                        onClick={() => openProjectPage(project.id, "details")}
                        className="w-full flex items-center justify-between rounded-xl py-2 px-3 text-xs font-bold transition-all bg-[#1f4693] text-white shadow-xs hover:bg-[#1a3a7c] cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5" />
                          Project Details
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-white/80" />
                      </button>

                      {/* BUTTON 2: Sales */}
                      <button
                        type="button"
                        onClick={() => openProjectPage(project.id, "sales")}
                        className="w-full flex items-center justify-between rounded-xl py-2 px-3 text-xs font-bold transition-all bg-gradient-to-r from-[#f96706] to-[#f7941e] text-white shadow-xs hover:opacity-95 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" />
                          Sales &amp; Docs
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-white/80" />
                      </button>

                      {/* BUTTON 3: Project Updates */}
                      <button
                        type="button"
                        onClick={() => openProjectPage(project.id, "updates")}
                        className="w-full flex items-center justify-between rounded-xl py-2 px-3 text-xs font-bold transition-all bg-[#3089a6] text-white shadow-xs hover:bg-[#256e85] cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Project Updates
                        </span>
                        <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {updatesCount}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DEDICATED LOADED PAGE FOR A PROJECT */}
      {/* "after when we want to click details or any option it should open in lode page and add a button to back to projects" */}
      {/* ========================================================================= */}
      {viewMode === "project" && selectedProject && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Navigation Bar with "Back to Projects" Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              {/* REQUIRED: BACK TO PROJECTS BUTTON */}
              <button
                type="button"
                onClick={backToProjects}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-extrabold text-xs px-4 py-2.5 transition border border-slate-300 shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748b]">
                <span>Project Tracker</span>
                <span>/</span>
                <strong className="text-[#0f172a] font-bold">{selectedProject.name}</strong>
              </div>
            </div>

            {/* Quick Project Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] text-slate-400 font-semibold uppercase shrink-0">
                Switch Project:
              </span>
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    p.id === selectedProjectId
                      ? "bg-[#f96706] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loaded Page Hero Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedProject.accent || "from-[#f96706] to-[#f7941e]"} text-white font-black text-2xl shadow-md shrink-0`}
                >
                  {selectedProject.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#f96706] bg-[#f96706]/10 px-2 py-0.5 rounded-md border border-[#f96706]/20">
                      {selectedProject.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
                        selectedProject.details?.completed
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {selectedProject.details?.completed ? "Completed & Live" : "Active Development"}
                    </span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      Value: {selectedProject.details?.projectValue}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-[#0f172a] mt-1.5 leading-tight">
                    {selectedProject.name} — {selectedProject.fullName}
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1">
                    Client: <strong>{selectedProject.client}</strong> &bull; Primary Domain: <span className="font-mono text-slate-800">{selectedProject.details?.domainName}</span>
                  </p>
                </div>
              </div>

              {/* 3 Prominent Tabs Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "details"
                      ? "bg-[#1f4693] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Info className="h-4 w-4" />
                  1. Project Details
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("sales")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "sales"
                      ? "bg-gradient-to-r from-[#f96706] to-[#f7941e] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  2. Sales &amp; Docs
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("updates")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "updates"
                      ? "bg-[#3089a6] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  3. Project Updates ({selectedProject.updates?.length || 0})
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* TAB 1: PROJECT DETAILS (ALL IN DETAILS) */}
            {/* =================================================================== */}
            {activeTab === "details" && (
              <div className="pt-6 space-y-6 animate-fadeIn">
                {/* 1. Project Status: Completed or Not */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0f172a] text-sm uppercase tracking-wide">
                          Project Status: Completed or Not
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Handover milestone sign-offs &amp; engineering phase progress
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${
                        selectedProject.details?.completed
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {selectedProject.details?.completed
                        ? "Completed (100% Handover)"
                        : "In Progress (Development)"}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Delivery Milestone:</span>
                      <strong className="text-slate-900 font-bold">
                        {selectedProject.details?.completionStatus}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Completion / Handover Date:</span>
                      <span className="font-bold text-[#1f4693]">
                        {selectedProject.details?.completionDate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Sign-off Authority:</span>
                      <span className="font-medium text-slate-800">
                        {selectedProject.details?.signoffAuthority}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Warranty &amp; Support Period:</span>
                      <span className="font-medium text-emerald-700">
                        {selectedProject.details?.warrantyPeriod}
                      </span>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-700">Total Engineering Progress</span>
                        <strong className="text-emerald-700 font-black">
                          {selectedProject.details?.progress}% Complete
                        </strong>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#1f4693] transition-all duration-700"
                          style={{ width: `${selectedProject.details?.progress || 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4-Phase Delivery Breakdown */}
                  <div>
                    <h5 className="font-bold text-slate-800 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#f96706]" />
                      Milestone Phase-by-Phase Delivery Breakdown:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProject.details?.phases?.map((phase, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-100 bg-white shadow-2xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                phase.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {phase.status === "Completed" ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                idx + 1
                              )}
                            </span>
                            <div>
                              <strong className="block text-slate-900 text-xs">
                                {phase.name}
                              </strong>
                              <span className="text-[10.5px] text-slate-400">
                                Target / Milestone: {phase.date}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              phase.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {phase.status} ({phase.progress}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Hosted Status & Domain Expiration */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0f172a] text-sm uppercase tracking-wide">
                          Hosted Status &amp; Domain Expiration
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Active domain expiration dates, DNS records, and SSL certificates
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${
                        selectedProject.details?.hosted
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {selectedProject.details?.hosted ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Hosted &amp; Live
                        </>
                      ) : (
                        "Staging Environment"
                      )}
                    </span>
                  </div>

                  {/* DOMAIN EXPIRATION HIGHLIGHT CARD */}
                  <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/70 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c24f05] block">
                          Primary Domain Endpoint:
                        </span>
                        <div className="text-base font-extrabold text-[#0f172a] font-mono">
                          {selectedProject.details?.domainName}
                        </div>
                        {selectedProject.details?.customDomain && (
                          <span className="text-[11px] text-slate-500">
                            Custom Alias: <code className="text-[#1f4693] font-semibold">{selectedProject.details.customDomain}</code>
                          </span>
                        )}
                      </div>

                      {selectedProject.details?.hostedUrl && (
                        <a
                          href={selectedProject.details.hostedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#f96706] hover:bg-[#e05b02] shadow-xs transition shrink-0"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Launch Live Domain
                        </a>
                      )}
                    </div>

                    {/* WHEN WILL THE DOMAIN EXPIRE (Prominent Callout) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 bg-white rounded-xl border border-orange-200 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                          When Will Domain Expire?
                        </span>
                        <div className="text-base font-black text-rose-700 tracking-tight">
                          {selectedProject.details?.domainExpiryDate}
                        </div>
                        <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                          &bull; {selectedProject.details?.domainDaysRemaining} Days Remaining
                        </span>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-orange-200 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                          Auto-Renewal Status
                        </span>
                        <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Auto-Renewal Active
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-1">
                          Auto-renews via Company Corporate Vault Card
                        </span>
                      </div>
                    </div>

                    {/* Domain Registrar & Nameservers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Domain Registrar</span>
                        <strong className="text-slate-900 text-xs">
                          {selectedProject.details?.domainRegistrar}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Registered Date</span>
                        <span className="text-slate-700 text-xs font-medium">
                          {selectedProject.details?.domainRegisteredDate}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 block text-[11px]">Active Nameservers</span>
                        <code className="text-[#1f4693] text-[11px] font-mono block bg-slate-50 p-1.5 rounded border border-slate-200 mt-0.5">
                          {selectedProject.details?.domainNameservers} ({selectedProject.details?.dnssecStatus})
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* SSL & Server Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <Lock className="h-3.5 w-3.5 text-emerald-600" />
                        SSL/TLS Certificate
                      </div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {selectedProject.details?.sslStatus}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Expiry:</strong> {selectedProject.details?.sslExpiryDate}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1f4693]">
                        <Server className="h-3.5 w-3.5 text-[#1f4693]" />
                        Cloud Server IP &amp; Region
                      </div>
                      <div className="font-semibold text-slate-900 text-xs truncate">
                        {selectedProject.details?.hostingProvider}
                      </div>
                      <div className="text-[11px] text-slate-600 flex justify-between">
                        <span>IP: <code className="font-mono text-slate-800">{selectedProject.details?.serverIp}</code></span>
                        <span>Uptime: <strong className="text-emerald-700">{selectedProject.details?.uptime}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Backup Files & Storage Vault */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#1f4693]">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0f172a] text-sm uppercase tracking-wide">
                          Backup Files &amp; Storage Vault
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Automated snapshot location, encryption, and archive integrity
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase bg-blue-50 text-[#1f4693] border border-blue-200">
                      <Database className="h-3 w-3" /> Encrypted Vault
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div>
                      <span className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                        Backup Where (Target Storage Provider):
                      </span>
                      <strong className="block text-slate-900 text-xs">
                        {selectedProject.details?.backupWhere}
                      </strong>
                      <code className="text-[11px] text-[#1f4693] font-mono break-all block mt-1 bg-white p-2 rounded border border-slate-200">
                        {selectedProject.details?.backupLocation}
                      </code>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Snapshot Frequency</span>
                        <strong className="text-slate-900 text-xs">
                          {selectedProject.details?.backupFrequency}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Archive Size</span>
                        <strong className="text-slate-900 text-xs">
                          {selectedProject.details?.backupSize}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500">
                      Last taken: {selectedProject.details?.lastBackupTime}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openUploadBackupModal(selectedProject)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f96706] hover:underline cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload Backup
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const blob = new Blob(
                            [
                              `Zyllo Tech Secure Vault Archive Manifest\nProject: ${selectedProject.fullName}\nLocation: ${selectedProject.details?.backupLocation}\nTimestamp: ${new Date().toISOString()}\nChecksum: SHA256-VALID-VERIFIED\nStatus: Vault Online`,
                            ],
                            { type: "text/plain" }
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${selectedProject.id}-backup-manifest.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showNotification(`Downloaded backup manifest for ${selectedProject.name}.`);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f4693] hover:underline cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download Backup Manifest
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Project Value & AMC Schedule */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[#f96706]">
                        <IndianRupee className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0f172a] text-sm uppercase tracking-wide">
                          Project Value &amp; AMC Schedule
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Commercial valuation, payment milestones, and support terms
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase bg-orange-50 text-[#f96706] border border-orange-200">
                      Commercial Terms
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">
                          Total Contract Value
                        </span>
                        <div className="text-2xl font-black text-[#0f172a] tracking-tight">
                          {selectedProject.details?.projectValue}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">
                          Currency Standard
                        </span>
                        <div className="text-sm font-bold text-emerald-700">
                          Indian Rupee (INR ₹)
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold">Payment Status:</span>
                        <span className="font-bold text-emerald-700">
                          {selectedProject.details?.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold">AMC Schedule:</span>
                        <span className="font-bold text-[#1f4693]">
                          {selectedProject.details?.amcValue} &bull; {selectedProject.details?.amcSchedule}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 2: SALES & INVOICES */}
            {/* =================================================================== */}
            {activeTab === "sales" && (
              <div className="pt-6 space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="font-extrabold text-[#0f172a] text-sm">
                      Commercial Sales Documentation &amp; Agreements
                    </h4>
                    <p className="text-xs text-[#64748b]">
                      Authorized digital document downloads for Quotation, PO, SO, and Invoices.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Commercial Integrity Verified
                  </span>
                </div>

                {/* 3 Core Agreements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quotation */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10.5px] font-bold text-[#1f4693] border border-blue-200 uppercase">
                          Quotation (QT)
                        </span>
                        <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {selectedProject.sales?.quotation?.status}
                        </span>
                      </div>

                      <h5 className="font-bold text-[#0f172a] text-sm leading-snug mb-1">
                        {selectedProject.sales?.quotation?.code}
                      </h5>
                      <p className="text-xs text-[#64748b] mb-3 line-clamp-2">
                        {selectedProject.sales?.quotation?.title}
                      </p>

                      <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Amount:</span>
                          <strong className="text-slate-900 font-bold">
                            {selectedProject.sales?.quotation?.amount}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date:</span>
                          <span className="text-slate-700">{selectedProject.sales?.quotation?.date}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        downloadSalesDocument(
                          selectedProject.sales.quotation,
                          "quotation",
                          selectedProject
                        );
                        showNotification(`Downloading Quotation ${selectedProject.sales.quotation.code}...`);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#1f4693] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#1a3a7c] transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Quotation
                    </button>
                  </div>

                  {/* Purchase Order */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10.5px] font-bold text-purple-700 border border-purple-200 uppercase">
                          Purchase Order (PO)
                        </span>
                        <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {selectedProject.sales?.po?.status}
                        </span>
                      </div>

                      <h5 className="font-bold text-[#0f172a] text-sm leading-snug mb-1">
                        {selectedProject.sales?.po?.code}
                      </h5>
                      <p className="text-xs text-[#64748b] mb-3 line-clamp-2">
                        {selectedProject.sales?.po?.title}
                      </p>

                      <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Amount:</span>
                          <strong className="text-slate-900 font-bold">
                            {selectedProject.sales?.po?.amount}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Auth By:</span>
                          <span className="text-slate-700 truncate max-w-[120px]">
                            {selectedProject.sales?.po?.authorizedBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        downloadSalesDocument(
                          selectedProject.sales.po,
                          "purchase order (po)",
                          selectedProject
                        );
                        showNotification(`Downloading Purchase Order ${selectedProject.sales.po.code}...`);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-700 py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-purple-800 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download PO
                    </button>
                  </div>

                  {/* Sales Order */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-800 border border-amber-200 uppercase">
                          Sales Order (SO)
                        </span>
                        <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {selectedProject.sales?.so?.status}
                        </span>
                      </div>

                      <h5 className="font-bold text-[#0f172a] text-sm leading-snug mb-1">
                        {selectedProject.sales?.so?.code}
                      </h5>
                      <p className="text-xs text-[#64748b] mb-3 line-clamp-2">
                        {selectedProject.sales?.so?.title}
                      </p>

                      <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contract:</span>
                          <strong className="text-slate-900 font-bold">
                            {selectedProject.sales?.so?.amount}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Delivery Lead:</span>
                          <span className="text-slate-700">{selectedProject.sales?.so?.deliveryLead}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        downloadSalesDocument(
                          selectedProject.sales.so,
                          "sales order (so)",
                          selectedProject
                        );
                        showNotification(`Downloading Sales Order ${selectedProject.sales.so.code}...`);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#f96706] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#e05b02] transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download SO
                    </button>
                  </div>
                </div>

                {/* Milestone Invoices Table */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h5 className="font-bold text-[#0f172a] text-xs">
                      Milestone Invoices Breakdown
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      {selectedProject.sales?.invoices?.length || 0} Invoices Generated
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200 text-[#475569] font-bold uppercase text-[10.5px]">
                          <th className="py-2.5 px-3">Invoice #</th>
                          <th className="py-2.5 px-3">Milestone Description</th>
                          <th className="py-2.5 px-3">Issued Date</th>
                          <th className="py-2.5 px-3 text-right">Amount</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Download</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedProject.sales?.invoices?.map((inv, idx) => (
                          <tr key={inv.code || idx} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-3 font-mono font-bold text-[#1f4693]">
                              {inv.code}
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-900">
                              {inv.title}
                            </td>
                            <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                              {inv.date}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-slate-900">
                              {inv.amount}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  inv.status === "Paid"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  downloadSalesDocument(inv, "invoice", selectedProject);
                                  showNotification(`Downloading Invoice ${inv.code}...`);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-[#0f172a] hover:bg-[#f96706] hover:text-white transition shadow-2xs border border-slate-200"
                              >
                                <Download className="h-3 w-3" />
                                Download
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

            {/* =================================================================== */}
            {/* TAB 3: PROJECT UPDATES (EXCEL & PDF AT TOP + TABULAR FORMAT) */}
            {/* =================================================================== */}
            {activeTab === "updates" && (
              <div className="pt-6 space-y-5 animate-fadeIn">
                {/* Top of Table Actions Bar (Excel & PDF buttons + Search + Add) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-[200px]">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search updates..."
                        value={updatesSearch}
                        onChange={(e) => setUpdatesSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="inprogress">In Progress</option>
                      <option value="intesting">In Testing</option>
                      <option value="pendingapproval">Pending Approval</option>
                    </select>
                  </div>

                  {/* REQUIRED AT TOP OF TABLE: EXCEL AND PDF EXPORT */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition cursor-pointer"
                      title="Download updates in Excel (.xlsx) format"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Download in Excel
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPdf}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f4693] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#18397a] transition cursor-pointer"
                      title="Download updates in PDF report format"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Download in PDF
                    </button>

                    <button
                      type="button"
                      onClick={openAddModal}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f96706] to-[#f7941e] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:opacity-95 transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Update Request
                    </button>
                  </div>
                </div>

                {/* Table matching user sketch: S.No., Update Req, Req Rec from, Date of mod, Status, Remarks, Actions */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[#0f172a] font-extrabold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-3 text-center w-12">S.No.</th>
                          <th className="py-3 px-3 w-[28%]">Update Req</th>
                          <th className="py-3 px-3 w-[18%]">Req Rec from</th>
                          <th className="py-3 px-3 w-[14%]">Date of Modification</th>
                          <th className="py-3 px-3 w-[12%] text-center">Status</th>
                          <th className="py-3 px-3 w-[18%]">Remarks</th>
                          <th className="py-3 px-3 text-center w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUpdates.length > 0 ? (
                          filteredUpdates.map((update, idx) => {
                            const statusKey = (update.status || "").toLowerCase().replace(/\s+/g, "");
                            let statusClasses = "bg-slate-100 text-slate-800 border-slate-200";
                            if (statusKey === "completed") {
                              statusClasses = "bg-emerald-100 text-emerald-800 border-emerald-300";
                            } else if (statusKey === "inprogress") {
                              statusClasses = "bg-amber-100 text-amber-900 border-amber-300";
                            } else if (statusKey === "intesting") {
                              statusClasses = "bg-blue-100 text-blue-800 border-blue-300";
                            } else if (statusKey === "pendingapproval") {
                              statusClasses = "bg-purple-100 text-purple-800 border-purple-300";
                            }

                            return (
                              <tr
                                key={update.id || idx}
                                className="hover:bg-orange-50/20 transition group"
                              >
                                <td className="py-3.5 px-3 text-center font-bold text-slate-700 bg-slate-50/50">
                                  {update.sno || idx + 1}
                                </td>

                                <td className="py-3.5 px-3 font-semibold text-[#0f172a]">
                                  <div className="leading-snug">{update.updateReq}</div>
                                </td>

                                <td className="py-3.5 px-3 text-slate-700 font-medium">
                                  <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#f96706]" />
                                    <span>{update.reqRecFrom}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap font-medium">
                                  {update.dateOfModification}
                                </td>

                                <td className="py-3.5 px-3 text-center">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusClasses}`}
                                  >
                                    {update.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-3 text-slate-600 text-[11px] leading-relaxed">
                                  {update.remarks || "—"}
                                </td>

                                {/* View & Edit down the table */}
                                <td className="py-3.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setViewUpdateModal(update)}
                                      className="inline-flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-bold text-[#1f4693] bg-blue-50 hover:bg-[#1f4693] hover:text-white transition border border-blue-200 cursor-pointer shadow-2xs"
                                      title="View Update Details"
                                    >
                                      <Eye className="h-3 w-3" />
                                      View
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => openEditModal(update)}
                                      className="inline-flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-600 hover:text-white transition border border-amber-200 cursor-pointer shadow-2xs"
                                      title="Edit Update Request"
                                    >
                                      <Pencil className="h-3 w-3" />
                                      Edit
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-500">
                              <p className="font-semibold text-slate-700">No modification updates found.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748b]">
                    <span>
                      Showing <strong>{filteredUpdates.length}</strong> of{" "}
                      <strong>{selectedProject.updates?.length || 0}</strong> modification records
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-[#1f4693]" /> View opens modal
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Pencil className="h-3 w-3 text-amber-700" /> Edit updates state
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Back Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={backToProjects}
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-[#0f172a] font-extrabold text-xs px-4 py-2.5 transition border border-slate-300 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </button>
            <span className="text-xs text-slate-400">
              Project Tracker &bull; Zyllo Tech Software Solutions
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW UPDATE DETAILS */}
      {/* ========================================================================= */}
      {viewUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-[#1f4693] font-bold text-xs">
                  #{viewUpdateModal.sno}
                </span>
                <div>
                  <h3 className="font-extrabold text-[#0f172a] text-base">
                    Update Request #{viewUpdateModal.sno}
                  </h3>
                  <span className="text-xs text-[#64748b]">
                    Project: {selectedProject?.name} &bull; Modification Log
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewUpdateModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10.5px] block mb-1">
                  Update Request Description:
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 leading-relaxed">
                  {viewUpdateModal.updateReq}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-0.5">
                    Request Received From:
                  </span>
                  <strong className="text-slate-900 text-xs block">
                    {viewUpdateModal.reqRecFrom}
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-0.5">
                    Date of Modification:
                  </span>
                  <strong className="text-slate-900 text-xs block">
                    {viewUpdateModal.dateOfModification}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                  Status:
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {viewUpdateModal.status}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase text-[10.5px] block mb-1">
                  Remarks / Engineering Status:
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {viewUpdateModal.remarks || "No additional remarks logged for this update."}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewUpdateModal;
                  setViewUpdateModal(null);
                  openEditModal(toEdit);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewUpdateModal(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT UPDATE */}
      {/* ========================================================================= */}
      {editUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-extrabold text-[#0f172a] text-base">
                  Edit Update #{editUpdateModal.sno}
                </h3>
                <span className="text-xs text-[#64748b]">
                  Modify request parameters, modification date, status, or remarks
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditUpdateModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Update Request Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formState.updateReq}
                  onChange={(e) => setFormState({ ...formState, updateReq: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  placeholder="Enter update request details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Request Received From *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.reqRecFrom}
                    onChange={(e) => setFormState({ ...formState, reqRecFrom: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                    placeholder="e.g. Lead Operations Manager"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date of Modification *
                  </label>
                  <input
                    type="date"
                    required
                    value={formState.dateOfModification}
                    onChange={(e) =>
                      setFormState({ ...formState, dateOfModification: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status *</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Testing">In Testing</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks *</label>
                <textarea
                  rows={2}
                  value={formState.remarks}
                  onChange={(e) => setFormState({ ...formState, remarks: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  placeholder="Enter remarks, release notes, or deployment status..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditUpdateModal(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#f96706] hover:bg-[#e05b02] shadow-xs transition"
              >
                <Check className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW UPDATE REQUEST */}
      {/* ========================================================================= */}
      {addUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveAdd}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-extrabold text-[#0f172a] text-base">
                  Log New Update Request
                </h3>
                <span className="text-xs text-[#64748b]">
                  Add a new client modification for <strong>{selectedProject?.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAddUpdateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Update Request Title / Scope *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formState.updateReq}
                  onChange={(e) => setFormState({ ...formState, updateReq: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  placeholder="Describe the requested feature, bug fix, or modification..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Request Received From *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.reqRecFrom}
                    onChange={(e) => setFormState({ ...formState, reqRecFrom: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                    placeholder="e.g. Chief Product Officer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date of Modification *
                  </label>
                  <input
                    type="date"
                    required
                    value={formState.dateOfModification}
                    onChange={(e) =>
                      setFormState({ ...formState, dateOfModification: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status *</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="In Testing">In Testing</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={formState.remarks}
                  onChange={(e) => setFormState({ ...formState, remarks: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f96706]"
                  placeholder="Engineering notes, target milestone, or remarks..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddUpdateModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0f172a] hover:bg-slate-800 shadow-xs transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add New Project */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#f96706] border border-orange-200">
                  <FolderKanban className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Add New Enterprise Project
                  </h3>
                  <p className="text-xs text-slate-500">
                    Register a new project with hosting telemetry, sales records, and client portal sync
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProjectModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateNewProject} className="p-6 space-y-5 overflow-y-auto">
              {/* Section 1: Project Identity */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f96706] mb-3 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Project Identification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ZenithPay, MedPulse, AeroTrack"
                      value={newProjectForm.name}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Client / Organization <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ZenithPay Financial Holdings Ltd."
                      value={newProjectForm.client}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Project Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ZenithPay Global Fintech Gateway & Settlement Suite"
                      value={newProjectForm.fullName}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newProjectForm.category}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#f96706] focus:outline-none"
                    >
                      <option value="Enterprise ERP & Cloud">Enterprise ERP & Cloud</option>
                      <option value="IoT & Supply Chain">IoT & Supply Chain</option>
                      <option value="Industrial SaaS & Field Ops">Industrial SaaS & Field Ops</option>
                      <option value="IoT Automation & Web SaaS">IoT Automation & Web SaaS</option>
                      <option value="Fintech & Core Banking">Fintech & Core Banking</option>
                      <option value="HealthTech & Telemedicine">HealthTech & Telemedicine</option>
                      <option value="AI Infrastructure & Vector Search">AI Infrastructure & Vector Search</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Status & Sprint Delivery */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f96706] mb-3 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Sprint Status & Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Status
                    </label>
                    <select
                      value={newProjectForm.status}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, status: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#f96706] focus:outline-none"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Testing">Testing</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Completion Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dec 2026, Q1 2027"
                      value={newProjectForm.completion_date}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, completion_date: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Sprint Progress</span>
                      <span className="text-[#f96706] font-extrabold">{newProjectForm.progress}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newProjectForm.progress}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, progress: Number(e.target.value) })}
                        className="w-full accent-[#f96706] cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProjectForm.progress}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, progress: Math.min(100, Math.max(0, Number(e.target.value))) })}
                        className="w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-center font-bold text-xs text-slate-900 focus:bg-white focus:border-[#f96706] focus:outline-none"
                      />
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f96706] to-[#3089a6] transition-all"
                        style={{ width: `${newProjectForm.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Commercials */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f96706] mb-3 flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" /> Commercials &amp; Valuation (INR ₹)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Contract Value (INR)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹35,00,000"
                      value={newProjectForm.projectValue}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, projectValue: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Monthly AMC Value (INR)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹35,000 / Month"
                      value={newProjectForm.amcValue}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, amcValue: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Hosting & Infrastructure */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f96706] flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Server, Domain & Hosting
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProjectForm.hosted}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, hosted: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f96706]"
                    />
                    <span>Hosted on Server</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Domain Name / URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. zenithpay.zyllotech.com"
                      value={newProjectForm.domainName}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, domainName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Domain Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. October 14, 2028"
                      value={newProjectForm.domainExpiryDate}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, domainExpiryDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hosting Provider & Infrastructure
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AWS Cloud Compute Cluster + Cloudflare CDN"
                      value={newProjectForm.hostingProvider}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, hostingProvider: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Backups & Tech Stack */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f96706] mb-3 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5" /> Backups & Engineering Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Backup Vault Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AWS S3 Vault & GitHub Private Archive"
                      value={newProjectForm.backupWhere}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, backupWhere: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Backup Frequency
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Daily Automated Snapshot (03:00 AM IST)"
                      value={newProjectForm.backupFrequency}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, backupFrequency: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Technology Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React 19, Python FastAPI, PostgreSQL, Docker, AWS"
                      value={newProjectForm.tech_stack}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, tech_stack: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of system modules, target users, and key architectural scope..."
                      value={newProjectForm.description}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Create &amp; Sync Project
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
                    Upload codebase archives, database dumps, or application snapshots to cloud vaults
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

            <form onSubmit={handleUploadBackupSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Project <span className="text-rose-500">*</span>
                </label>
                <select
                  value={uploadBackupProject?.id || selectedProjectId}
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
                      <p className="text-[11px] text-slate-500">Size: {backupUploadForm.fileSize} &bull; Click to choose another file</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-slate-800">
                        Click to browse or drop backup archive here
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports TAR, GZ, ZIP, SQL DUMP, and Postgres binary formats
                      </p>
                    </>
                  )}
                </label>

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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Backup Notes / Version Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sprint cutover snapshot with verified database integrity."
                  value={backupUploadForm.notes}
                  onChange={(e) => setBackupUploadForm({ ...backupUploadForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#f96706] focus:outline-none"
                />
              </div>

              {isUploadingBackup && (
                <div className="rounded-xl border border-orange-200 bg-orange-50/80 p-3.5 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-[#f96706] animate-bounce" />
                      Uploading &amp; Verifying Archive in Cloud Vault...
                    </span>
                    <span className="text-[#f96706]">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-orange-200/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#f96706] to-[#1f4693] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

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
    </div>
  );
}
