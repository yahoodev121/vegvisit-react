import ShowListingStepsType from '../types/ShowListingStepsType';
import { UserListingSteps,  Listing } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ManageListingSteps = {

  type: ShowListingStepsType,

  args: {
    listId: { type: new NonNull(StringType) },
    currentStep: { type: new NonNull(IntType)}
  },

  async resolve({ request }, { listId, currentStep }) {


    // Check whether user is logged in
    if (request.user || request.user.admin != true) {
      let where = { id: listId };
      if (!request.user.admin) {
        where = { id: listId, userId: request.user.id };
      }

      // Confirm whether the Listing Id is available
      const isListingAvailable = await Listing.findOne({ where });
      let isUpdated = false;

      if(isListingAvailable != null){
        // Check if record already available for this listing
        const listingSteps = await UserListingSteps.findOne({ where: { listId } });

        if(listingSteps != null) {
          
          // Update Step#1
          if(currentStep === 1) {
            if(listingSteps.step1 === 'active') {
              let updateObject = {
                step1: 'completed'
              };
              if (listingSteps.step2 !== 'completed') {
                updateObject.step2 = 'active';
              }
              const updateStep1 = await UserListingSteps.update(
                updateObject,
                { where: { listId } }
              );
              // Update Status
              isUpdated = true;
            }
          }
          
          // Update Step#2
          if(currentStep === 2) {
            
            if(listingSteps.step2 === 'active') {
              let updateObject = {
                step2: 'completed'
              };
              if (listingSteps.step3 !== 'completed') {
                updateObject.step3 = 'active';
              }
              const updateStep2 = await UserListingSteps.update(
                updateObject,
                { where: { listId } }
              );
              // Update Status
              isUpdated = true;
            }
          }

          // Update Step#3
          if(currentStep === 3) {
            if(listingSteps.step3 === 'active') {
              const updateStep2 = await UserListingSteps.update({
                step3: 'completed',
              },
              { where: { listId } });
              // Update Status
              isUpdated = true;
            }
          }

          if(isUpdated) {
            // Get updated records
            const getUpdatedRecords = await UserListingSteps.findOne({ where: { listId } });
            return getUpdatedRecords;
          } else {
              // No changes, return data as it is
              return listingSteps;
          }

          
        } else {
            const createListingSteps = await UserListingSteps.create({ 
              listId: listId,
              step1: "active"
            });
            return createListingSteps;
        }
      } else {
         return {
            status: "Listing is not available"
          };
      }
    }

  },
};

export default ManageListingSteps;
