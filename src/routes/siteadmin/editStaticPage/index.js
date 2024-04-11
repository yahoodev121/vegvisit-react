import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import EditStaticPage from './EditStaticPage';

const title = 'Edit Page Details';

export default {

    path: '/siteadmin/edit/staticpage/:pageId',

    async action({ store, params }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }
    
        const pageId = Number(params.pageId);

        return {
            title,
            component: <AdminLayout><EditStaticPage title={title} pageId={pageId} /></AdminLayout>,
        };
    },

};
