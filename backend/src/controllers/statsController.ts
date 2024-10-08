import { Request, Response } from 'express';
import redis from '../config/redis';

// Fetch SMS usage stats (last minute and today)
export const getSMSStats = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber } = req.query;
  const ip = req.ip;

  const keyMinute = `sms:${ip}:${phoneNumber}:minute`;
  const keyDay = `sms:${ip}:${phoneNumber}:day`;

  try {
    const minuteCount = await redis.get(keyMinute) || 0;
    const dayCount = await redis.get(keyDay) || 0;

    res.status(200).json({
      smsSentInLastMinute: parseInt(minuteCount as string),
      totalSmsSentToday: parseInt(dayCount as string),
    });
  } catch (error) {
    console.error('Error fetching SMS stats:', error);
    res.status(500).json({ error: 'Failed to retrieve SMS statistics' });
  }
};

// Fetch rate limit violations (log them in Redis, if required)
export const getRateLimitViolations = async (req: Request, res: Response): Promise<void> => {
  const ip = req.ip;

  try {
    const violations = await redis.lrange(`rateLimitViolations:${ip}`, 0, -1);  // Store violations in a list
    res.status(200).json({ violations });
  } catch (error) {
    console.error('Error fetching rate limit violations:', error);
    res.status(500).json({ error: 'Failed to retrieve rate limit violations' });
  }
};
