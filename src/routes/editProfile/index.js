import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import EditProfile from './EditProfile';
import { setSiteSettings } from '../../actions/siteSettings';
import { getDiets } from '../../actions/getDiets';


const title = 'Edit Profile';

export default {

  path: '/user/edit',

  async action({ store }) {

    // From Redux Store
    let isAuthenticated = store.getState().runtime.isAuthenticated;
    const diets = store.getState().diets.data;

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }

    await store.dispatch(setSiteSettings());

    if (diets === undefined) {
      store.dispatch(getDiets());
    }

    return {
      title,
      component: <UserLayout><EditProfile title={title} /></UserLayout>,
    };
  },

};
