import React from 'react';
import Layout from '../../components/Layout';
import ViewListing from './ViewListing';
import NotFound from '../notFound/NotFound';
import fetch from '../../core/fetch';
import moment from 'moment';
// import { change } from 'redux-form';

// Helpers
import { listingBaseUrl } from '../../helpers/cdnImages'


const title = 'View Listing';

function renderNotFound() {
  return {
    title,
    component: <Layout><NotFound title={title} /></Layout>,
    status: 404,
  };
}

export default {

  path: '/rooms/:listId/:preview?',

  async action({ params, store, query }) {


    let listTitle, listDescription, listPhoto, lat, lng, startDate, endDate;
    const baseCurrency = store.getState().currency.base;
    const getListquery = `
      query GetListMeta($listId: Int!) {
        getListMeta(listId: $listId) {
          id
          title
          description
          isPublished
          coverPhoto
          listPhotos {
            id
            name
          }
          listingRetreat {
            id
            highlights
            category {
              id
              name
            }
            startDate
            endDate
            numberSeats
            searchResultsBulletpoints
            about
            itinerary
            accommodation
          }
          listType
          status
          lat
          lng
        }
      }
    `;

    // From URI
    let listURL = params.listId;
    let listId, listURLData;
    let preview = false;
    let info;
    let inquiry = false;

    if (params.preview) {
      preview = true;
    }

    if (query.inquiry) {
      inquiry = true;
    }

    if (listURL && listURL.indexOf('-') >= 0) {
      listURLData = listURL.split('-');
      listId = listURLData[listURLData.length - 1];
    } else {
      listId = listURL;
    }

    if (listId === undefined || isNaN(listId)) {
      renderNotFound();
      return;
    }

    if ('info' in query) {
      info = query.info;
    }

    // const dates = params.dates;
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: getListquery,
        variables: { listId }
      }),
    });
    const { data } = await resp.json();

    if ('startDate' in query && 'endDate' in query) {
      startDate = moment(query.startDate);
      endDate = moment(query.endDate);
      // store.dispatch(change("BookingForm","startDate",startDate));
      // store.dispatch(change("BookingForm","endDate",endDate));
    }

    if (data && data.getListMeta) {
      if (!data.getListMeta.isPublished && !preview) {
        renderNotFound();
        return;
      }
      listTitle = data.getListMeta.title;
      listDescription = data.getListMeta.description;
      lat = data.getListMeta.lat;
      lng = data.getListMeta.lng;
      if (data.getListMeta.listPhotos && data.getListMeta.listPhotos.length > 0) {
        if (data.getListMeta.coverPhoto) {
          const photo = data.getListMeta.listPhotos.find((photo => {
            return photo.id === data.getListMeta.coverPhoto;
          }));
          if (photo) {
            listPhoto = listingBaseUrl() + 'xx_large_' + photo.name;
          }
        } 
        if (!listPhoto) {
          listPhoto = listingBaseUrl() + 'xx_large_' + data.getListMeta.listPhotos[0].name;
        }
      }
    } else {
      renderNotFound();
      return;
    }
    return {
      title: listTitle || title,
      description: listDescription || '',
      image: listPhoto || '',
      component: <Layout><ViewListing
        title={title}
        preview={preview}
        lat={lat}
        lng={lng}
        listId={Number(listId)}
        startDate={startDate}
        endDate={endDate}
        baseCurrency={baseCurrency}
        info={info}
        inquiry={inquiry}
      /></Layout>,
    };
  },

};
