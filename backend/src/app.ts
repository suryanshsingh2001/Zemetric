import express from "express";
import smsRoutes from "./routes/smsRoutes";
import statsRoutes from "./routes/statsRoutes";
import logRoutes from "./routes/logRoutes";
import { connectRedis } from "./config/redis";
import cors from "cors";
import logger from "./utils/Logger";

const app = express();

app.use(cors());
app.use(express.json());

//connect to redis

connectRedis();

// SMS API routes
app.use("/api/sms", smsRoutes);

// Stats API routes
app.use("/api/stats", statsRoutes);

app.use("/api/logs", logRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started and listening on port ${PORT}`);
});
