import moment from 'moment';
import 'moment-timezone';

import { convert } from './currencyConvertion';

export function calculatePrice(checkIn, checkOut, timeZone, specialPricing, basePrice, serviceFees, base, rates, currency, monthlyDiscount, formatMessage, weeklyDiscount, cleaningPrice, messages) {
  let guestServiceFee = 0, hostServiceFee = 0, priceForDays = 0;
  let discount = 0, discountType, total = 0, totalWithoutFees = 0;
  let momentStartDate, momentEndDate, dayDifference, isAverage = 0;
  let bookingSpecialPricing = [], isSpecialPriceAssigned = false;
  let isDayTotal = 0;
  if (checkIn != null && checkOut != null) {
    momentStartDate = moment(checkIn);
    momentEndDate = moment(checkOut);
    dayDifference = momentEndDate.diff(momentStartDate, 'days');
    // priceForDays = Number(basePrice) * Number(dayDifference);
    if (dayDifference > 0) {
      let stayedNights = [];
      // Find stayed nights
      for (let i = 0; i < dayDifference; i++) {
        let currentDate = moment(checkIn).add(i, 'day');
        stayedNights.push(currentDate);
      }
      if (stayedNights && stayedNights.length > 0) {
        stayedNights.map((item, key) => {
          let isSpecialPricing;
          if (item) {
            let pricingRow, currentPrice;
            // isSpecialPricing = specialPricing.find(o => moment(item).format('MM/DD/YYYY') == moment(o.blockedDates).format('MM/DD/YYYY'));
            if (timeZone) {
              isSpecialPricing = specialPricing && specialPricing.find(o => moment(item).tz(timeZone).format('MM/DD/YYYY') == moment(o.blockedDates).tz(timeZone).format('MM/DD/YYYY'));
            }
            else {
              isSpecialPricing = specialPricing && specialPricing.find(o => moment(item).tz(moment.tz.guess()).format('MM/DD/YYYY') == moment(o.blockedDates).tz(moment.tz.guess()).format('MM/DD/YYYY'));
            }
            if (isSpecialPricing && isSpecialPricing.isSpecialPrice) {
              isSpecialPriceAssigned = true;
              currentPrice = Number(isSpecialPricing.isSpecialPrice);
            }
            else {
              currentPrice = Number(basePrice);
            }
            // Price object
            pricingRow = {
              blockedDates: item,
              isSpecialPrice: currentPrice,
            };
            bookingSpecialPricing.push(pricingRow);
          }
        });
      }
    }
    if (isSpecialPriceAssigned) {
      bookingSpecialPricing.map((item, index) => {
        priceForDays = priceForDays + Number(item.isSpecialPrice);
      });
    }
    else {
      bookingSpecialPricing.map((item, index) => {
        priceForDays = priceForDays + Number(item.isSpecialPrice);
      });
    }
  }
  isAverage = Number(priceForDays) / Number(dayDifference);
  isDayTotal = isAverage.toFixed(2) * dayDifference;
  priceForDays = isDayTotal;
  if (serviceFees) {
    if (serviceFees.guest.type === 'percentage') {
      guestServiceFee = priceForDays * (Number(serviceFees.guest.value) / 100);
    }
    else {
      if (basePrice > 0) {
        guestServiceFee = convert(base, rates, serviceFees.guest.value, serviceFees.guest.currency, currency);
      }
      else {
        guestServiceFee = 0;
      }
    }
    // if (serviceFees.host.type === 'percentage') {
    //   if (basePrice > 0 && priceForDays > 0) {
    //     hostServiceFee = priceForDays * (Number(serviceFees.host.value) / 100);
    //   } else {
    //     hostServiceFee = priceForDays + (Number(serviceFees.host.value) / 100);
    //   }
    //   // hostServiceFee = priceForDays * (Number(serviceFees.host.value) / 100);
    // } else {
    //   hostServiceFee = convert(base, rates, serviceFees.host.value, serviceFees.host.currency, currency);
    // }
    if (serviceFees.host.type === 'percentage') {
      hostServiceFee = priceForDays * (Number(serviceFees.host.value) / 100);
    }
    else {
      if (basePrice > 0) {
        hostServiceFee = convert(base, rates, serviceFees.host.value, serviceFees.host.currency, currency);
      }
      else {
        hostServiceFee = 0;
      }
    }
  }
  if (dayDifference >= 7) {
    if (monthlyDiscount > 0 && dayDifference >= 28) {
      discount = (Number(priceForDays) * Number(monthlyDiscount)) / 100;
      discountType = monthlyDiscount + '%';
      if (formatMessage && messages) {
        discountType = discountType + ' ' + formatMessage(messages.monthlyDiscount);
      }
    }
    else {
      if (weeklyDiscount > 0) {
        discount = (Number(priceForDays) * Number(weeklyDiscount)) / 100;
        discountType = weeklyDiscount + '%';
        if (formatMessage && messages) {
          discountType = discountType + ' ' + formatMessage(messages.weeklyDiscount);
        }
      }
    }
  }
  total = (priceForDays + guestServiceFee + cleaningPrice) - discount;
  totalWithoutFees = (priceForDays + cleaningPrice) - discount;
  return { discount, discountType, guestServiceFee, hostServiceFee, totalWithoutFees, isSpecialPriceAssigned, bookingSpecialPricing, isAverage, dayDifference, priceForDays, total };
}
