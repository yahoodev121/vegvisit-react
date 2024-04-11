import { sitename } from '../../../config';
import { updateVerificationCode, getCountryCode } from './helpers/dbFunctions';
import sendUnauthorized from '../../sendUnauthorized';
import { sendSms } from './helpers/sendSms';
import logger from '../../logger';

const TwilioSms = app => {
    app.post('/send-verification-code', function (req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/send-verification-code');
      } else {
        next();
      }
    }, async function (req, res) {
        let responseStatus = 200, errorMessage;
        let phoneNumber = req.body.phoneNumber;
        let dialCode = req.body.dialCode;
        let verificationCode = Math.floor(1000 + Math.random() * 9000);
        let message = sitename + ' security code: ' + verificationCode;
        message += '. Use this to finish verification.';
        let userId = req.user.id;

        try {

            await updateVerificationCode(verificationCode, userId);
            logger.info(`/send-verification-code: Successfully updated verification code for user ${userId}`);

            await sendSms(phoneNumber, dialCode, message);
            logger.info(`/send-verification-code: Successfully sent sms for user ${userId} to phone number ${dialCode} ${phoneNumber}`);

        } catch(error) {
            logger.error(`/send-verification-code: Error updating verification code and sending sms: ${error.message}`, error);
            responseStatus = 400;
            errorMessage = error.message;
        }

        res.send({ status: responseStatus, errorMessage });
    });
};

export default TwilioSms;