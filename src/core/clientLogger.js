import logger from './logger';
import sendUnauthorized from './sendUnauthorized';

const getWinstonLevel = (logLevel) => {
  let winstonLevel = 'notice'; // if we don't receive a valid level
  switch (logLevel) { // trace/debug/info/warn/error
    case 'trace':
      winstonLevel = 'debug'
      break;
    case 'debug':
      winstonLevel = 'debug'
      break;
    case 'info':
      winstonLevel = 'info'
      break;
    case 'warn':
      winstonLevel = 'warn'
      break;
    case 'error':
      winstonLevel = 'error'
      break;
    default:
      break;
  }
  return winstonLevel;
}

const clientLogger = app => {

  /**
   * Log client logging messages
   */
  app.post('/logger', function (req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/logger');
      } else {
        next();
      }
    }, function(req, res) {
      const {level, message, timestamp} = req.body;

      logger.log({
        component: 'Client',
        level: getWinstonLevel(level.label),
        setting: level.setting,
        user: req.user,
        // message: `${message}, Client time: ${timestamp}`,
        message,
        clientTimestamp: timestamp
      });

      res.sendStatus(200);
    }
  );  
}

export default clientLogger;