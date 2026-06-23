
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
