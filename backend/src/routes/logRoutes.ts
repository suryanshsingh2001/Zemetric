import { Router } from "express";
import { readLogs } from "../utils/LogParser";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const logs = await readLogs();
    res.json(logs); 
  } catch (error) {
    console.error("Error reading logs:", error);
    res.status(500).json({ message: "Error reading logs" });
  }
});

export default router;
