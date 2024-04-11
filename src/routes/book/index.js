import React from 'react';
import Layout from '../../components/Layout';
import Book from './Book';
import NotFound from '../notFound/NotFound';

const title = 'Booking';

export default {

  path: '/book/:hostingId',

  action({ store, params, query }) {

    // From Redux Store
    let isAuthenticated = store.getState().runtime.isAuthenticated;
    let bookingData = store.getState().book.data;
    let hostingId = params.hostingId;
    let inquiry = query.inquiry ? true : false;

    // Check authentication
    if (!isAuthenticated) {
      return { redirect: '/login?refer=/rooms/' + hostingId };
    }

    // Check listId is provided
    if(!hostingId){
      return {
        title,
        component: <Layout><NotFound title={title} /></Layout>,
        status: 404
      };
    }

    // Check redux store for booking data
    if(!inquiry && !bookingData){
      return { redirect: '/rooms/' + hostingId };
    }

    return {
      title,
      component: <Layout><Book title={title} inquiry={inquiry} hostingId={hostingId}/></Layout>,
    };
  },

};