import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import PopularLocation from './PopularLocation';

const title = 'Popular Location';

export default {

    path: '/siteadmin/popularlocation',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><PopularLocation title={title} /></AdminLayout>,
        };
    },

};
