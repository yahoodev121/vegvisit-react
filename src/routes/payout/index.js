import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import PayoutContainer from './PayoutContainer';

const title = 'Payout Preferences';

export default {

  path: '/user/payout',

  action({ store }) {

    // From Redux Store
    let isAuthenticated = store.getState().runtime.isAuthenticated;

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }

    return {
      title,
      component: <UserLayout><PayoutContainer title={title} /></UserLayout>,
    };
  },

};
