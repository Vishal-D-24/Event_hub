import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { login, getProfile } from '../controllers/eventManagerController.js';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', requireAuth, getProfile);

export default router;
