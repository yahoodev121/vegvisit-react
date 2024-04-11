import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Reservations from './Reservations';

const title = 'Reservations';

export default {

  path: '/siteadmin/reservations',

  async action({ store }) {


    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><Reservations title={title} /></AdminLayout>,
    };
  },

};
