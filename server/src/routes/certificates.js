import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
  previewCertificate, 
  sendCertificate, 
  sendBulkCertificates 
} from '../controllers/certificateController.js';

const router = Router();

router.get('/preview/:participantId', requireAuth, previewCertificate);
router.post('/send/:participantId', requireAuth, sendCertificate);
router.post('/send-bulk', requireAuth, sendBulkCertificates);

export default router;
