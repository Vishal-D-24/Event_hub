import bcrypt from 'bcryptjs';
import EventManager from '../models/EventManager.js';

// Event Manager Login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const eventManager = await EventManager.findOne({ email }).populate('organization');

    if (!eventManager) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!eventManager.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact your organization.' });
    }

    const ok = await bcrypt.compare(password, eventManager.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = eventManager._id.toString();
    req.session.userRole = 'eventManager';

    res.json({
      id: eventManager._id,
      email: eventManager.email,
      name: eventManager.name,
      phone: eventManager.phone,
      organization: {
        id: eventManager.organization._id,
        name: eventManager.organization.organizationName,
      },
      permissions: eventManager.permissions,
      role: 'eventManager',
    });
  } catch (e) {
    next(e);
  }
}

// Get Current Event Manager Profile
export async function getProfile(req, res, next) {
  try {
    const eventManager = await EventManager.findById(req.user._id)
      .populate('organization', 'organizationName email')
      .select('-password')
      .lean();

    if (!eventManager) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(eventManager);
  } catch (e) {
    next(e);
  }
}
