// ============================================
// Logger Utility
// ============================================
// Simple structured logging without external dependencies

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const log = (level, message, data = null) => {
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    ...(data && { data })
  };

  const logString = JSON.stringify(logEntry);

  // Console output
  console.log(logString);

  // File output
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logString + '\n');
};

export default {
  info: (message, data) => log('INFO', message, data),
  warn: (message, data) => log('WARN', message, data),
  error: (message, data) => log('ERROR', message, data),
  debug: (message, data) => log('DEBUG', message, data)
};
