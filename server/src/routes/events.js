import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import {
  listEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  shareLink,
  getParticipantsForEvent,
  exportParticipantsCSV,
  sendCertificatesNow,
  sendCertificatesToSelected,
} from '../controllers/eventController.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});

const upload = multer({ storage });

router.use(requireAuth);

router.get('/', listEvents);
router.post('/', requirePermission('canCreateEvents'), upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'certTemplate', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
]), createEvent);
router.get('/:id', getEvent);
router.put('/:id', requirePermission('canEditEvents'), upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'certTemplate', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
]), updateEvent);
router.delete('/:id', requirePermission('canDeleteEvents'), deleteEvent);
router.post('/:id/share', shareLink);
router.get('/:id/participants', requirePermission('canManageRegistrations'), getParticipantsForEvent);
router.get('/:id/export', requirePermission('canManageRegistrations'), exportParticipantsCSV);
router.post('/:id/send-certificates', requirePermission('canGenerateCertificates'), sendCertificatesNow);
router.post('/:id/send-certificates-selected', requirePermission('canGenerateCertificates'), sendCertificatesToSelected);

export default router;
