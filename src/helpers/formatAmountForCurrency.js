import log from './clientLog';

/**
 * Create a string for a given amount and currency with the requited decimal places
 * @param {*} paymentAmount The amount
 * @param {*} paymentCurrency The currency
 */
export default function formatAmountForCurrency(paymentAmount, paymentCurrency) {
  let paymentAmountString = paymentAmount.toFixed(2);

  // Following currencies must not have decimal places or PayPal will throw an error:
  // https://developer.paypal.com/docs/payouts/reference/country-and-currency-codes/#
  if (paymentCurrency === 'JPY' || paymentCurrency === 'HUF' || paymentCurrency === 'TWD') {
    const paymentAmountRounded = Math.round(paymentAmount);
    paymentAmountString = paymentAmountRounded.toFixed(0);
  }

  log.debug(`src.helpers.formatAmountForCurrency.formatAmountForCurrency: Formatted ${paymentAmount} ${paymentCurrency} to ${paymentAmountString}`);
  return paymentAmountString;
}
