import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Users from './Users';

const title = 'User Management';

export default {

  path: '/siteadmin/users',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><Users title={title} /></AdminLayout>,
    };
  },

};
