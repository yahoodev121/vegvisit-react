import { payment as config } from '../../../config';
import {createTransactionHistory} from './createTransactionHistory';
import logger from '../../logger';
import sendUnauthorized from '../../sendUnauthorized';
import paypal from 'paypal-rest-sdk';
import moment from 'moment';


const payoutRoutes = app => {

  var paymentConfig = {
    "api" : {
      "host" : config.paypal.host,
      "port" : '',            
      "client_id" : config.paypal.clientId,  // your paypal application client id
      "client_secret" : config.paypal.secret // your paypal application secret id
    }
  }
 
  paypal.configure(paymentConfig.api);

  app.post('/payout', function (req, res, next) {
      if (!(req.user && req.user.admin)) {
        sendUnauthorized(req, res, '/payout');
      } else {
        next();
      }
    }, async function(req, res) {
      // paypal payment configuration.

      // var sender_batch_id = Math.random().toString(36).substring(9);
      // _1 in case we want to issue another different payout for the same reservation on the same day
      var sender_batch_id = 'Payout_' + moment().format('YYYYMMDD') + '_r' + req.body.reservationId + '_p' + req.body.payoutId + '_1';
      var reservationId = req.body.reservationId;
      var hostEmail = req.body.hostEmail;
      var payoutId = req.body.payoutId;
      var amount = req.body.amount;
      var currency = req.body.currency;  
      var userId = req.body.userId;  
      var paymentMethodId = req.body.paymentMethodId;
      var recipientType = paymentMethodId == 4 ? "PHONE" : "EMAIL";
      var recipientWallet = paymentMethodId == 4 ? "VENMO" : "PAYPAL";

      var create_payout_json = {
          "sender_batch_header": {
              "sender_batch_id": sender_batch_id,
              "email_subject": "You have a payment"
          },
          "items": [
              {
                  "recipient_type": recipientType,
                  "recipient_wallet": recipientWallet,
                  "amount": {
                      "value": amount,
                      "currency": currency
                  },
                  "receiver": hostEmail,
                  "note": "Thanks for hosting with Vegvisits! Here’s your payout 😊",
                  "sender_item_id": reservationId
              }
          ]
      };

      paypal.payout.create(create_payout_json, async function (error, payout) {
        if (error) {
          logger.warn(`payoutRoutes /payout: Paypal payout error for reservation ${reservationId} and sender_batch_id ${sender_batch_id}: ${error.response.message}, Error: ${JSON.stringify(error)}`);
            res.send({status: error.response});
            // throw error;
        } else {
            var batchId = payout.batch_header.payout_batch_id;
            var batchStatus = payout.batch_header.batch_status;
            logger.info(`payoutRoutes /payout: Paypal payout without error for reservation ${reservationId} and sender_batch_id ${sender_batch_id} and PayPal Batch ID ${batchId}. Batch status is ${batchStatus}. Result: ${JSON.stringify(payout)}`);

            /*paypal.payout.get(payoutId, function (error, payoutData) { // Should use batchId in case
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log("Get Payout Response");
                    console.log(JSON.stringify(payoutData));
                }
            });*/ 

            // we will be informed about SUCCESS in /paypal_webhook, so here it should be PENDING
            if(batchStatus && (batchStatus === 'PENDING' || batchStatus === 'SUCCESS')){ 
              await createTransactionHistory(
                reservationId, 
                hostEmail, 
                payoutId, 
                amount, 
                currency,
                userId,
                paymentMethodId,
                batchId,
                batchStatus,
                sender_batch_id
              );
              logger.info(`payoutRoutes /payout: Paypal payout successful and entry in transaction history created for reservation ${reservationId} and sender_batch_id ${sender_batch_id} and PayPal Batch ID ${batchId}.`);
              res.send({status: batchStatus});
            } else {
              logger.warn(`payoutRoutes /payout: Paypal payout: Received unexpected batch status ${batchStatus} for reservation ${reservationId} and sender_batch_id ${sender_batch_id} and PayPal Batch ID ${batchId}. No entry in transaction history created!`);
              res.send({status: batchStatus});
            }
        }
      }); 
    }
  );
};

export default payoutRoutes;