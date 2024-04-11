import stripePackage from 'stripe';
import { payment } from '../../../config';
const stripe = stripePackage(payment.stripe.secretKey);
import { createTransactionHistory } from './helpers/createTransactionHistory';
import { createTransaction } from './helpers/createTransaction';

const stripePayout = app => {
    app.post('/stripe-payout', async function (req, res) {
        const reservationDetails = req.body.reservationDetails;
        let destination, transfer_group, amount, reservationId, currency;
        let status = 200, errorMessage, payout, userId, hostEmail, payoutId;
        if (reservationDetails) {
            destination = reservationDetails.destination;
            transfer_group = reservationDetails.transfer_group;
            amount = reservationDetails.amount;
            currency = reservationDetails.currency;
            reservationId = reservationDetails.reservationId;
            userId = reservationDetails.userId;
            hostEmail = reservationDetails.hostEmail;
            payoutId = reservationDetails.payoutId;
        } else {
            status = 400;
            errorMessage = 'Something Went Wrong, please try again';
        }

        if(status === 200) {
            try {
                payout = await stripe.transfers.create({
                    amount: Math.round(amount + 'e2'),
                    currency,
                    destination,
                    transfer_group,
                    metadata: {
                        reservationId,
                        type: 'payout',
                        hostEmail: hostEmail
                    }
                });
            } catch(error) {
                status = 400;
                errorMessage = error.message;
            }
        }

        if (status === 200 && payout && 'id' in payout) {
            // Update Transactions
            /*await createTransaction(
                reservationDetails.reservationId,
                null,
                null,
                payout.id,
                Math.round(reservationDetails.amount),
                reservationDetails.currency,
                'host'
            );*/
            await createTransactionHistory(
                reservationDetails.reservationId,
                hostEmail,
                payoutId,
                payout.id,
                Number(Math.round(reservationDetails.amount+'e2')+'e-2'),
                reservationDetails.currency,
                userId,
                2
            );
        }
        res.send({ status, errorMessage });
    });
};

export default stripePayout;