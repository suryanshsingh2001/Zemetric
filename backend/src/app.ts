import express from 'express';
import smsRoutes from './routes/smsRoutes';

import { connectRedis } from './config/redis';

const app = express();
app.use(express.json());

// Connect to Redis and Database
connectRedis();

// Mount routes
app.use('/api/sms', smsRoutes);

export default app;
