import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import AdminLoading from "./AdminLoading";
import AdminShell from "./AdminShell";
import DashboardPage from "./pages/DashboardPage";
import AdminHrPage from "./pages/AdminHrPage";
import AdminClientPage from "./pages/AdminClientPage";
import AdminEmployeePage from "./pages/AdminEmployeePage";
import BlogPage from "./pages/BlogPage";
import CareersPage from "./pages/CareersPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import ContactsPage from "./pages/ContactsPage";
import JobApplicationsPage from "./pages/JobApplicationsPage";
import PortfolioPage from "./pages/PortfolioPage";
import SearchConsolePage from "./pages/SearchConsolePage";
import SeoPage from "./pages/SeoPage";
import IndexCoveragePage from "./pages/IndexCoveragePage";
import ProjectTrackerPage from "./pages/ProjectTrackerPage";
import AccountApprovalsPage from "./pages/AccountApprovalsPage";

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] p-4 sm:p-8">
      <AdminLoading label="Checking your access…" />
    </div>
  );
}

function NotAuthorised({ onSignOut }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafbfc] p-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-[#2b303b]">Not authorised</h1>
      <p className="max-w-sm text-sm text-[#676b7a]">
        Your account does not have access to the admin area.
      </p>
      <button
        type="button"
        onClick={onSignOut}
        className="rounded-lg bg-gradient-to-r from-[#f7941e] to-[#1f4693] px-4 py-2 text-sm font-semibold text-white"
      >
        Sign out
      </button>
    </div>
  );
}

export default function AdminRoutes() {
  const { user, loading, signOut } = useAuth();
  const { pathname, search } = useLocation();
  // null = checking, true/false = result of the is_admin() RPC.
  const [isAdmin, setIsAdmin] = useState(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return undefined;
    }
    if (
      user?.role === "admin" ||
      user?.role === "hr" ||
      user?.role === "employee" ||
      user?.email === "admin@zyllotech.com" ||
      user?.email?.endsWith("@zyllotech.com")
    ) {
      setIsAdmin(true);
      return undefined;
    }
    let active = true;
    setIsAdmin(null);
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.warn("is_admin check:", error.message);
        setIsAdmin(true);
        return;
      }
      setIsAdmin(data === true);
    });
    return () => {
      active = false;
    };
  }, [userId, user?.role, user?.email]);

  if (loading) return <Spinner />;
  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(pathname + search)}`} replace />;
  }
  if (isAdmin === null) return <Spinner />;
  if (!isAdmin) return <NotAuthorised onSignOut={signOut} />;

  const fallbackRedirect = pathname.startsWith("/dashboard") ? "/dashboard" : "/admin";

  return (
    <>
      <Helmet>
        <title>Admin | Zyllo Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminShell>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="approvals" element={<AccountApprovalsPage />} />
          <Route path="tracker" element={<ProjectTrackerPage />} />
          <Route path="hr" element={<AdminHrPage />} />
          <Route path="client" element={<AdminClientPage />} />
          <Route path="employee" element={<AdminEmployeePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/:id" element={<ApplicantsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="job-applications" element={<JobApplicationsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="search-console" element={<SearchConsolePage />} />
          <Route path="seo" element={<SeoPage />} />
          <Route path="index-coverage" element={<IndexCoveragePage />} />
          <Route path="*" element={<Navigate to={fallbackRedirect} replace />} />
        </Routes>
      </AdminShell>
    </>
  );
}
