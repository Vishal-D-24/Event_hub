import Event from '../../models/Event.js';
import Participant from '../../models/Participant.js';
import { generateCertificateBuffer } from '../../utils/pdf.js';
import { sendEmail } from '../../utils/mailer.js';

export async function generateAndSendCertificatesForEvent(eventId) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  const participants = await Participant.find({ event: event._id }).lean();
  let sent = 0;
  for (const p of participants) {
    const buffer = await generateCertificateBuffer({
      participantName: p.name,
      event,
      templatePath: event.certTemplatePath,
      signaturePath: event.signaturePath,
    });

    try {
      await sendEmail({
        to: p.email,
        subject: `Certificate - ${event.title}`,
        html: `<p>Dear ${p.name},</p><p>Please find your certificate attached.</p>`,
        attachments: [{ filename: `certificate-${p._id}.pdf`, content: buffer.toString('base64') }],
      });
      await Participant.findByIdAndUpdate(p._id, { certificateSent: true, certificateSentAt: new Date() });
      sent++;
    } catch (e) {
      // continue
    }
  }
  event.certificatesSent = true;
  await event.save();
  return { sent, total: participants.length };
}

export async function generateAndSendCertificatesToSelected(eventId, participantIds) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  const participants = await Participant.find({ 
    event: event._id,
    _id: { $in: participantIds }
  }).lean();
  
  let sent = 0;
  for (const p of participants) {
    const buffer = await generateCertificateBuffer({
      participantName: p.name,
      event,
      templatePath: event.certTemplatePath,
      signaturePath: event.signaturePath,
    });

    try {
      await sendEmail({
        to: p.email,
        subject: `Certificate - ${event.title}`,
        html: `<p>Dear ${p.name},</p><p>Please find your certificate attached.</p>`,
        attachments: [{ filename: `certificate-${p._id}.pdf`, content: buffer.toString('base64') }],
      });
      await Participant.findByIdAndUpdate(p._id, { certificateSent: true, certificateSentAt: new Date() });
      sent++;
    } catch (e) {
      // continue
    }
  }
  return { sent, total: participants.length };
}
