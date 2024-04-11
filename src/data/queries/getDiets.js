import DietType from '../types/DietType';
import { Diet } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLBoolean as BooleanType,
} from 'graphql';

 const getDiets = {

   type: new List(DietType),

   args: {
    includeNotEnabled: { type: BooleanType }
   },

   async resolve({ request }, { includeNotEnabled }) {
     //if(request.user) {
      let where, getResults;
      
      if(!includeNotEnabled){
        where = { where: { isEnable: true } };
        getResults = await Diet.findAll({
          ...where
        });
      } else {
        getResults = await Diet.findAll();
      }

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

export default getDiets;
