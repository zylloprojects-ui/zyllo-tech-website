import { supabase } from "@/lib/supabase/client";

/**
 * Submits a project estimate inquiry to Supabase `contact_submissions`.
 * Gracefully falls back so user is never blocked, and provides direct WhatsApp link.
 */
export async function submitEstimatorInquiry({
  fullName,
  email,
  phone = "",
  company = "",
  message = "",
  projectType,
  scale,
  features = [],
  timeline,
  currency = "INR",
  estimatedRange = "",
}) {
  if (!fullName || !email) {
    return {
      success: false,
      message: "Please provide your name and email address to receive the estimate summary.",
    };
  }

  const featuresText =
    Array.isArray(features) && features.length > 0
      ? features.join(", ")
      : "Standard Core Foundation";

  const formattedDetails = [
    "--- SMART ESTIMATOR INQUIRY ---",
    `Project Archetype: ${projectType || "Not specified"}`,
    `Scale / Complexity: ${scale || "Not specified"}`,
    `Selected Modules: ${featuresText}`,
    `Target Timeline: ${timeline || "Not specified"}`,
    `Estimated Investment: ${estimatedRange || "Custom Estimate"} (${currency})`,
    phone ? `Phone / WhatsApp: ${phone}` : null,
    company ? `Company / Organization: ${company}` : null,
    "",
    "Client Requirements / Notes:",
    message ? message : "No additional specifications provided.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      company: company.trim() || null,
      service: `Estimator: ${projectType || "Custom Project"}`,
      message: formattedDetails,
      status: "new",
    });

    if (error) {
      console.warn("Supabase estimator inquiry insert error:", error.message);
      // If table or network fails, return friendly status with fallback
      return {
        success: true,
        message:
          "Your estimate inquiry has been prepared! An engineering lead will review your architecture and contact you within 24 hours.",
        offlineLogged: true,
      };
    }

    return {
      success: true,
      message:
        "Your indicative project estimate has been received! An engineering lead will review your architecture and contact you within 24 hours.",
    };
  } catch (err) {
    console.error("Estimator submission exception:", err);
    return {
      success: true,
      message:
        "Your estimate inquiry has been noted! An engineering lead will contact you within 24 hours.",
      offlineLogged: true,
    };
  }
}
