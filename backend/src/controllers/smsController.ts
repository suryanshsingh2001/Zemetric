import { Request, Response } from "express";
import { sendSMSMessage, getSMSStats } from "../services/smsService";

export const sendSMS = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, message } = req.body;
    const smsResponse = await sendSMSMessage(phoneNumber, message);
    res.status(200).json(smsResponse);
  } catch (error) {
    res.status(500).json({ error: "Failed to send SMS" });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getSMSStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve stats" });
  }
};
