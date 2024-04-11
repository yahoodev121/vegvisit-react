import moment from 'moment';
import Sequelize from 'sequelize';

//PayPal API v1
import paypal from 'paypal-rest-sdk';

//PayPal API v2
import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import * as paypalClient from './paypalClient';

import { payment as config } from '../../config';
import {updateReservation} from './updateReservation';
import {createTransaction} from './createTransaction';
import {createThread} from './createThread';
import {blockDates} from './blockDates';
import {emailBroadcast} from './email';
import isValidNumber from '../../helpers/isValidNumber';
import {updatePaypalTransaction} from "./updateTransaction";
import sendUnauthorized from '../sendUnauthorized';
import logger from '../logger';
import { Reservation, Threads, ThreadItems, Listing, ListingData, ListBlockedDates, ServiceFees, ReservationSpecialPricing, User } from '../../data/models';
import { calculatePrice } from '../../helpers/calculatePrice';
import { compileServiceFees } from '../../helpers/compileServiceFees';
import { getCurrencyInformation } from '../../data/queries/getCurrencyInformation';
import { paypalCaptureOrder } from './paypalCaptureOrder';
import checkAuthorizedOrLocalHostRequest from '../checkAuthorizedOrLocalHostRequest';
import { checkAvailableDates } from '../reservation/checkAvailableDates';


const paypalRoutes = app => {

  //PayPal API v1 configuration
  var paymentConfig = {
    "api" : {
      "mode" : config.paypal.isLiveEnvironment ? 'live' : 'sandbox',
      "host" : config.paypal.host,
      "port" : '',            
      "client_id" : config.paypal.clientId,  // your paypal application client id
      "client_secret" : config.paypal.secret // your paypal application secret id
    }
  }
 
  paypal.configure(paymentConfig.api);

  app.post('/paypal_webhook_payout', async function(req, res) {
    logger.debug(`/paypal_webhook_payout: Paypal webhook entered, body is: ${JSON.stringify(req.body)}`);
    logger.debug(`/paypal_webhook_payout: Paypal webhook entered, headers are: ${JSON.stringify(req.headers)}`);

    var webhookId = config.paypal.webhookId_payout;

    paypal.notification.webhookEvent.verify(req.headers, req.body, webhookId, async function (error, response) {
        if (error) {
            logger.error(`/paypal_webhook_payout: Webhook verification error: ${error.message}`, error);
            res.sendStatus(500);
        } else {
            logger.debug(`/paypal_webhook_payout: Webhook verification response is: ${JSON.stringify(response)}`);
            // Verification status must be SUCCESS
            if (response.verification_status === "SUCCESS") {
                logger.debug(`/paypal_webhook_payout: Paypal webhook verification was successful.`);
                if (req.body.event_type && req.body.resource && req.body.resource.batch_header && req.body.resource.batch_header.batch_status && req.body.resource.batch_header.payout_batch_id && req.body.resource.batch_header.sender_batch_header && req.body.resource.batch_header.sender_batch_header.sender_batch_id) {
                  const payout_batch_id = req.body.resource.batch_header.payout_batch_id;
                  let sender_batch_id = req.body.resource.batch_header.sender_batch_header.sender_batch_id;
                  let continueWithPayoutsBatch = false;
                  switch (req.body.event_type) {
                    case 'PAYMENT.PAYOUTSBATCH.SUCCESS':
                      logger.debug('/paypal_webhook_payout: Paypal Webhook Payout: SUCCESS');
                      continueWithPayoutsBatch = true;
                      break;
                    case 'PAYMENT.PAYOUTSBATCH.PROCESSING':
                      logger.debug('/paypal_webhook_payout: Paypal Webhook Payout: PROCESSING');
                      continueWithPayoutsBatch = true;
                      break;
                    case 'PAYMENT.PAYOUTSBATCH.DENIED':
                      logger.debug('/paypal_webhook_payout: Paypal Webhook Payout: DENIED');
                      continueWithPayoutsBatch = true;
                      break;
                    default:
                      logger.warn('/paypal_webhook_payout: Paypal Webhook Payout: Unknown event, will not proceed: ' + req.body.event_type);
                      break;
                  }
                  if (continueWithPayoutsBatch) {
                    try {
                      const fees = (req.body.resource.batch_header.fees && isValidNumber(Number.parseFloat(req.body.resource.batch_header.fees.value))) ? Number.parseFloat(req.body.resource.batch_header.fees.value) : null;
                      // The fees currency will be in the currency of the payout
                      // const feesCurrency = (req.body.resource.batch_header.fees && req.body.resource.batch_header.fees.currency) ? req.body.resource.batch_header.fees.currency : null;
                      const batchStatus = req.body.resource.batch_header.batch_status;
                      let transactionUpdate = await updatePaypalTransaction(sender_batch_id, batchStatus, fees, payout_batch_id);

                      if (!transactionUpdate || !transactionUpdate.length || transactionUpdate[0] === 0) {
                        if (batchStatus === 'PROCESSING') {
                            logger.debug(`/paypal_webhook_payout: Transaction (${sender_batch_id}) was not updated for transactionId ${payout_batch_id} with status ${req.body.event_type}.
                            Maybe it was already set to SUCCESS or DENIED before.`);
                            res.sendStatus(200);
                        } else {
                          logger.warn(`/paypal_webhook_payout: Transaction (${sender_batch_id}) could not be updated for transactionId ${payout_batch_id} with status ${req.body.event_type}`);
                          res.sendStatus(500);  
                        }
                      } else if (transactionUpdate[0] > 1) {
                        logger.warn(`/paypal_webhook_payout: Transaction (${sender_batch_id}) updated more than one dataset for transactionId ${payout_batch_id} with status ${req.body.event_type}`);
                        res.sendStatus(200);
                      } else if (transactionUpdate[0] === 1) {
                        logger.info(`/paypal_webhook_payout: Transaction (${sender_batch_id}) successfully updated for transactionId ${payout_batch_id} with status ${req.body.event_type}`);
                        res.sendStatus(200);
                      } 
                    } catch (error) {
                      logger.error('/paypal_webhook_payout: Paypal webhook error: ' + error.message, error);
                      res.sendStatus(500);
                    }
                  } else {
                    res.sendStatus(500);
                  }
                } else {
                  logger.warn(`/paypal_webhook_payout: Not enough information in request body: ${JSON.stringify(req.body.resource)}`);
                  res.sendStatus(500);
                }
            } else {
                logger.warn(`/paypal_webhook_payout: Paypal webhook verification failed`);
                res.sendStatus(500);
            }
        }
    });
  });

  app.post('/paypal_webhook_order', async function(req, res) {
    logger.debug(`/paypal_webhook_order: Paypal webhook entered, body is: ${JSON.stringify(req.body)}`);
    logger.debug(`/paypal_webhook_order: Paypal webhook entered, headers are: ${JSON.stringify(req.headers)}`);

    const webhookId = config.paypal.webhookId_order;
    paypal.notification.webhookEvent.verify(req.headers, req.body, webhookId, async function (error, response) {
        if (error) {
            logger.error(`/paypal_webhook_order: Webhook verification error: ${error.message}`, error);
            res.sendStatus(500);
        } else {
            logger.debug(`/paypal_webhook_order: Webhook verification response is: ${JSON.stringify(response)}`);
            const Op = Sequelize.Op;
            // Verification status must be SUCCESS
            if ((response.verification_status === "SUCCESS")) {
                logger.debug(`/paypal_webhook_order: Paypal webhook verification was successful.`);
                if (req && req.body && req.body.event_type && req.body.event_type === 'CHECKOUT.ORDER.APPROVED' && req.body.resource && req.body.resource.id && req.body.resource.intent === 'CAPTURE') {
                  if (req.body.resource.status !== 'APPROVED') {
                    logger.info(`/paypal_webhook_order: Status of order is ${req.body.resource.status}, will not continue. Request resource is ${JSON.stringify(req.body.resource)}.`);
                    res.sendStatus(200);
                    return;
                  }
                  const orderID = req.body.resource.id;
                  logger.info(`/paypal_webhook_order: Starting capture order process for orderID ${orderID}, request resource is ${JSON.stringify(req.body.resource)}.`);
                  if (req.body.resource.purchase_units && req.body.resource.purchase_units.length === 1 && req.body.resource.purchase_units[0] && req.body.resource.purchase_units[0].reference_id && req.body.resource.purchase_units[0].reference_id !== 'default' && req.body.resource.purchase_units[0].amount) {
                    const amount = req.body.resource.purchase_units[0].amount.value;
                    const currency = req.body.resource.purchase_units[0].amount.currency_code;
                    const threadItemsId = req.body.resource.purchase_units[0].reference_id;
                    const threadItem = await ThreadItems.findOne({
                      where: {
                        id: threadItemsId,
                      }
                    });
                    if (threadItem) {
                      try {
                        let reservation, listing, thread;
                        if (threadItem.reservationId) {
                          reservation = await Reservation.findOne({
                            where: {
                              id: threadItem.reservationId,
                            }
                          });
                          if (reservation) {
                            //  check whether this transaction is already completed (i.e. payment is completed for reservation)
                            if (reservation.paymentState === 'completed') {
                              logger.debug(`/paypal_webhook_order: Payment already completed for threadItem ${threadItemsId} and reservation ${reservation.id}. No further processing.`);
                              res.sendStatus(200);
                              return;
                            } else if (reservation.paymentState !== 'pending') {
                              logger.warn(`/paypal_webhook_order: Continuing with capture order process although payment state is ${reservation.paymentState} for threadItem ${threadItemsId} and reservation ${reservation.id}.`);
                            }
                            if (reservation.reservationState !== 'approved') {
                              logger.warn(`/paypal_webhook_order: Continuing with capture order process although reservation state is ${reservation.reservationState} for threadItem ${threadItemsId} and reservation ${reservation.id}.`);
                            }
                            logger.debug(`/paypal_webhook_order: Continuing with capture order process for threadItem ${threadItemsId} with following reservation ${reservation.id}: ${JSON.stringify(reservation)}.`);
                          } else {
                            throw new Error(`No reservation found with id ${threadItem.reservationId} for threadItem ${threadItemsId}`);
                          }
                          listing = await Listing.findOne({
                            where: {
                              id: reservation.listId,
                            }
                          });
                          if (!listing) {
                            throw new Error(`No listing found with id ${reservation.listId} for reservation ${reservation.id}`);
                          }
                        }
                        thread = await Threads.findOne({
                          where: {
                            id: threadItem.threadId,
                          }
                        });
                        if (!thread) {
                          throw new Error(`No thread found with id ${threadItem.threadId} for threadItem ${threadItemsId}`);
                        }
                        const checkAvailableDatesResult = await checkAvailableDates(thread.listId, threadItem.startDate, threadItem.endDate);
                        logger.debug(`/paypal_webhook_order: Checked dates (from ${threadItem.startDate} to ${threadItem.endDate}) for listing ${thread.listId} with result ${JSON.stringify(checkAvailableDatesResult)}`);
                        if (checkAvailableDatesResult.status !== 200) {
                          logger.warn(`/paypal_webhook_order: Dates (start: ${threadItem.startDate}, end: ${threadItem.endDate}) for threadItem ${threadItemsId} are not available. Not available dates are: ${JSON.stringify(checkAvailableDatesResult)}`);
                          res.sendStatus(200);
                          return;
                        }
                        if (!reservation) {
                          ({ listing, reservation } = await createReservation(thread, threadItem));
                        }
                        const { status } = await paypalCaptureOrder(reservation.id, amount, currency, orderID);
                        if (status === 'Success') {
                          logger.info(`/paypal_webhook_order: The payment was performed successfully for reservation ID ${reservation.id} and orderID ${orderID}.`);
                        } else {
                          logger.error(`/paypal_webhook_order: The payment could not be performed successfully, paypalCaptureOrder failed.`);
                        }
                      } catch (error) {
                        logger.error(`/paypal_webhook_order: Processing order for threadItem ${threadItemsId}: ${error.message}`, error);
                        res.sendStatus(500);
                        return;
                      }
                    } else {
                      logger.warn(`/paypal_webhook_order: No ThreadItem existing with id ${threadItemsId} for this order: ${JSON.stringify(req.body.resource)}`);
                      res.sendStatus(500);
                      return;
                    }
                  } else {
                    logger.warn(`/paypal_webhook_order: Not enough information for purchase_units in request body to continue: ${JSON.stringify(req.body.resource)}`);
                    res.sendStatus(500);
                    return;
                  }
                  res.sendStatus(200);
                } else {
                  logger.warn(`/paypal_webhook_order: Not enough information in request body: ${JSON.stringify(req.body.resource)}`);
                  res.sendStatus(500);
                  return;
                }
            } else {
                logger.warn("/paypal_webhook_order: Paypal webhook verification failed");
                res.sendStatus(500);
            }
        }
    });
  });

  /**
   * Perform a PayPal capture order (payment)
   */
  app.post("/paypalCaptureOrder", function (req, res, next) {
    if (checkAuthorizedOrLocalHostRequest(req, res, '/paypalCaptureOrder')) {
      next();
    } else {
      res.sendStatus(401);
    }
  }, async function (req, res) {
    try {
      const {reservationId, amount, currency, orderID} = req.body;
      logger.info(`/paypalCaptureOrder: Called for reservationId ${reservationId}`);

      const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});

      const capture = await paypalClient.client().execute(request);

      let status, redirect, errorMessage;
      if (!(capture && capture.result && capture.result.purchase_units[0] && capture.result.purchase_units[0].payments && capture.result.purchase_units[0].payments.captures[0] && capture.result.purchase_units[0].payments.captures[0].id && capture.result.status === 'COMPLETED')) {
        status = "Error";
        logger.warn(`/paypalCaptureOrder: Error response from PayPal OrdersCaptureRequest for reservationId ${reservationId} and orderID ${orderID}, capture result: ${JSON.stringify(capture)}`);
      } else {
        const captureID = capture.result.purchase_units[0].payments.captures[0].id;
        const captureStatus = capture.result.purchase_units[0].payments.captures[0].status;
        const captureStatusDetails = capture.result.purchase_units[0].payments.captures[0].status_details;
        let captureStatusInformation = captureStatus;
        if (captureStatusDetails) {
          captureStatusInformation += `: ${JSON.stringify(captureStatusDetails)}`;
        }
        const platformTransactionId = capture.result.purchase_units[0].payments.captures[0].invoice_id;
        logger.info(`/paypalCaptureOrder: OrdersCaptureRequest request successful (${capture.result.status}) for reservationId ${reservationId} and orderID ${orderID}: Capture id is ${captureID} and has status ${captureStatusInformation}`);
        logger.debug(`/paypalCaptureOrder: OrdersCaptureRequest request result for reservationId ${reservationId} and orderID ${orderID}: ${JSON.stringify(capture)}`);

        status = "Success";
        const transactionStatus = capture.result.status;
        const paymentMethod = 1;
        let transactionAmount = amount;
        let transactionCurrency = currency;
        let transactionFee = null;
        const receivable = capture.result.purchase_units[0].payments.captures[0].seller_receivable_breakdown;
        if (receivable &&
          receivable.gross_amount &&
          receivable.paypal_fee
        ) {
          transactionAmount = receivable.gross_amount.value;
          transactionCurrency = receivable.gross_amount.currency_code;
          transactionFee = receivable.paypal_fee.value;
        }

        //TODO: Improve error handling
        const createTransactionResult = await createTransaction(
          reservationId,
          capture.result.payer.email_address, // payerEmail, // guest email
          capture.result.payer.payer_id, // payerId
          config.paypal.email, //receiverEmail,
          null, // receiverId
          captureID, // transactionId
          transactionAmount, // amount,
          transactionFee, // transactionFee,
          transactionCurrency, // currency,
          null, // ipn_track_id
          paymentMethod,
          transactionStatus,
          platformTransactionId
        );
        if (createTransactionResult && createTransactionResult.status === 'created') {
          logger.debug(`/paypalCaptureOrder: Created transaction for reservationId ${reservationId} with result ${JSON.stringify(createTransactionResult)}`);
        } else {
          logger.error(`/paypalCaptureOrder: Could not create transaction for reservationId ${reservationId}`);
        }

        const updateReservationResult = await updateReservation(reservationId, amount, currency);
        logger.debug(`/paypalCaptureOrder: Updated reservation for reservationId ${reservationId} with result ${JSON.stringify(updateReservationResult)}`);

        await blockDates(reservationId);
        logger.debug(`/paypalCaptureOrder: Blocked dates for reservationId ${reservationId}`);
        await createThread(reservationId);
        logger.debug(`/paypalCaptureOrder: Created thread for reservationId ${reservationId}`);
        await emailBroadcast(reservationId);
        logger.debug(`/paypalCaptureOrder: Sent emails for reservationId ${reservationId}`);
        redirect = config.paypal.redirectURL.success + "/" + reservationId;
        logger.info(`/paypalCaptureOrder: Success for reservationId ${reservationId}`);
      }
      res.send({status, redirect});
    } catch (error) {
      logger.error('/paypalCaptureOrder: PayPal payment error: ' + error.message, error);
      const status = 'Error';
      let redirect;
      res.send({status, redirect});
    }
  }
);

};

export default paypalRoutes;

/**
 * Create a reservation entry for an approved inquiry as part of the payment
 * @param {*} thread 
 * @param {*} threadItem 
 */
async function createReservation(thread, threadItem) {
  let reservation, listing;
  listing = await Listing.findOne({
    where: {
      id: thread.listId,
    }
  });
  if (!listing) {
    throw new Error(`No listing found with id ${thread.listId} for thread ${threadItem.threadId}`);
  }
  const listingData = await ListingData.findOne({
    where: {
      listId: thread.listId,
    }
  });
  if (!listingData) {
    throw new Error(`No listingData found with id ${thread.listId} for thread ${threadItem.threadId}`);
  }
  const listBlockedDates = await ListBlockedDates.findAll({
    where: {
      listId: thread.listId,
      calendarStatus: 'available'
    }
  });
  const serviceFeesData = await ServiceFees.findOne();
  let serviceFees;
  if (serviceFeesData) {
    serviceFees = compileServiceFees(serviceFeesData);
  }
  else {
    throw new Error(`No serviceFees found.`);
  }
  const { base, rates } = await getCurrencyInformation();
  const messages = null, formatMessage = null;
  const { discount, discountType, guestServiceFee, hostServiceFee, totalWithoutFees, isSpecialPriceAssigned, bookingSpecialPricing, isAverage, dayDifference, priceForDays, total } = calculatePrice(threadItem.startDate, threadItem.endDate, listing.timeZone, listBlockedDates, listingData.basePrice, serviceFees, base, rates, listingData.currency, listingData.monthlyDiscount, formatMessage, listingData.weeklyDiscount, listingData.cleaningPrice, messages);
  // Total in reservation table is defined without guest service fee
  let totalReservationAmount = total;
  if (total > 0) {
    totalReservationAmount = total - guestServiceFee;
  }
  const confirmationCode = Math.floor(100000 + Math.random() * 900000);
  const isPreApprove = threadItem.type === 'preApproved';
  const isSpecialPriceAverage = isAverage.toFixed(2);
  reservation = await Reservation.create({
    listId: thread.listId,
    hostId: thread.host,
    guestId: thread.guest,
    checkIn: threadItem.startDate,
    checkOut: threadItem.endDate,
    guests: threadItem.personCapacity,
    message: null,
    basePrice: listingData.basePrice,
    cleaningPrice: listingData.cleaningPrice,
    currency: listingData.currency,
    discount,
    discountType,
    guestServiceFee,
    hostServiceFee,
    total: totalReservationAmount,
    confirmationCode,
    reservationState: 'approved',
    paymentMethodId: 1,
    cancellationPolicy: listingData.cancellationPolicy,
    isSpecialPriceAverage,
    dayDifference,
    isPreApprove
  });
  if (reservation) {
    logger.debug(`core.payment.paypal.createReservation: Successfully created reservation ${reservation.id} for listing ${thread.listId} and thread ${threadItem.threadId}: ${JSON.stringify(reservation)}`);
    if (bookingSpecialPricing && bookingSpecialPricing.length > 0) {
      bookingSpecialPricing.map(async (item, key) => {
        let updateReservationSpecialPricing = await ReservationSpecialPricing.create({
          listId: thread.listId,
          reservationId: reservation.id,
          blockedDates: item.blockedDates,
          isSpecialPrice: item.isSpecialPrice
        });
        logger.debug(`core.payment.paypal.createReservation: Updated ReservationSpecialPricing for reservation ${reservation.id} with following result: ${JSON.stringify(updateReservationSpecialPricing)}`);
      });
    }
  }
  else {
    throw new Error(`Reservation could not be created for listing ${thread.listId} and thread ${threadItem.threadId}`);
  }
  return { listing, reservation };
}

