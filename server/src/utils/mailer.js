import SibApiV3Sdk from "@getbrevo/brevo";

let brevoClient;

export async function sendEmail({ to, subject, html, attachments = [] }) {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY not set in environment variables");
      throw new Error("BREVO_API_KEY not set");
    }

    if (!to) {
      throw new Error("Recipient email address is required");
    }

    // Initialize once
    if (!brevoClient) {
      brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
      brevoClient.setApiKey(
        SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
      );
      console.log("✓ Brevo client initialized");
    }

    // ✅ Read correct sender values
    let senderEmail = process.env.BREVO_SENDER_EMAIL;
    let senderName = process.env.BREVO_SENDER_NAME || "Smart Event Hub";

    const emailPayload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    if (attachments.length > 0) {
      emailPayload.attachment = attachments.map((file) => ({
        name: file.filename,
        content: file.content,
      }));
    }

    const response = await brevoClient.sendTransacEmail(emailPayload);
    console.log("✅ Email sent successfully:", response.messageId || response);
    return response;

  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    if (error.response?.body) console.error("Response:", error.response.body);
    throw error;
  }
}
