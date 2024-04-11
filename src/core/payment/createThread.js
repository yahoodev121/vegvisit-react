import Sequelize from 'sequelize';

import { Reservation, Threads, ThreadItems, UserProfile } from '../../data/models';
import { sendNotifications } from '../../helpers/sendNotifications';

export async function createThread(
  reservationId
) {
  const Op = Sequelize.Op;
  // Find Reservation and collect data
  const reservation = await Reservation.findOne({
    where: {
      id: reservationId,
    }
  });

  if (reservation) {

    let notifyUserId, notifyUserType, notifyContent, userName, messageContent;
    notifyUserId = reservation.hostId;
    notifyUserType = 'host';

    //Find or create a thread
    const thread = await Threads.findOrCreate({
      where: {
        listId: reservation.listId,
        host: reservation.hostId,
        guest: reservation.guestId
      },
      defaults: {
        //properties you want on create
        listId: reservation.listId,
        host: reservation.hostId,
        guest: reservation.guestId,
        messageUpdatedDate: new Date()
      }
    });

    if (thread) {
      let bookType, messageType, messages;
      if (reservation.reservationState === 'pending') {
        bookType = 'requestToBook';
        messageType = 'requestToBook'
      } else {
        bookType = 'intantBooking';
        messageType = 'inquiry';
        // update previous related inquiry ThreadItems with reservationId
        const inquiryThreadItemsUpdate = ThreadItems.update({
            reservationId: reservationId
          },
          {
            where: {
              threadId: thread[0].dataValues.id,
              messageType: 'inquiry',
              type: {
                [Op.in]: ['inquiry', 'preApproved']
              },
              reservationId: {
                [Op.eq]: null
			        },
              startDate: reservation.checkIn,
              endDate: reservation.checkOut,
              personCapacity: reservation.guests
            }
          }
        )
      }

      if (reservation.isPreApprove === true || reservation.basePrice == 0) {
        messages = reservation.message;
      } else {
        messages = ""
      }

      const threadItems = await ThreadItems.findOrCreate({
        where: {
          threadId: thread[0].dataValues.id,
          reservationId: reservation.id,
          sentBy: reservation.guestId,
          startDate: reservation.checkIn,
          endDate: reservation.checkOut,
          type: bookType,
          messageType
        },
        defaults: {
          //properties you want on create
          threadId: thread[0].dataValues.id,
          reservationId: reservation.id,
          sentBy: reservation.guestId,
          content: messages,
          type: bookType,
          startDate: reservation.checkIn,
          endDate: reservation.checkOut,
          personCapacity: reservation.guests
        }
      });

      const updateThreads = await Threads.update({
        isRead: false
      },
        {
          where: {
            id: thread[0].dataValues.id
          }
        }
      );

      const hostProfile = await UserProfile.findOne({
        where: {
          userId: reservation.hostId
        }
      });

      const guestProfile = await UserProfile.findOne({
        where: {
          userId: reservation.guestId
        }
      });

      userName = (guestProfile && guestProfile.displayName) ? guestProfile.displayName : guestProfile.firstName;
      messageContent = userName + ': ' + reservation.message;


      notifyContent = {
        "screenType": "trips",
        "title": "New Booking",
        "userType": notifyUserType.toString(),
        "message": messageContent.toString(),
      };

      sendNotifications(notifyContent, notifyUserId);

    }
  }
}