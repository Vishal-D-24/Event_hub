
import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import { nanoid } from 'nanoid';
import { participantsToCSV } from '../utils/csv.js';
import { generateAndSendCertificatesForEvent } from './helpers/certificates.js';

export async function listEvents(req, res, next) {
  try {
    const { category, mode, q } = req.query;
    
    // Get organization ID based on user role
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    
    const filter = { organization: organizationId };
    if (category) filter.category = category;
    if (mode) filter.mode = mode;
    if (q) filter.title = { $regex: q, $options: 'i' };
    
    const events = await Event.find(filter).sort({ createdAt: -1 }).lean();

    const ids = events.map((e) => e._id);
    const counts = await Participant.aggregate([
      { $match: { event: { $in: ids } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

    res.json(events.map((e) => ({ ...e, participantCount: countMap[e._id.toString()] || 0 })));
  } catch (e) {
    next(e);
  }
}

export async function createEvent(req, res, next) {
  const startTime = Date.now();
  try {
    const { title, description, category, mode, startDateTime, endDateTime, location, customFields } = req.body;
    
    // Log request for debugging
    console.log('📝 Create Event Request:', {
      body: { title, description, category, mode, startDateTime, endDateTime, location },
      userId: req.user?._id,
      userRole: req.userRole,
      filesReceived: Object.keys(req.files || {})
    });
    
    if (!title || !mode || !startDateTime || !endDateTime) {
      return res.status(400).json({ error: 'Missing required fields: title, mode, startDateTime, endDateTime' });
    }

    const shareId = nanoid(10);

    // ✅ Cloudinary URLs (these are populated by multer-storage-cloudinary during upload)
    console.log('⏱️ File upload took:', Date.now() - startTime, 'ms');
    
    // Extract Cloudinary URLs - use secure_url for HTTPS
    const posterUrl = req.files?.poster?.[0]?.secure_url || null;
    const certTemplateUrl = req.files?.certTemplate?.[0]?.secure_url || null;
    const signatureUrl = req.files?.signature?.[0]?.secure_url || null;
    console.log('📤 File URLs extracted:', { posterUrl, certTemplateUrl, signatureUrl });

    const organizationId =
      req.userRole === 'organization'
        ? req.user._id
        : req.user.organization._id || req.user.organization;

    const createdByModel = req.userRole === 'organization' ? 'Organization' : 'EventManager';

    const dbStartTime = Date.now();
    const event = await Event.create({
      title,
      description,
      category,
      mode,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      location,
      posterUrl,
      certTemplateUrl,
      signatureUrl,
      customFields: customFields ? JSON.parse(customFields) : [],
      shareId,
      registrationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register/${shareId}`,
      organization: organizationId,
      createdBy: req.user._id,
      createdByModel,
    });

    const totalTime = Date.now() - startTime;
    const dbTime = Date.now() - dbStartTime;
    console.log('✅ Event created successfully:', event._id);
    console.log(`⏱️ Timing: Total ${totalTime}ms (DB: ${dbTime}ms, Upload: ${dbStartTime - startTime}ms)`);
    
    res.json(event);
  } catch (e) {
    console.error('❌ Create Event Error:', e.message, e.stack);
    next(e);
  }
}


export async function getEvent(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOne({ _id: req.params.id, organization: organizationId }).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });
    const count = await Participant.countDocuments({ event: event._id });
    res.json({ ...event, participantCount: count });
  } catch (e) {
    next(e);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const update = {};
    Object.assign(update, req.body);

    if (update.startDateTime) update.startDateTime = new Date(update.startDateTime);
    if (update.endDateTime) update.endDateTime = new Date(update.endDateTime);

    if (req.files?.poster?.[0]) update.posterUrl = req.files.poster[0].path;
    if (req.files?.certTemplate?.[0]) update.certTemplateUrl = req.files.certTemplate[0].path;
    if (req.files?.signature?.[0]) update.signatureUrl = req.files.signature[0].path;

    const organizationId =
      req.userRole === 'organization'
        ? req.user._id
        : req.user.organization._id || req.user.organization;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organization: organizationId },
      update,
      { new: true }
    );

    if (!event) return res.status(404).json({ error: 'Not found' });

    res.json(event);
  } catch (e) {
    next(e);
  }
}


export async function deleteEvent(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOneAndDelete({ _id: req.params.id, organization: organizationId });
    if (!event) return res.status(404).json({ error: 'Not found' });
    await Participant.deleteMany({ event: event._id });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function shareLink(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOne({ _id: req.params.id, organization: organizationId }).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json({ link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register/${event.shareId}` });
  } catch (e) {
    next(e);
  }
}

export async function getParticipantsForEvent(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOne({ _id: req.params.id, organization: organizationId }).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });
    const participants = await Participant.find({ event: event._id }).sort({ createdAt: -1 }).lean();
    res.json(participants);
  } catch (e) {
    next(e);
  }
}

export async function exportParticipantsCSV(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOne({ _id: req.params.id, organization: organizationId }).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });
    const participants = await Participant.find({ event: event._id }).sort({ createdAt: -1 }).lean();
    const csv = participantsToCSV(participants);
    res.header('Content-Type', 'text/csv');
    res.attachment(`participants-${event._id}.csv`);
    res.send(csv);
  } catch (e) {
    next(e);
  }
}

export async function sendCertificatesNow(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOne({ _id: req.params.id, organization: organizationId });
    if (!event) return res.status(404).json({ error: 'Not found' });
    const { sent, total } = await generateAndSendCertificatesForEvent(event._id);
    res.json({ sent, total });
  } catch (e) {
    next(e);
  }
}

export async function sendCertificatesToSelected(req, res, next) {
  try {
    const organizationId = req.userRole === 'organization' ? req.user._id : req.user.organization._id || req.user.organization;
    const event = await Event.findOne({ _id: req.params.id, organization: organizationId });
    if (!event) return res.status(404).json({ error: 'Not found' });
    
    const { participantIds } = req.body;
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ error: 'participantIds array required' });
    }

    const { generateAndSendCertificatesToSelected } = await import('./helpers/certificates.js');
    const { sent, total } = await generateAndSendCertificatesToSelected(event._id, participantIds);
    res.json({ sent, total });
  } catch (e) {
    next(e);
  }
}
