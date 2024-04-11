import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import HomeBanner from './HomeBanner';
import { getHomeBannerImages } from '../../../actions/getHomeBannerImages';
const title = 'Home Banner';

export default {

  path: '/siteadmin/home/home-banner',

  async action({ store , dispatch}) {

    // From Redux Store
    let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    await store.dispatch(getHomeBannerImages())

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    return {
      title,
      component: <AdminLayout><HomeBanner title={title} /></AdminLayout>,
    };
  },

};
