import fetch from '../../fetch';
import { toastr } from 'react-redux-toastr';

export async function processStripePayment(
    type,
    cardDetails,
    reservationDetails,
    paymentMethodId
) {

    let URL;
    let variables = {
        cardDetails,
        reservationDetails,
        paymentMethodId
    };
    if (type === 'reservation') {
        URL = '/stripe-reservation';
    } else if (type === 'payout') {
        URL = '/stripe-payout';
    } else if (type === 'addPayout') {
        URL = '/stripe-add-payout';
        variables = {
            userDetails: cardDetails,
            bankDetails: reservationDetails
        };
    }

    const resp = await fetch(URL, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(variables),
        credentials: 'include'
    });
    //return await resp.json();
    const { status, errorMessage, redirect, accountId } = await resp.json();
    if (status === 200 && redirect) {
        if (reservationDetails.bookingTypeData != 'instant') {
            toastr.success("Booking", "Your booking request has been sent successfully");
        }
        window.location = redirect;
    }
    return {
        status,
        errorMessage,
        accountId
    }
}