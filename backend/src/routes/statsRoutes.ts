import { Router } from "express";
import {
  getSMSStats,
  getRateLimitViolations,
} from "../controllers/statsController";

const router = Router();

// Route to get SMS usage stats
router.get("/usage", getSMSStats);

// Route to get rate limit violations
router.get("/violations", getRateLimitViolations);

export default router;
