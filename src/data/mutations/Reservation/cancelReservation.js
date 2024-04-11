// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

import ReservationType from '../../types/ReservationType';

// Sequelize models
import { Reservation, ListBlockedDates, CancellationDetails, ThreadItems, Threads, UserProfile } from '../../models';

import { sendNotifications } from '../../../helpers/sendNotifications';
import logger from '../../../core/logger';

const cancelReservation = {

  type: ReservationType,

  args: {
    reservationId: { type: new NonNull(IntType) },
    cancellationPolicy: { type: new NonNull(StringType) },
    refundToGuest: { type: new NonNull(FloatType) },
    payoutToHost: { type: new NonNull(FloatType) },
    guestServiceFee: { type: new NonNull(FloatType) },
    hostServiceFee: { type: new NonNull(FloatType) },
    total: { type: new NonNull(FloatType) },
    currency: { type: new NonNull(StringType) },
    threadId: { type: new NonNull(IntType) },
    cancelledBy: { type: new NonNull(StringType) },
    message: { type: new NonNull(StringType) },
    checkIn: { type: new NonNull(StringType) },
    checkOut: { type: new NonNull(StringType) },
    guests: { type: new NonNull(IntType) },
  },

  async resolve({ request, response }, {
    reservationId,
    cancellationPolicy,
    refundToGuest,
    payoutToHost,
    guestServiceFee,
    hostServiceFee,
    total,
    currency,
    threadId,
    userId,
    cancelledBy,
    message,
    checkIn,
    checkOut,
    guests
  }) {
    const Op = Sequelize.Op;
    let isReservationUpdated = false;
    // Check if user already logged in
    if (request.user && !request.user.admin) {

      const userId = request.user.id;
      logger.debug(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve: cancelReservation called by user ${userId} for reservation ${reservationId} with variables ${JSON.stringify(request.body.variables)}`);

      let notifyUserId ,notifyUserType, notifyContent;
      let userName, messageContent;

      const getThread = await Threads.findOne({
          where: {
            id: threadId
          },
          raw: true
        });

        if (getThread && getThread.host && getThread.guest) {
          notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
          notifyUserType = getThread.host === userId ? 'guest' : 'host';
        }

        const hostProfile = await UserProfile.findOne({
          where: {
            userId: getThread.host
          }
        });

        const guestProfile = await UserProfile.findOne({
          where: {
            userId: getThread.guest
          }
        });


        if (hostProfile && guestProfile && getThread) {
          userName = getThread.host === userId ? (hostProfile && hostProfile.displayName) : (guestProfile && guestProfile.displayName);
        }  


      const count = await Reservation.count({
        where: {
          id: reservationId,
          reservationState: 'cancelled'
        }
      });

      if (count > 0) {
        logger.warn(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve: Reservation ${reservationId} seems already to be cancelled. Returning 400.`);
        return {
          status: '400'
        };
      }

      // Update Reservation table
      const updateReservation = await Reservation.update({
        reservationState: 'cancelled'
      }, {
          where: {
            id: reservationId
          }
        }).then(function (instance) {
          // Check if any rows are affected
          if (instance > 0) {
            isReservationUpdated = true;
            logger.debug(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve.updateReservation: Reservation ${reservationId} updated successfully with result ${JSON.stringify(instance)}`);
          } else {
            logger.error(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve.updateReservation: Reservation ${reservationId} could not be updated. Result was ${JSON.stringify(instance)}`);
          }
        });

      // Unblock the blocked dates only if guest cancels the reservation
      if (cancelledBy === 'guest') {
        // const unlockBlockedDates = await ListBlockedDates.update({
        //   reservationId: null,
        //   calendarStatus: 'available'
        // }, {
        //     where: {
        //       reservationId,
        //     }
        //   });
          const unlockBlockedDates = await ListBlockedDates.update({
            reservationId: null,
            calendarStatus: 'available'
          }, {
              where: {
                reservationId,
                calendarStatus: 'blocked',
                isSpecialPrice: {
                  [Op.ne]: null
                }
              }
            });
            logger.debug(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve: Unblocked dates for reservation ${reservationId} with result ${JSON.stringify(unlockBlockedDates)}`);
  
            const unblockDatesWithOutPrice = await ListBlockedDates.destroy({
                where: {
                  reservationId,
                  calendarStatus: 'blocked',
                  isSpecialPrice: {
                    [Op.eq]: null
                  }
                }
              });
              logger.debug(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve: Unblocked dates without price for reservation ${reservationId} with result ${JSON.stringify(unblockDatesWithOutPrice)}`);

      }

      // Create record for cancellation details
      const cancellation = CancellationDetails.create({
        reservationId,
        cancellationPolicy,
        refundToGuest,
        payoutToHost,
        guestServiceFee,
        hostServiceFee,
        total,
        currency,
        cancelledBy
      });
      logger.debug(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve: Created cancellation details for reservation ${reservationId} with result ${JSON.stringify(cancellation)}`);


      // Create thread items
      const thread = ThreadItems.create({
        threadId,
        reservationId,
        sentBy: userId,
        content: message,
        type: cancelledBy === 'host' ? 'cancelledByHost' : 'cancelledByGuest',
        startDate: checkIn,
        endDate: checkOut,
        personCapacity: guests
      });
      logger.debug(`data.mutations.Reservation.cancelReservation.cancelReservation.resolve: Created thread item for reservation ${reservationId} and threadId ${threadId} with result ${JSON.stringify(thread)}`);


      messageContent = userName + ': ' + message;

      notifyContent = {
        "screenType": "trips",
        "title": 'Booking is Cancelled',
        "userType": notifyUserType.toString(),
        "message": messageContent.toString()
      };

      if (isReservationUpdated) {
        sendNotifications(notifyContent, notifyUserId);

        return {
          status: '200'
        }
      } else {
        return {
          status: '400'
        }
      }

    } else {
      return {
        status: "notLoggedIn",
      };
    }
  },
};

export default cancelReservation;

/**
mutation cancelReservation(
  $reservationId: Int!,
  $cancellationPolicy: String!,
  $refundToGuest: Float!,
  $payoutToHost: Float!,
  $guestServiceFee: Float!,
  $hostServiceFee: Float!,
  $total: FloatType!,
  $currency: String!,
  $threadId: Int!,
  $cancelledBy: String!,
  $message: String!
){
    cancelReservation(
      reservationId: $reservationId,
      cancellationPolicy: $cancellationPolicy,
      refundToGuest: $refundToGuest,
      payoutToHost: $payoutToHost,
      guestServiceFee: $guestServiceFee,
      hostServiceFee: $hostServiceFee,
      total: $total,
      currency: $currency,
      threadId: $threadId,
      cancelledBy: $cancelledBy,
      message: $message
    ) {
        status
    }
}
**/
