import fetch from '../fetch';

export async function paypalCaptureOrder(reservationId, amount, currency, orderID) {
  const resp = await fetch('/paypalCaptureOrder', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({reservationId, amount, currency, orderID}),
    credentials: 'include',
  });
  const {status, redirect} = await resp.json();
  return {status, redirect};      
}