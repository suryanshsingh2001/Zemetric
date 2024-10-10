import { Request, response, Response } from "express";
import redis from "../config/redis";
import logger from "../utils/Logger";

// Fetch SMS usage stats (last minute and today)
export const getSMSStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber } = req.query;
  const ip = req.ip;

  const keyMinute = `sms:${ip}:${phoneNumber}:minute`;
  const keyDay = `sms:${ip}:${phoneNumber}:day`;

  try {
    const minuteCount = (await redis.get(keyMinute)) || 0;
    const dayCount = (await redis.get(keyDay)) || 0;

    //Get violations here as well
    const violations = await redis.lrange(`rateLimitViolations:${ip}`, 0, -1);

    const violationsCount = violations.length;

    logger.info("SMS statistics retrieved", {
      response: {
        ip,
        phoneNumber,
        minuteCount,
        dayCount,
        violationsCount,
      },
    });

    res.status(200).json({
      smsSentInLastMinute: parseInt(minuteCount as string),
      totalSmsSentToday: parseInt(dayCount as string),
      violations: violationsCount,
    });
  } catch (error) {
    logger.error("Failed to retrieve SMS statistics", {
      response: { ip, phoneNumber, error },
    });
    res.status(500).json({ error: "Failed to retrieve SMS statistics" });
  }
};

// Fetch rate limit violations (log them in Redis, if required)
export const getRateLimitViolations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ip = req.ip;

  try {
    const violations = await redis.lrange(`rateLimitViolations:${ip}`, 0, -1); // Store violations in a list
    logger.info(`Rate limit violations retrieved : ${violations.length}`, {
      response: {
        ip,
        violations,
      },
    });
    res.status(200).json({ violations });
  } catch (error) {
    logger.error("Failed to retrieve rate limit violations", {
      response: { ip, error },
    });
    res.status(500).json({ error: "Failed to retrieve rate limit violations" });
  }
};
