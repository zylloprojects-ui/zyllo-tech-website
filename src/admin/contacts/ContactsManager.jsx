
import { useEffect, useState, useTransition } from "react";
import {
  Search,
  Mail,
  Phone,
  Trash2,
  Eye,
  X,
  Building2,
  Briefcase,
  FileSpreadsheet,
  CalendarRange,
  Inbox,
  CircleDot,
  MessageCircle,
  CheckCircle2,
  Video,
  ExternalLink,
  Copy,
  Check,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import PageHeader from "../PageHeader";
import StatusBadge from "../StatusBadge";
import EmptyState from "../EmptyState";
import { updateSubmissionStatus, deleteSubmission, resendConsultationEmail } from "@/lib/api/admin/contacts";

export function parseConsultationDetails(item) {
  if (!item) return null;
  const isConsultation =
    (item.service && (item.service.includes("30-Min") || item.service.includes("Consultation"))) ||
    (item.message &&
      (item.message.includes("SCHEDULED TECHNICAL CONSULTATION") ||
        item.message.includes("30-MIN TECHNICAL CONSULTATION")));

  if (!isConsultation) return null;

  const msg = item.message || "";
  const dateTimeMatch = msg.match(/(?:Requested Date & Time|Date & Time):\s*(.+)/i);
  const meetLinkMatch = msg.match(/(?:Meeting Link|Meet Link|Video Link):\s*(https?:\/\/[^\s\n]+)/i);
  const topicMatch = msg.match(/(?:Discussion Topic|Focus Topic):\s*(.+)/i);

  const meetingLink = meetLinkMatch ? meetLinkMatch[1].trim() : "https://meet.google.com/zyt-tech-meet";
  const dateTime = dateTimeMatch ? dateTimeMatch[1].trim() : null;
  const topic = topicMatch
    ? topicMatch[1].trim()
    : item.service
    ? item.service.replace(/^30-Min Call:\s*/, "")
    : "Technical Consultation";

  return {
    isConsultation: true,
    dateTime,
    meetingLink,
    topic,
  };
}

const STATUS_LABELS = {
  new: "New",
  contacted: "bg-[#3089a6]/10 text-[#216478]",
  closed: "Closed",
};

const STATUS_STYLES = {
  new: "bg-[#1f4693]/10 text-[#1f4693]",
  contacted: "bg-[#3089a6]/10 text-[#216478]",
  closed: "bg-[#3089a6]/10 text-[#216478]",
};

// Forward-only workflow: New -> Contacted -> Closed. Each status's dropdown
// only offers itself plus the states ahead of it, never a state already passed.
const STATUS_OPTIONS = {
  new: ["new", "contacted", "closed"],
  contacted: ["contacted", "closed"],
  closed: ["closed"],
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "consultations", label: "30-Min Calls" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "closed", label: "Closed" },
];

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ContactsManager({ initialSubmissions }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  useEffect(() => setSubmissions(initialSubmissions), [initialSubmissions]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewing, setViewing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  useEffect(() => {
    setModalCopied(false);
    setResendStatus(null);
  }, [viewing]);

  const filtered = submissions.filter((item) => {
    const consult = parseConsultationDetails(item);
    const isConsultation = Boolean(consult);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "consultations" ? isConsultation : item.status === activeFilter);

    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.full_name.toLowerCase().includes(q) ||
      (item.company ?? "").toLowerCase().includes(q) ||
      (item.service ?? "").toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (consult?.dateTime ?? "").toLowerCase().includes(q);

    const itemDate = new Date(item.created_at);
    const matchesFrom = dateFrom === "" || itemDate >= new Date(`${dateFrom}T00:00:00`);
    const matchesTo = dateTo === "" || itemDate <= new Date(`${dateTo}T23:59:59`);

    return matchesFilter && matchesQuery && matchesFrom && matchesTo;
  });

  function clearDateRange() {
    setDateFrom("");
    setDateTo("");
  }

  const totalCount = submissions.length;
  const consultationCount = submissions.filter((item) => Boolean(parseConsultationDetails(item))).length;
  const newCount = submissions.filter((item) => item.status === "new").length;
  const contactedCount = submissions.filter((item) => item.status === "contacted").length;
  const closedCount = submissions.filter((item) => item.status === "closed").length;

  const SUMMARY_BADGES = [
    { key: "total", icon: Inbox, label: "Total Submissions", value: totalCount, accent: "#1f4693" },
    { key: "consultations", icon: Video, label: "30-Min Calls", value: consultationCount, accent: "#f96706" },
    { key: "new", icon: CircleDot, label: "New", value: newCount, accent: "#f7941e" },
    { key: "contacted", icon: MessageCircle, label: "Contacted", value: contactedCount, accent: "#1f4693" },
    { key: "closed", icon: CheckCircle2, label: "Closed", value: closedCount, accent: "#3089a6" },
  ];

  async function handleExportExcel() {
    if (filtered.length === 0) {
      alert("No submissions to export for the current filters.");
      return;
    }
    setIsExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Zyllo Tech Admin";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Contact Submissions");

      sheet.columns = [
        { header: "Name", key: "name", width: 22 },
        { header: "Email", key: "email", width: 28 },
        { header: "Phone", key: "phone", width: 16 },
        { header: "Company", key: "company", width: 20 },
        { header: "Service", key: "service", width: 20 },
        { header: "Status", key: "status", width: 14 },
        { header: "Date", key: "date", width: 14 },
        { header: "Message", key: "message", width: 50 },
      ];

      // Header row: orange fill, white bold text — matches the site's
      // brand color used throughout the admin panel.
      const headerRow = sheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF7941E" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
      headerRow.height = 22;

      filtered.forEach((item) => {
        sheet.addRow({
          name: item.full_name,
          email: item.email,
          phone: item.phone || "—",
          company: item.company || "—",
          service: item.service || "—",
          status: STATUS_LABELS[item.status] || item.status,
          date: formatDate(item.created_at),
          message: item.message || "",
        });
      });

      sheet.getColumn("message").alignment = { wrapText: true, vertical: "top" };
      sheet.views = [{ state: "frozen", ySplit: 1 }];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const stamp = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contact-submissions-${stamp}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel export failed:", err);
      alert("Excel export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  function handleStatusChange(id, newStatus) {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    startTransition(async () => {
      const result = await updateSubmissionStatus(id, newStatus);
      if (result.status === "error") {
        alert(result.message);
      }
    });
  }

  function handleDelete(id) {
    startTransition(async () => {
      const result = await deleteSubmission(id);
      if (result.status === "error") {
        alert(result.message);
        return;
      }
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contact Submissions"
        subtitle={
          <>
            {filtered.length} of {submissions.length} submission
            {submissions.length === 1 ? "" : "s"} shown.
          </>
        }
        actions={
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#676b7a]/50"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search submissions…"
            className="w-full rounded-lg border border-[#e7e9ee] bg-white py-2 pl-9 pr-3 text-sm text-[#2b303b] outline-none placeholder:text-[#676b7a]/50 focus:border-[#1f4693]/50"
          />
        </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        {SUMMARY_BADGES.map(({ key, icon: Icon, label, value, accent }) => (
          <span
            key={key}
            className="inline-flex items-center gap-2 rounded-full border border-[#e7e9ee] bg-white py-1.5 pl-2 pr-4 shadow-sm"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accent}15` }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-[#2b303b]">{value}</span>
            <span className="text-xs font-medium text-[#676b7a]">{label}</span>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.key
                  ? "border-transparent bg-gradient-to-r from-[#f7941e] to-[#1f4693] text-white"
                  : "border-[#e7e9ee] bg-white text-[#676b7a] hover:border-[#f7941e]/40 hover:text-[#f7941e]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5 rounded-lg border border-[#e7e9ee] px-2.5 py-1.5">
              <label htmlFor="dateFrom" className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#676b7a]/70">
                <CalendarRange className="h-3 w-3" aria-hidden="true" />
                From
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                max={dateTo || undefined}
                className="w-[8.5rem] bg-transparent text-sm text-[#2b303b] outline-none"
              />
            </div>

            <div className="flex flex-col gap-0.5 rounded-lg border border-[#e7e9ee] px-2.5 py-1.5">
              <label htmlFor="dateTo" className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#676b7a]/70">
                <CalendarRange className="h-3 w-3" aria-hidden="true" />
                To
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || undefined}
                className="w-[8.5rem] bg-transparent text-sm text-[#2b303b] outline-none"
              />
            </div>

            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={clearDateRange}
                aria-label="Clear date range"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#676b7a] hover:bg-[#fafbfc] hover:text-[#2b303b]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7e9ee] bg-white px-3.5 py-2 text-sm font-medium text-[#2b303b] transition-colors hover:border-[#3089a6]/40 hover:text-[#3089a6] disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            {isExporting ? "Exporting…" : "Export Excel"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-[#e7e9ee] bg-[#fafbfc] text-xs font-bold uppercase tracking-wide text-[#676b7a]">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const consult = parseConsultationDetails(item);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-[#e7e9ee] last:border-0 transition-colors hover:bg-[#fafbfc]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#2b303b]">{item.full_name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#676b7a]">
                        <Mail className="h-3 w-3" aria-hidden="true" />
                        {item.email}
                      </p>
                      {item.phone && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#676b7a]">
                          <Phone className="h-3 w-3" aria-hidden="true" />
                          {item.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#2b303b]">{item.company || "—"}</td>
                    <td className="px-5 py-4">
                      {consult ? (
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold text-[#f96706]">
                            <Video className="h-3 w-3" />
                            30-Min Call
                          </span>
                          {consult.dateTime && (
                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#1d2735]">
                              <CalendarRange className="h-3 w-3 text-[#f96706]" />
                              {consult.dateTime}
                            </p>
                          )}
                          {consult.meetingLink && (
                            <a
                              href={consult.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#3089a6] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                              Join Google Meet
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#676b7a]">{item.service || "—"}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        disabled={isPending}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[item.status]}`}
                      >
                        {STATUS_OPTIONS[item.status].map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[#676b7a]">{formatDate(item.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {consult && (
                          <a
                            href={consult.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Join Google Meet Call"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#f96706] transition-colors hover:bg-orange-50"
                          >
                            <Video className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewing(item)}
                          aria-label={`View submission from ${item.full_name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#676b7a] transition-colors hover:bg-[#f7941e]/10 hover:text-[#f7941e]"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          aria-label={`Delete submission from ${item.full_name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#676b7a] transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon={Mail}
            title={submissions.length === 0 ? "No submissions yet" : "No matching submissions"}
            message={
              submissions.length === 0
                ? "No submissions yet — they'll appear here once someone fills out the contact form."
                : "No submissions match your search."
            }
          />
        )}
      </div>

      {viewing && (() => {
        const viewingConsult = parseConsultationDetails(viewing);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e17]/50 px-4 backdrop-blur-sm"
            onClick={() => setViewing(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#2b303b]">{viewing.full_name}</h2>
                  <StatusBadge
                    status={viewing.status}
                    label={STATUS_LABELS[viewing.status]}
                    className="mt-1.5"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#676b7a] transition-colors hover:bg-[#fafbfc] hover:text-[#2b303b]"
                >
                  <X className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
              </div>

              {/* Special 30-Min Call Banner if applicable */}
              {viewingConsult && (
                <div className="mt-4 rounded-xl border-2 border-[#f96706]/40 bg-gradient-to-br from-[#fffaf5] to-[#fff4ea] p-4 text-xs">
                  <div className="flex items-center justify-between border-b border-orange-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f96706] text-white">
                        <Video className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9a3412]">
                          30-Min Technical Call
                        </span>
                        <div className="text-sm font-extrabold text-[#1d2735]">Google Meet Video Conference</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Confirmed
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5 text-xs">
                    {viewingConsult.dateTime && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#78350f]">Date &amp; Time Slot:</span>
                        <span className="font-bold text-[#1d2735]">{viewingConsult.dateTime}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#78350f]">Discussion Topic:</span>
                      <span className="font-bold text-[#1d2735]">{viewingConsult.topic}</span>
                    </div>
                  </div>

                  {/* Google Meet URL box with copy button */}
                  <div className="mt-3 rounded-lg border border-orange-200 bg-white p-2.5">
                    <span className="block text-[11px] font-bold text-[#78350f] mb-1">Confirmed Google Meet Link:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={viewingConsult.meetingLink}
                        className="w-full bg-transparent text-xs font-semibold text-[#1d2735] outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator?.clipboard?.writeText) {
                            navigator.clipboard.writeText(viewingConsult.meetingLink);
                            setModalCopied(true);
                            setTimeout(() => setModalCopied(false), 2000);
                          }
                        }}
                        className="inline-flex shrink-0 items-center gap-1 rounded bg-orange-50 px-2.5 py-1 text-xs font-bold text-[#f96706] hover:bg-orange-100 transition-colors"
                      >
                        {modalCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{modalCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Meeting Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <a
                      href={viewingConsult.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#f96706] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition-all"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Google Meet</span>
                      <ExternalLink className="h-3 w-3 opacity-80" />
                    </a>

                    <button
                      type="button"
                      disabled={resendingEmail}
                      onClick={async () => {
                        setResendingEmail(true);
                        setResendStatus(null);
                        const res = await resendConsultationEmail({
                          name: viewing.full_name,
                          email: viewing.email,
                          phone: viewing.phone,
                          company: viewing.company,
                          preferredDate: viewingConsult.dateTime ? viewingConsult.dateTime.split(" at ")[0] : "Scheduled Date",
                          preferredTime: viewingConsult.dateTime ? viewingConsult.dateTime.split(" at ")[1] || "Scheduled Time" : "Scheduled Time",
                          timezone: "IST",
                          topic: viewingConsult.topic,
                          meetingLink: viewingConsult.meetingLink,
                        });
                        setResendingEmail(false);
                        if (res && res.success) {
                          setResendStatus(`Confirmation email with Google Meet link re-sent to ${viewing.email}!`);
                        } else {
                          setResendStatus(res?.message || "Could not dispatch email. Please check SMTP settings.");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#9a3412] hover:bg-orange-50 transition-colors disabled:opacity-60"
                    >
                      {resendingEmail ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" />
                          <span>Resend Meet Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {resendStatus && (
                    <p className={`mt-2 text-[11px] font-semibold ${resendStatus.includes("Could not") ? "text-red-600" : "text-emerald-700"}`}>
                      {resendStatus}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 text-sm">
                <p className="flex items-center gap-2 text-[#2b303b]">
                  <Mail className="h-4 w-4 text-[#676b7a]" aria-hidden="true" />
                  <a href={`mailto:${viewing.email}`} className="hover:text-[#f7941e]">
                    {viewing.email}
                  </a>
                </p>
                {viewing.phone && (
                  <p className="flex items-center gap-2 text-[#2b303b]">
                    <Phone className="h-4 w-4 text-[#676b7a]" aria-hidden="true" />
                    {viewing.phone}
                  </p>
                )}
                {viewing.company && (
                  <p className="flex items-center gap-2 text-[#2b303b]">
                    <Building2 className="h-4 w-4 text-[#676b7a]" aria-hidden="true" />
                    {viewing.company}
                  </p>
                )}
                {viewing.service && (
                  <p className="flex items-center gap-2 text-[#2b303b]">
                    <Briefcase className="h-4 w-4 text-[#676b7a]" aria-hidden="true" />
                    {viewing.service}
                  </p>
                )}
                <p className="text-xs text-[#676b7a]">{formatDate(viewing.created_at)}</p>
              </div>

              <div className="mt-4 rounded-xl border border-[#e7e9ee] bg-[#fafbfc] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#676b7a]">
                  Project Description / Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#2b303b]">
                  {viewing.message}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e17]/50 px-4 backdrop-blur-sm"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-[#2b303b]">Delete this submission?</h2>
            <p className="mt-2 text-sm text-[#676b7a]">
              This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-[#e7e9ee] px-4 py-2 text-sm font-medium text-[#676b7a] transition-colors hover:bg-[#fafbfc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
