import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import SiteChrome from "@/components/SiteChrome";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import ScrollToTopOnRoute from "@/components/ScrollToTopOnRoute";
import PageLoader from "@/components/PageLoader";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail.jsx"));
const Industries = lazy(() => import("./pages/Industries.jsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const CareerDetail = lazy(() => import("./pages/CareerDetail.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Estimator = lazy(() => import("./pages/Estimator.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const SitemapPage = lazy(() => import("./pages/SitemapPage.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const ClientPortal = lazy(() => import("./pages/ClientPortal.jsx"));
const EmployeePortal = lazy(() => import("./pages/EmployeePortal.jsx"));
const HrPortal = lazy(() => import("./pages/HrPortal.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const AdminRoutes = lazy(() => import("./admin/AdminRoutes.jsx"));

export default function App() {
  return (
    <>
      <OrganizationJsonLd />
      <ScrollToTopOnRoute />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin and Workspaces under Admin Shell */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/hr/login" element={<Login />} />
          <Route path="/employee/login" element={<Login />} />
          <Route path="/client/login" element={<Login />} />
          <Route path="/portal/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/dashboard/*" element={<AdminRoutes />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/portal/employee" element={<ClientPortal />} />
          <Route path="/portal/*" element={<ClientPortal />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/client-portal/*" element={<ClientPortal />} />
          <Route path="/employee" element={<EmployeePortal />} />
          <Route path="/employee-portal" element={<EmployeePortal />} />
          <Route path="/employee/dashboard" element={<EmployeePortal />} />
          <Route path="/hr" element={<HrPortal />} />
          <Route path="/hr/employee" element={<HrPortal />} />
          <Route path="/hr/client" element={<HrPortal />} />
          <Route path="/hr/*" element={<HrPortal />} />
          <Route path="/hr-portal" element={<HrPortal />} />
          <Route path="/hr-portal/*" element={<HrPortal />} />

          <Route element={<SiteChrome />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<CareerDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/estimator" element={<Estimator />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
