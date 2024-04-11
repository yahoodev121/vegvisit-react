const logger = {
  info: (msg) => {
    console.log(msg);
  },
  debug: (msg) => {
    console.log(msg);
  },
  error: (msg) => {
    console.log(msg);
  },
  warn: (msg) => {
    console.log(msg);
  }
};

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
/* if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
} */

export default logger;