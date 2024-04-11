import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';
import { 
  ListSettings, 
  UserListingData, 
  UserAmenities, 
  UserHouseRules,
  UserSafetyAmenities,
  UserSpaces,
  UserServices
} from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const deleteListSettings = {

  type: ListSettingsType,

  args: {
    id: { type: IntType },
  },

  async resolve({ request }, { id }) {

    if(request.user && request.user.admin == true) {

      let isListSettingsDeleted = false;

      // For UserListingData
      const checkUserListingData = await UserListingData.findOne({
        where: {
          settingsId: id
        }
      });

      // For UserListingData
      const checkUserAmenities = await UserAmenities.findOne({
        where: {
          amenitiesId: id
        }
      });

      // For UserListingData
      const checkUserServices = await UserServices.findOne({
        where: {
          serviceId: id
        }
      });

      // For UserHouseRules
      const checkUserHouseRules = await UserHouseRules.findOne({
        where: {
          houseRulesId: id
        }
      });

      // For UserSafetyAmenities
      const checkUserSafetyAmenities = await UserSafetyAmenities.findOne({
        where: {
          safetyAmenitiesId: id
        }
      });

      // For UserSpaces
      const checkUserSpaces = await UserSpaces.findOne({
        where: {
          spacesId: id
        }
      });

      if(checkUserListingData || checkUserAmenities || checkUserServices || checkUserHouseRules || checkUserSafetyAmenities || checkUserSpaces) {
        return {
          status: '500'
        }
      }

      const removeListSettings = await ListSettings.destroy({
          where: {
            id: id
          }
      })
      .then(function(instance){
        // Check if any rows are affected
        if(instance > 0) {
          isListSettingsDeleted = true;
        }
      });

      if(isListSettingsDeleted) {
        return {
          status: 'success'
        }
      } else {
          return {
            status: 'failed'
          }
      }
     } else {
         return {
           status: 'failed'
         }
     }
  },
};

export default deleteListSettings;
