import { Router } from 'express';
import { getPublicEventByShareId, registerForEvent } from '../controllers/participantController.js';

const router = Router();

router.get('/public/:shareId', getPublicEventByShareId);
router.post('/register/:shareId', registerForEvent);

export default router;
