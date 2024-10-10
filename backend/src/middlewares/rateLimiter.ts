import { Request, Response, NextFunction, response } from "express";
import redis from "../config/redis";
import logger from "../utils/Logger";

const RATE_LIMIT_MINUTE = 3;
const RATE_LIMIT_DAY = 10;

/**
 * Middleware function for rate limiting based on IP address and phone number.
 * This function limits the number of requests that can be made from a specific IP address
 * and phone number combination within a minute and a day.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if there is an issue with the rate limiting process.
 *
 * @description
 * The rate limiter checks the number of requests made from a specific IP address and phone number
 * combination within a minute and a day. If the limit is exceeded, it responds with a 429 status code
 * and a message indicating when the user can retry. It also logs the rate limit violations and sets
 * an expiration for the violation logs.
 *
 * - Minute-based rate limiting:
 *   - Key format: `sms:{ip}:{phoneNumber}:minute`
 *   - If the number of requests exceeds `RATE_LIMIT_MINUTE`, it responds with a 429 status code
 *     and a retry-after header indicating the remaining time in seconds.
 *
 * - Day-based rate limiting:
 *   - Key format: `sms:{ip}:{phoneNumber}:day`
 *   - If the number of requests exceeds `RATE_LIMIT_DAY`, it responds with a 429 status code
 *     and a retry-after header indicating the remaining time in hours.
 *
 
 */
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
