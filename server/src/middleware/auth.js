import Organization from '../models/Organization.js';
import EventManager from '../models/EventManager.js';

// Authenticate any logged-in user (Organization or EventManager)
export async function requireAuth(req, res, next) {
  try {
    const userId = req.session?.userId;
    const userRole = req.session?.userRole;

    if (!userId || !userRole) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let user;
    if (userRole === 'organization') {
      user = await Organization.findById(userId).lean();
    } else if (userRole === 'eventManager') {
      user = await EventManager.findById(userId)
        .populate('organization')
        .lean();

      if (user && !user.isActive) {
        return res.status(403).json({ error: 'Account is inactive' });
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    req.userRole = userRole;
    next();
  } catch (e) {
    next(e);
  }
}

// Only allow organizations
export async function requireOrganization(req, res, next) {
  try {
    // Run requireAuth normally
    requireAuth(req, res, (err) => {
      if (err) return next(err);

      if (req.userRole !== 'organization') {
        return res
          .status(403)
          .json({ error: 'Access denied. Organizations only.' });
      }

      next();
    });
  } catch (e) {
    next(e);
  }
}

// Check specific permission for event managers
export function requirePermission(permission) {
  return (req, res, next) => {
    try {
      // Organizations have all permissions
      if (req.userRole === 'organization') {
        return next();
      }

      if (req.userRole === 'eventManager') {
        if (!req.user.permissions || !req.user.permissions[permission]) {
          return res.status(403).json({
            error: `Permission denied: ${permission}`,
          });
        }
        return next();
      }

      res.status(403).json({ error: 'Access denied' });
    } catch (e) {
      next(e);
    }
  };
}
