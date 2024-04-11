import RecommendType from '../../../types/RecommendType';
import { Recommend } from '../../../models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const addRecommend = {

  type: RecommendType,

  args: {
    listId: { type: IntType }
  },

  async resolve({ request }, { listId }) {

    if(request.user && request.user.admin == true) {

      const insertRecommend = await Recommend.create({
        listId
      });     

      if(insertRecommend){
       return {
          status: 'success'
       };
      } else {
        return {
           status: 'failed'
         }
      }
    } else {
      return {
         status: 'not logged in'
       }
    }
  },
};

export default addRecommend;
