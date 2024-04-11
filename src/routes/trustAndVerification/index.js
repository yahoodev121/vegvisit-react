import React from 'react';
import moment from 'moment';
import * as ExecutionEnvironment from 'exenv';

import UserLayout from '../../components/Layout/UserLayout';
import TrustAndVerification from './TrustAndVerification';
import { emailVerification } from '../../actions/manageUserVerification';
import { bookingProcess } from '../../actions/booking/bookingProcess';
import { checkAvailableDates } from '../../helpers/checkAvailableDates';

import log from '../../helpers/clientLog';

const title = 'Trust and Verification';

export default {

  path: '/user/verification',

  async action({ store, query }) {

    //no SSR?
    const isExecutedOnClientSide = ExecutionEnvironment.canUseDOM;

    // From Redux Store
    let isAuthenticated = store.getState().runtime.isAuthenticated;

    if (!isAuthenticated) {
      if ('confirm' in query && 'email' in query) {
        //return { redirect: '/login?verification=email' };
        return { redirect: "/login?refer=/user/verification---confirm=" + query.confirm + "--email=" + query.email };
      }
      return { redirect: '/login' };
    }

    let userId = store.getState().account.data.userId;
    let info;
    let listId;

    if ('confirm' in query && 'email' in query) {
      store.dispatch(emailVerification(query.confirm, query.email, userId));
      // Without isExecutedOnClientSide, checkAvailableDates is always false since the user is not evaluated correctly (it is not sent by fetch-node)
      // With the isExecutedOnClientSide in place the footer is not rendered correctly when doing a redirect (so let's not do it here but in component, see below)
      if (isExecutedOnClientSide && 'bookingListing' in query && 'bookingStartDate' in query && 'bookingEndDate' in query && 'bookingGuests' in query && 'bookingMessageType' in query && 'bookingPreApprove' in query) {
        const startDate = moment(query.bookingStartDate);
        const endDate = moment(query.bookingEndDate);
        const bookingPreApprove = (query.bookingPreApprove === 'true');
        const validAndAvailableDates = await checkAvailableDates(query.bookingListing, startDate, endDate);
        if (validAndAvailableDates) {
          log.debug(`routes.trustAndVerification: Dates are still available, starting booking process for listing ${query.bookingListing} between ${startDate.format()} and ${endDate.format()}.`)
          store.dispatch(bookingProcess(query.bookingListing, query.bookingGuests, startDate, endDate, bookingPreApprove, null, null, null, query.bookingMessageType, null));
        } else {
          // Dates are not valid or available, let's open the listing page with a message to the user
          // But let's do that inside the component when we are sure we are on the client to avoid SSR issues
          log.warn(`routes.trustAndVerification: Listing ${query.bookingListing} is not available any more between ${startDate.format()} and ${endDate.format()}.`)
          listId = query.bookingListing;
          info = 'notAvailable';
        }
      } else if ('bookingListing' in query && 'bookingMessageType' in query && query.bookingMessageType === 'inquiry') {
        listId = query.bookingListing;
        info = 'inquiry';
      }
    }

    return {
      title,
      component: <UserLayout><TrustAndVerification title={title} info={info} listId={listId} /></UserLayout>,
    };
  },

};
