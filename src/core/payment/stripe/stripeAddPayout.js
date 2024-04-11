import stripePackage from 'stripe';
import { payment } from '../../../config';
const stripe = stripePackage(payment.stripe.secretKey);
//import { createTransactionHistory } from './helpers/createTransactionHistory';
//import { createTransaction } from './helpers/createTransaction';

const stripeAddPayout = app => {
    app.post('/stripe-add-payout', async function (req, res) {
        const userDetails = req.body.userDetails;
        const bankDetails = req.body.bankDetails;
        let status = 200, errorMessage, createPayout, dob;
        let accountId = null;
        var ts = Math.round((new Date()).getTime() / 1000);
        
        if(!userDetails && !bankDetails) {
            status = 400;
            errorMessage = 'Something went wrong, reload the page and try again';
        }
        if(userDetails.day && userDetails.month && userDetails.year) {
            dob = {
                day: userDetails.day,
                month: userDetails.month,
                year: userDetails.year,
            };
        }
        if(status === 200){
            try {
                createPayout = await stripe.accounts.create({
                    type: "custom",
                    country: bankDetails.country,
                    email: userDetails.email,
                    external_account: {
                        object: "bank_account",
                        country: bankDetails.country,
                        currency: bankDetails.currency,
                        routing_number: bankDetails.routingNumber,
                        account_number: bankDetails.accountNumber,
                    },
                    tos_acceptance: {
                        date: ts,
                        ip: req.connection.remoteAddress
                    },
                    legal_entity: {
                        dob,
                        first_name: bankDetails.firstname,
                        last_name: bankDetails.lastname,
                        ssn_last_4: bankDetails.ssn4Digits,
                        type: 'sole_prop',
                        address: {
                            city: bankDetails.city,
                            line1: bankDetails.address1,
                            postal_code: bankDetails.zipcode,
                            state: bankDetails.state
                        }

                    },
                });
            } catch(error) {
                status = 400;
                errorMessage = error.message;
            }
        }
        if (status === 200 && createPayout && "id" in createPayout) {
            accountId = createPayout.id;
        } else {
            status = 400;
            errorMessage = errorMessage ? errorMessage : 'Something went wrong, please try again!';
        }
        res.send({ status, errorMessage, accountId });
    });
};

export default stripeAddPayout;