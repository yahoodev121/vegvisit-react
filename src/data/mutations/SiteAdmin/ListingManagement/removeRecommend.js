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

const removeRecommend = {

  type: RecommendType,

  args: {
    listId: { type: IntType }
  },

  async resolve({ request }, { listId }) {

    if(request.user && request.user.admin == true) {

      const deleteRecommend = await Recommend.destroy({
        where: {
          listId
        }
      });

      if(deleteRecommend){
        return {
          listId,
          status: 'success'
        }
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

export default removeRecommend;
