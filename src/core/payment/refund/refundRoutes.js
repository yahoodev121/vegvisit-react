import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk';

// import paypal from 'paypal-rest-sdk';
// import { payment as config } from '../../../config';
import {createTransaction} from './createTransaction';
import moment from 'moment';
import logger from '../../logger';
import sendUnauthorized from '../../sendUnauthorized';
import * as paypalClient from '../paypalClient';

const refundRoutes = app => {

  /* var paymentConfig = {
    "api" : {
      "host" : config.paypal.host,
      "port" : '',            
      "client_id" : config.paypal.clientId,  // your paypal application client id
      "client_secret" : config.paypal.secret // your paypal application secret id
    }
  }
 
  paypal.configure(paymentConfig.api);

  app.post('/refund', async function(req, res) {
    // paypal payment configuration.

    // var sender_batch_id = Math.random().toString(36).substring(9);
    // _1 in case we want to issue another different refund for the same reservation on the same day
    var sender_batch_id = 'Refund_' + moment().format('YYYYMMDD') + '_r' + req.body.reservationId + '_p' + req.body.receiverId + '_1';
    var reservationId = req.body.reservationId;
    var receiverEmail = req.body.receiverEmail;
    var receiverId = req.body.receiverId;
    var payerEmail = req.body.payerEmail;
    var payerId = req.body.payerId;
    var amount = req.body.amount;
    var currency = req.body.currency;
    var paymentMethodId = req.body.paymentMethodId;

    var create_payout_json = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": amount,
                    "currency": currency
                },
                "receiver": receiverEmail,
                "note": "Thank you.",
                "sender_item_id": reservationId
            }
        ]
    };

    paypal.payout.create(create_payout_json, async function (error, payout) {
      if (error) {
          console.warn('Paypal payout error: ' + error.response.message, error.response);
          res.send({status: error.response});
          // throw error;
      } else {
          var batchId = payout.batch_header.payout_batch_id;
          var batchStatus = payout.batch_header.batch_status;     

          // we will be informed about SUCCESS in /paypal_webhook, so here it should be PENDING
          if(batchStatus && (batchStatus === 'PENDING' || batchStatus === 'SUCCESS')){ 
            await createTransaction(
              reservationId,
              receiverEmail,
              receiverId,
              payerId,
              payerEmail,
              amount,
              currency,
              batchId,
              batchStatus,
              sender_batch_id,
              paymentMethodId
            );
            res.send({status: batchStatus});
          } else {
            res.send({status: batchStatus});
          }
      }
    }); 

  }); */

  app.post('/refund', function (req, res, next) {
    if (!(req.user && req.user.admin)) {
      sendUnauthorized(req, res, '/refund');
    } else {
      next();
    }
  }, async function (req, res) {
    try {
      const reservationId = req.body.reservationId;
      const receiverEmail = req.body.receiverEmail;
      const receiverId = req.body.receiverId;
      const payerEmail = req.body.payerEmail;
      const payerId = req.body.payerId;
      const amount = req.body.amount;
      const currency = req.body.currency;
      const paymentMethodId = req.body.paymentMethodId;
      const captureId = req.body.transactionId;
      let status = '';

      const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(captureId);
      request.requestBody({
        amount: {
          currency_code: currency,
          value:         amount
        },
        invoice_id: 'Refund_' + moment.utc().format('YYYYMMDD') + 'Z_r' + req.body.reservationId + '_p' + req.body.receiverId + '_1',
        note_to_payer: 'VegVisits Refund'
      });
      const refund = await paypalClient.client().execute(request);
      logger.debug(`/refund: Executed PayPal refund request for reservationId ${reservationId} with following result: ${JSON.stringify(refund)}`);

      let paypalFee = null;
      if (refund.result.seller_payable_breakdown && refund.result.seller_payable_breakdown.paypal_fee) {
        paypalFee = refund.result.seller_payable_breakdown.paypal_fee.value;
      }

      status = refund.result.status;
      const transaction = await createTransaction(
        reservationId,
        receiverEmail,
        receiverId,
        payerId,
        payerEmail,
        amount,
        currency,
        refund.result.id,
        refund.result.status,
        refund.result.invoice_id,
        paymentMethodId,
        paypalFee
      );
      logger.debug(`/refund: Created refund transaction for reservationId ${reservationId}: Transaction.id: ${transaction && transaction.length > 0 ? transaction[0].id : 'NO TRANSACTION RETURN'}`);

      res.send({status});
    } catch (error) {
      logger.error('/refund: PayPal refund error: ' + error.message, error);
      const status = 'Error: ' + error.message;
      res.send({status});
    }
  });

};

export default refundRoutes;