import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import SiteSettings from './SiteSettings';

const title = 'Site Settings';

export default {

  path: '/siteadmin/settings/site',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><SiteSettings title={title} /></AdminLayout>,
    };
  },

};
