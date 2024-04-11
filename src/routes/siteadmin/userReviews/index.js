import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import UserReviews from './UserReviews';

const title = 'Users Reviews';

export default {

    path: '/siteadmin/user-reviews',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><UserReviews title={title} /></AdminLayout>,
        };
    },

};
