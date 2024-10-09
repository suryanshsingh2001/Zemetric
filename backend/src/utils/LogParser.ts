import fs from 'fs';
import path from 'path';


// Utility function to read logs from the file
export const readLogs = async (): Promise<any[]> => {
  const logFilePath = path.join(process.cwd(), 'logs', 'app.log');

  // Read the log file and return the logs as an array of JSON objects
  return new Promise((resolve, reject) => {
    fs.readFile(logFilePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      
      // Split the log entries and parse them as JSON
      const logEntries = data.trim().split('\n').map((entry) => {
        try {
          return JSON.parse(entry); // Parse each log entry
        } catch (error) {
          console.error('Error parsing log entry:', entry, error);
          return null; // Return null for entries that cannot be parsed
        }
      }).filter(Boolean); // Filter out null values

      resolve(logEntries);
    });
  });
};


