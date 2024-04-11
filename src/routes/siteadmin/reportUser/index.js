import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ReportUser from './ReportUser';

const title = 'Report User';

export default {

    path: '/siteadmin/reportUser',

    async action({ store }) {


        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><ReportUser title={title} /></AdminLayout>,
        };
    },

};
