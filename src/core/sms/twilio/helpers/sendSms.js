import twilio from 'twilio';

import { sms } from '../../../../config';
import logger from '../../../logger';

const client = new twilio(sms.twilio.accountSid, sms.twilio.authToken);
if (sms.twilio.logLevel == 'debug') {
  client.logLevel = 'debug';
}

export async function sendSms(phoneNumber, dialCode, message) {
  let convertedNumber = dialCode + phoneNumber;

  logger.debug(
    `core.sms.twilio.helpers.sendSms.sendSms: Sending sms to ${convertedNumber} with following message: ${message}`
  );

  let from;
  if (sms.twilio.alphanumericSenderIdCountryCodes &&
    sms.twilio.alphanumericSenderIdCountryCodes.length > 0 &&
    sms.twilio.alphanumericSenderIdCountryCodes.includes(dialCode)
  ) {
    from = sms.twilio.alphanumericSenderId;
  } else {
    from = sms.twilio.phoneNumber;
  }

  try {
    await client.messages.create({
      body: message,
      from: from,
      to: convertedNumber,
    });
  } catch (error) {
    logger.error(
      `core.sms.twilio.helpers.sendSms.sendSms: Error sending sms: ${error.message}`,
      error
    );
    throw error;
  }
}
