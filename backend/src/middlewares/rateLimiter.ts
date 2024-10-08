import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

const RATE_LIMIT_MINUTE = 3;
const RATE_LIMIT_DAY = 10;

const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { phoneNumber } = req.body;
  const ip = req.ip;

  const keyMinute = `sms:${ip}:${phoneNumber}:minute`;
  const keyDay = `sms:${ip}:${phoneNumber}:day`;

  try {
    // Minute-based rate limiting
    const minuteCount = await redis.get(keyMinute);
    if (minuteCount && parseInt(minuteCount) >= RATE_LIMIT_MINUTE) {
      const ttlMinute = await redis.ttl(keyMinute);

      // Log the violation
      await redis.lpush(
        `rateLimitViolations:${ip}`,
        `Minute limit exceeded for ${phoneNumber} at ${new Date().toISOString()}`
      );
      await redis.expire(`rateLimitViolations:${ip}`, 60 * 60); // Expire violations after 1 hour

      res.status(429).json({
        message: `Too many requests, try again in ${ttlMinute} seconds`,
      });

      return;
    }

    // Day-based rate limiting
    const dayCount = await redis.get(keyDay);
    if (dayCount && parseInt(dayCount) >= RATE_LIMIT_DAY) {
      const ttlDay = await redis.ttl(keyDay);

      // Log the violation
      await redis.lpush(
        `rateLimitViolations:${ip}`,
        `Daily limit exceeded for ${phoneNumber} at ${new Date().toISOString()}`
      );
      await redis.expire(`rateLimitViolations:${ip}`, 60 * 60);

      res.status(429).json({
        message: `Daily limit reached, try again in ${Math.ceil(
          ttlDay / 60 / 60
        )} hours`,
      });

      return;
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default rateLimiter;
