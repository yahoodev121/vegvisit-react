import { UserProfile, User, Listing, ListingData, ThreadItems, Threads } from '../../data/models';
import { sendEmail } from '../email/sendEmail';

export async function emailBroadcast(id) {
  // Get Reservation Data
  const threadItems = await ThreadItems.findOne({
    where: { id: id }
  });
  if (threadItems) {
    // Get Thread Data
    const threads = await Threads.findOne({
      where: { id: threadItems.threadId }
    });
    // Get Host Data
    const host = await User.findOne({
      where: {
        id: threads.host,
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
        id: threads.guest,
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
        id: threads.listId
      },
      include: [
        {
          model: ListingData,
          as: 'listingData'
        }
      ]
    });

    let hostEmail = host.email;
    let hostName = host.profile.firstName;
    let guestEmail = guest.email;
    let guestName = guest.profile.firstName;
    let checkIn = threadItems.startDate;
    let checkOut = threadItems.endDate;
    let listTitle = list.title;
    let listCity = list.city;
    let listTimeZone = list.timeZone;
    let hostJoinedDate = host.profile.createdAt;
    let hostLocation = host.profile.location;
    let hostContactNumber = host.profile.phoneNumber;
    let guestContactNumber = guest.profile.phoneNumber;
    let hostProfilePic = host.profile.picture;
    let threadId = threadItems.threadId;
    let listId = threads.listId;

    // Send email to host
    let contentForHost = {
      hostName,
      guestName,
      listTitle,
      listTimeZone,
      threadId,
      checkIn,
      checkOut,
      hostProfilePic
    };

    await sendEmail(hostEmail, 'invitationExpiredHost', contentForHost);

    // Send email to guest
    let contentForGuest = {
      hostName,
      guestName,
      listId,
      listTitle,
      listTimeZone,
      threadId,
      checkIn,
      checkOut,
      hostProfilePic
    };

    await sendEmail(guestEmail, 'invitationExpiredGuest', contentForGuest);

    return {
      status: 'email is sent'
    };
  } else {
    return {
      status: 'failed to send email'
    }
  }
}