"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
} from "lucide-react";
import Link from "@/lib/nx/link";
import Seo from "@/components/Seo";
import { useAuth, getPortalDestination } from "@/lib/auth";

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading, signUp } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // "HR" | "Client" | "Employee"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // If already authenticated and approved, redirect to their portal
  useEffect(() => {
    if (!loading && user && user.status !== "PENDING" && user.status !== "REJECTED") {
      navigate(getPortalDestination(user), { replace: true });
    }
  }, [user, loading, navigate]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  function validate() {
    if (!form.name || form.name.trim().length < 2) {
      return "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.password || form.password.length < 10) {
      return "Password is required and must be at least 10 characters long.";
    }

    if (!form.confirmPassword || form.password !== form.confirmPassword) {
      return "Passwords do not match. Please verify your confirm password field.";
    }

    const allowedRoles = ["hr", "client", "employee"];
    if (!form.role || !allowedRoles.includes(form.role.toLowerCase())) {
      return "Please select a valid role: HR, Client, or Employee.";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setBusy(true);

    try {
      const res = await signUp({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role.toLowerCase(),
      });

      setBusy(false);

      if (res?.error) {
        setError(res.error.message || "Registration failed. Please check your details and try again.");
        return;
      }

      // Success - show required awaiting approval message
      setSuccessData({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        message:
          res?.data?.message ||
          "Your registration has been submitted successfully! Your account is awaiting administrator approval. You will be able to log in once your account has been approved.",
      });
    } catch (err) {
      setBusy(false);
      setError("An unexpected network error occurred. Please try again.");
    }
  }

  return (
    <>
      <Seo title="Sign Up | Zyllo Tech" path="/signup" noindex />
      <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f96706] to-[#f7941e] text-white font-extrabold shadow-sm">
              Z
            </span>
            <span className="text-2xl font-black tracking-tight text-[#0f172a]">
              Zyllo <span className="text-[#3089a6]">Tech</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0f172a]">
            {successData ? "Registration Submitted" : "Create your account"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#676b7a]">
            {successData
              ? "Account request submitted for administrator verification"
              : "Register for role-based portal access with administrator approval"}
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="rounded-2xl border border-[#e7e9ee] bg-white p-6 sm:p-8 shadow-sm">
            {successData ? (
              // Success Screen with the Exact Required Confirmation Message
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-[#0f172a]">
                    Registration Pending Approval
                  </h3>
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-left">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-semibold leading-relaxed text-amber-900">
                        Your registration has been submitted successfully! Your account is awaiting administrator approval. You will be able to log in once your account has been approved.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration summary card */}
                <div className="rounded-xl border border-[#e7e9ee] bg-[#fafbfc] p-4 text-xs text-left space-y-2 text-[#2b303b]">
                  <div className="flex justify-between border-b border-[#e7e9ee] pb-1.5">
                    <span className="text-[#676b7a] font-medium">Full Name:</span>
                    <strong className="font-bold text-[#0f172a]">{successData.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#e7e9ee] pb-1.5">
                    <span className="text-[#676b7a] font-medium">Email Address:</span>
                    <strong className="font-bold text-[#0f172a]">{successData.email}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#e7e9ee] pb-1.5">
                    <span className="text-[#676b7a] font-medium">Requested Role:</span>
                    <span className="rounded-full bg-orange-100 text-[#f96706] px-2 py-0.5 font-bold text-[11px]">
                      {successData.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#676b7a] font-medium">Account Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      PENDING
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              // Registration Form with Exactly 5 Fields
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Field 1: Full Name */}
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-bold text-[#0f172a] mb-1">
                    Full Name <span className="text-[#f96706]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#676b7a]" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={form.name}
                      onChange={handleChange("name")}
                      className="w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-[#2b303b] placeholder:text-[#94a3b8] focus:border-[#f96706] focus:ring-1 focus:ring-[#f96706] outline-none transition"
                    />
                  </div>
                </div>

                {/* Field 2: Email Address */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold text-[#0f172a] mb-1">
                    Email Address <span className="text-[#f96706]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#676b7a]" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="e.g. alex.morgan@company.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      className="w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-[#2b303b] placeholder:text-[#94a3b8] focus:border-[#f96706] focus:ring-1 focus:ring-[#f96706] outline-none transition"
                    />
                  </div>
                </div>

                {/* Field 3: Password (min 10 chars) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reg-password" className="block text-xs font-bold text-[#0f172a]">
                      Password <span className="text-[#f96706]">*</span>
                    </label>
                    <span className="text-[10px] text-[#676b7a] font-medium">Min. 10 characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#676b7a]" />
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={10}
                      placeholder="Enter minimum 10 characters"
                      value={form.password}
                      onChange={handleChange("password")}
                      className="w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-10 py-2 text-xs sm:text-sm text-[#2b303b] placeholder:text-[#94a3b8] focus:border-[#f96706] focus:ring-1 focus:ring-[#f96706] outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#676b7a] hover:text-[#0f172a] cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Field 4: Confirm Password */}
                <div>
                  <label htmlFor="reg-confirm" className="block text-xs font-bold text-[#0f172a] mb-1">
                    Confirm Password <span className="text-[#f96706]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#676b7a]" />
                    <input
                      id="reg-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      className="w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-10 py-2 text-xs sm:text-sm text-[#2b303b] placeholder:text-[#94a3b8] focus:border-[#f96706] focus:ring-1 focus:ring-[#f96706] outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-[#676b7a] hover:text-[#0f172a] cursor-pointer"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Field 5: Sign Up As (Dropdown: HR, Client, Employee) */}
                <div>
                  <label htmlFor="reg-role" className="block text-xs font-bold text-[#0f172a] mb-1">
                    Sign Up As <span className="text-[#f96706]">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-[#676b7a]" />
                    <select
                      id="reg-role"
                      required
                      value={form.role}
                      onChange={handleChange("role")}
                      className="w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-[#2b303b] focus:border-[#f96706] focus:ring-1 focus:ring-[#f96706] outline-none transition cursor-pointer"
                    >
                      <option value="">Select your portal role...</option>
                      <option value="HR">HR</option>
                      <option value="Client">Client</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <p className="mt-1 text-[11px] text-[#676b7a]">
                    Note: All new accounts require administrator approval before portal access is activated.
                  </p>
                </div>

                {/* Validation Error Message */}
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f96706] to-[#f7941e] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Link to Login */}
                <div className="pt-3 border-t border-[#e7e9ee] text-center text-xs text-[#676b7a]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-[#f96706] hover:underline cursor-pointer">
                    Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-[#676b7a]">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Enterprise role-based security &bull; Protected by Zyllo Tech admin governance
        </p>
      </div>
    </>
  );
}
