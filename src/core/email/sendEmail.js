import React from 'react';
import Oy from 'oy-vey';
import { IntlProvider } from 'react-intl';
import fetch from '../fetch';
import EmailTemplate from './template/EmailTemplate';
import {emailConfig,safeModeEmail} from '../../config';
import {getSubjectAndNotification} from './template/subjects';
import { isBrowser, isNode } from 'browser-or-node';
// import log from '../../helpers/clientLog';
// import logger from '../logger';

export async function sendEmail(to, type, content) {

        let from = emailConfig.sender + '<' + emailConfig.senderEmail + '>';
        let html, subject, previewText;
        let logger;
        if (isBrowser) {
          const loggerImport = await import('../../helpers/clientLog');
          logger = loggerImport.default;
        }
        if (isNode) {
          const loggerImport = await import('../logger');
          logger = loggerImport.default;
        }
        try {
          let subjectData = getSubjectAndNotification(type, content);
          html = Oy.renderTemplate(
              <IntlProvider locale={"en"}>
                  <EmailTemplate type={type} content={content}  /> 
              </IntlProvider>,{
              title: subjectData.subject,
              previewText: subjectData.previewText
          });
          
          let mailOptions = {
              from,
              to: (safeModeEmail || to), // list of receivers
              subject: subjectData.subject, // Subject line
              //text: textMessage, // plain text body
              html,
              reCaptcha: content.reCaptcha,
              notification: subjectData.notification
          };
          const resp = await fetch('/sendEmail', {
              method: 'post',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({mailOptions}),
              credentials: 'include'
          });
          logger.debug(`src.core.email.sendEmail: Response status from /sendEmail to ${mailOptions.to} is: ${resp.status}.`);
          const { status, response } = await resp.json();
          return { status, response };
        } catch (error) {
          if (isBrowser) {
            logger.error(`src.core.email.sendEmail: Following email could not be sent. To: ${to}, Type: ${type}, Content: ${JSON.stringify(content)}. Error message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
          }
          if (isNode) {
            logger.error(`src.core.email.sendEmail: Following email could not be sent. To: ${to}, Type: ${type}, Content: ${JSON.stringify(content)}.`, error);
          }
          return {
            status: 400,
            response: 'Mail Error'
          };
        }
        
} 
