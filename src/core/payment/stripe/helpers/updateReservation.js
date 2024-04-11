import { Reservation } from '../../../../data/models';
import { getCurrencyInformation } from '../../../../data/queries/getCurrencyInformation';
import { convert } from '../../../../helpers/currencyConvertion';

export async function updateReservation(id, confirmPaymentIntentId) {
  let { base, rates } = await getCurrencyInformation();
  rates = JSON.parse(rates);
  const oldReservation = await Reservation.findOne({
    where: {
      id
    }
  });
  if (oldReservation) {
    const basePrice = oldReservation.basePrice ? convert(base, rates, oldReservation.basePrice, oldReservation.currency, base) : oldReservation.basePrice;
    const cleaningPrice = oldReservation.cleaningPrice ? convert(base, rates, oldReservation.cleaningPrice, oldReservation.currency, base) : oldReservation.cleaningPrice;
    const discount = oldReservation.discount ? convert(base, rates, oldReservation.discount, oldReservation.currency, base) : oldReservation.discount;
    const hostServiceFee = oldReservation.hostServiceFee ? convert(base, rates, oldReservation.hostServiceFee, oldReservation.currency, base) : oldReservation.hostServiceFee;
    const guestServiceFee = oldReservation.guestServiceFee ? convert(base, rates, oldReservation.guestServiceFee, oldReservation.currency, base) : oldReservation.guestServiceFee;
    const total = oldReservation.total ? convert(base, rates, oldReservation.total, oldReservation.currency, base) : oldReservation.total;
    const isSpecialPriceAverage = oldReservation.isSpecialPriceAverage ? convert(base, rates, oldReservation.isSpecialPriceAverage, oldReservation.currency, base) : oldReservation.isSpecialPriceAverage;
    const reservation = await Reservation.update({
        basePrice,
        cleaningPrice,
        discount,
        hostServiceFee,
        guestServiceFee,
        total,
        isSpecialPriceAverage,
        currency: base,
        paymentState: 'completed',
        paymentIntentId: confirmPaymentIntentId
       },
       {
          where: {
            id
          }
       });

    if(reservation) {
        return {
          status: 'updated'
        };
    } else {
        return {
          status: 'failed to update the reservation'
        }
    }
  } else {
    return {
      status: `failed to update the reservation, reservation ${id} was not found`
    }
  }
}

export async function updateRemainingPaymentStatus(id) {
    const reservation = await Reservation.update({
        remainingPaymentStatus: 'completed',
    },
        {
            where: {
                id
            }
        });

    if (reservation) {
        return {
            status: 'updated'
        };
    } else {
        return {
            status: 'failed to update the reservation'
        }
    }
}

export async function updateIsValidReservation(id) {
    const reservation = await Reservation.update({
        isValid: false
       },
       {
          where: {
            id
          }
       });

    if(reservation) {
        return {
          status: 'updated'
        };
    } else {
        return {
          status: 'failed to update the reservation'
        }
    }
}