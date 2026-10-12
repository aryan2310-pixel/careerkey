interface LeadPayload {
  fullName: string;
  phone: string;
  city: string;
  course: string;
  questions?: string;
}

/**
 * Sends a non-blocking notification to an external webhook (e.g. Discord, Slack, Zapier, WhatsApp CRM)
 * when a student submits a new counselling inquiry.
 */
export async function sendLeadNotification(lead: LeadPayload): Promise<void> {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🎯 **New Counselling Inquiry on CareerKey!**\n**Student:** ${lead.fullName}\n**Phone:** ${lead.phone}\n**Course:** ${lead.course}\n**City:** ${lead.city}${lead.questions ? `\n**Questions:** ${lead.questions}` : ""}`,
      }),
    });
  } catch (err) {
    // Non-blocking log: Ensures public lead submission never fails or hangs
    console.error("Failed to send lead webhook notification:", err);
  }
}
