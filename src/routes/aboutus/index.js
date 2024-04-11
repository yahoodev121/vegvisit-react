import React from 'react';
import Layout from '../../components/Layout';
import About from './Aboutus';
import Aboutus from './Aboutus';

export default {

  path: '/about-Us',

  action() {
    return {
      title: 'About Us | Vegvists',
      component: <Layout><Aboutus /></Layout>
    };
  },

};
