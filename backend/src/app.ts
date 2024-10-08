import express from 'express';
import smsRoutes from './routes/smsRoutes';
import statsRoutes from './routes/statsRoutes';
import { connectRedis } from './config/redis';

const app = express();

app.use(express.json());


//connect to redis

connectRedis();

// SMS API routes
app.use('/api/sms', smsRoutes);

// Stats API routes
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
