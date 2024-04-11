import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
    GraphQLList as List,
} from 'graphql';
import Sequelize from 'sequelize';
import moment from 'moment';

import sequelize from '../sequelize';


// Models
import {
    Listing,
    UserProfile,
    Threads,
    Payout,
    TransactionHistory,
    Transaction,
    CancellationDetails,
    User,
    ThreadItems,
    Cancellation,
    ReservationSpecialPricing
} from '../models';

// Type
import ThreadsType from './ThreadsType';
import ShowListingType from './ShowListingType';
import ProfileType from './ProfileType';
import PayoutType from './PayoutType';
import TransactionHistoryType from './TransactionHistoryType';
import TransactionType from './TransactionType';
import CancellationDetailsType from './CancellationDetailsType';
import UserType from './UserType';
import ThreadItemsType from './ThreadItemsType';
import CancellationType from './CancellationType';
import ReservationSpecialPricingType from './ReservationSpecialPricingType';
import DaysUntilCheckInType from './DaysUntilCheckInType';

import { calculateDaysUntilCheckin } from '../../helpers/calculateDaysUntilCheckIn';

const ReservationType = new ObjectType({
    name: 'Reservation',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        listData: {
            type: ShowListingType,
            resolve(reservation) {
                return Listing.findOne({
                    where: { id: reservation.listId }
                })
            }
        },
        hostId: {
            type: StringType
        },
        hostPayout: {
            type: PayoutType,
            resolve(reservation) {
                if (reservation.payoutId != null && reservation.payoutId > 0) {
                    return Payout.findOne({
                        where: {
                            userId: reservation.hostId,
                            id: reservation.payoutId
                        }
                    })
                } else {
                    return Payout.findOne({
                        where: {
                            userId: reservation.hostId,
                            default: true
                        }
                    })
                }
            }
        },
        hostTransaction: {
            type: TransactionHistoryType,
            resolve(reservation) {
                return TransactionHistory.findOne({
                    where: {
                        reservationId: reservation.id,
                    }
                })
            }
        },
        hostData: {
            type: ProfileType,
            resolve(reservation) {
                return UserProfile.findOne({
                    where: { userId: reservation.hostId }
                });
            }
        },
        guestId: {
            type: StringType
        },
        guestData: {
            type: ProfileType,
            resolve(reservation) {
                return UserProfile.findOne({
                    where: { userId: reservation.guestId }
                })
            }
        },
        transaction: {
            type: TransactionType,
            resolve(reservation) {
                return Transaction.findOne({
                    where: { reservationId: reservation.id, paymentType: 'booking' }
                })
            }
        },
        refundStatus: {
            type: TransactionType,
            resolve(reservation) {
                return Transaction.findOne({
                    where: { reservationId: reservation.id, paymentType: 'cancellation' }
                })
            }
        },
        guestUser: {
            type: UserType,
            resolve(reservation) {
                return User.findOne({
                    where: { Id: reservation.guestId }
                })
            }
        },
        hostUser: {
            type: UserType,
            resolve(reservation) {
                return User.findOne({
                    where: { Id: reservation.hostId }
                })
            }
        },
        checkIn: {
            type: StringType
        },
        checkOut: {
            type: StringType
        },
        guests: {
            type: IntType
        },
        message: {
            type: StringType
        },
        basePrice: {
            type: FloatType
        },
        cleaningPrice: {
            type: FloatType
        },
        currency: {
            type: StringType
        },
        discount: {
            type: FloatType
        },
        discountType: {
            type: StringType
        },
        guestServiceFee: {
            type: FloatType,
        },
        hostServiceFee: {
            type: FloatType,
        },
        total: {
            type: FloatType,
        },
        confirmationCode: {
            type: IntType
        },
        reservationState: {
            type: StringType
        },
        paymentState: {
            type: StringType
        },
        payoutId: {
            type: IntType
        },
        messageData: {
            type: ThreadsType,
            resolve(reservation) {
                const Op = Sequelize.Op;
                return Threads.findOne({
                    where: {
                        listId: reservation.listId,
                        [Op.or]: [
                            {
                                host: reservation.guestId
                            },
                            {
                                guest: reservation.guestId
                            }
                        ]
                    }
                });
            }
        },
        cancellationDetails: {
            type: CancellationDetailsType,
            resolve(reservation) {
                return CancellationDetails.findOne({
                    where: {
                        reservationId: reservation.id
                    }
                });
            }
        },
        createdAt: {
            type: StringType
        },
        updatedAt: {
            type: StringType
        },
        count: {
            type: IntType
        },
        status: {
            type: StringType
        },
        paymentMethodId: {
            type: IntType
        },
        threadData: {
            type: ThreadItemsType,
            resolve(reservation) {
                return ThreadItems.findOne({
                    where: {
                        reservationId: reservation.id,
                    }
                });
            }
        },
        cancellationPolicy: {
            type: IntType
        },
        cancellation: {
            type: CancellationType,
            resolve(reservation) {
                return Cancellation.findOne({
                    where: {
                        id: reservation.cancellationPolicy,
                        isEnable: true
                    }
                });
            }
        },
        bookingSpecialPricing: {
            type: new List(ReservationSpecialPricingType),
            async resolve(reservation) {
                let convertedResponse = [];
                const listingSpecialPricingData = await ReservationSpecialPricing.findAll({
                    where: {
                        reservationId: reservation.id
                    },
                    order: [['blockedDates', 'ASC']],
                    raw: true
                });

                if (listingSpecialPricingData && listingSpecialPricingData.length > 0) {
                    Promise.all(listingSpecialPricingData.map((item) => {
                        convertedResponse.push({
                            "id": item.id,
                            "listId": item.listId,
                            "reservationId": item.reservationId,
                            "blockedDates": moment(item.blockedDates).utc().format('MM/DD/YYYY'),
                            "isSpecialPrice": item.isSpecialPrice
                        });
                    }));

                    return await convertedResponse;
                } else {
                    return await [];
                }
            }
        },
        isSpecialPriceAverage: {
            type: FloatType
        },

        dayDifference: {
            type: FloatType
        },
        isPreApprove:{
            type: BooleanType
        },
        daysUntilCheckIn: {
            type: DaysUntilCheckInType,
            async resolve(reservation) {
                // calculate days before check-in based on host time zone cancellation time threshold
                const checkinDateString = reservation.checkIn;
                // get time zone of the host
                const {timeZone} = await Listing.findOne({
                    where: { id: reservation.listId }
                });
                const {guestCancellationTimeThreshold, hostCancellationTimeThreshold} = await Cancellation.findOne({
                    where: {
                        id: reservation.cancellationPolicy,
                        isEnable: true
                    }
                });
                const timeObjectGuest = moment(guestCancellationTimeThreshold, 'HH:mm:ss');
                const timeObjectHost = moment(hostCancellationTimeThreshold, 'HH:mm:ss');
                const now = moment();
                let daysUntilCheckInGuestThreshold, daysUntilCheckInHostThreshold;
                if (timeZone) {
                    daysUntilCheckInGuestThreshold = calculateDaysUntilCheckin(checkinDateString, now, timeZone, timeObjectGuest.get('hour'), timeObjectGuest.get('minute'), timeObjectGuest.get('second'));
                    daysUntilCheckInHostThreshold = calculateDaysUntilCheckin(checkinDateString, now, timeZone, timeObjectHost.get('hour'), timeObjectHost.get('minute'), timeObjectHost.get('second'));
                } 
                return {daysUntilCheckInGuestThreshold, daysUntilCheckInHostThreshold};
            },
        }
    },
});

export default ReservationType;