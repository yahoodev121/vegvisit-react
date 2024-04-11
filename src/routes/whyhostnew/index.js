import React from 'react';
// import Layout from '../../components/Layout';
import WhyHostNew from './WhyHostNew';
import HomeLayout from '../../components/Layout/HomeLayout';

const title = 'Become A Host︱Vegvisits';

export default {

  path: '/whyhost',

  action({store}) {
    const layoutType = store.getState().siteSettings.data.homePageType;
    return {
      title,
      component: 
      <div className={'whyHostHidden'}><HomeLayout layoutType={layoutType}><WhyHostNew title={title} /></HomeLayout></div>,
    };
  },

};
