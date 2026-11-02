
import { supabase } from "@/lib/supabase/client";

export async function updateSubmissionStatus(submissionId, newStatus) {
  if (!["new", "contacted", "closed"].includes(newStatus)) {
    return { status: "error", message: "Invalid status." };
  }

  // If backend SQLite inquiry ID
  if (typeof submissionId === "string" && submissionId.startsWith("inq_")) {
    const rawId = submissionId.replace("inq_", "");
    try {
      await fetch(`/api/inquiries/${rawId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      return { status: "success" };
    } catch (e) {
      console.warn("Backend inquiry status update failed:", e);
    }
  }

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: newStatus })
    .eq("id", submissionId);

  if (error) {
    console.error("Failed to update submission status:", error.message);
    return { status: "error", message: "Could not update status." };
  }

  return { status: "success" };
}

export async function deleteSubmission(submissionId) {
  if (typeof submissionId === "string" && submissionId.startsWith("inq_")) {
    return { status: "success" };
  }

  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", submissionId);

  if (error) {
    console.error("Failed to delete submission:", error.message);
    return { status: "error", message: "Could not delete submission." };
  }

  return { status: "success" };
}

export async function fetchSubmissions() {
  let supabaseData = [];
  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, full_name, email, phone, company, service, message, status, created_at")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      supabaseData = data;
    }
  } catch (err) {
    console.warn("Supabase fetchSubmissions error:", err.message);
  }

  // Also query backend SQLite /api/inquiries to ensure any 30-min technical consultations are included
  let backendInquiries = [];
  try {
    const res = await fetch("/api/inquiries");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        backendInquiries = data.inquiries.map((row) => ({
          id: `inq_${row.id}`,
          full_name: row.name,
          email: row.email,
          phone: row.phone || null,
          company: row.company || null,
          service: row.service || null,
          message: row.message || "",
          status: (row.status || "new").toLowerCase(),
          created_at: row.created_at || new Date().toISOString(),
        }));
      }
    }
  } catch (backendErr) {
    // Offline / static dev mode
  }

  if (supabaseData.length > 0 && backendInquiries.length > 0) {
    // Merge without duplicating same client requests
    const seen = new Set(
      supabaseData.map((s) => `${s.email}_${s.full_name}_${(s.service || "").slice(0, 15)}`)
    );
    const uniqueBackend = backendInquiries.filter(
      (b) => !seen.has(`${b.email}_${b.full_name}_${(b.service || "").slice(0, 15)}`)
    );
    return [...supabaseData, ...uniqueBackend];
  }

  if (supabaseData.length > 0) return supabaseData;
  if (backendInquiries.length > 0) return backendInquiries;

  return [];
}

/**
 * Resends the 30-min consultation confirmation email with Google Meet link to the client
 */
export async function resendConsultationEmail(consultationData) {
  try {
    const res = await fetch("/api/schedule/resend-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consultationData),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("Failed to resend consultation email:", err);
  }
  return { success: false, message: "Could not reach email delivery service." };
}
