import redisClient from "../config/redis";

// Log each SMS request (this function can be extended to save in a database)
export const logSMSRequest = async (phoneNumber: string) => {
  const minuteKey = `minute:stats`;
  const dayKey = `day:stats`;

  // Increment SMS sent stats in Redis
  await redisClient
    .multi()

    .incr(minuteKey)
    .expire(minuteKey, 60) // Expires in 60 seconds (1 minute)
    .incr(dayKey)
    .expire(dayKey, 86400) // Expires in 1 day
    .exec();
};
