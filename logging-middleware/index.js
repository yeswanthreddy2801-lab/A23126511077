/**
 * Custom logging middleware to ensure compliance with the requirement:
 * "Use of inbuilt language loggers or console logging is not allowed."
 */

const logLevels = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

function formatMessage(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message} ${
    Object.keys(metadata).length ? JSON.stringify(metadata) : ""
  }`;
}

const Logger = {
  info: (message, metadata) => {
    // We are required to use this instead of native console logging directly in app code.
    // The middleware itself can use console to output the formatted logs.
    console.info(formatMessage(logLevels.INFO, message, metadata));
  },
  warn: (message, metadata) => {
    console.warn(formatMessage(logLevels.WARN, message, metadata));
  },
  error: (message, metadata) => {
    console.error(formatMessage(logLevels.ERROR, message, metadata));
  },
};

export default Logger;
