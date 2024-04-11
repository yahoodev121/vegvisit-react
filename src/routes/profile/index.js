import React from 'react';
import Layout from '../../components/Layout';
import Profile from './Profile';
import NotFound from '../notFound/NotFound';
import { getDiets } from '../../actions/getDiets';

import fetch from '../../core/fetch';

const title = 'User Profile';

export default {

  path: '/users/show/:profileId?',

  async action({ params, store }) {
    const data = store.getState().account.data;
    const isAuthenticated = store.getState().runtime.isAuthenticated;
    const diets = store.getState().diets.data;
    const profileId = params.profileId;
    let profile = 0;
    let isUser = false;

    if (profileId) {
      profile = Number(profileId);
      if (isAuthenticated && data && Number(data.profileId) == Number(profileId)) {
        profile = Number(profileId);
        isUser = true;
      }  
    } else {
      isUser = false;
    }

    if (diets === undefined) {
      store.dispatch(getDiets());
    }

    return {
      title,
      component: <Layout>
        <Profile
          title={title}
          isUser={isUser}
          profileId={profile}
        />
      </Layout>,
    };
  },

};
