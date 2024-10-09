import { Request, response, Response } from "express";
import redis from "../config/redis";
import logger from "../utils/Logger";

export const sendSMS = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, message } = req.body;
  const ip = req.ip;

  const keyMinute = `sms:${ip}:${phoneNumber}:minute`;
  const keyDay = `sms:${ip}:${phoneNumber}:day`;

  //Although, we have handled this case in client side, but still we are checking here
  if (!phoneNumber || !message) {
    logger.error("Missing required fields", {
      response: { ip, phoneNumber, message },
    });

    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    // Increment request count for the minute
    const minuteCount = await redis.incr(keyMinute);
    if (minuteCount === 1) {
      await redis.expire(keyMinute, 60); // Set 1-minute expiration
    }

    // Increment request count for the day
    const dayCount = await redis.incr(keyDay);
    if (dayCount === 1) {
      await redis.expire(keyDay, 24 * 60 * 60); // Set 24-hour expiration
    }

    // Log SMS sent
    // console.log(`SMS sent to ${phoneNumber} from ${ip}: ${message}`);

    logger.info("SMS sent successfully", {
      response: {
        ip,
        phoneNumber,
        message,
      },
    });

    res.status(200).json({ message: "SMS sent successfully!" });
  } catch (error) {
    // console.error("Error sending SMS:", error);
    logger.error("Failed to send SMS", {
      response: { ip, phoneNumber, message, error },
    });
    res.status(500).json({ error: "Failed to send SMS" });
  }
};
