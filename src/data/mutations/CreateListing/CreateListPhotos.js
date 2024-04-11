import ListPhotosType from '../../types/ListPhotosType';
import { Listing, ListPhotos, UserListingSteps } from '../../models';
import logger from '../../../core/logger';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';

const CreateListPhotos = {

  type:  ListPhotosType,

  args: {
    listId: { type: new NonNull(IntType) },
    name: { type: StringType },
    type: { type: StringType }
  },

  async resolve({ request, response }, { listId, name, type }) {

    // Check whether user is logged in
    if (request.user) {

      let where = { id: listId };
      if (!request.user.admin) {
        where = {
          id: listId,
          userId: request.user.id
        }
      };

      // Check whether listing is available
      const isListingAvailable = await Listing.findOne({ where });

      if(isListingAvailable) {

        try {
          // Create a new record for a photo
          const createPhoto = await ListPhotos.create({
            listId: listId,
            name: name,
            type: type
          });
          logger.debug(`data.mutations.CreateListing.CreateListphotos.CreateListphotos: Created photo ${name} of type ${type} for user ${JSON.stringify(request.user)} and listing ${listId} with result: ${JSON.stringify(createPhoto)}`);
  
          const photosCount = await ListPhotos.count({ where: { listId } });
          const steps = await UserListingSteps.findOne({ where: { listId } });
  
          logger.debug(`data.mutations.CreateListing.CreateListphotos.CreateListphotos: After photo creation for user ${JSON.stringify(request.user)} and listing ${listId} photos count is ${photosCount} and listing steps are: ${JSON.stringify(steps)}`);
          if (photosCount > 0 && steps.step3 === 'completed') {
            const updateListingStatus = await Listing.update({
              isReady: true
            }, {
                where: { id: listId }
            });
            logger.debug(`data.mutations.CreateListing.CreateListphotos.CreateListphotos: Updated listing ${listId} status to isReady=true for user ${JSON.stringify(request.user)} with result: ${updateListingStatus}`);
          }
  
          return {
            status: "success",
            photosCount: photosCount
          };
        } catch (error) {
          logger.error(`data.mutations.CreateListing.CreateListphotos.CreateListphotos: Error creating photo ${name} of type ${type} for user ${JSON.stringify(request.user)} and listing ${listId}: ${error.message}`, error)
          return {
            status: `Error creating list photo: ${error.message}`
          }
        }

      } else {
        logger.warn(`data.mutations.CreateListing.CreateListphotos.CreateListphotos: Listing ${listId} for user ${JSON.stringify(request.user)} not found.`);
        return {
          status: "Listing is not available"
        };
      }

    } else {
        return {
          status: "Not loggedIn"
        };
    }

  },
};

export default CreateListPhotos;
