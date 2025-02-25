import React from 'react';
import Layout from '../../components/Layout';
import ViewRetreat from './editRetreat';
import NotFound from '../notFound/NotFound';
import fetch from '../../core/fetch';
import moment from 'moment';
// import { change } from 'redux-form';

// Helpers
import { listingBaseUrl } from '../../helpers/cdnImages'
import {gql} from "react-apollo";

import { getListingFields } from '../../actions/getListingFields';
import { getCategoriesData } from '../../actions/getCategories';
import { getMealData } from '../../actions/getMeals';
import { getAreaData } from '../../actions/getAreas';
import { getLanguageData } from '../../actions/getLanguages';
import ListRetreat from '../addRetreat/ListRetreat';

const title = 'Edit Retreat';

function renderNotFound() {
  return {
    title,
    component: <Layout><NotFound title={title} /></Layout>,
    status: 404,
  };
}

export default {

  path: '/retreats/:id/edit',

  async action({ params, store, query }) {
    // From URI
    let listId = params.id;
    const baseCurrency = store.getState().currency.base;
    const formBaseURI = "/list-retreat";

    const getRetreatQuery = `
      query ($listId:String!) {
      UserListing (listId:$listId) {
        id
        title
        personCapacity
        lat
        lng
        city
        state
        country
        timeZone
        beds
        bookingType
        coverPhoto
        reviewsCount,
        reviewsStarRating,
        kitchen,
        listPhotos {
          id
          name
          type
          status
        }
        listCategories {
          id
          listId
          category
          subCategory
        }
        listingData {
          basePrice
          currency
        }
        settingsData {
          listsettings {
            id
            itemName
            itemDescription
          }
        }
        listingRetreat {
          accommodations {
            type
            price
            deposit_percent
            description
            photos {
              name
              type
            }
          }
          teachers {
            name
            email
            is_yoga_alliance
            about
            photos {
              name
              type
            }
            location {
              country
              street
              buildingName
              city
              state
              zipCode
            }
          }
          eventType
          category
          title
          location
          country
          street
          city
          state
          zipcode
          lat
          lng
          subCategory
          RetreatStyle
          atmospheres
          yogaTypes
          skillLevels
          languageId
          benefits
          summary
          includes
          not_includes
          special
          full_description
          instagram_url
          meal
          drink
          food
          currency
          retreat_dates
          duration
          min_days
          Seats
          isAllowPayment
          isCash
          addons
          cancellationPolicy
          allow_flexibility
          use_increase_booking
          free_gift_name
          free_gift_desc
          itinerary
          localInfoDesc
          localInformation
          facilityFeatures
          seasonalInformation
          travelHelp
        }
        wishListStatus
        isListOwner
        listType
      }
    }`;

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: getRetreatQuery,
        variables: { listId }
      }),
    });
    const { data } = await resp.json();

    const listingFields = store.getState().listingFields.data;
    store.dispatch(getCategoriesData());
    store.dispatch(getMealData());
    store.dispatch(getLanguageData());
    store.dispatch(getAreaData());

    let mode = "edit";

    // Fetch all settings fields
    if (listingFields === undefined) {
      store.dispatch(getListingFields());
    }

    if(false) {
      renderNotFound();
      return;
    }
    return {
      title: title,
      description: '',
      image: '',
      component: <Layout>
        {/* <ViewRetreat retreat={data} initialFilter={initialFilter} searchSettings={searchSettings} /> */}
        <ListRetreat
          listId={Number(listId)}
          title={title}
          formBaseURI={formBaseURI}
          mode={mode}
          baseCurrency={baseCurrency}
          retreat={data}
        />
      </Layout>,
    };
  },

};
