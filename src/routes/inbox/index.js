import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import InboxContainer from './InboxContainer';

const title = 'Inbox';

export default {

  path: '/inbox/:inboxType?',

  action({ store, params }) {

    // From Redux Store
    const isAuthenticated = store.getState().runtime.isAuthenticated;

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }

    let type = 'guest';
    if (params.inboxType && params.inboxType === 'host') {
      type = 'host';
    }

    return {
      title,
      component: <UserLayout>
        <InboxContainer 
          title={title}
          inboxType={type}
        />
      </UserLayout>,
    };
  },

};
