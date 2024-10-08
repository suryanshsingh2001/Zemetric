// src/config/redis.ts

import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined, // Optional, in case Redis is password protected
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;

// Function to connect to Redis (if required for external Redis or monitoring)
export const connectRedis = () => {
    redisClient.ping((err, res) => {
        if (err) {
            console.error('Error connecting to Redis:', err);
        } else {
            console.log('Redis is connected and responding:', res);
        }
    });
};
