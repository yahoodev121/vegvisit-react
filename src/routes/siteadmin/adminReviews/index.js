import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import AdminReviews from './AdminReviews';

const title = 'Admin Reviews';

export default {

    path: '/siteadmin/reviews',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><AdminReviews title={title} /></AdminLayout>,
        };
    },

};
