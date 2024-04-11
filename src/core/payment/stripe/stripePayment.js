import { getCustomerId } from './helpers/getCustomerId'
import {
  updateReservation,
} from './helpers/updateReservation'
import { createThread } from './helpers/createThread'
import { blockDates } from '../blockDates'
import { emailBroadcast } from './helpers/email'
import sendUnauthorized from '../../sendUnauthorized'
import logger from '../../logger'

const stripePayment = app => {
  app.post(
    '/stripe-reservation',
    function (req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/stripe-reservation')
      } else {
        next()
      }
    },
    async function (req, res) {
      try {
        const reservationDetails = req.body.reservationDetails
        const paymentMethodId = req.body.paymentMethodId
        let customerId
        let status = 200,
          errorMessage
        if (reservationDetails) {
          // Check if stripe customer id is already created
          customerId = await getCustomerId(reservationDetails.guestId)
        } else {
          status = 400
          errorMessage = 'Something went wrong, please try again'
          res.send({ status, errorMessage })
          return
        }
        if (reservationDetails.amount != 0) {
          status = 400
          errorMessage = 'Something went wrong, please try again'
          res.send({ status, errorMessage })
          return
        } else {
          await updateReservation(reservationDetails.reservationId)
          await createThread(reservationDetails.reservationId)
          await blockDates(reservationDetails.reservationId)
          await emailBroadcast(reservationDetails.reservationId)
          if (reservationDetails.bookingTypeData == 'instant') {
            let redirect =
              '/users/trips/itinerary/' + reservationDetails.reservationId
            res.send({ status, errorMessage, redirect })
          } else {
            let redirect = '/rooms/' + reservationDetails.listId
            res.send({ status, errorMessage, redirect })
          }
        }
      } catch (error) {
        logger.error('/stripe-reservation: Stripe workflow error: ' + error.message, error);
        const status = 500;
        let redirect;
        const errorMessage = 'Something went wrong, please try again';
        res.send({ status, errorMessage, redirect });
      }
    }
  )
}

export default stripePayment
