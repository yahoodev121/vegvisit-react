import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ProfileView from './ProfileView';

const title = 'Profile Verified View';

export default {

    path: '/siteadmin/profileView/:profileId?',

    async action({ store, params }) {


        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }


        const data = store.getState().account.data;
        const profileId = params.profileId;
        let profile = 0;
        let isUser = false;
        if(profileId === null || profileId === undefined) {
          if(data) {
            isUser = true;
          }
        } else {
          profile = Number(profileId);
        }
  
        return {
            title,
            component: <AdminLayout><ProfileView title={title} profileId={profile} /></AdminLayout>,
        };
    },

};
