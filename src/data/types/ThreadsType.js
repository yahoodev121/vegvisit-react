import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLList as List
} from 'graphql';
import Sequelize from 'sequelize';

// Models
import { UserProfile, ThreadItems, Listing, User } from '../models'
// Types
import ThreadItemsType from './ThreadItemsType';
import ProfileType from './ProfileType';
import ShowListingType from './ShowListingType';
import UserType from './UserType';
import sequelize from '../../data/sequelize';
import logger from '../../core/logger';

const ThreadsType = new ObjectType({
    name: 'Threads',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        userBanStatus: {
            type: IntType
        },
        host: {
            type: StringType
        },
        guest: {
            type: StringType
        },
        createdAt: {
            type: StringType
        },
        status: {
            type: StringType
        },
        listData: {
            type: ShowListingType,
            resolve(threads) {
                return Listing.findOne({ where: { id: threads.listId } });
            }
        },
        hostProfile: {
            type: ProfileType,
            resolve(threads) {
                return UserProfile.findOne({ where: { userId: threads.host } });
            }
        },
        hostUserData: {
            type: UserType,
            resolve(threads) {
                return User.findOne({ where: { id: threads.host } });
            }
        },
        guestProfile: {
            type: ProfileType,
            resolve(threads) {
                return UserProfile.findOne({ where: { userId: threads.guest } });
            }
        },
        guestUserData: {
            type: UserType,
            resolve(threads) {
                return User.findOne({ where: { id: threads.guest } });
            }
        },
        threadItems: {
            type: new List(ThreadItemsType),
            resolve(threads) {
                return ThreadItems.findAll({
                    where: {
                        threadId: threads.id,
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 5,
                    offset: 0
                });
            }
        },
        threadItemsCount: {
            type: IntType,
            resolve(threads) {
                return ThreadItems.count({
                    where: {
                        threadId: threads.id,
                    },
                    order: [['createdAt', 'DESC']]
                });
            }
        },
        threadItem: {
            type: ThreadItemsType,
            resolve(threads) {
                return ThreadItems.findOne({
                    where: {
                        threadId: threads.id,
                    },
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                });
            }
        },
        threadItemForType: {
            type: ThreadItemsType,
            resolve(threads) {
                const Op = Sequelize.Op;
                return ThreadItems.findOne({
                    where: {
                        threadId: threads.id,
                        type: {
                            [Op.notIn]: ['message']
                        }
                    },
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                });
            }
        },
        actionThreadItems: {
          type: new List(ThreadItemsType),
          async resolve(threads) {
              try {
                // const threadItems = await sequelize.query(`WITH ranked_threadItems AS (SELECT m.*, ROW_NUMBER() OVER (PARTITION BY reservationId ORDER BY createdAt DESC) AS rn FROM ThreadItems AS m WHERE m.threadId = ${threads.id}) SELECT * FROM ranked_threadItems WHERE rn = 1 ORDER BY createdAt DESC;`, { model: ThreadItems });
                const threadItems = await sequelize.query(`SELECT * FROM ThreadItems WHERE id IN (SELECT MAX(id) FROM ThreadItems WHERE threadId = ${threads.id} AND type != 'message' AND reservationId IS NOT NULL GROUP BY reservationId UNION SELECT id FROM ThreadItems WHERE threadId = ${threads.id} AND type != 'message' AND reservationId IS NULL) ORDER BY createdAt DESC;`, { model: ThreadItems });
                return threadItems;                
              } catch (error) {
                logger.error('data.types.ThreadsType (actionThreadItems): Sequelize error: ' + error.message, error);
                return [];
              }

          }
        },
        actionThreadItem: {
            type: ThreadItemsType,
            async resolve(threads) {
                try {
                  const threadItems = await sequelize.query(`SELECT * FROM ThreadItems WHERE id IN (SELECT MAX(id) FROM ThreadItems WHERE threadId = ${threads.id} AND type != 'message' AND reservationId IS NOT NULL GROUP BY reservationId UNION SELECT id FROM ThreadItems WHERE threadId = ${threads.id} AND type != 'message' AND reservationId IS NULL) ORDER BY createdAt DESC limit 1;`, { model: ThreadItems });
                  if (threadItems && threadItems.length > 0) {
                    return threadItems[0];                
                  } else {
                    return null;
                  }
                } catch (error) {
                  logger.error('data.types.ThreadsType (actionThreadItem): Sequelize error: ' + error.message, error);
                  return null;
                }
  
            }
          },
        threadItemUnread: {
            type: ThreadItemsType,
            resolve(threads, { }, request) {
                const Op = Sequelize.Op;
                return ThreadItems.findOne({
                    where: {
                        threadId: threads.id,
                        sentBy: {
                          [Op.ne]: request.user.id
                        },
                        isRead: false
                    },
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                });
            }
        },
        hostUnreadCount: {
            type: IntType,
            resolve(threads, { }, request) {
                const Op = Sequelize.Op;
                return ThreadItems.count({
                    where: {
                        threadId: threads.id,
                        sentBy: {
                          [Op.ne]: request.user.id
                        },
                        isRead: false
                    },
                });
            }
        },
        isRead: {
            type: BooleanType
        },
    }
});
export default ThreadsType;