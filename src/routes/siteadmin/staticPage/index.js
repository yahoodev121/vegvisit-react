import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import StaticPage from './StaticPage';

const title = 'Static Page Management';

export default {

    path: '/siteadmin/staticpage/management',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><StaticPage title={title} /></AdminLayout>,
        };
    },

};
