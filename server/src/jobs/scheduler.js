import cron from 'node-cron';
import Event from '../models/Event.js';
import { generateAndSendCertificatesForEvent } from '../controllers/helpers/certificates.js';

export function startScheduler() {
  // Every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    const now = new Date();
    const dueEvents = await Event.find({ endDateTime: { $lt: now }, certificatesSent: false }).lean();
    for (const e of dueEvents) {
      try {
        await generateAndSendCertificatesForEvent(e._id);
        console.log(`Certificates sent for event ${e._id}`);
      } catch (err) {
        console.error('Scheduler error', err.message);
      }
    }
  });
}
