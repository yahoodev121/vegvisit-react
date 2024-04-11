import moment from 'moment';

/**
 * Calculate accomodation price for a given interval
 * @param {*} basePrice The base price per night
 * @param {*} bookingSpecialPricing An array of special price night information (rows for this reservation of the ReservationSpecialPricing table)
 * @param {*} from Interval start for which price is calculated (first day)
 * @param {*} to Interval end for which price is calculated (last day)
 * @param {*} nightlyDiscount Discount per night
 */
export default function calcPrice(basePrice, bookingSpecialPricing, from, to, nightlyDiscount) {

  let priceForDays = 0;
  const specialPricing = [];
  let isSpecialPriceAssigned = false;
  const momentStartDate = moment(from);
  const momentEndDate = moment(to);
  const nights = momentEndDate.startOf('day').diff(momentStartDate.startOf('day'), 'days');

  bookingSpecialPricing && bookingSpecialPricing.map((item, key) => {
    let currentPrice;
    const itemDay = moment(item.blockedDates);
    if (item.blockedDates && itemDay && itemDay.isValid() && itemDay.isBetween(from, to, 'day', '[)')) {
      
      const specialPrice = Number(item.isSpecialPrice);
      if (!Number.isNaN(specialPrice) && specialPrice !== Number(basePrice)) {
        isSpecialPriceAssigned = true;
        currentPrice = specialPrice;
      } else {
        currentPrice = Number(basePrice);
      }
      const pricingRow = {
        blockedDates: item,
        isSpecialPrice: currentPrice - nightlyDiscount,
      };
      specialPricing.push(pricingRow);
    }
  });

  if (isSpecialPriceAssigned) {
    specialPricing.map((item, index) => {
      priceForDays = Number(priceForDays) + Number(item.isSpecialPrice);
    });
  } else {
    priceForDays = (basePrice - nightlyDiscount) * nights;
  }
  return { priceForDays, nights, isSpecialPrice: isSpecialPriceAssigned };
}
