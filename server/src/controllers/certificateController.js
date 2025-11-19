import Participant from '../models/Participant.js';
import Event from '../models/Event.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCertificateBuffer } from '../utils/pdf.js';
import { sendEmail } from '../utils/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function previewCertificate(req, res, next) {
  try {
    const participant = await Participant.findById(req.params.participantId).lean();
    if (!participant) return res.status(404).json({ error: 'Not found' });
    const event = await Event.findById(participant.event).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });

    const buffer = await generateCertificateBuffer({
      participantName: participant.name,
      event,
      templatePath: event.certTemplatePath,

    });

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="certificate-${participant._id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  } catch (e) {
    next(e);
  }
}

export async function sendCertificate(req, res, next) {
  try {
    const { participantId } = req.params;

    const participant = await Participant.findById(participantId);
    if (!participant) {
      console.warn("⚠ Participant not found");
      return res.status(404).json({ error: 'Participant not found' });
    }

    const event = await Event.findById(participant.event);
    if (!event) {
      console.warn("⚠ Event not found");
      return res.status(404).json({ error: 'Event not found' });
    }

    console.log(`📧 Preparing certificate for ${participant.name} (${participant.email})`);

    const buffer = await generateCertificateBuffer({
      participantName: participant.name,
      event,
      templatePath: event.certTemplatePath, // Ensure correct PNG/PDF path
    });

    // ✅ SEND EMAIL
    const sendResult = await sendEmail({
      to: participant.email,
      subject: `Certificate - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations ${participant.name}!</h2>
          <p>You have successfully participated in <strong>${event.title}</strong>.</p>
          <p>Your certificate is attached below.</p>
          <br />
          <p>Best Regards,<br>Smart Event Hub Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `certificate-${event.title.replace(/\s+/g, '-')}.pdf`,
          content: buffer.toString("base64"), // ✅ Base64 required for Brevo
        }
      ]
    });

    console.log(`✅ Email successfully sent: messageId=${sendResult.messageId || "N/A"}`);

    // ✅ UPDATE DB
    participant.certificateSent = true;
    participant.certificateSentAt = new Date();
    await participant.save();

    console.log(`🎉 Certificate marked as sent for ${participant.email}`);

    // ✅ SEND RESPONSE
    return res.status(200).json({
      success: true,
      message: `Certificate sent successfully to ${participant.email}`,
      participant: {
        id: participant._id,
        name: participant.name,
        email: participant.email,
        certificateSent: participant.certificateSent,
        certificateSentAt: participant.certificateSentAt,
      }
    });

  } catch (error) {
    console.error("❌ Certificate sending failed:", error.message);
    if (error.response?.body) console.error("📦 Brevo Response:", error.response.body);
    next(error);
  }
}


export async function sendBulkCertificates(req, res, next) {
  try {
    const { eventId, participantIds } = req.body;

    if (!eventId) return res.status(400).json({ error: 'Event ID required' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const query = { event: eventId };
    if (participantIds && participantIds.length > 0) {
      query._id = { $in: participantIds };
    }

    const participants = await Participant.find(query);

    if (participants.length === 0) {
      return res.status(400).json({ error: 'No participants found' });
    }

    console.log(`📧 Sending certificates to ${participants.length} participants`);

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const participant of participants) {
      try {
        const buffer = await generateCertificateBuffer({
          participantName: participant.name,
          event,
          templatePath: event.certTemplatePath,

        });

        await sendEmail({
          to: participant.email,
          subject: `Certificate - ${event.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Congratulations ${participant.name}!</h2>
              <p>Thank you for participating in <strong>${event.title}</strong>.</p>
              <p>Please find your certificate of participation attached to this email.</p>
              <br>
              <p>Best regards,<br>The Event Team</p>
            </div>
          `,
          attachments: [{
            filename: `certificate-${event.title.replace(/\s+/g, '-')}.pdf`,
            content: buffer.toString('base64')
          }]
        });

        participant.certificateSent = true;
        participant.certificateSentAt = new Date();
        await participant.save();

        sent++;
        console.log(`✅ Sent to ${participant.email}`);
      } catch (error) {
        failed++;
        console.error(`❌ Failed to send to ${participant.email}:`, error.message);
        errors.push({ participant: participant.email, error: error.message });
      }
    }

    if (sent > 0) {
      event.certificatesSent = true;
      await event.save();
    }

    console.log(`✅ Bulk send complete: ${sent} sent, ${failed} failed`);

    res.json({
      success: true,
      message: `Sent ${sent} of ${participants.length} certificates`,
      stats: { sent, failed, total: participants.length },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('❌ Bulk certificate send failed:', error);
    next(error);
  }
}
