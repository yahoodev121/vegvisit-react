import React from 'react';
import Layout from '../../../components/Layout';
import Page from '../../../components/Page';

export default {

  path: '/help',

  async action({ locale }) {
    const data = await new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require('./help.md'));
      }, 'help');
    });

    return {
      title: data.title,
      chunk: 'help',
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
