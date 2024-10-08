import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ipAddress = req.ip;  // Get client IP
    const phoneNumber = req.body.phoneNumber;  // Assume phoneNumber is in the request body
    const redisKey = `sms:${ipAddress}:${phoneNumber}`;
    
    try {
        // Fetch current counts from Redis
        const requestsPerMinute = await redisClient.get(`${redisKey}:minute`);
        const requestsPerDay = await redisClient.get(`${redisKey}:day`);

        // Convert to numbers (or default to 0)
        const minuteCount = parseInt(requestsPerMinute || '0', 10);
        const dayCount = parseInt(requestsPerDay || '0', 10);

        if (minuteCount >= 3) {
            // Rate limit exceeded for minute
            const retryAfter = await redisClient.ttl(`${redisKey}:minute`);
            res.set('Retry-After', retryAfter.toString());
            res.status(429).json({ error: 'Too many requests. Try again later.' });
            return;  // Stop further execution, ensuring `void` is returned
        }

        if (dayCount >= 10) {
            // Rate limit exceeded for the day
            const retryAfter = await redisClient.ttl(`${redisKey}:day`);
            res.set('Retry-After', retryAfter.toString());
            res.status(429).json({ error: 'Daily limit reached. Try again tomorrow.' });
            return;  // Stop further execution, ensuring `void` is returned
        }

        // Increment rate limit counts in Redis and set expiration time (1 minute for minute limit, 1 day for daily limit)
        await redisClient.multi()
            .incr(`${redisKey}:minute`)
            .expire(`${redisKey}:minute`, 60)  // 1 minute limit
            .incr(`${redisKey}:day`)
            .expire(`${redisKey}:day`, 86400)  // 1 day limit
            .exec();

        // Move to the next middleware/controller
        next();
    } catch (err) {
        console.error('Rate limiter error:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;  // Stop further execution, ensuring `void` is returned
    }
};
