import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import { sendEmail } from '../utils/mailer.js'; // ✅ Brevo mail function

export async function getPublicEventByShareId(req, res, next) {
  try {
    const event = await Event.findOne({ shareId: req.params.shareId }).lean();
    if (!event) return res.status(404).json({ error: 'Invalid link' });

    res.json({
      title: event.title,
      description: event.description,
      mode: event.mode,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      location: event.location,
      customFields: event.customFields || [],
      posterUrl: event.posterPath 
        ? `${process.env.BACKEND_URL}/${event.posterPath.replace(/\\/g,'/')}`
        : null,
    });
  } catch (e) {
    next(e);
  }
}

export async function registerForEvent(req, res, next) {
  try {
    const event = await Event.findOne({ shareId: req.params.shareId });
    if (!event) return res.status(404).json({ error: 'Invalid link' });

    const { name, email, phone, college, yearDept, customResponses } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

    const participant = await Participant.create({
      name,
      email,
      phone,
      college,
      yearDept,
      event: event._id,
      customResponses: customResponses || {}
    });

    const eventDate = event.startDateTime 
      ? new Date(event.startDateTime).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short'
        })
      : 'TBD';

    // ✅ Registration Confirmation Email (Brevo)
    const confirmationHTML = `
      <div style="font-family: Arial; max-width: 600px; margin: auto;">
        <h2 style="background:#667eea; color:white; padding:18px; text-align:center;">Registration Confirmed ✅</h2>
        <div style="padding:25px; background:white;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>You have successfully registered for:</p>

          <h2 style="color:#667eea;">${event.title}</h2>
          ${event.description ? `<p>${event.description}</p>` : ''}

          <p><strong>Date:</strong> ${eventDate}</p>
          ${event.mode ? `<p><strong>Mode:</strong> ${event.mode}</p>` : ''}
          ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}

          <p style="margin-top:25px;">We’ll send updates soon. Stay tuned!</p>
          <p>— Smart Event Hub Team</p>
        </div>
      </div>
    `;

    // Fire email (no await – do not slow request)
    sendEmail({
      to: email,
      subject: `Registration Confirmed - ${event.title}`,
      html: confirmationHTML,
    });

    res.json({ ok: true, id: participant._id });

  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'You have already registered.' });
    }
    next(e);
  }
}
