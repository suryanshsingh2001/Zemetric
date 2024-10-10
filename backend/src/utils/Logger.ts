import { createLogger, format, transports } from "winston";

// Destructure necessary components from the format
const { combine, timestamp, printf, errors, json } = format;

// Custom log format for the console (string format)
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  let metaString = Object.keys(meta).length
    ? ` | Data: ${JSON.stringify(meta)}`
    : "";
  return `${timestamp} [${level.toUpperCase()}]: ${message}${metaString}`;
});

// Configure the logger
/**
 * Creates a logger instance with specified configurations.
 * 
 * The logger is configured to log messages at the "info" level and above.
 * It uses a combination of timestamp and custom log format for both console and file transports.
 * 
 * Console Transport:
 * - Logs are displayed in a pretty format with a timestamp and custom log format.
 * - Metadata, if present, is included in the log output.
 * 
 * File Transport:
 * - Logs are written to "logs/app.log" in JSON format.
 * - The log file is overwritten on each run.
 * - Each log entry includes a timestamp and is structured as JSON.
 * 
 * @constant
 * @type {Logger}
 */
const logger = createLogger({
  level: "info", // Set log level
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add a timestamp
    logFormat // Apply the custom log format
  ),
  transports: [
    // Console log: pretty format with JSON metadata (if present)
    new transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat // This shows the log + any metadata as a string in console
      ),
    }),
    // File log: outputs in JSON format
    new transports.File({
      filename: "logs/app.log",
      options: { flags: "w" }, // Overwrite the log file on each run
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        json() // Logs will be written as structured JSON in the file
      ),
    }),
  ],
});

// Export the logger for use in other files
export default logger;
