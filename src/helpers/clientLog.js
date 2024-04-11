import log from 'loglevel';
import loglevelPlugin from 'loglevel-plugin-server';
import moment from 'moment';

import { logging } from '../config';

const level = (logging && logging.clientLogLevel) || 'warn';

const format = ({ message, methodName, logLevel, loggerName }) => JSON.stringify({
  message,
  level: {
    label: (methodName || ''),
    value: logLevel,
    setting: log.getLevel(),
  },
  logger: loggerName || '',
  timestamp: moment().format(),
});

const options = {
  url: '/logger',
  callOriginal: (logging && logging.clientLogConsole),
  level,
  format,
};
loglevelPlugin(log, options);

export default log;
