import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import AddPopularLocation from './AddPopularLocation';

const title = 'Add Popular Location';

export default {

    path: '/siteadmin/popularlocation/add',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><AddPopularLocation title={title} /></AdminLayout>,
        };
    },

};
