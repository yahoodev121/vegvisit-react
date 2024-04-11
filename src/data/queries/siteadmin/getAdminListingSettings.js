import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';
import { ListSettings, ListSettingsTypes } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

 const getAdminListingSettings = {

   type: ListSettingsType,

   args: {
     typeId: { type: IntType },
   },

   async resolve({ request }, { typeId }) {
     if(request.user && request.user.admin == true) {

       const getResults = await ListSettingsTypes.findOne({
          where: {
            id: typeId
          }
       });

       if(!getResults){
         return {
           status: "failed"
         }
       }

       return getResults;

      } else {
          return {
            status: "failed"
          }
      }
   },

 };

export default getAdminListingSettings;
