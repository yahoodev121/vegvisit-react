import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import SearchSettings from './SearchSettings';

const title = 'Search Settings';

export default {

  path: '/siteadmin/settings/search',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><SearchSettings title={title} /></AdminLayout>,
    };
    
  },

};
