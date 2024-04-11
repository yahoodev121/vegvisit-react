import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import AddBlogDetails from './AddBlogDetails';

const title = 'Add Page Details';

export default {

    path: '/siteadmin/page/add',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><AddBlogDetails title={title} /></AdminLayout>,
        };
    },

};
