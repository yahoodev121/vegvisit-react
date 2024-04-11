/*
const winston = require('winston');
import { logging } from '../config';

const { combine, timestamp, label, printf, errors } = winston.format;

const logfileFormat = printf(({ level, component, message, label, timestamp, setting, clientTimestamp, stack, user }) => {
  // return `${timestamp} [${label}] ${level ? level.toUpperCase() : 'UNKNOWN'}: ${message}, Client time: ${clientTimestamp}`;
  if (!component) {
    component = 'Server';
  }
  return JSON.stringify({
    timestamp,
    component,
    level: level ? level.toUpperCase() : 'UNKNOWN',
    user,
    message,
    clientTimestamp,
    stack
  });
});
const consoleFormat = printf(({ level, component, message, label, timestamp, setting, clientTimestamp, stack, user }) => {
  if (!component) {
    component = 'Server';
  }
  let log;
  if (clientTimestamp) {
    log = `${timestamp} [${component}] ${level ? level.toUpperCase() : 'UNKNOWN'} ${user ? 'User: ' + JSON.stringify(user) : ''}: ${message}, Client time: ${clientTimestamp}. Client Loglevel Setting: ${setting}`;
  } else {
    log = `${timestamp} [${component}] ${level ? level.toUpperCase() : 'UNKNOWN'}: ${message}`;
  }
  return stack
    ? `${log}\n${stack}`
    : log;
});

const logger = winston.createLogger({
  // level: 'info',
  // format: winston.format.json(),
  format: combine(
    // label({ label: 'Vegvisits' }),
    timestamp(),
    errors({ stack: true }),
    logfileFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `warn` and below to `client.log`
    // - disabled: Write all logs with level `info` and below to `combined.log`
    // - Write all logs to console
    //
    new winston.transports.File({
      filename: (logging && logging.logfile) ? logging.logfile : 'Combined.log',
      level: (logging && logging.logFileLevel) ?  logging.logFileLevel : 'warn'
    }),
    // new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      level: (logging && logging.logConsoleLevel) ?  logging.logConsoleLevel : 'info',
      format: combine(
        // label({ label: 'Client' }),
        timestamp(),
        errors({ stack: true }),
        consoleFormat
      ),
      // format: winston.format.simple(),
      // format: winston.format.prettyPrint(),
    })
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
/!* if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
} *!/

export default logger;*/
