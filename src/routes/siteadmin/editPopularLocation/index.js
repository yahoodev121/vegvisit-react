import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import EditPopularLocation from './EditPopularLocation';

const title = 'Edit Popular Location';

export default {

    path: '/siteadmin/edit/popularlocation/:locationId',

    async action({ store, params }) {

        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }
    
        const locationId = Number(params.locationId);

        return {
            title,
            component: <AdminLayout><EditPopularLocation title={title} locationId={locationId} /></AdminLayout>,
        };
    },

};
