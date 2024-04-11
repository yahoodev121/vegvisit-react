import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import BannerSettings from './BannerSettings';

const title = 'Banner Settings';

export default {

  path: '/siteadmin/home/caption',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component : <AdminLayout><BannerSettings title={title}/></AdminLayout>,
    };
  },

};
