import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Messages from './Messages';

const title = 'Messages';

export default {

    path: '/siteadmin/messages',

    async action({ store }) {


        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><Messages title={title} /></AdminLayout>,
        };
    },

};
