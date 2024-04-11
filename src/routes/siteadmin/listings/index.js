import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Listings from './Listings';

const title = 'Listings Management';

export default {

  path: '/siteadmin/listings',

  async action({ store }) {


    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><Listings title={title} /></AdminLayout>,
    };
  },

};
