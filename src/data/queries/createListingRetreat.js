// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType,
} from 'graphql';

// GraphQL Type
import CreateListingRetreatType from '../types/CreateListingRetreatType';

// Sequelize models
import {ListingData, ListingRetreats, ListPhotos} from '../models';

import fetch from '../../core/fetch/fetch.server';

import logger from '../../core/logger';
import isValidNumber from '../../helpers/isValidNumber';
import ListingRetreatCategory from '../models/ListingRetreatCategory';

const createListingRetreat = {

  type: CreateListingRetreatType,

  args: {
    listId: { type: IntType },
    accommodations: { type: StringType },
    teachers: {type: StringType},
    categories: {type: StringType},
    eventType: {type: StringType},
    category: {type: StringType},
    title: {type: StringType},
    location: {type: StringType},
    country: {type: StringType},
    street: {type: StringType},
    city: {type: StringType},
    state: {type: StringType},
    zipcode: {type: StringType},
    lat: {type: StringType},
    lng: {type: StringType},
    subCategory: {type: StringType},
    RetreatStyle: {type: StringType},
    atmospheres: {type: StringType},
    yogaTypes: {type: StringType},
    skillLevels: {type: StringType},
    languageId: {type: IntType},
    benefits: {type: StringType},
    summary: {type: StringType},
    reviews: {type: StringType},
    includes: {type: StringType},
    not_includes: {type: StringType},
    special: {type: StringType},
    full_description: {type: StringType},
    instagram_url: {type: StringType},
    meal: {type: StringType},
    drink: {type: StringType},
    food: {type: StringType},
    currency: {type: StringType},
    retreat_dates: {type: StringType},
    duration: {type: IntType},
    min_days: {type: IntType},
    Seats: {type: IntType},
    showType: {type: IntType},
    isAllowPayment: {type: BooleanType},
    isCash: {type: BooleanType},
    addons: {type: StringType},
    cancellationPolicy: {type: StringType},
    allow_flexibility: {type: StringType},
    use_increase_booking: {type: StringType},
    free_gift_name: {type: StringType},
    free_gift_desc: {type: StringType},
    itinerary: {type: StringType},
    localInfoDesc: {type: StringType},
    localInformation: {type: StringType},
    facilityFeatures: {type: StringType},
    seasonalInformation: {type: StringType},
    travelHelp: {type: StringType},
    photos: {type: StringType},
    basePrice: {type: StringType}
  },

  async resolve({ request, response }, {
    listId,
    accommodations,
    teachers,
    categories,
    eventType,
    title,
    location,
    country,
    street,
    city,
    state,
    zipcode,
    lat,
    lng,
    RetreatStyle,
    atmospheres,
    yogaTypes,
    skillLevels,
    languageId,
    benefits,
    summary,
    showType,
    reviews,
    includes,
    not_includes,
    special,
    full_description,
    instagram_url,
    meal,
    drink,
    food,
    currency,
    retreat_dates,
    duration,
    min_days,
    Seats,
    isAllowPayment,
    isCash,
    addons,
    cancellationPolicy,
    allow_flexibility,
    use_increase_booking,
    free_gift_name,
    free_gift_desc,
    itinerary,
    localInfoDesc,
    localInformation,
    facilityFeatures,
    seasonalInformation,
    travelHelp,
    photos,
    basePrice
  }) {

    if (request.user && request.user.admin != true) {
      try {
        let data = {
          listId,
          accommodations,
          teachers,
          eventType,
          title,
          location,
          country,
          street,
          city,
          state,
          zipcode,
          lat,
          lng,
          RetreatStyle,
          atmospheres,
          yogaTypes,
          skillLevels,
          languageId,
          benefits,
          summary,
          includes,
          not_includes,
          special,
          full_description,
          instagram_url,
          meal,
          drink,
          food,
          currency,
          retreat_dates,
          duration,
          min_days,
          Seats,
          isAllowPayment,
          isCash,
          addons,
          cancellationPolicy,
          allow_flexibility,
          use_increase_booking,
          free_gift_name,
          free_gift_desc,
          itinerary,
          localInfoDesc,
          localInformation,
          facilityFeatures,
          seasonalInformation,
          travelHelp,
          reviews,
          showType,
        };
        console.log('=========================Create Retreat===============================', listId);

        await ListingRetreats.destroy({
          where: {
            listId: listId,
          }
        });

        const listingRetreat = await ListingRetreats.create(data);

        let price = 0;
        if (accommodations) {
          let accommodationData = JSON.parse(accommodations);
          let item = accommodationData[0];
          price = item.price;
        }

        await ListingData.destroy({
          where: {
            listId: listId,
          }
        });

        await ListingData.create({
          listId: listId,
          basePrice: price,
          currency: currency,
          maxDaysNotice: 'available'
        })

        if (photos) {
          await ListPhotos.destroy({
            where: {
              listId: listId,
            }
          });

          let photoData = JSON.parse(photos);
          console.log('------------------------------Retreat Photos---------------------------', photoData);
          for (let i = 0; i < photoData.length; i ++) {
            let item = photoData[i];
            await ListPhotos.create({
              listId: listId,
              name: item.name,
              type: item.type
            });
          }
        }

        if (categories) {
          await ListingRetreatCategory.destroy({
            where: {
              listId: listId,
            }
          });

          let categoryData = JSON.parse(categories);
          for (let i = 0; i < categoryData.length; i ++) {
            let item = categoryData[i];
            await ListingRetreatCategory.create({
              listId: listId,
              category: item.category,
              subCategory: JSON.stringify(item.subCategory)
            })
          }
        }

        if (listingRetreat && listingRetreat.id) {
          return {
            status: "success",
            id: listingRetreat.id
          };
        }
      } catch (error) {
        // logger.error("create retreat error:", error)
        console.log('create-retreat-error:', error);
        return {
          status: "create retreat error",
        };
      }
    } else {
      // logger.debug(`data.queries.createListing.createListing: Returning "notLoggedIn"`);
      console.log(`data.queries.createListing.createListing: Returning "notLoggedIn"`);
      return {
        status: "notLoggedIn",
      };
    }

  },
};

export default createListingRetreat;
