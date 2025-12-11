import bcrypt from 'bcryptjs';
import Organization from '../models/Organization.js';
import EventManager from '../models/EventManager.js';
import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import { sendEmail } from '../utils/mailer.js';

// Organization Signup
export async function signup(req, res, next) {
  try {
    const { email, password, name, organizationName, phone, address } = req.body;

    if (!email || !password || !name || !organizationName) {
      return res.status(400).json({ error: 'Email, password, name, and organization name are required' });
    }

    const existing = await Organization.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const organization = await Organization.create({
      email,
      password: hashed,
      name,
      organizationName,
      phone,
      address,
    });

    req.session.userId = organization._id.toString();
    req.session.userRole = 'organization';

    // Welcome Email
    const welcomeHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1>Welcome to Smart Event Hub!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p>Hi ${name},</p>
          <p>Your organization account for <strong>${organizationName}</strong> has been successfully created.</p>
          <p>You can now create events and manage event managers.</p>
          <p><a href="${process.env.FRONTEND_URL}/dashboard" style="padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px;">Get Started</a></p>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: 'Welcome to Smart Event Hub!',
      html: welcomeHTML,
    });

    res.json({
      id: organization._id,
      email: organization.email,
      name: organization.name,
      organizationName: organization.organizationName,
      role: 'organization',
    });
  } catch (e) {
    next(e);
  }
}

// Organization Login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const organization = await Organization.findOne({ email });

    if (!organization) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, organization.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = organization._id.toString();
    req.session.userRole = 'organization';

    res.json({
      id: organization._id,
      email: organization.email,
      name: organization.name,
      organizationName: organization.organizationName,
      role: 'organization',
    });
  } catch (e) {
    next(e);
  }
}

// Create Event Manager
export async function createEventManager(req, res, next) {
  try {
    const { email, password, name, phone, permissions } = req.body;
    const organizationId = req.user._id;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existing = await EventManager.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const eventManager = await EventManager.create({
      email,
      password: hashed,
      name,
      phone,
      organization: organizationId,
      permissions: permissions || {},
    });

    // Send credentials email
    const credentialsHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1>Event Manager Account Created</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p>Hi ${name},</p>
          <p>You have been added as an Event Manager for <strong>${req.user.organizationName}</strong>.</p>
          <p><strong>Login Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><a href="${process.env.FRONTEND_URL}/event-manager/login" style="padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px;">Login Now</a></p>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: 'Event Manager Account - Smart Event Hub',
      html: credentialsHTML,
    });

    res.json({
      id: eventManager._id,
      email: eventManager.email,
      name: eventManager.name,
      phone: eventManager.phone,
      permissions: eventManager.permissions,
      isActive: eventManager.isActive,
    });
  } catch (e) {
    next(e);
  }
}

// List Event Managers
export async function listEventManagers(req, res, next) {
  try {
    const organizationId = req.user._id;
    const managers = await EventManager.find({ organization: organizationId })
      .select('-password')
      .lean();

    res.json(managers);
  } catch (e) {
    next(e);
  }
}

// Update Event Manager
export async function updateEventManager(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone, permissions, isActive } = req.body;
    const organizationId = req.user._id;

    const manager = await EventManager.findOne({ _id: id, organization: organizationId });
    if (!manager) {
      return res.status(404).json({ error: 'Event manager not found' });
    }

    if (name) manager.name = name;
    if (phone !== undefined) manager.phone = phone;
    if (permissions) manager.permissions = { ...manager.permissions, ...permissions };
    if (isActive !== undefined) manager.isActive = isActive;

    await manager.save();

    res.json({
      id: manager._id,
      email: manager.email,
      name: manager.name,
      phone: manager.phone,
      permissions: manager.permissions,
      isActive: manager.isActive,
    });
  } catch (e) {
    next(e);
  }
}

// Delete Event Manager
export async function deleteEventManager(req, res, next) {
  try {
    const { id } = req.params;
    const organizationId = req.user._id;

    const manager = await EventManager.findOneAndDelete({ _id: id, organization: organizationId });
    if (!manager) {
      return res.status(404).json({ error: 'Event manager not found' });
    }

    res.json({ message: 'Event manager deleted successfully' });
  } catch (e) {
    next(e);
  }
}

// Get Organization Analytics
export async function getAnalytics(req, res, next) {
  try {
    const organizationId = req.user._id;

    const totalEvents = await Event.countDocuments({ organization: organizationId });
    const totalManagers = await EventManager.countDocuments({ organization: organizationId });
    const totalParticipants = await Participant.countDocuments({
      event: { $in: await Event.find({ organization: organizationId }).distinct('_id') },
    });

    const upcomingEvents = await Event.countDocuments({
      organization: organizationId,
      startDateTime: { $gte: new Date() },
    });

    const pastEvents = await Event.countDocuments({
      organization: organizationId,
      endDateTime: { $lt: new Date() },
    });

    res.json({
      totalEvents,
      totalManagers,
      totalParticipants,
      upcomingEvents,
      pastEvents,
    });
  } catch (e) {
    next(e);
  }
}
