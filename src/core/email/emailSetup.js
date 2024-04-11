'use strict';
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
import {emailConfigSecret, googleCaptcha, googleCaptchaSecret, sms} from '../../config';
import logger from '../logger';
import checkAuthorizedOrLocalHostRequest from '../checkAuthorizedOrLocalHostRequest';
import fetch from '../fetch';
import { UserProfile, User, UserVerifiedInfo } from '../../data/models';
import { sendSms } from '../sms/twilio/helpers/sendSms';


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
    host: emailConfigSecret.host,
    port: emailConfigSecret.port,
    auth: {
        user: emailConfigSecret.email,
        pass: emailConfigSecret.password
    },
    secure: emailConfigSecret.secure,
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: emailConfigSecret.tls
    }
}));

const sendEmail = (app) => {

    app.post('/sendEmail', async function (req, res, next) {
      if (checkAuthorizedOrLocalHostRequest(req, res, '/sendEmail')) {
        next();
      } else if (req.body.mailOptions && req.body.mailOptions.reCaptcha) {
        try {
          logger.debug(`/sendEmail: Starting reCAPTCHA verification for: ${JSON.stringify(req.body.mailOptions.reCaptcha)}`);
          const RECAPTCHA_SERVER_KEY = googleCaptchaSecret.secretkey;
          const reCaptcha = req.body.mailOptions.reCaptcha;
          // Validate if human
          const resp = await fetch(googleCaptcha.verifyUrl, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: `secret=${RECAPTCHA_SERVER_KEY}&response=${reCaptcha}`
          });
          const response = await resp.json();
          if (response.success) {
            logger.info(`/sendEmail: reCAPTCHA verification passed successfully: ${JSON.stringify(response)}`);
            next();
          } else {
            logger.warn(`/sendEmail: reCAPTCHA verification failed, probably not a human: ${JSON.stringify(response)}`);
          }
        } catch (error) {
          logger.error(`/sendEmail: Error during reCAPTCHA verification: ${error.message}`, error);
        }
      } else {
        res.sendStatus(401);
      }
    }, function (req, res) {

        let mailOptions = req.body.mailOptions;
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              logger.error(`/sendEmail: Error sending mail: ${error.message}`, error);
              res.send({status: 400, response: error});
            } else {
              logger.info(`/sendEmail: Sent mail successfully: ${JSON.stringify(mailOptions)}`);
              // Send sms notification
              // Determine the user and his phone number in case he has a confirmed phone number
              if (mailOptions.notification) {
                const user = await User.findOne({
                  where: {
                    email: mailOptions.to,
                    userDeletedAt: null
                  },
                  include: [
                    { model: UserProfile, as: 'profile' },
                    { model: UserVerifiedInfo, as: 'userVerifiedInfo' }
                  ]
                });
                if (user && user.profile && user.userVerifiedInfo) {
                  const userPhoneNumber = user.profile.phoneNumber;
                  const userPhoneNumberCountryCode = user.profile.countryCode;
                  const userPhoneNumberVerification = user.userVerifiedInfo.isPhoneVerified;
                  if (userPhoneNumber && userPhoneNumberCountryCode && userPhoneNumberVerification) {
                    // Send sms notification
                    const message = mailOptions.notification; // `You have new activity on your ${sitename} account!`;
                    try {
                      if (sms.sendSmsNotifications) {
                        await sendSms(userPhoneNumber, userPhoneNumberCountryCode, message);
                        logger.info(`/sendEmail: Sent sms notification for email ${mailOptions.to} to ${userPhoneNumberCountryCode} ${userPhoneNumber}`);  
                      } else {
                        logger.warn(`/sendEmail: SMS notifications are deactivated! No sms notification sent for email ${mailOptions.to} to ${userPhoneNumberCountryCode} ${userPhoneNumber}. To activate sms notifications set "sms.sendSmsNotifications = true" in the configuration file.`); 
                      }
                    } catch (error) {
                      logger.error(`/sendEmail: Error sending sms notification: ${error.message}`, error);
                    }
                  } else {
                    logger.debug(`/sendEmail: There is no verified phone number for User with email ${mailOptions.to} and id ${user.id}, therefore not sending a sms notification. Notification should have been: "${mailOptions.notification}"`);
                  }
                } else {
                  logger.warn(`/sendEmail: No User information for email ${mailOptions.to} found for sending a sms notification`);
                }
              }

              res.send({status: 200, response: 'email sent successfully'});
            }
        });
    });

};

export default sendEmail;  