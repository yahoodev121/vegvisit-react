import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import WriteReview from './WriteReview';

const title = 'Admin Reviews';

export default {

    path: '/siteadmin/write-reviews',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><WriteReview title={title} /></AdminLayout>,
        };
    },

};
