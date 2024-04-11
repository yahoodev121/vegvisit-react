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
import CreateListingType from '../types/CreateListingType';

// Sequelize models
import { Listing, UserListingSteps, UserListingData, BedTypes } from '../../data/models';

import fetch from '../../core/fetch';

import logger from '../../core/logger';
import isValidNumber from '../../helpers/isValidNumber';

const createListing = {

  type: CreateListingType,

  args: {
    roomType: { type: StringType },
    houseType: { type: StringType },
    residenceType: { type: StringType },
    bedrooms: { type: StringType },
    buildingSize: { type: StringType },
    bedType: { type: StringType },
    beds: { type: IntType },
    personCapacity: { type: IntType },
    bathrooms: { type: FloatType },
    bathroomType: { type: StringType },
    country: { type: StringType },
    street: { type: StringType },
    buildingName: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    timeZone: { type: StringType },
    bedTypes: { type: StringType },
    title: { type: StringType },
    listType: { type: StringType },
    experienceCategory: { type: StringType }
  },

  async resolve({ request, response }, {
    roomType,
    houseType,
    residenceType,
    bedrooms,
    buildingSize,
    bedType,
    beds,
    personCapacity,
    bathrooms,
    bathroomType,
    country,
    street,
    buildingName,
    city,
    state,
    zipcode,
    lat,
    lng,
    timeZone,
    bedTypes,
    title,
    listType,
    experienceCategory
  }) {

    if (request.user && request.user.admin != true) {

      let latValue = lat;
      let lngValue = lng;
      let timeZoneValue = timeZone;

      if (!(isValidNumber(lat) && isValidNumber(lng) && timeZone)) {
        const address = street + ", " + city + ", " + state + ", " + country + ", " + zipcode;

        logger.debug(`data.queries.createListing.createListing: Querying locationItem with address: ${address}`);

        const query = `
          query ($address: String) {
            locationItem(address: $address) {
              street
              city
              state
              country
              zipcode
              lat
              lng
              timeZone
            }
          }
        `;

        const resp = await fetch('/graphql', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            variables: { address: address }
          }),
          credentials: 'include',
        });

        const { data } = await resp.json();
        logger.debug(`data.queries.createListing.createListing: Queried locationItem successfully with result: ${JSON.stringify(data)}`);

        if (data && data.locationItem) {
          latValue = data.locationItem.lat;
          lngValue = data.locationItem.lng;
          timeZoneValue = data.locationItem.timeZone;
        }
      }

      logger.debug(`data.queries.createListing.createListing: Using following location data to create the listing: Lat: ${latValue}, Lng: ${lngValue}, Timezone: ${timeZoneValue}`);

      const doCreateListing = await Listing.create({
        userId: request.user.id,
        residenceType: residenceType,
        bedrooms: bedrooms,
        beds: beds,
        personCapacity: personCapacity,
        bathrooms: bathrooms,
        country: country,
        street: street,
        buildingName: buildingName,
        city: city,
        state: state,
        zipcode: zipcode,
        lat: latValue,
        lng: lngValue,
        timeZone: timeZoneValue,
        bookingType: 'request',
        title,
        roomType,
        listType,
        isPublished: true,
        experienceCategory
      });

      logger.debug(`data.queries.createListing.createListing: Created listing with result: ${JSON.stringify(doCreateListing)}`);

      if (doCreateListing && doCreateListing.id) {

        // Recently added list id
        const id = doCreateListing.id;

        let bedTypeData;
        if (bedTypes && bedTypes.length > 0) {

          bedTypeData = JSON.parse(bedTypes);

          logger.debug(`data.queries.createListing.createListing: Processing bed types for created listing with id ${id}.`);

          // items included
          if (bedTypeData != null && bedTypeData != undefined) {

            const removeBedTypes = await BedTypes.destroy({
              where: {
                listId: id
              }
            });

            logger.debug(`data.queries.createListing.createListing: Removed bed types for created listing with id ${id}: ${JSON.stringify(removeBedTypes)}`);

            await Promise.all(bedTypeData.map(async (item, key) => {
              let updateBedTypes = await BedTypes.create({
                listId: id,
                bedCount: item.bedCount,
                bedType: item.bedType
              });
              logger.debug(`data.queries.createListing.createListing: Created bed type for listing with id ${id}: ${JSON.stringify(updateBedTypes)}`);
            })
            );
          }
        }

        // Assign other settings values in here
        let otherListSettings = [];
        if (roomType) otherListSettings.push({ settingsId: roomType, listId: id });
        if (houseType) otherListSettings.push({ settingsId: houseType, listId: id });
        if (buildingSize) otherListSettings.push({ settingsId: buildingSize, listId: id });
        if (bedType) otherListSettings.push({ settingsId: bedType, listId: id });
        if (bathroomType) otherListSettings.push({ settingsId: bathroomType, listId: id });
        if (otherListSettings.length > 0) {
          logger.debug(`data.queries.createListing.createListing: Processing other settings (UserListingData) for listing with id ${id}: ${JSON.stringify(otherListSettings)}`);
          // Bulk create on UserListingData to store other settings of this listingSteps
          const createOtherSettings = await UserListingData.bulkCreate(otherListSettings).catch((error) => {
            logger.error(`data.queries.createListing.createListing: Error processing other settings (UserListingData) for listing with id ${id}: ${error.message}`, error);
          });
          logger.debug(`data.queries.createListing.createListing: Processed other settings (UserListingData) for listing with id ${id} with result: ${JSON.stringify(createOtherSettings)}`);
        } else {
          logger.debug(`data.queries.createListing.createListing: No other settings (UserListingData) to process for listing with id ${id}: ${JSON.stringify(otherListSettings)}`);
        }

        logger.debug(`data.queries.createListing.createListing: Returning "success"`);

        return {
          status: "success",
          id: id
        };
      } else {
        logger.warn(`data.queries.createListing.createListing: Create listing failed, result was ${JSON.stringify(doCreateListing)}. Returning "failed"`);
        return {
          status: "failed",
        };
      }

    } else {
      logger.debug(`data.queries.createListing.createListing: Returning "notLoggedIn"`);
      return {
        status: "notLoggedIn",
      };
    }

  },
};

export default createListing;
