// Redux Actions
import { payoutHost } from '../../../../actions/Reservation/payoutHost';
import { refundGuest } from '../../../../actions/Reservation/refundGuest';
import { closeReservationModal } from '../../../../actions/Reservation/payoutModal';
import log from '../../../../helpers/clientLog';

async function submit(values, dispatch) {
  // let paymentCurrency = (values.paymentMethodId == 1 || values.paymentMethodId == 4) ? values.paymentCurrency : null;
  // Make payouts always in USD which is already the currency of the amount
  let paymentCurrency = (values.paymentMethodId == 1 || values.paymentMethodId == 4) ? values.currency : null;
	
	if(values.type === 'host'){
    log.debug(`components.siteadmin.ReservationManagement.ModalForm.submit: Initiating payout with values ${JSON.stringify(values)}`);
		paymentCurrency = values.paymentMethodId == 2 ? values.payoutCurrency : paymentCurrency;
		await dispatch(
			payoutHost(
				values.reservationId, 
				values.receiverEmail, 
				values.payoutId, 
				values.amount, 
				values.currency,
				paymentCurrency,
				values.hostId,
				values.paymentMethodId,
				values.hostEmail
			)
		);
		return dispatch(closeReservationModal());
	}

	if(values.type === 'guest'){
    log.debug(`components.siteadmin.ReservationManagement.ModalForm.submit: Initiating refund with values ${JSON.stringify(values)}`);
    if (values.paymentMethodId == 1 || values.paymentMethodId == 3) {
      paymentCurrency = values.transactionCurrency;
    }
		await dispatch(
			refundGuest(
				values.reservationId, 
				values.receiverEmail, 
				values.receiverId,
				values.payerEmail,
				values.payerId,
				values.amount, 
				values.currency,
				paymentCurrency,
				values.paymentMethodId,
				values.transactionId
			)
		);
		return dispatch(closeReservationModal());
	}
}

export default submit;
