import ListSettingsType from '../types/ListingSettingsType';

import { ListSettings, ListSettingsTypes } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

 const getListingSpecSettings = {

   type: ListSettingsType,

   args: {
    id: { type: IntType }
   },

   async resolve({ request }, { id }) {

      const getResults = await ListSettingsTypes.findOne({
        where: { id: id } 
      });

      if(!getResults){
        return {
          status: "failed"
        }
      }

      return getResults;

  },

 };

export default getListingSpecSettings;
