import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import HomeLayout from '../../components/Layout/HomeLayout';

import { getListingFields } from '../../actions/getListingFields';
import { getHomeBannerImages } from '../../actions/getHomeBannerImages';

export default {

  path: '/',

  async action({store}) {
    const title = store.getState().siteSettings.data.siteTitle;
    const description = store.getState().siteSettings.data.metaDescription;
    const listingFields = store.getState().listingFields.data;
    const layoutType = store.getState().siteSettings.data.homePageType;
    const image = store.getState().siteSettings.data.openGraphImage;

    if (listingFields === undefined) {
      store.dispatch(getListingFields());
    }
    await store.dispatch(getHomeBannerImages());
    
    return {
      title,
      description,
      listingFields,
      chunk: 'home',
      component: <HomeLayout layoutType={layoutType}><Home layoutType={layoutType} /></HomeLayout>,
      image
    };
  },

};
