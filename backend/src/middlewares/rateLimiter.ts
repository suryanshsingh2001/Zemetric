import { Request, Response, NextFunction, response } from "express";
import redis from "../config/redis";
import logger from "../utils/Logger";

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

      //Add retry-after header

      res.status(429).json({
        message: `Too many requests, try again in ${ttlMinute} seconds`,
        retryAfter: ttlMinute,
      });

      logger.error(`Too many requests, try again in ${ttlMinute} seconds`, {
        response: {
          ip,
          phoneNumber,
          keyMinute,
          minuteCount,
          ttlMinute,
        },
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
        retryafter: Math.ceil(ttlDay / 60 / 60),
      });

      logger.error(
        `Daily limit reached, try again in ${Math.ceil(
          ttlDay / 60 / 60
        )} hours`,
        {
          response: {
            ip,
            phoneNumber,
            keyDay,
            dayCount,
            ttlDay,
          },
        }
      );

      return;
    }

    next();
  } catch (error) {
    logger.error("Rate limiter error", { error: (error as any).message });
    res.status(500).json({ error: "Internal server error" });
  }
};
export default rateLimiter;
