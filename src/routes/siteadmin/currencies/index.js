import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Currency from './Currency';

const title = 'Currency Management';

export default {

  path: '/siteadmin/currency',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component : <AdminLayout><Currency title={title} /></AdminLayout>,
    };
  },

};
