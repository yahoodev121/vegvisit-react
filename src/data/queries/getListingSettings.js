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

 const getListingSettings = {

   type: new List(ListSettingsType),

   args: {
    step: { type: StringType }
   },

   async resolve({ request }, { step }) {
     //if(request.user) {
      let where = { where: undefined };
      
      if(step != undefined){
        where = { where: { step: step } };
      }

      where.where = Object.assign({}, where.where, {isEnable: true});

      const getResults = await ListSettingsTypes.findAll(where);

      if(!getResults){
        return {
          status: "failed"
        }
      }

      return getResults;

    /*} else {
          return {
            status: "failed"
          }
      }*/
  },

 };

export default getListingSettings;
