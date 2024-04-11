import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ViewReservationroute from './ViewReservationroute';

const title = 'Reservation Details';

export default {

    path: '/siteadmin/viewreservation/:id',

    async action({ store, params }) {


        // From Redux Store
        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }
        const id=params.id;
        return {
            title,
            component: <AdminLayout><ViewReservationroute title={title} id={Number(id)}/></AdminLayout>,
        };
    },

};
