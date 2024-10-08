import { Router } from 'express';
import { sendSMS } from '../controllers/smsController';
import rateLimiter from '../middlewares/rateLimiter';

const router = Router();

router.post('/send', rateLimiter, sendSMS);

export default router;
