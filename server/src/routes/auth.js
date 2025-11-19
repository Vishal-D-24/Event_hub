import { Router } from 'express';
import { logout, me } from '../controllers/unifiedAuthController.js';

const router = Router();

// Universal routes for all user types
router.post('/logout', logout);
router.get('/me', me);

export default router;
