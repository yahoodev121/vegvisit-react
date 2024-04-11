import querystring from 'querystring';
import stripePackage from 'stripe';
import Sequelize from 'sequelize';

import { url, payment, stripeExpress as stripeExpressConfig } from '../../../config';
import {
  Payout
} from '../../../data/models';
import sendUnauthorized from '../../sendUnauthorized';
import logger from '../../logger';

const stripe = stripePackage(payment.stripe.secretKey);

/**
 * Stripe Express endpoints
 * @param {*} app 
 */
const stripeExpress = app => {
    /**
     * GET /stripe-authorize
     *
     * Redirect to Stripe to set up payouts.
     */
    app.get('/stripe-authorize', function (req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/stripe-authorize');
      } else {
        logger.debug(`/stripe-authorize: Starting to process query ${JSON.stringify(req.query)} for user ${JSON.stringify(req.user)}`);
        next();
      }
    }, (req, res) => {
      // Generate a random string as `state` to protect from CSRF and include it in the session
      req.session.state = Math.random()
        .toString(36)
        .slice(2);
      // Define the mandatory Stripe parameters: make sure to include our platform's client ID
      let parameters = {
        client_id: stripeExpressConfig.clientId,
        state: req.session.state,
      };
      // Optionally, the Express onboarding flow accepts `first_name`, `last_name`, `email`,
      // and `phone` in the query parameters: those form fields will be prefilled
      parameters = Object.assign(parameters, {
          redirect_uri: stripeExpressConfig.redirectUri,
          // 'stripe_user[business_type]': req.user.type || 'individual',
          // 'stripe_user[business_name]': req.user.businessName || undefined,
          'stripe_user[first_name]': req.query.firstName || undefined,
          'stripe_user[last_name]': req.query.lastName || undefined,
          'stripe_user[email]': req.query.payEmail || undefined,
          // 'stripe_user[country]': req.query.country || undefined,
          'stripe_user[dob_day]': req.query.birthdayDay || undefined,
          'stripe_user[dob_month]': req.query.birthdayMonth || undefined,
          'stripe_user[dob_year]': req.query.birthdayYear || undefined,
          // If we're suggesting this account have the `card_payments` capability,
          // we can pass some additional fields to prefill:
          // 'suggested_capabilities[]': 'card_payments',
          // 'stripe_user[street_address]': req.user.address || undefined,
          // 'stripe_user[city]': req.user.city || undefined,
          // 'stripe_user[zip]': req.user.postalCode || undefined,
          // 'stripe_user[state]': req.user.city || undefined,
        },
        req.query.country && {'stripe_user[country]': req.query.country},
      );
      logger.debug(`/stripe-authorize: Starting Express flow with ${JSON.stringify(parameters)}`);
      // Redirect to Stripe to start the Express onboarding flow
      res.redirect(
        stripeExpressConfig.authorizationUri + '?' + querystring.stringify(parameters)
      );
    });

    /**
     * GET /stripe-connected
     *
     * Connect the new Stripe account to the platform account payouts.
     */
    app.get('/stripe-connected', function (req, res, next) {
        if (!req.user || !req.query.code || !req.query.state  || req.session.state != req.query.state) {
          logger.warn(`/stripe-connected: Not logged in or wrong code: User: ${JSON.stringify(req.user)}, code: ${req.query.code}, query: ${JSON.stringify(req.query)}`);
          res.sendStatus(403);
        } else {
          logger.debug(`/stripe-connected: Starting to process query ${JSON.stringify(req.query)} for user ${JSON.stringify(req.user)} and session ${JSON.stringify(req.session)}`);
          next();
        }
      }, async function (req, res) {
        const Op = Sequelize.Op;
        let status = 200, errorMessage, count;
        if(!stripeExpressConfig.useExpress) {
          status = 400;
          errorMessage = 'Not available';
        }
        if(req.query.error || !req.query.code) {
            status = 400;
            errorMessage = 'Something went wrong, please add your payout method again';
        }
        if(status === 200){
            try {
              const response = await stripe.oauth.token({
                grant_type: 'authorization_code',
                code: req.query.code,
              });
              logger.debug(`/stripe-connected: Received token from Stripe: ${JSON.stringify(response)}`);
              if (!(response && response.stripe_user_id)) {
                throw new Error('Bad response from Stripe when trying to get token for authorization code');
              }
              const connected_account_id = response.stripe_user_id;

              // Update Payout with stripe_user_id
              count = await Payout.update({ payEmail: connected_account_id }, {
                where: {
                    userId: req.user.id,
                    methodId: 2,
                    [Op.not]: [{
                      payEmail: {
                        [Op.like]: 'acct_%'
                      }
                    }]
                }
              });
              if (count != 1) {
                logger.warn(`/stripe-connected: Expected to update one dataset but updated ${count} payout method datasets for userId ${req.user.id} with accountId ${connected_account_id}`);
              } else {
                logger.info(`/stripe-connected: Updated ${count} payout method datasets for userId ${req.user.id} with accountId ${connected_account_id}`);
              }
              res.redirect('/user/payout');
              return;
            } catch(error) {
                logger.error(`/stripe-connected: Token or update error: ${error.message}`, error);
                status = 400;
                errorMessage = error.message;
            }
        }
        logger.error(`/stripe-connected: Error: ${errorMessage}`);
        res.sendStatus(status);
    });

    /**
     * GET /stripe-dashboard
     *
     * Redirect to the users' Stripe Express dashboard to view payouts and edit account details.
     */
    app.get('/stripe-dashboard', function (req, res, next) {
        if (!req.user) {
          sendUnauthorized(req, res, '/stripe-dashboard');
        } else {
          logger.debug(`/stripe-dashboard: Starting to process query ${JSON.stringify(req.query)} for user ${JSON.stringify(req.user)}`);
          next();
        }
      }, async (req, res) => {
        const stripeAccountId = req.query.accountId;
        try {
          // Make sure the logged-in user completed the Express onboarding and the accountId belongs to the user
          const payout = await Payout.findOne({
            where: { userId: req.user.id , methodId: 2, payEmail: stripeAccountId},
          });
          if (!stripeAccountId || !stripeAccountId.startsWith('acct_') || !payout) {
            logger.warn(`/stripe-dashboard: The Stripe accountId ${stripeAccountId} is not defined or not existing for user ${JSON.stringify(req.user)}`);
            return res.redirect('/user/payout');
          }

          // Generate a unique login link for the associated Stripe account to access their Express dashboard
          const loginLink = await stripe.accounts.createLoginLink(
            stripeAccountId, {
              redirect_url: url + '/user/payout'
            }
          );
          // Directly link to the account tab
          if (req.query.account) {
            loginLink.url = loginLink.url + '#/account';
          }
          logger.debug(`/stripe-dashboard: Redirecting user ${JSON.stringify(req.user)} to Stripe login link now.`);
          // Retrieve the URL from the response and redirect the user to Stripe
          return res.redirect(loginLink.url);
        } catch (err) {
          logger.error(`/stripe-dashboard: Failed to create a Stripe login link for user ${JSON.stringify(req.user)}. Error: ${err.message}`, err);
          return res.redirect('/user/payout');
        }
      }
    );
};

export default stripeExpress;