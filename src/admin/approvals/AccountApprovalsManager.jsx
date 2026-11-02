import { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  ShieldCheck,
  RefreshCw,
  Mail,
  Calendar,
  Building,
  BadgeAlert,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../PageHeader";

export default function AccountApprovalsManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [roleFilter, setRoleFilter] = useState("all"); // 'all' | 'hr' | 'client' | 'employee'

  // Modals
  const [detailModalUser, setDetailModalUser] = useState(null);
  const [confirmApproveUser, setConfirmApproveUser] = useState(null);
  const [confirmRejectUser, setConfirmRejectUser] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("zyllotech_token") || "demo_jwt_token_admin";
      const res = await fetch("/api/admin/registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      // Backend request failed, fallback to local storage
    }

    // Local storage fallback
    try {
      const raw = localStorage.getItem("zyllotech_registered_users");
      const localUsers = raw ? JSON.parse(raw) : [];
      // Combine with known demo users
      const demoUsers = [
        {
          id: 2,
          name: "Alex Morgan",
          email: "user@zyllotech.com",
          role: "client",
          status: "APPROVED",
          employee_id: null,
          created_at: "2026-10-16T06:56:26.000Z",
          approved_at: "2026-10-16T06:56:26.000Z",
          approved_by: "system",
        },
        {
          id: 3,
          name: "Priya Sharma (HR Operations Lead)",
          email: "hr@zyllotech.com",
          role: "hr",
          status: "APPROVED",
          employee_id: null,
          created_at: "2026-10-21T10:03:00.000Z",
          approved_at: "2026-10-21T10:03:00.000Z",
          approved_by: "system",
        },
        {
          id: 4,
          name: "Alex Morgan (Employee)",
          email: "employee@zyllotech.com",
          role: "employee",
          status: "APPROVED",
          employee_id: "ZYL-EMP-0001",
          created_at: "2026-10-26T06:17:01.000Z",
          approved_at: "2026-10-26T06:17:01.000Z",
          approved_by: "admin@zyllotech.com",
        },
      ];

      // Merge avoiding duplicates by email
      const all = [...localUsers];
      demoUsers.forEach((demo) => {
        if (!all.some((u) => u.email?.toLowerCase() === demo.email.toLowerCase())) {
          all.push(demo);
        }
      });
      setRegistrations(all);
    } catch (err) {
      setRegistrations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleApprove = async () => {
    if (!confirmApproveUser) return;
    setActionBusy(true);

    try {
      const token = localStorage.getItem("zyllotech_token") || "demo_jwt_token_admin";
      const res = await fetch(`/api/admin/registrations/${confirmApproveUser.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        showToast(data.message || `Account approved successfully as ${confirmApproveUser.role.toUpperCase()}.`);
        setConfirmApproveUser(null);
        fetchRegistrations();
        setActionBusy(false);
        return;
      }
    } catch (e) {}

    // Fallback local update
    try {
      const raw = localStorage.getItem("zyllotech_registered_users");
      const list = raw ? JSON.parse(raw) : [];
      let newEmpId = null;
      if (confirmApproveUser.role === "employee") {
        newEmpId = `ZYL-EMP-000${list.filter((u) => u.role === "employee" && u.status === "APPROVED").length + 2}`;
      }

      const updated = list.map((u) => {
        if (u.id === confirmApproveUser.id || u.email === confirmApproveUser.email) {
          return {
            ...u,
            status: "APPROVED",
            employee_id: newEmpId || u.employee_id,
            approved_at: new Date().toISOString(),
            approved_by: "admin@zyllotech.com",
          };
        }
        return u;
      });

      localStorage.setItem("zyllotech_registered_users", JSON.stringify(updated));
      showToast(
        newEmpId
          ? `Employee account approved! Generated Employee ID: ${newEmpId}`
          : `Account approved successfully as ${confirmApproveUser.role.toUpperCase()}.`
      );
      setConfirmApproveUser(null);
      fetchRegistrations();
    } catch (err) {}
    setActionBusy(false);
  };

  const handleReject = async () => {
    if (!confirmRejectUser) return;
    setActionBusy(true);

    try {
      const token = localStorage.getItem("zyllotech_token") || "demo_jwt_token_admin";
      const res = await fetch(`/api/admin/registrations/${confirmRejectUser.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        showToast(data.message || "Account registration request rejected.");
        setConfirmRejectUser(null);
        fetchRegistrations();
        setActionBusy(false);
        return;
      }
    } catch (e) {}

    // Fallback local update
    try {
      const raw = localStorage.getItem("zyllotech_registered_users");
      const list = raw ? JSON.parse(raw) : [];
      const updated = list.map((u) => {
        if (u.id === confirmRejectUser.id || u.email === confirmRejectUser.email) {
          return {
            ...u,
            status: "REJECTED",
            approved_at: new Date().toISOString(),
            approved_by: "admin@zyllotech.com",
          };
        }
        return u;
      });

      localStorage.setItem("zyllotech_registered_users", JSON.stringify(updated));
      showToast("Account registration request rejected.");
      setConfirmRejectUser(null);
      fetchRegistrations();
    } catch (err) {}
    setActionBusy(false);
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((u) => {
      // Status filter
      if (statusFilter !== "all") {
        if ((u.status || "PENDING").toUpperCase() !== statusFilter.toUpperCase()) {
          return false;
        }
      }

      // Role filter
      if (roleFilter !== "all") {
        if ((u.role || "").toLowerCase() !== roleFilter.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const nameMatch = (u.name || "").toLowerCase().includes(q);
        const emailMatch = (u.email || "").toLowerCase().includes(q);
        const empIdMatch = (u.employee_id || "").toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !empIdMatch) return false;
      }

      return true;
    });
  }, [registrations, statusFilter, roleFilter, search]);

  const counts = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter((u) => (u.status || "PENDING").toUpperCase() === "PENDING").length;
    const approved = registrations.filter((u) => (u.status || "").toUpperCase() === "APPROVED").length;
    const rejected = registrations.filter((u) => (u.status || "").toUpperCase() === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [registrations]);

  const getRoleBadge = (role) => {
    const r = (role || "").toLowerCase();
    if (r === "hr") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
          HR Portal
        </span>
      );
    }
    if (r === "employee") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 text-[#f96706] border border-orange-200 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
          Employee
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-[#1f4693] border border-blue-200 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
        Client
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold uppercase">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          APPROVED
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-xs font-bold uppercase">
          <XCircle className="h-3 w-3 text-rose-600" />
          REJECTED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-xs font-bold uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        PENDING
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-white p-4 text-xs font-bold text-slate-800 shadow-xl animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="User Registration Requests"
        subtitle="Review, approve, or reject pending role-based signup requests for HR, Client, and Employee accounts."
        icon={UserCheck}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              {counts.pending} Awaiting Approval
            </span>
            <button
              type="button"
              onClick={fetchRegistrations}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7e9ee] bg-white px-3 py-1.5 text-xs font-bold text-[#0f172a] shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#676b7a]" />
              Refresh
            </button>
          </div>
        }
      />

      {/* Metric KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#e7e9ee] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#676b7a] uppercase">
            <span>Total Requests</span>
            <Users className="h-4 w-4 text-[#1f4693]" />
          </div>
          <div className="text-2xl font-black text-[#0f172a] mt-1">{counts.total}</div>
          <p className="text-[11px] text-[#676b7a] mt-0.5">All registered accounts</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase">
            <span>Pending Review</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{counts.pending}</div>
          <p className="text-[11px] text-amber-800/80 mt-0.5">Require administrator sign-off</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase">
            <span>Approved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{counts.approved}</div>
          <p className="text-[11px] text-emerald-800/80 mt-0.5">Active portal login enabled</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-800 uppercase">
            <span>Rejected</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-1">{counts.rejected}</div>
          <p className="text-[11px] text-rose-800/80 mt-0.5">Login denied</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#e7e9ee] bg-white p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Status Pills */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold overflow-x-auto">
          {[
            { id: "all", label: "All Requests", count: counts.total },
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "approved", label: "Approved", count: counts.approved },
            { id: "rejected", label: "Rejected", count: counts.rejected },
          ].map((tab) => {
            const isSel = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSel
                    ? "bg-white text-[#0f172a] shadow-xs font-bold"
                    : "text-[#676b7a] hover:text-[#0f172a]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSel
                      ? "bg-orange-100 text-[#f96706]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role dropdown and Search bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] focus:border-[#f96706] focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="employee">Employee Only</option>
            <option value="hr">HR Only</option>
            <option value="client">Client Only</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#676b7a]" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#cbd5e1] bg-white placeholder-[#94a3b8] focus:border-[#f96706] focus:ring-1 focus:ring-[#f96706] outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl border border-[#e7e9ee] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fafbfc] text-[#0f172a] font-extrabold border-b border-[#e7e9ee] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Requested Role</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4 text-center">Approval Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e9ee]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <span className="inline-block h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2" />
                    Loading registration requests...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#0f172a]">No registration requests found</p>
                    <p className="text-xs text-[#676b7a] mt-0.5">
                      No accounts matched your selected filter &ldquo;{statusFilter}&rdquo;{search ? ` or query &ldquo;${search}&rdquo;` : ""}.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((user) => {
                  const status = (user.status || "PENDING").toUpperCase();
                  const isPending = status === "PENDING";
                  const isApproved = status === "APPROVED";
                  const isRejected = status === "REJECTED";

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition">
                      {/* Full Name */}
                      <td className="py-3.5 px-4 font-bold text-[#0f172a]">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#f96706] font-bold text-xs shrink-0">
                            {(user.name || "U").slice(0, 2).toUpperCase()}
                          </span>
                          <span className="truncate max-w-[180px]">{user.name}</span>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="py-3.5 px-4 text-[#2b303b] font-medium font-mono text-xs">
                        <span className="truncate block max-w-[200px]">{user.email}</span>
                      </td>

                      {/* Requested Role */}
                      <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                      {/* Employee ID */}
                      <td className="py-3.5 px-4">
                        {user.employee_id ? (
                          <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[11px] font-bold text-[#1f4693]">
                            {user.employee_id}
                          </span>
                        ) : user.role === "employee" ? (
                          <span className="text-[11px] text-[#676b7a] italic">Generated upon approval</span>
                        ) : (
                          <span className="text-[#94a3b8]">&mdash;</span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-[#676b7a] whitespace-nowrap">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </td>

                      {/* Approval Status */}
                      <td className="py-3.5 px-4 text-center">{getStatusBadge(user.status)}</td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailModalUser(user)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#e7e9ee] bg-white px-2.5 py-1 text-xs font-semibold text-[#0f172a] shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                            title="View registration metadata"
                          >
                            <Eye className="h-3 w-3 text-[#1f4693]" />
                            <span>Details</span>
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => setConfirmApproveUser(user)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
                                title="Approve account request"
                              >
                                <Check className="h-3 w-3" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setConfirmRejectUser(user)}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
                                title="Reject account request"
                              >
                                <X className="h-3 w-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {isRejected && (
                            <button
                              type="button"
                              onClick={() => setConfirmApproveUser(user)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 text-[11px] font-bold transition cursor-pointer"
                              title="Reconsider and approve account"
                            >
                              <Check className="h-3 w-3" />
                              <span>Re-Approve</span>
                            </button>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => setConfirmRejectUser(user)}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 text-[11px] font-bold transition cursor-pointer"
                              title="Revoke and reject account"
                            >
                              <X className="h-3 w-3" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: VIEW DETAILS ================= */}
      {detailModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#e7e9ee] space-y-4">
            <div className="flex items-start justify-between border-b border-[#e7e9ee] pb-3">
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">Registration Details</h3>
                <p className="text-xs text-[#676b7a]">Full metadata for account request #{detailModalUser.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#2b303b]">
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-[#676b7a] font-semibold">User ID:</span>
                <span className="font-mono font-bold text-[#0f172a]">{detailModalUser.id}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-[#676b7a] font-semibold">Full Name:</span>
                <span className="font-bold text-[#0f172a]">{detailModalUser.name}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-[#676b7a] font-semibold">Email Address:</span>
                <span className="font-mono text-[#0f172a]">{detailModalUser.email}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-[#676b7a] font-semibold">Requested Role:</span>
                <span>{getRoleBadge(detailModalUser.role)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-[#676b7a] font-semibold">Approval Status:</span>
                <span>{getStatusBadge(detailModalUser.status)}</span>
              </div>

              {detailModalUser.employee_id && (
                <div className="flex justify-between border-b border-slate-100 py-1.5">
                  <span className="text-[#676b7a] font-semibold">Generated Employee ID:</span>
                  <span className="font-mono font-black text-[#1f4693] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {detailModalUser.employee_id}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-[#676b7a] font-semibold">Registration Date:</span>
                <span className="text-[#0f172a]">
                  {detailModalUser.created_at
                    ? new Date(detailModalUser.created_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              {detailModalUser.approved_at && (
                <div className="flex justify-between border-b border-slate-100 py-1.5">
                  <span className="text-[#676b7a] font-semibold">Action Timestamp:</span>
                  <span className="text-[#0f172a]">
                    {new Date(detailModalUser.approved_at).toLocaleString()}
                  </span>
                </div>
              )}

              {detailModalUser.approved_by && (
                <div className="flex justify-between border-b border-slate-100 py-1.5">
                  <span className="text-[#676b7a] font-semibold">Reviewed By:</span>
                  <span className="font-bold text-[#0f172a]">{detailModalUser.approved_by}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e7e9ee]">
              <button
                type="button"
                onClick={() => setDetailModalUser(null)}
                className="rounded-xl border border-[#cbd5e1] px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM APPROVAL ================= */}
      {confirmApproveUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e7e9ee] space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">Confirm Account Approval</h3>
                <p className="text-xs text-[#676b7a]">Grant role-based portal access</p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-[#2b303b] space-y-2">
              <p>
                Are you sure you want to approve registration for{" "}
                <strong className="text-[#0f172a] font-bold">{confirmApproveUser.name}</strong> (
                {confirmApproveUser.email})?
              </p>
              <div className="pt-1.5 border-t border-emerald-200/60 flex items-center justify-between font-semibold">
                <span>Role to grant:</span>
                <span className="font-bold text-emerald-800 uppercase">{confirmApproveUser.role}</span>
              </div>
              {confirmApproveUser.role === "employee" && (
                <div className="rounded-lg bg-white border border-emerald-300 p-2.5 text-[11px] text-emerald-900 mt-2">
                  <strong className="block text-emerald-800">Auto Employee ID Generation:</strong>
                  A unique Employee ID (e.g. <code>ZYL-EMP-XXXX</code>) will be permanently generated and saved in the database.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => setConfirmApproveUser(null)}
                className="rounded-xl border border-[#cbd5e1] px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionBusy}
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {actionBusy ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM REJECTION ================= */}
      {confirmRejectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e7e9ee] space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-700 shrink-0">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">Confirm Account Rejection</h3>
                <p className="text-xs text-[#676b7a]">Deny portal registration request</p>
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs text-[#2b303b] space-y-2">
              <p>
                Are you sure you want to reject registration for{" "}
                <strong className="text-[#0f172a] font-bold">{confirmRejectUser.name}</strong> (
                {confirmRejectUser.email})?
              </p>
              <p className="text-[11.5px] text-rose-800">
                The account status will be set to <strong>REJECTED</strong>. The user will be blocked from logging into any portal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => setConfirmRejectUser(null)}
                className="rounded-xl border border-[#cbd5e1] px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionBusy}
                onClick={handleReject}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                {actionBusy ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
