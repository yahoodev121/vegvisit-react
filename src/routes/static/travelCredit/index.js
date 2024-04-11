import React from 'react';
import Layout from '../../../components/Layout';
import Page from '../../../components/Page';
import fetch from '../../../core/fetch';

const query = `query getEditStaticPage ($id: Int!) {
  getEditStaticPage (id: $id) {
      id
      pageName
      content
      metaTitle
      metaDescription
      createdAt
  }
}`;
export default {

  path: '/travel',

  async action({ locale }) {
    const dataResult = await new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require('./travelCredit.md'));
      }, 'travelCredit');
    });
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: {id : 3},
      }),
      credentials: 'include',
    });
  
    const { data } = await resp.json();

    if(data && data.getEditStaticPage ){
      return {
        title: 'Travel Credit',
        description:  data.getEditStaticPage.metaDescription,
        chunk: 'about',
        component: <Layout><Page html={data.getEditStaticPage.content} title={data.getEditStaticPage.pageName}/></Layout>,
      };

    }else{
      return {
      title: dataResult.title,
      chunk: 'travelCredit',
      component: <Layout><Page {...dataResult} /></Layout>,
      };
    }
  },

};
