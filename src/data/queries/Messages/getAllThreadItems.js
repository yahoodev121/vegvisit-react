// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import ThreadItemsType from '../../types/ThreadItemsType';
import { ThreadItems, Threads } from '../../models';

const getAllThreadItems = {

  type: new List(ThreadItemsType),

  args: {
    threadId: { type: new NonNull(IntType) },
    offset: { type: IntType },
  },

  async resolve({ request }, { threadId, offset }) {
    const limit = 5;
    // Check if user already logged in
    if (request.user) {

      return await ThreadItems.findAll({
        where: { threadId },
        order: [[`createdAt`, `DESC`]],
        limit,
        offset
      });

    } else {
      return {
        status: "notLoggedIn",
      };
    }
  }
};

export default getAllThreadItems;