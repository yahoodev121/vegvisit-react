import { Reservation, UserProfile, User, Listing, ListingData, ThreadItems } from '../../data/models';
import {sendEmail} from '../email/sendEmail';

export async function emailBroadcasts(id) {
    // Get Reservation Data
    const reservation = await Reservation.findOne({
      where: { id }
    });
    const threadItems = await ThreadItems.findOne({
        where: { reservationId: reservation.id }
    });
    if(reservation) {
        // Get Host Data
        const host = await User.findOne({
          where: {
            id: reservation.hostId,
          },
          include: [
            {
              model: UserProfile,
              as: 'profile'
            }
          ]
        });
        // Get Guest Data
        const guest = await User.findOne({
          where: {
            id: reservation.guestId,
          },
          include: [
            {
              model: UserProfile,
              as: 'profile'
            }
          ]
        });
        // Get List Data
        const list = await Listing.findOne({
          where: {
            id: reservation.listId
          },
          include: [
            {
              model: ListingData,
              as: 'listingData'
            }
          ]
        });

        let reservationId = reservation.id;
        let confirmationCode = reservation.confirmationCode;
        let hostEmail = host.email;
        let hostName = host.profile.firstName;
        let guestEmail = guest.email;
        let guestName = guest.profile.firstName;
        let checkIn = reservation.checkIn;
        let checkOut = reservation.checkOut;
        let listTitle = list.title; 
        let listCity = list.city;
        let listTimeZone = list.timeZone;
        let allowedCheckInTime = list.listingData.checkInStart;
        let allowedCheckOutTime = list.listingData.checkInEnd; 
        let hostJoinedDate = host.profile.createdAt;
        let hostLocation = host.profile.location;
        let hostContactNumber = host.profile.phoneNumber;
        let guestContactNumber = guest.profile.phoneNumber;
        let hostProfilePic = host.profile.picture;
        let threadId = threadItems ? threadItems.threadId : null;
        let listId = reservation.listId;

        // Send email to host
        let contentForHost = {
          reservationId,
          confirmationCode,
          hostName,
          guestName,
          listTitle,
          listTimeZone,
          threadId,
          listId,
          checkIn,
          checkOut
        };
        await sendEmail(hostEmail, 'bookingExpireWithoutPaymentHost', contentForHost);

        // Send email to guest
        let contentForGuest = {
          reservationId,
            hostName,
            guestName,
            listTitle,
            listCity,
            listTimeZone,
            threadId,
            hostJoinedDate,
            hostLocation,
            checkIn, 
            checkOut,
            allowedCheckInTime,
            allowedCheckOutTime,
            hostContactNumber,
            hostProfilePic,
            guestContactNumber,
            confirmationCode,
            listId
        };
        
        await sendEmail(guestEmail, 'bookingExpireWithoutPaymentGuest', contentForGuest);

        return {
          status: 'email is sent'
        };
    } else {
        return {
          status: 'failed to send email'
        }
    }
}