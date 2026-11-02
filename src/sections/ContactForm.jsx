"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "@/lib/nx/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  User,
  Video,
} from "lucide-react";
import { SERVICES as SERVICES_LIST } from "@/data/services";
import { submitContactForm, scheduleTechnicalCall } from "@/lib/api/contact";

const SERVICES = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Cloud Solutions",
  "AI Solutions",
  "Maintenance & Support",
  "Cybersecurity Engineering",
  "Quality Engineering & QA",
  "Product Strategy & Consulting",
  "Other",
];

const NEXT_STEPS = [
  { title: "We read your message", text: "Your inquiry goes straight to our team." },
  { title: "We get back to you", text: "You receive a reply with suggested next steps." },
  { title: "We talk it through", text: "A straightforward, no-pressure conversation." },
];

const INCLUDE = [
  "What you want to achieve (your goals)",
  "Your preferred timeline, if you have one",
  "A budget range, if known",
  "Existing systems or tools we should know about",
];

const SCHEDULE_STEPS = [
  {
    title: "Direct 1-on-1 Scoping",
    text: "A 30-minute Google Meet or Zoom session with a lead software architect.",
  },
  {
    title: "Architecture & Feasibility",
    text: "Review of your requirements, technical stack, integrations, and milestones.",
  },
  {
    title: "Actionable Roadmap",
    text: "We send an indicative sprint breakdown and architecture plan with zero obligations.",
  },
];

const TIME_SLOTS = [
  { value: "10:00 AM IST", label: "10:00 AM IST (04:30 AM UTC / Asia Morning)" },
  { value: "02:00 PM IST", label: "02:00 PM IST (08:30 AM UTC / EU Morning)" },
  { value: "04:30 PM IST", label: "04:30 PM IST (11:00 AM UTC / EU Midday)" },
  { value: "07:00 PM IST", label: "07:00 PM IST (01:30 PM UTC / US East Morning)" },
  { value: "09:00 PM IST", label: "09:00 PM IST (03:30 PM UTC / US East Noon)" },
  { value: "10:30 PM IST", label: "10:30 PM IST (05:00 PM UTC / US West Morning)" },
];

const initialState = { status: "idle", message: "" };

const inputBase =
  "min-h-12 w-full rounded-xl border border-[#cbd5e1] bg-white py-3 pl-11 pr-4 text-base text-[#0f172a] placeholder:text-[#64748b] outline-none transition-all duration-200 hover:border-[#94a3b8] focus:border-[#f96706] focus:ring-4 focus:ring-[#f96706]/20";

function RequiredMark() {
  return (
    <span className="ml-0.5 text-[#c9580d]" aria-hidden="true">
      *
    </span>
  );
}

function Field({ id, label, required, icon: Icon, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-semibold text-[#0f172a]">
        {label}
        {required && <RequiredMark />}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]"
          aria-hidden="true"
        />
        {children}
      </div>
    </div>
  );
}

function ServiceChips({ value, onChange, error }) {
  function toggle(service) {
    onChange(value.includes(service) ? value.filter((item) => item !== service) : [...value, service]);
  }
  return (
    <div>
      <input type="hidden" name="service" value={value.join(", ")} />
      <div role="group" aria-labelledby="service-label" className="flex flex-wrap gap-2">
        {SERVICES.map((service) => {
          const selected = value.includes(service);
          return (
            <button
              key={service}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => toggle(service)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-[15px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f96706]/30 ${
                selected
                  ? "border-[#f96706] bg-[#fff2e2] font-semibold text-[#a84a0b]"
                  : "border-[#cbd5e1] bg-white text-[#1e293b] hover:border-[#f96706]/60 hover:bg-[#fffaf5]"
              }`}
            >
              {selected && <Check className="h-4 w-4 text-[#f96706]" aria-hidden="true" />}
              {service}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[15px] font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  // Mode: "message" (Send a message) | "schedule" (Book a 30-min call)
  const [mode, setMode] = useState("message");

  // Sync mode with URL hash (#schedule / #message)
  useEffect(() => {
    function checkHash() {
      if (typeof window !== "undefined" && window.location.hash === "#schedule") {
        setMode("schedule");
        const el = document.getElementById("contact-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (typeof window !== "undefined" && window.location.hash === "#message") {
        setMode("message");
      }
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Standard message form state
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [service, setService] = useState([]);
  const [serviceError, setServiceError] = useState("");
  const [count, setCount] = useState(0);
  const [dismissed, setDismissed] = useState(null);

  // 30-Min Call form state
  const todayDateStr = new Date().toISOString().split("T")[0];
  const [schedData, setSchedData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: todayDateStr,
    preferredTime: "04:30 PM IST",
    topic: "",
    message: "",
  });
  const [schedLoading, setSchedLoading] = useState(false);
  const [schedResult, setSchedResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  function handleMessageSubmit(event) {
    if (service.length === 0) {
      event.preventDefault();
      setServiceError("Please select at least one service.");
    }
  }

  function sendAnotherMessage() {
    setDismissed(state);
    setService([]);
    setServiceError("");
    setCount(0);
  }

  async function handleScheduleSubmit(e) {
    e.preventDefault();
    setSchedLoading(true);
    setSchedResult(null);

    const result = await scheduleTechnicalCall({
      name: schedData.name,
      email: schedData.email,
      phone: schedData.phone,
      company: schedData.company,
      preferredDate: schedData.preferredDate,
      preferredTime: schedData.preferredTime,
      timezone: "IST",
      topic: schedData.topic,
      message: schedData.message,
    });

    setSchedLoading(false);
    setSchedResult(result);
  }

  function resetScheduleForm() {
    setSchedData({
      name: "",
      email: "",
      phone: "",
      company: "",
      preferredDate: todayDateStr,
      preferredTime: "04:30 PM IST",
      topic: "",
      message: "",
    });
    setSchedResult(null);
  }

  const showSuccess = state.status === "success" && dismissed !== state;

  const schedWhatsappText = encodeURIComponent(
    `Hello Zyllo Tech! I just scheduled a 30-Minute Technical Call for ${schedData.preferredDate} at ${schedData.preferredTime} to discuss "${schedData.topic || "Project Architecture"}". Looking forward to connecting!`
  );

  return (
    <section id="contact-section" className="relative overflow-hidden border-t border-[#d9dde2] bg-[#f6f8fc] py-10 lg:py-14">
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* Mode Selector Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center rounded-2xl border border-[#d9dde2] bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setMode("message");
                if (typeof window !== "undefined") window.history.replaceState(null, "", "#message");
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                mode === "message"
                  ? "bg-[#173a52] text-white shadow-md shadow-[#173a52]/20"
                  : "text-[#667085] hover:text-[#1d2735]"
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Send a Message</span>
            </button>

            <button
              type="button"
              id="schedule"
              onClick={() => {
                setMode("schedule");
                if (typeof window !== "undefined") window.history.replaceState(null, "", "#schedule");
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                mode === "schedule"
                  ? "bg-[#f96706] text-white shadow-md shadow-[#f96706]/30"
                  : "text-[#667085] hover:text-[#1d2735]"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Book a 30-Min Call</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                  mode === "schedule" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                }`}
              >
                Meet / Zoom
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-8">
          
          {/* Side Panel: Contextual based on mode */}
          <aside className="order-2 rounded-2xl border border-[#dfe5ef] bg-[#eef3fa] p-6 text-[#1d2735] lg:order-1 lg:p-7">
            {mode === "schedule" ? (
              <>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
                  <Video className="h-3.5 w-3.5" />
                  <span>Google Meet or Zoom</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#173a52]">
                  What to expect on your call
                </h3>
                <ol className="mt-4 space-y-3.5">
                  {SCHEDULE_STEPS.map((step, i) => (
                    <li key={step.title} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f96706] text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="min-w-0 text-[15px] leading-snug">
                        <span className="block font-semibold text-[#173a52]">{step.title}</span>
                        <span className="block text-[#3d4858]">{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="mt-5 flex items-center gap-2 text-[15px] font-semibold text-[#173a52]">
                  <Clock className="h-4 w-4 shrink-0 text-[#f96706]" aria-hidden="true" />
                  30 minutes · 100% technical insights, zero sales pressure.
                </p>

                <div className="mt-6 border-t border-[#d3dbe8] pt-5">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#173a52]">
                    Common discussion topics
                  </span>
                  <ul className="mt-3 space-y-2 text-[14px] text-[#3d4858]">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Enterprise AI Copilot &amp; RAG Architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Web SaaS Portal Scaling &amp; Cloud Migration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Mobile App (Flutter / React Native) MVP Scope</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Dedicated Engineering Pod Onboarding</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 border-t border-[#d3dbe8] pt-5">
                  <Link
                    href="/estimator"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-[#f96706] hover:text-[#c9580d]"
                  >
                    <span>Need preliminary pricing first? Try our Cost Estimator</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#173a52]">What happens next</span>
                <ol className="mt-4 space-y-3.5">
                  {NEXT_STEPS.map((step, i) => (
                    <li key={step.title} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#173a52] text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="min-w-0 text-[15px] leading-snug">
                        <span className="block font-semibold text-[#173a52]">{step.title}</span>
                        <span className="block text-[#3d4858]">{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 flex items-center gap-2 text-[15px] font-semibold text-[#173a52]">
                  <Clock className="h-4 w-4 shrink-0 text-[#c9580d]" aria-hidden="true" />
                  We reply within one business day.
                </p>

                <div className="mt-6 border-t border-[#d3dbe8] pt-5">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#173a52]">What to include</span>
                  <ul className="mt-3 space-y-2">
                    {INCLUDE.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#3d4858]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7f4d]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-[#d3dbe8] pt-5">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#173a52]">Our services</span>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {SERVICES_LIST.map((svc) => (
                      <li key={svc.slug}>
                        <Link
                          href={`/services/${svc.slug}`}
                          className="inline-flex min-h-11 items-center rounded-full border border-[#c9d3e3] bg-white px-3.5 py-2 text-[15px] font-medium text-[#1f4693] transition-colors hover:border-[#1f4693] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1f4693]/30"
                        >
                          {svc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </aside>

          {/* Form Card */}
          <div className="order-1 min-w-0 overflow-hidden rounded-2xl border border-[#e2e5ea] bg-white shadow-xl shadow-[#1c2f4a]/10 lg:order-2">
            <div
              aria-hidden="true"
              className={`h-1.5 bg-gradient-to-r ${
                mode === "schedule"
                  ? "from-[#f96706] via-[#ff9c68] to-[#9333ea]"
                  : "from-[#f96706] via-[#f7941e] to-[#3089a6]"
              }`}
            />

            <div className="p-5 sm:p-8">
              
              {/* MODE 2: BOOK A 30-MIN TECHNICAL CALL */}
              {mode === "schedule" ? (
                schedResult?.status === "success" ? (
                  <div role="status" className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-300">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
                      <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
                    </span>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Slot Booked &amp; Meet Link Generated</span>
                    </div>

                    <h3 className="mt-3 text-2xl font-extrabold text-[#1d2735]">
                      30-Minute Technical Call Confirmed!
                    </h3>
                    
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#4a5668]">
                      Your consultation slot is booked. A confirmation email with your Google Meet link has been dispatched to{" "}
                      <strong className="text-[#1d2735]">{schedData.email}</strong>, and our engineering team has been notified.
                    </p>

                    {/* Prominent Google Meet Box */}
                    <div className="mt-6 w-full max-w-lg rounded-2xl border-2 border-[#f96706]/40 bg-gradient-to-b from-[#fffaf5] to-[#fff4ea] p-5 text-left shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#f96706]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f96706] text-white">
                            <Video className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#9a3412]">
                              Confirmed Video Meeting
                            </div>
                            <div className="text-sm font-extrabold text-[#1d2735]">Google Meet Video Call</div>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          30 Minutes
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-[#3d4858]">
                        <div className="flex justify-between py-1 border-b border-orange-100">
                          <span className="font-medium text-[#78350f]">Date &amp; Time:</span>
                          <span className="font-bold text-[#1d2735]">
                            {schedData.preferredDate} at {schedData.preferredTime}
                          </span>
                        </div>
                        {schedData.topic && (
                          <div className="flex justify-between py-1 border-b border-orange-100">
                            <span className="font-medium text-[#78350f]">Focus Topic:</span>
                            <span className="font-bold text-[#1d2735]">{schedData.topic}</span>
                          </div>
                        )}
                        <div className="pt-2">
                          <span className="block font-medium text-[#78350f] mb-1">Meeting Link:</span>
                          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white p-2">
                            <input
                              type="text"
                              readOnly
                              value={schedResult.meetingLink || "https://meet.google.com/zyt-tech-meet"}
                              className="w-full bg-transparent text-xs font-semibold text-[#1d2735] outline-none select-all"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const link = schedResult.meetingLink || "https://meet.google.com/zyt-tech-meet";
                                if (navigator?.clipboard?.writeText) {
                                  navigator.clipboard.writeText(link);
                                  setCopiedLink(true);
                                  setTimeout(() => setCopiedLink(false), 2500);
                                }
                              }}
                              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-[#f96706] hover:bg-orange-100 transition-colors"
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Call Action Buttons */}
                      <div className="mt-4 flex flex-wrap items-center gap-2.5">
                        <a
                          href={schedResult.meetingLink || "https://meet.google.com/zyt-tech-meet"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f96706] to-[#ea580c] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#f96706]/25 hover:brightness-105 transition-all text-center"
                        >
                          <Video className="h-4 w-4" />
                          <span>Join Google Meet</span>
                          <ExternalLink className="h-3 w-3 opacity-80" />
                        </a>

                        <a
                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                            `30-Min Technical Consultation: Zyllo Tech & ${schedData.name || "Client"}`
                          )}&details=${encodeURIComponent(
                            `30-Minute Technical Scoping & Architecture Call with Zyllo Tech Engineering Pod.\n\nTopic: ${
                              schedData.topic || "Architecture & Feasibility"
                            }\nMeeting Link: ${schedResult.meetingLink || "https://meet.google.com/zyt-tech-meet"}\nPhone: +91 70757 73680`
                          )}&location=${encodeURIComponent(schedResult.meetingLink || "https://meet.google.com/zyt-tech-meet")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#d0d5dd] bg-white px-3.5 py-2 text-xs font-semibold text-[#344054] hover:bg-neutral-50 transition-colors shadow-sm"
                        >
                          <CalendarCheck className="h-3.5 w-3.5 text-[#1f4693]" />
                          <span>Add to Google Calendar</span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={`https://wa.me/917075773680?text=${schedWhatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Confirm via WhatsApp (+91 70757 73680)</span>
                      </a>
                      <button
                        type="button"
                        onClick={resetScheduleForm}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d0d5dd] bg-white px-4 py-2 text-xs font-semibold text-[#344054] hover:bg-neutral-50 transition-colors"
                      >
                        Book Another Session
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
                        <Video className="h-3.5 w-3.5" />
                        <span>Google Meet / Zoom Consultation</span>
                      </div>
                      <h2 className="text-2xl font-extrabold tracking-tight text-[#1d2735] sm:text-3xl">
                        Schedule a{" "}
                        <span className="bg-gradient-to-r from-[#f96706] to-[#9333ea] bg-clip-text text-transparent">
                          30-Minute Technical Call
                        </span>
                      </h2>
                      <p className="mt-1.5 text-base leading-relaxed text-[#4a5668]">
                        Pick a date and time slot to discuss architecture feasibility, sprint timelines, or RFP specs directly with our engineering lead.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field id="sched-name" label="Full Name" required icon={User}>
                        <input
                          id="sched-name"
                          type="text"
                          required
                          placeholder="Alex Morgan"
                          value={schedData.name}
                          onChange={(e) => setSchedData({ ...schedData, name: e.target.value })}
                          className={inputBase}
                        />
                      </Field>

                      <Field id="sched-email" label="Work Email" required icon={Mail}>
                        <input
                          id="sched-email"
                          type="email"
                          required
                          placeholder="alex@company.com"
                          value={schedData.email}
                          onChange={(e) => setSchedData({ ...schedData, email: e.target.value })}
                          className={inputBase}
                        />
                      </Field>

                      <Field id="sched-company" label="Company / Organization" icon={Building2}>
                        <input
                          id="sched-company"
                          type="text"
                          placeholder="HyperCloud Global (optional)"
                          value={schedData.company}
                          onChange={(e) => setSchedData({ ...schedData, company: e.target.value })}
                          className={inputBase}
                        />
                      </Field>

                      <Field id="sched-phone" label="Phone / WhatsApp" icon={Phone}>
                        <input
                          id="sched-phone"
                          type="tel"
                          placeholder="+91 70757 73680"
                          value={schedData.phone}
                          onChange={(e) => setSchedData({ ...schedData, phone: e.target.value })}
                          className={inputBase}
                        />
                      </Field>

                      <div>
                        <label htmlFor="sched-date" className="mb-1.5 block text-[15px] font-semibold text-[#1d2735]">
                          Preferred Date <RequiredMark />
                        </label>
                        <div className="relative">
                          <Calendar
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
                            aria-hidden="true"
                          />
                          <input
                            id="sched-date"
                            type="date"
                            required
                            min={todayDateStr}
                            value={schedData.preferredDate}
                            onChange={(e) => setSchedData({ ...schedData, preferredDate: e.target.value })}
                            className={inputBase}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="sched-time" className="mb-1.5 block text-[15px] font-semibold text-[#1d2735]">
                          Preferred Time Slot <RequiredMark />
                        </label>
                        <div className="relative">
                          <Clock
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
                            aria-hidden="true"
                          />
                          <select
                            id="sched-time"
                            required
                            value={schedData.preferredTime}
                            onChange={(e) => setSchedData({ ...schedData, preferredTime: e.target.value })}
                            className={inputBase}
                          >
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="sched-topic" className="mb-1.5 block text-[15px] font-semibold text-[#1d2735]">
                        Primary Discussion Focus
                      </label>
                      <input
                        id="sched-topic"
                        type="text"
                        placeholder="e.g. AI RAG integration feasibility, SaaS migration, Mobile MVP"
                        value={schedData.topic}
                        onChange={(e) => setSchedData({ ...schedData, topic: e.target.value })}
                        className="min-h-12 w-full rounded-xl border border-[#d9dde2] bg-white px-4 py-3 text-base text-[#1d2735] placeholder:text-[#667085] outline-none transition-all duration-200 hover:border-[#b9c0cb] focus:border-[#f96706] focus:ring-4 focus:ring-[#f96706]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="sched-message" className="mb-1.5 block text-[15px] font-semibold text-[#1d2735]">
                        Technical Notes / Current Architecture State
                      </label>
                      <textarea
                        id="sched-message"
                        rows={3}
                        placeholder="Tell us about existing code repositories, cloud providers (AWS/GCP), or target launch constraints..."
                        value={schedData.message}
                        onChange={(e) => setSchedData({ ...schedData, message: e.target.value })}
                        className="w-full resize-y rounded-xl border border-[#d9dde2] bg-white px-4 py-3 text-base text-[#1d2735] placeholder:text-[#667085] outline-none transition-all duration-200 hover:border-[#b9c0cb] focus:border-[#f96706] focus:ring-4 focus:ring-[#f96706]/20"
                      />
                    </div>

                    {schedResult?.status === "error" && (
                      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[15px] font-medium text-red-700">
                        {schedResult.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={schedLoading}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f96706] via-[#ea580c] to-[#9333ea] px-8 py-3 text-base font-bold text-white shadow-[0_14px_28px_-10px_rgba(249,103,6,0.7)] transition-all duration-200 hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f96706]/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {schedLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                          <span>Scheduling Consultation...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-5 w-5" aria-hidden="true" />
                          <span>Confirm 30-Minute Technical Call</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs text-[#667085] pt-1">
                      <span className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Private &amp; Confidential · NDA Available upon request</span>
                      </span>
                      <span>Google Meet / Zoom invite sent to your email</span>
                    </div>
                  </form>
                )
              ) : (
                /* MODE 1: SEND A MESSAGE (EXISTING FORM) */
                showSuccess ? (
                  <div role="status" className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f6ee] text-[#1f7f4d]">
                      <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-2xl font-extrabold text-[#1d2735]">Thanks, we&apos;ve got your message.</h3>
                    <p className="mt-2 max-w-sm text-base leading-relaxed text-[#4a5668]">
                      Our team will reach out within one business day.
                    </p>
                    <button
                      type="button"
                      onClick={sendAnotherMessage}
                      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#1f4693]/40 bg-white px-6 py-2.5 text-[15px] font-semibold text-[#1f4693] transition-colors hover:border-[#1f4693] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1f4693]/30"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form action={formAction} onSubmit={handleMessageSubmit} className="flex flex-col gap-5">
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight text-[#1d2735] sm:text-3xl">
                        Send us a{" "}
                        <span className="bg-gradient-to-r from-[#f96706] to-[#3089a6] bg-clip-text text-transparent">
                          message
                        </span>
                      </h2>
                      <p className="mt-1.5 text-base leading-relaxed text-[#4a5668]">
                        Share a few details and we&apos;ll reply within one business day. No spam, no pressure.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field id="fullName" label="Full Name" required icon={User}>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          placeholder="Your full name"
                          className={inputBase}
                        />
                      </Field>
                      <Field id="email" label="Email" required icon={Mail}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="you@company.com"
                          className={inputBase}
                        />
                      </Field>
                      <Field id="phone" label="Phone Number" required icon={Phone}>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          placeholder="+91 00000 00000"
                          className={inputBase}
                        />
                      </Field>
                      <Field id="company" label="Company Name" icon={Building2}>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          placeholder="Your company (optional)"
                          className={inputBase}
                        />
                      </Field>
                    </div>

                    <div>
                      <span id="service-label" className="mb-2 block text-[15px] font-semibold text-[#1d2735]">
                        Service Required
                        <RequiredMark />
                        <span className="ml-2 text-sm font-normal text-[#667085]">Select all that apply</span>
                      </span>
                      <ServiceChips
                        value={service}
                        onChange={(next) => {
                          setService(next);
                          setServiceError("");
                        }}
                        error={serviceError}
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <label htmlFor="description" className="text-[15px] font-semibold text-[#1d2735]">
                          Project Description
                          <RequiredMark />
                        </label>
                        <span className="text-[15px] text-[#667085]">{count} characters</span>
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        onChange={(e) => setCount(e.target.value.length)}
                        placeholder="Tell us a bit about what you're looking to build..."
                        className="w-full resize-y rounded-xl border border-[#d9dde2] bg-white px-4 py-3 text-base text-[#1d2735] placeholder:text-[#667085] outline-none transition-all duration-200 hover:border-[#b9c0cb] focus:border-[#f96706] focus:ring-4 focus:ring-[#f96706]/20"
                      />
                      <p className="mt-1.5 text-[15px] text-[#667085]">
                        <RequiredMark /> Required fields. A sentence or two is plenty to start.
                      </p>
                    </div>

                    {state.status === "error" && (
                      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[15px] font-medium text-red-700">
                        {state.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isPending}
                      aria-busy={isPending}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f96706] to-[#e8590c] px-8 py-3 text-base font-bold text-white shadow-[0_14px_28px_-10px_rgba(249,103,6,0.7)] transition-all duration-200 hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f96706]/40 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </button>

                    <div className="flex flex-col gap-1 text-[15px] leading-relaxed text-[#4a5668] sm:flex-row sm:items-center sm:justify-between">
                      <p className="inline-flex items-center gap-2">
                        <Lock className="h-4 w-4 shrink-0 text-[#1f7f4d]" aria-hidden="true" />
                        <span>
                          Your details stay private. See our{" "}
                          <Link
                            href="/privacy"
                            className="font-semibold text-[#1f4693] underline underline-offset-4 hover:text-[#c9580d]"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </p>
                      <Link
                        href="/careers#open-positions"
                        className="inline-flex min-h-11 items-center gap-1 font-semibold text-[#1f4693] underline underline-offset-4 hover:text-[#c9580d]"
                      >
                        Looking for a job?
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </form>
                )
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
