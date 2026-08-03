import { getAppConfig } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  module?: string;
  action?: string;
  requestId?: string;
  userId?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

interface LogEntry extends LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  environment: string;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    environment: getAppConfig().environment,
    ...context,
  };
}

function writeLog(entry: LogEntry): void {
  const output = JSON.stringify(entry);

  switch (entry.level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'info':
      // eslint-disable-next-line no-console -- structured production logging
      console.info(output);
      break;
    default:
      if (getAppConfig().features.logDebug) {
        // eslint-disable-next-line no-console -- structured dev logging
        console.log(output);
      }
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (getAppConfig().features.logDebug) {
      writeLog(formatLog('debug', message, context));
    }
  },

  info(message: string, context?: LogContext) {
    writeLog(formatLog('info', message, context));
  },

  warn(message: string, context?: LogContext) {
    writeLog(formatLog('warn', message, context));
  },

  error(message: string, context?: LogContext) {
    writeLog(formatLog('error', message, context));
  },
};
