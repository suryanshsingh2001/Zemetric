import redisClient from '../config/redis';
import { logSMSRequest } from '../models/smsModel';

// Mock function to simulate SMS sending
const mockSendSMS = async (phoneNumber: string, message: string) => {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    return { success: true, message: 'SMS sent successfully' };
};

// Send SMS message and log request
export const sendSMSMessage = async (phoneNumber: string, message: string) => {
    // Send SMS (replace this with actual SMS API call logic)
    const smsResponse = await mockSendSMS(phoneNumber, message);

    // Log the SMS request (IP and phone number will be passed here)
    await logSMSRequest(phoneNumber);

    return smsResponse;
};

// Retrieve SMS statistics (e.g., how many messages sent in the last minute/day)
export const getSMSStats = async () => {
    const minuteCount = await redisClient.get(`minute:stats`);
    const dayCount = await redisClient.get(`day:stats`);

    return {
        minute: minuteCount || 0,
        day: dayCount || 0,
    };
};
