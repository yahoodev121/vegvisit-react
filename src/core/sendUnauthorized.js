import logger from './logger';

function sendUnauthorized(req, res, endpoint) {
  const connectInfo = `from ${req.connection.remoteAddress}, x-real-ip ${req.headers['x-real-ip']}, x-forwarded-for ${req.headers['x-forwarded-for']}. Headers: ${JSON.stringify(req.headers)}`;
  logger.warn(`Blocked ${endpoint} unauthorized call ${connectInfo}`);
  res.sendStatus(401);
}

export default sendUnauthorized;