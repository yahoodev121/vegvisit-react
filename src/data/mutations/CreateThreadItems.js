// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import ThreadItemsType from '../types/ThreadItemsType';

// Sequelize models
import { Threads, ThreadItems, UserProfile } from '../../data/models';
import { sendNotifications } from '../../helpers/sendNotifications';

const CreateThreadItems = {

  type: ThreadItemsType,

  args: {
    listId: { type: new NonNull(IntType)},
    host: { type: new NonNull(StringType)},
    content: { type: new NonNull(StringType) },
    type: { type: StringType },
    startDate: { type: StringType },
    endDate: { type: StringType },
    personCapacity: { type: IntType },
    messageType: { type: StringType },
    reservationId: { type: IntType },
  },

  async resolve({ request, response }, {
    listId,
    host,
    content,
    type,
    startDate,
    endDate,
    personCapacity,
    messageType,
    reservationId
  }) {

    // Check if user already logged in
    if(request.user && !request.user.admin) {

        const userId = request.user.id;

        let notifyUserId, notifyGuestId, notifyHostId, notifyUserType;
        let userName, messageContent;
        // Check if a thread is already there or create a new one
        const thread = await Threads.findOrCreate({
          where: {
            listId,
            host,
            guest: userId,
          },
          defaults: {
            //properties you want on create
            listId,
            host,
            guest: userId,
            messageUpdatedDate: new Date()
          }
        });

        if(thread) {
          // Create a thread item
          const threadItems = await ThreadItems.create({
            threadId: thread[0].dataValues.id,
            sentBy: userId,
            content,
            type,
            startDate,
            endDate,
            personCapacity,
            messageType,
            reservationId
          });
          if(threadItems){
            const updateThreads = await Threads.update({
              isRead: false,
              messageUpdatedDate: new Date()
            },
              {
                where: {
                  id: thread[0].dataValues.id
                }
              }
            );

            const getThread = await Threads.findOne({
              where: {
                id: thread[0].dataValues.id
              },
              raw: true
            });

            if (getThread && getThread.host && getThread.guest) {
              notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
              notifyUserType = getThread.host === userId ? 'guest' : 'host';
              notifyGuestId = getThread.host === userId ? getThread.guest : getThread.host;
              notifyHostId = getThread.host === userId ? getThread.host : getThread.guest;
            }

            const guestProfile = await UserProfile.findOne({
              where: {
                userId
              }
            });

            const hostProfile = await UserProfile.findOne({
              where: {
                userId: host
              }
            });

            if (guestProfile && getThread) {
              userName = (guestProfile && guestProfile.displayName) ? guestProfile.displayName : guestProfile.firstName
              // getThread.host === userId ? (guestProfile && guestProfile.displayName) : (hostProfile && hostProfile.displayName);
            }

            messageContent = userName + ': ' + content;

            let notifyContent = {
              "screenType": "message",
              "title": "New Inquiry",
              "userType": notifyUserType.toString(),
              "message": messageContent.toString(),
              "threadId": (thread[0].dataValues.id).toString(),
              "guestId": notifyGuestId.toString(),
              "guestName": guestProfile && ((guestProfile.displayName).toString()),
              "guestPicture": (guestProfile && guestProfile.picture) ? ((guestProfile.picture).toString()) : '',
              "hostId": notifyHostId.toString(),
              "hostName": hostProfile && ((hostProfile.displayName).toString()),
              "hostPicture": (hostProfile && hostProfile.picture) ? ((hostProfile.picture).toString()) : '',
              "guestProfileId": guestProfile && ((guestProfile.profileId).toString()),
              "hostProfileId": hostProfile && ((hostProfile.profileId).toString()),
              "listId": listId.toString()
            };

      
            sendNotifications(notifyContent, notifyUserId);

            return threadItems;
          } else {
            return {
              status: 'failed to create thread items'
            }
          }
        } else {
          return {
            status: 'failed to create a thread'
          }
        }
    } else {
        return {
          status: "notLoggedIn",
        };
    }
  },
};

export default CreateThreadItems;

/**
mutation CreateThreadItems(
  $listId: Int!, 
  $host: String!,
  $content: String!,
  $type: String,
  $startDate: String,
  $endDate: String,
  $personCapacity: Int
){
    CreateThreadItems(
      listId: $listId,
      host: $host,
      content: $content,
      type: $type,
      startDate: $startDate,
      endDate: $endDate,
      personCapacity: $personCapacity
    ) {
        id
        sentBy
        content
        type
        startDate
        endDate
        personCapacity
        createdAt
    }
}
**/  
