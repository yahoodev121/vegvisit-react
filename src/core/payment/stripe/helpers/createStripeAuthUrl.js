import {queryfy} from 'queryfy';

/**
 * Creates the Url needed to start the Stripe Express workflow
 * @param {*} params See validParams object
 */
export function createStripeAuthUrl(params) {
  const {firstName, lastName, payEmail, country, birthdayDay, birthdayMonth, birthdayYear} = params;
  const validParams = Object.assign({},
    firstName && {firstName},
    lastName && {lastName},
    payEmail && {payEmail},
    country && {country},
    birthdayDay && {birthdayDay},
    birthdayMonth && {birthdayMonth},
    birthdayYear && {birthdayYear}
  );
  const path = '/stripe-authorize';
  const queryString = queryfy(path, validParams);
  // return `/stripe-authorize?firstName=${firstName}&lastName=${lastName}&payEmail=${payEmail}&country=${country}&birthdayDay=${birthdayDay}&birthdayMonth=${birthdayMonth}&birthdayYear=${birthdayYear}`;
  return queryString;
}