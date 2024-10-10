import { Request, response, Response } from "express";
import redis from "../config/redis";
import logger from "../utils/Logger";

// Fetch SMS usage stats (last minute and today)
/**
 * Retrieves SMS statistics for a given phone number and IP address.
 * 
 * @param req - The HTTP request object, containing query parameters.
 * @param res - The HTTP response object, used to send back the desired HTTP response.
 * 
 * @returns A promise that resolves to void.
 * 
 * This function performs the following tasks:
 * 1. Extracts the `phoneNumber` from the query parameters and the `ip` from the request.
 * 2. Logs an error and responds with a 400 status code if the `phoneNumber` is missing.
 * 3. Constructs Redis keys for tracking SMS counts per minute and per day.
 * 4. Retrieves the SMS counts and rate limit violations from Redis.
 * 5. Logs the retrieved statistics and responds with a 200 status code and the statistics in JSON format.
 * 6. Logs an error and responds with a 500 status code if there is a failure in retrieving the statistics.
 * 
 * @throws Will throw an error if there is an issue with Redis operations.
 */
export const getSMSStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber } = req.query;
  const ip = req.ip;

  if (!phoneNumber) {
    logger.error("Missing required fields", {
      response: { ip, phoneNumber },
    });
    res.status(400).json({ error: "Bad Request: Missing phoneNumber" });
    return;
  }

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



/**
 * Retrieves the rate limit violations for a specific IP address from Redis and sends them in the response.
 *
 * @param req - The HTTP request object, containing the IP address.
 * @param res - The HTTP response object, used to send the response.
 * @returns A promise that resolves to void.
 *
 * @remarks
 * This function fetches the rate limit violations for the IP address found in the request object.
 * It retrieves the violations from a Redis list and logs the number of violations retrieved.
 * If successful, it sends the violations in the response with a 200 status code.
 * If an error occurs during retrieval, it logs the error and sends a 500 status code with an error message.
 *
  * @throws Will throw an error if there is an issue with Redis operations.
 */
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
