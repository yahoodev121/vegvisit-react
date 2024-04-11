import ShowListingType from '../../types/ShowListingType';
import { Listing } from '../../models';
import logger from '../../../core/logger';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const managePublish = {

  type: ShowListingType,

  args: {
    listId: { type: new NonNull(IntType) },
    action: { type: new NonNull(StringType) },
  }, 

  async resolve({ request }, { listId, action }) {

    // Check whether user is logged in
    if(request.user || request.user.admin) {

        try {
          let where = { id: listId, isReady: true };
          if (!request.user.admin) {
              where = {
                  id: listId,
                  isReady: true,
                  userId: request.user.id
              }
          };
  
          var published;
          // Publish
          if(action === 'publish') {
              const publish = await Listing.update({
                  isPublished: true,
                  lastPublished: new Date(),
                  listingStatus: true
              },{
                  where
              });
              if (publish && publish[0] && publish[0] === 1) {
                published = true;
                logger.info(`data.mutations.Listing.ManagePublish.managePublish: Published listing ${listId} with result ${JSON.stringify(publish)}`);
              } else {
                logger.warn(`data.mutations.Listing.ManagePublish.managePublish: Unexpected result when trying to publish listing ${listId}. Result was ${JSON.stringify(publish)}`);
              }
          }
  
          // UnPublish
          if(action === 'unPublish') {
              const unPublish = await Listing.update({
                  isPublished: false,
                  listingStatus: true
              },{
                  where
              });
              if (unPublish && unPublish[0] && unPublish[0] === 1) {
                published = true;
                logger.info(`data.mutations.Listing.ManagePublish.managePublish: Unpublished listing ${listId} with result ${JSON.stringify(unPublish)}`);
              } else {
                logger.warn(`data.mutations.Listing.ManagePublish.managePublish: Unexpected result when trying to unpublish listing ${listId}. Result was ${JSON.stringify(unPublish)}`);
              }
          }
  
          if(published) {
              return {
                  status: '200'
              };
          } else {
              return {
                  status: '400'
              }
          }
        } catch (error) {
          logger.error(`data.mutations.Listing.ManagePublish.managePublish: Error when trying to ${action} listing ${listId}. Error was ${error.message}`, error);
          return {
            status: '500'
          }
        }

      } else {
          logger.warn(`data.mutations.Listing.ManagePublish.managePublish: Not loggged in when attempting to ${action} listing ${listId}! Request was ${JSON.stringify(request)}`);
          return {
            status: "notLoggedIn"
          };
      }
    },
};

export default managePublish;

/**
mutation ManagePublish($listId: Int!, $action: String!) {
    managePublish(listId: $listId, action: $action) {
        status
    }
}
 */
