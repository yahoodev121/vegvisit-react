// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

import ThreadItemsType from '../types/ThreadItemsType';

// Sequelize models
import { ThreadItems, Threads } from '../../data/models';

const readMessage = {

  type: ThreadItemsType,

  args: {
    threadId: { type: new NonNull(IntType) }
  },

  async resolve({ request, response }, {
    threadId
  }) {
    const Op = Sequelize.Op;

    // Check if user already logged in
    if (request.user && !request.user.admin) {

      const userId = request.user.id;

      // Create a thread item
      const threadItems = await ThreadItems.update({
        isRead: true
      }, {
          where: {
            threadId,
            sentBy: {
              [Op.ne]: userId
            },
            isRead: false
          }
        }); 
      
      if (threadItems && threadItems.length && threadItems[0] && threadItems[0] > 0) {
        const updateThreads = await Threads.update({
            isRead: true,
            messageUpdatedDate: new Date()
          }, {
            where: {
              id: threadId,
            }
          }
        );
      }

      return {
        status: 'updated'
      };
    } else {
      return {
        status: 'notLoggedIn',
      };
    }
  },
};

export default readMessage;
