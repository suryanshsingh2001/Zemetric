import Redis from "ioredis";
import logger from "../utils/Logger";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined, // Optional, in case Redis is password protected
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis", {
    response: {
      host: redisClient.options.host,
      port: redisClient.options.port,
    },
  });
});

redisClient.on("error", (err) => {
  logger.error(`Redis connection error: ${err}`);
});

export default redisClient;

// Function to connect to Redis (if required for external Redis or monitoring)
export const connectRedis = () => {
  redisClient.ping((err, res) => {
    if (err) {
      logger.error("Error connecting to Redis:", err);
    } else {
      logger.info("Redis is connected and responding:" + res);
    }
  });
};
