import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import FooterBlock from './FooterBlock';

const title = 'Footer Block';

export default {

  path: '/siteadmin/home/footer-block',

  async action({ store }) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><FooterBlock title={title} /></AdminLayout>,
    };
  },

};
