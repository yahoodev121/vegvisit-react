import logger from './logger';

function checkAuthorizedOrLocalHostRequest(req, res, endPoint) {
  const connectInfo = `from ${req.connection.remoteAddress}, local address is ${req.connection.localAddress}, host is ${req.get('host')}, hostname is ${req.hostname}, x-real-ip is ${req.headers['x-real-ip']}, x-forwarded-for is ${req.headers['x-forwarded-for']}. Headers: ${JSON.stringify(req.headers)}`;
  if (!req.user) {
    const remoteAddress = req.headers['x-real-ip'] || req.connection.remoteAddress;
    if (remoteAddress === req.connection.localAddress && (req.connection.localAddress.includes('127.0.0.1') || req.connection.localAddress.includes('::1'))) {
      logger.debug(`${endPoint}: Allowed local host unauthorized call ${connectInfo}`);
      return true;
    }
    else {
      logger.warn(`${endPoint}: Unauthorized call ${connectInfo}`);
      return false;
    }
  }
  else {
    logger.debug(`${endPoint}: Authorized call ${connectInfo}`);
    return true;
  }
}

export default checkAuthorizedOrLocalHostRequest;