import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import BlogManagement from './BlogManagement';

const title = 'Content Management System';

export default {

    path: '/siteadmin/content-management',

    async action({ store }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><BlogManagement title={title} /></AdminLayout>,
        };
    },

};
