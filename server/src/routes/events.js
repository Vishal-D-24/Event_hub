import { Router } from 'express';
import multer from 'multer';
import CloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
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

// ✅ Initialize Cloudinary with env vars (must be called before using upload)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Validate Cloudinary config is loaded
if (!process.env.CLOUDINARY_API_KEY) {
  console.error('❌ CLOUDINARY_API_KEY not set in environment variables');
  throw new Error('CLOUDINARY_API_KEY is required');
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smart-event-hub/events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.use(requireAuth);

router.get('/', listEvents);

router.post(
  '/',
  requirePermission('canCreateEvents'),
  upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'certTemplate', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  createEvent
);

router.get('/:id', getEvent);

router.put(
  '/:id',
  requirePermission('canEditEvents'),
  upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'certTemplate', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  updateEvent
);

router.delete('/:id', requirePermission('canDeleteEvents'), deleteEvent);

router.post('/:id/share', shareLink);

router.get(
  '/:id/participants',
  requirePermission('canManageRegistrations'),
  getParticipantsForEvent
);

router.get(
  '/:id/export',
  requirePermission('canManageRegistrations'),
  exportParticipantsCSV
);

router.post(
  '/:id/send-certificates',
  requirePermission('canGenerateCertificates'),
  sendCertificatesNow
);

router.post(
  '/:id/send-certificates-selected',
  requirePermission('canGenerateCertificates'),
  sendCertificatesToSelected
);

export default router;
