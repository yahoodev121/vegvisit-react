import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ServiceFeesSettings from './ServiceFeesSettings';

const title = 'Service Fees Settings';

export default {

  path: '/siteadmin/settings/servicefees',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><ServiceFeesSettings title={title} /></AdminLayout>,
    };
  },

};
