import { Router } from 'express';
import { requireOrganization } from '../middleware/auth.js';
import {
  signup,
  login,
  createEventManager,
  listEventManagers,
  updateEventManager,
  deleteEventManager,
  getAnalytics,
} from '../controllers/organizationController.js';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (organization only)
router.use(requireOrganization);
router.post('/event-managers', createEventManager);
router.get('/event-managers', listEventManagers);
router.put('/event-managers/:id', updateEventManager);
router.delete('/event-managers/:id', deleteEventManager);
router.get('/analytics', getAnalytics);

export default router;
