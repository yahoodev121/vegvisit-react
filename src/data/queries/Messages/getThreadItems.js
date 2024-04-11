// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

import ThreadItemsType from '../../types/ThreadItemsType';
import { ThreadItems, Threads } from '../../models';

const getThreadItems = {

  type: new List(ThreadItemsType),

  args: {
    listId: { type: new NonNull(IntType) },
    host: { type: new NonNull(StringType)},
    guest: { type: new NonNull(StringType)},
    messageType: { type: new List(StringType)},
    type: { type: new List(StringType)},
    startDate: { type: StringType},
    endDate: { type: StringType},
    personCapacity: { type: IntType },
    reservationId: { type: IntType }
  },

  async resolve({ request }, { listId, host, guest, messageType, type, startDate, endDate, personCapacity, reservationId }) {
    const Op = Sequelize.Op;
    const limit = 20;
    // Check if user already logged in
    if (request.user) {

      const thread = await Threads.findOne({
        where: {
            listId: listId,
            host: host,
            guest: guest
        }
      });

      if (thread && thread.id) {
        const where = Object.assign(
          {threadId: thread.id},
          messageType && messageType.length && messageType.length > 0 && {messageType: {
            [Op.in]: messageType
          }},
          type && type.length && type.length > 0 && {type: {
            [Op.in]: type
          }},
          startDate && {startDate: startDate},
          endDate && {endDate: endDate},
          personCapacity && {personCapacity: personCapacity},
          reservationId !== undefined && {reservationId: reservationId}
        );
          
        return await ThreadItems.findAll({
          where,
          order: [[`createdAt`, `DESC`]],
          limit
        });
      } else {
        return [];
      }

    } else {
      return [{
        status: "notLoggedIn",
      }];
    }
  }
};

export default getThreadItems;