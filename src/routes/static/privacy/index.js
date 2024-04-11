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

  path: '/privacy',

  async action({ locale }) {
    const dataResult = await new Promise((resolve) => {
      require.ensure([], (require) => {
        try {
          resolve(require(`./privacy.${locale}.md`)); // eslint-disable-line import/no-dynamic-require
        } catch (e) {
          resolve(require('./privacy.md'));
        }
      }, 'privacy');
    });

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: {id : 4},
      }),
      credentials: 'include',
    });
  
    const { data } = await resp.json();

    if(data && data.getEditStaticPage ){
      return {
        title: 'Terms & Privacy',
        description:  data.getEditStaticPage.metaDescription,
        chunk: 'about',
        component: <Layout><Page html={data.getEditStaticPage.content} title={data.getEditStaticPage.pageName}/></Layout>,
      };

    }else{
      return {
      title: dataResult.title,
      chunk: 'privacy',
      component: <Layout><Page {...dataResult} /></Layout>,
      };
    }
  },

};
