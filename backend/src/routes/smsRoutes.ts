import { Router } from 'express';
import { rateLimiter } from '../middlewares/rateLimiter';
import { getStats, sendSMS } from '../controllers/smsController';

const router = Router();

router.post('/send-sms', rateLimiter, sendSMS);
router.get('/stats', getStats);

export default router;
