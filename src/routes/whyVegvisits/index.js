import React from 'react';
// import Layout from '../../components/Layout';

import HomeLayout from '../../components/Layout/HomeLayout';
import Layout from '../../components/Layout';
import WhyVegVisits from './WhyVegVisits';
import cx from 'classnames';

const title = 'Why VegVisits';

export default {

  path: '/why-vegvisits',

  action({store}) {
    const layoutType = store.getState().siteSettings.data.homePageType;
    return {
      title,
      component: 
      <div className={cx('whyHostHidden', 'whyVegvisitHeader')}><Layout><WhyVegVisits title={title} /></Layout></div>,
    };
  },

};
