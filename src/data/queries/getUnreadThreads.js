// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

import ThreadsType from '../types/ThreadsType';
import { Threads, ThreadItems } from '../../data/models';

const getUnreadThreads = {

  type: new List(ThreadsType),

  async resolve({ request }) {
    const Op = Sequelize.Op;
    // Check if user already logged in
    if (request.user && !request.user.admin) {

      return await Threads.findAll({
        where: {
          [Op.or]: [
            {
              host: request.user.id
            },
            {
              guest: request.user.id
            }
          ]
        },
        order: [['updatedAt', 'DESC']],
        include: [{
          model: ThreadItems,
          as: 'threadItems',
          require: true,
          where: {
            sentBy: {
              [Op.ne]: request.user.id
            },
            isRead: false
          }
        }]
      });

    } else {
      return {
        status: "notLoggedIn",
      };
    }
  }
};

export default getUnreadThreads;

/**
query getUnreadThreads{
  getUnreadThreads {
    id
    listId
    host
    guest
    threadItemUnread {
      id
      threadId
      sentBy
      isRead
      type
      createdAt
      startDate
      endDate
      personCapacity
    }
    hostProfile {
      profileId
      firstName
      picture
    }
    guestProfile {
      profileId
      firstName
      picture
    }
    status
  }
}
**/