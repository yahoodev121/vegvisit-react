import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ImageBanner from './ImageBanner';

const title = 'Home page Banner';

export default {

  path: '/siteadmin/home/banner',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><ImageBanner title={title} /></AdminLayout>,
    };
  },

};
