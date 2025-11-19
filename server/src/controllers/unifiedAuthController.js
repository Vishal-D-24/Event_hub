import Organization from '../models/Organization.js';
import EventManager from '../models/EventManager.js';

// Universal Logout
export async function logout(req, res, next) {
  try {
    req.session.destroy(() => res.json({ ok: true }));
  } catch (e) {
    next(e);
  }
}

// Get Current User (Organization or EventManager)
export async function me(req, res, next) {
  try {
    const userId = req.session?.userId;
    const userRole = req.session?.userRole;

    if (!userId || !userRole) {
      return res.json(null);
    }

    let user;
    if (userRole === 'organization') {
      user = await Organization.findById(userId).select('-password').lean();
      if (user) {
        user.role = 'organization';
      }
    } else if (userRole === 'eventManager') {
      user = await EventManager.findById(userId)
        .populate('organization', 'organizationName')
        .select('-password')
        .lean();
      if (user) {
        user.role = 'eventManager';
      }
    }

    if (!user) {
      return res.json(null);
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
}
