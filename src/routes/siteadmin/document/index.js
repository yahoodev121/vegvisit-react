import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Document from './Document';

const title = 'ID Verification Management';

export default {

  path: '/siteadmin/id_verification',

  async action({ store }) {


    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><Document title={title} /></AdminLayout>,
    };
  },

};
