import { Reservation, ReservationSpecialPricing } from '../../data/models'
import { getCurrencyInformation } from '../../data/queries/getCurrencyInformation'
import sequelize from '../../data/sequelize'
import { convert } from '../../helpers/currencyConvertion'
import logger from '../logger'

export async function updateReservation (id, paymentAmount, paymentCurrency) {
  let { base, rates } = await getCurrencyInformation()
  rates = JSON.parse(rates)
  const oldReservation = await Reservation.findOne({
    where: {
      id
    }
  })
  if (oldReservation) {
    let conversionFactor = 1
    if (oldReservation.total + oldReservation.guestServiceFee > 0) {
      conversionFactor =
        paymentAmount / (oldReservation.total + oldReservation.guestServiceFee)
    }
    if (conversionFactor !== 1) {
      logger.warn(`core.payment.updateReservation.updateResevation: Conversion factor not 1 but ${conversionFactor} for reservation ${id} and currency ${paymentCurrency}: Payment amount is ${paymentAmount} but reservation total is ${oldReservation.total} and reservation guest service fee is ${oldReservation.guestServiceFee}}`);
    }
    /* If we need to convert to a different payment currency then this is needed, see also other comments in this method:
    const basePrice = oldReservation.basePrice
      ? oldReservation.basePrice * conversionFactor
      : oldReservation.basePrice
    // basePrice = basePrice.toFixed(2);
    const cleaningPrice = oldReservation.cleaningPrice
      ? oldReservation.cleaningPrice * conversionFactor
      : oldReservation.cleaningPrice
    // cleaningPrice = cleaningPrice.toFixed(2);
    const discount = oldReservation.discount
      ? oldReservation.discount * conversionFactor
      : oldReservation.discount
    // discount = discount.toFixed(2);
    const hostServiceFee = oldReservation.hostServiceFee
      ? oldReservation.hostServiceFee * conversionFactor
      : oldReservation.hostServiceFee
    // hostServiceFee = hostServiceFee.toFixed(2);
    const guestServiceFee = oldReservation.guestServiceFee
      ? oldReservation.guestServiceFee * conversionFactor
      : oldReservation.guestServiceFee
    // guestServiceFee = guestServiceFee.toFixed(2);
    const total = oldReservation.total
      ? oldReservation.total * conversionFactor
      : oldReservation.total
    // total = total.toFixed(2);
    const isSpecialPriceAverage = oldReservation.isSpecialPriceAverage
      ? oldReservation.isSpecialPriceAverage * conversionFactor
      : oldReservation.isSpecialPriceAverage
    // isSpecialPriceAverage = isSpecialPriceAverage.toFixed(2); */

    return sequelize
      .transaction(function (t) {
        return Reservation.update(
          {
            /* basePrice,
            cleaningPrice,
            discount,
            hostServiceFee,
            guestServiceFee,
            total,
            isSpecialPriceAverage,
            currency: paymentCurrency, */
            paymentState: 'completed'
          },
          {
            where: {
              id
            },
            transaction: t
          }
        ) /* .then(function (reservationUpdateResult) {
          logger.debug(`core.payment.updateReservation.updateResevation: Updated Reservation with result: ${JSON.stringify(reservationUpdateResult)}`);
          return ReservationSpecialPricing.update(
            {
              isSpecialPrice: sequelize.literal(
                `isSpecialPrice * ${conversionFactor}`
              )
            },
            {
              where: {
                reservationId: id
              },
              transaction: t
            }
          )
        }) */
      })
      .then(function (reservationUpdateResult) {
        logger.debug(`core.payment.updateReservation.updateResevation: Updated Reservation with result: ${JSON.stringify(reservationUpdateResult)}`);
        logger.debug(`core.payment.updateReservation.updateResevation: Transaction committed.`);
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
        return {
          status: 'updated'
        }
      })
      /* Don't catch here but in the calling method
      .catch(function (err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
        return {
          status: 'failed to update the reservation'
        }
      }) */
  } else {
    logger.error(`core.payment.updateReservation.updateResevation: Failed to update the reservation, reservation ${id} was not found`);
    throw new Error(`Failed to update the reservation, reservation ${id} was not found`);
  }
}
