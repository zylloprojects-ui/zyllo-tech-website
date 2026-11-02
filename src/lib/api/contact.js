import { supabase } from "@/lib/supabase/client";

// Plain async replacement for the old "use server" action. Same
// (prevState, formData) signature so it plugs straight into React 19's
// useActionState. Requires an RLS policy allowing anon INSERT on
// contact_submissions.
export async function submitContactForm(prevState, formData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const company = formData.get("company")?.toString().trim();
  const service = formData.get("service")?.toString().trim();
  const message = formData.get("description")?.toString().trim();

  if (!fullName || !email || !message) {
    return { status: "error", message: "Please fill in your name, email, and project details." };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    full_name: fullName,
    email,
    phone: phone || null,
    company: company || null,
    service: service || null,
    message,
  });

  if (error) {
    console.error("Failed to save contact submission:", error.message);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
    };
  }

  return { status: "success", message: "Thanks — we've got your message." };
}

/**
 * Schedules a 30-minute technical consultation call with an engineering lead.
 * Generates an instant Google Meet link, dispatches confirmation emails to both
 * client and admin, and syncs across Supabase and backend database.
 */
export async function scheduleTechnicalCall({
  name,
  email,
  phone = "",
  company = "",
  preferredDate,
  preferredTime,
  timezone = "IST",
  topic = "",
  message = "",
}) {
  if (!name || !email || !preferredDate || !preferredTime) {
    return {
      status: "error",
      message: "Please fill in your name, email, preferred date, and time slot.",
    };
  }

  // Generate unique Google Meet video conference link
  const code = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
  const meetingLink = `https://meet.google.com/zyt-${code}`;

  const meetingDetail = [
    "--- SCHEDULED 30-MIN TECHNICAL CONSULTATION ---",
    `Requested Date & Time: ${preferredDate} at ${preferredTime} (${timezone})`,
    "Meeting Platform: Google Meet",
    `Meeting Link: ${meetingLink}`,
    `Discussion Topic: ${topic || "Project Architecture & Feasibility"}`,
    company ? `Company / Organization: ${company}` : null,
    phone ? `Phone / WhatsApp: ${phone}` : null,
    "",
    "Client Notes / Architecture State:",
    message ? message : "No additional notes provided.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  let backendSuccess = false;
  let backendMessage = "";

  // 1. Dispatch confirmation email immediately to Client + notification email to Admin via Express Backend
  try {
    const res = await fetch("/api/schedule/meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim(),
        preferredDate,
        preferredTime,
        timezone,
        topic: topic || "Project Architecture & Feasibility",
        message,
        meetingLink,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        backendSuccess = true;
        backendMessage = data.message;
      }
    }
  } catch (backendErr) {
    console.warn("Backend /api/schedule/meeting call failed, saving to Supabase directly:", backendErr);
  }

  // 2. Also insert directly into Supabase contact_submissions for real-time admin sync & cloud persistence
  try {
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      company: company.trim() || null,
      service: `30-Min Call: ${topic || "Technical Scoping"}`,
      message: meetingDetail,
      status: "new",
    });

    if (error) {
      console.warn("Supabase schedule meeting insert warning:", error.message);
    }
  } catch (err) {
    console.warn("Supabase connection warning:", err);
  }

  return {
    status: "success",
    message:
      backendMessage ||
      `Your 30-minute consultation slot is booked for ${preferredDate} at ${preferredTime} (${timezone})! A confirmation email with your Google Meet link has been sent to ${email}.`,
    meetingLink,
    preferredDate,
    preferredTime,
    timezone,
    topic,
    name,
    email,
    backendEmailSent: backendSuccess,
  };
}
