"use server";

import { createClient } from "@/lib/supabase/server";

interface LeadData {
  type: "venue" | "contact";
  name: string;
  email: string;
  phone?: string;
  club_name?: string;
  city?: string;
  courts?: string;
  subject?: string;
  message?: string;
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await (supabase.from("leads") as any).insert({
    type: data.type,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    club_name: data.club_name ?? null,
    city: data.city ?? null,
    courts: data.courts ?? null,
    subject: data.subject ?? null,
    message: data.message ?? null,
  });

  if (error) {
    console.error("Lead insert error:", error);
    return { success: false, error: "Failed to save your message. Please try again." };
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailSubject = data.type === "venue"
        ? `New venue enquiry: ${data.club_name} (${data.city})`
        : `New contact message from ${data.name}`;

      const rows = [
        ["Name", data.name],
        ["Email", data.email],
        data.phone ? ["Phone", data.phone] : null,
        data.club_name ? ["Club", data.club_name] : null,
        data.city ? ["City", data.city] : null,
        data.courts ? ["Courts", data.courts] : null,
        data.subject ? ["Subject", data.subject] : null,
        data.message ? ["Message", data.message] : null,
      ]
        .filter(Boolean)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#9ca3af;font-size:13px">${k}</td><td style="padding:4px 0;font-size:13px">${v}</td></tr>`)
        .join("");

      await resend.emails.send({
        from: "PaddleMate <onboarding@resend.dev>",
        to: ["islas104@gmail.com"],
        subject: emailSubject,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#111;color:#fff;border-radius:12px">
            <h2 style="margin:0 0 20px;font-size:20px">${data.type === "venue" ? "🏟️ New Venue Enquiry" : "💬 New Contact Message"}</h2>
            <table style="border-collapse:collapse;width:100%">${rows}</table>
            <p style="margin-top:24px;font-size:12px;color:#6b7280">Submitted via paddlemate.co.uk</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Resend error:", e);
    }
  }

  return { success: true };
}
