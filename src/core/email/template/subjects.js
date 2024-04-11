import moment from 'moment';
import 'moment-timezone';

import {url, sitename, shortUrlGuestInbox, shortUrlHostInbox} from '../../../config';

export function getSubjectAndNotification(type, content) {
	let subject, previewText, notification;

	if (type === 'welcomeEmail' || type === 'confirmEmail') {
		subject = 'Confirm your email address';
		previewText = 'Action Required!';
	}
	if (type === 'bookingRequest') {
		subject = 'You have a new reservation';
		previewText = 'Great News! You have a new reservation';
	}
	if (type === 'bookingRequestGuest') {
		subject = 'Your booking request was just sent!';
    // previewText = 'Your booking request has been sent!';
    previewText = ' ';
	}
	if (type === 'bookingConfirmedToHost') {
		subject = ' You have a confirmed booking!';
    // previewText = 'Confirmed Reservation Details';
    previewText = ' ';
		const guestName = content && content.guestName ? content.guestName : 'a guest';
		const checkInDate = (content && content.checkIn && content.listTimeZone) ? moment(content.checkIn).tz(content.listTimeZone).format('dddd, Do MMM, YYYY') : '';
    const checkOutDate = (content && content.checkOut && content.listTimeZone) ? moment(content.checkOut).tz(content.listTimeZone).format('dddd, Do MMM, YYYY') : '';
		notification = `You have a confirmed booking on ${sitename} with ${guestName} from ${checkInDate} to ${checkOutDate}! We hope you have an amazing experience hosting and thanks for the support!`;
	}
	if (type === 'bookingConfirmedToGuest') {
		subject = 'Your reservation is complete!';
		previewText = `You’re going on a ${sitename} trip!`;
		const checkInDate = (content && content.checkIn && content.listTimeZone) ? moment(content.checkIn).tz(content.listTimeZone).format('dddd, Do MMM, YYYY') : '';
    const checkOutDate = (content && content.checkOut && content.listTimeZone) ? moment(content.checkOut).tz(content.listTimeZone).format('dddd, Do MMM, YYYY') : '';
		const title = getShortenedListingTitle();
		notification = `Your ${sitename} booking${title ? " at ’"+title+"’" : ''} from ${checkInDate} to ${checkOutDate} has been confirmed! Check out the confirmation email we’ve sent you. We hope you have an amazing time!`;
	}
	if (type === 'bookingDeclinedToGuest') {
		// subject = 'Your reservation request is declined by your host';
		subject = 'Your booking request was declined';
		previewText = 'Book somewhere else!';
	}
	if (type === 'bookingExpiredGuest') {
		subject = 'Your booking request has expired';
		// previewText = 'We are sorry, your request is expired';
		previewText=' ';
		const title = getShortenedListingTitle();
		notification = `Your ability to book ${title ? "’"+title+"’" : ''} on ${sitename} has expired. If you still want to book your trip, resend a booking request through the listing page. Once it’s approved (again) by the host, you’ll have an additional 24 hours to complete your booking.`;
	}
	if (type === 'bookingExpiredHost') {
		subject = 'Booking request expired, please respond!';
		// previewText = 'Your reservation is expired';
		previewText=' ';
		const guestName = content && content.guestName ? content.guestName : 'Your guest';
		const guestName2 = content && content.guestName ? content.guestName : 'your guest';
		notification = `${guestName}’s booking request on ${sitename} has expired. If you can still host, send a message here: ${shortUrlHostInbox}, and let ${guestName2} know to resend a booking request through your listing page. Once you approve the request within 24 hours, your guest can complete the booking.`;
	}
	if (type === 'cancelledByHost') {
		subject = 'Your reservation has been cancelled';
    // previewText = 'Your reservation is cancelled';
    previewText=' ';
		let message = getShortenedMessage();
		notification = `We are so sorry to say that your ${sitename} booking has been canceled.${message ? ' Here’s what the host had to say: "' + message + '".' : ''}`;
	}
	if (type === 'cancelledByGuest') {
		subject = 'Reservation cancelled';
    // previewText = 'Your reservation is cancelled';
    previewText=' ';
		const guestName = content && content.guestName ? content.guestName : 'your guest';
		const message = getShortenedMessage();
		notification = `We are so sorry to say that your ${sitename} booking by ${guestName} has been canceled.${message ? ' Here’s what the guest had to say: "' + message + '".' : ''}`;
	}
	if (type === 'completedGuest') {
		subject = 'Reminder: Review your recent trip!';
		previewText = 'Action Required!';
	}
	if (type === 'completedHost') {
		subject = 'Reminder: Review your recent guest!';
		previewText = 'Action Required!';
	}
	if (type === 'forgotPasswordLink') {
		subject = 'Password Reset Request';
		previewText = 'Action Required! Reset your Password';
	}

	if (type === 'message') {
		subject = `You’ve got a new message on ${sitename}!`;
		previewText = ' ';
		notification = `You have a new message on ${sitename}!`;
		if (content && content.type === 'guest') {
			notification = `${notification} To reply, click here: ${shortUrlGuestInbox}.`;
		} else if (content && content.type === 'host') {
			notification = `${notification} To reply, click here: ${shortUrlHostInbox}.`;
		}
		let message = getShortenedMessage();
		if (notification && message && content && content.senderName) {
			notification = `${notification}\n${content.senderName}’s message: "${message}".`;
		}
	}

	if (type === 'inquiry') {
		subject = "You have a new booking inquiry!";
		previewText = 'Respond to this message!';
		const guestName = content && content.senderName ? content.senderName : 'The guest';
		const message = getShortenedMessage();
		notification = `You have a new booking inquiry on ${sitename}! To reply, click here: ${shortUrlHostInbox}.`;
		if (message) {
			notification = `${notification}\n${guestName}’s message: “${message}”.`;
		}
	}

	if (type === 'inquiryGuest') {
		if (content && content.hostName) {
			subject = `Message sent to ${content.hostName}`;
		} else {
			subject = `Message sent to host`;
		}
		previewText = ' ';
	}

	if (type === 'requesttobook') {
		subject = "You have a new booking request!";
		previewText = 'Action Required!';
		const guestName = content && content.senderName ? content.senderName : 'The guest';
		const message = getShortenedMessage();
		const messagePart = message ? `${guestName}’s message: "${message}".`: '';
		let approveLink = 'here';
		if (content && content.threadId) {
			let messageURL = url + '/message/' + content.threadId + '/host';
			approveLink = `<a href="${messageURL}">${approveLink}</a>`;
		}
		notification = `Your listing has a new booking request on Vegvisits, and you have 24 hours to respond! To Approve or Decline the trip, click here: ${shortUrlHostInbox}.${messagePart ? ' '+messagePart : ''}`;
	}

	if (type === 'documentVerification') {
		subject = 'Your photo ID has been verified';
		previewText = 'Documents verification status';
	}

	if (type === 'documentVerificationreject') {
		subject = 'Your photo ID has been rejected';
		previewText = 'Documents verification status';
	}

	if (type === 'contact') {
		subject = 'Contact Form';
		previewText = 'Contact Form';
	}
	if (type === 'reportUser') {
		subject = 'Reporting the User';
		previewText = 'Report User Form';
	}
	if (type === 'bookingPreApproval') {
		subject = "You’ve been approved! Complete your booking 🌱";
		previewText = 'Action Required!';
		notification = `You’ve been approved to book your stay on ${sitename}! You have 24 hours to finish your booking: ${shortUrlGuestInbox}`;
	}

	if (type === 'banStatusServiceStatusBanned') {
		subject = 'Your account has been disabled';
		previewText = 'Status Banned';
	}
	if (type === 'banStatusServiceStatusUnBanned') {
		subject = 'Your account is now active';
		previewText = 'Status Unbanned';
	}
	if (type === 'contactSupport') {
		subject = 'Customer Support';
		previewText = 'Customer Support';
	}
	if (type === 'userFeedback') {
		subject = 'Customer Feedback';
		previewText = 'Customer Feedback';
	}
	if (type === 'cancelDetailsHost') {
		subject = 'Your reservation has been cancelled';
    // previewText = 'Your reservation is cancelled';
    previewText=' ';
	}
	if (type === 'cancelDetailsGuest') {
		subject = 'Reservation cancelled';
    // previewText = 'Your reservation is cancelled';
    previewText=' ';
	}
	if (type === 'bookingPreApprovalInquiry') {
		subject = `You’ve been invited to book on ${sitename}!`;
		previewText = ' ';
		notification = `You’ve been invited to book your trip on ${sitename}! You have 24 hours to finish your booking: ${shortUrlGuestInbox}`;
	}
	if (type === 'bookingExpireWithoutPaymentGuest') {
		subject = 'Your invitation to book has expired';
		// previewText = 'Your reservation is expired';
		previewText = ' ';
	}
	if (type === 'bookingExpireWithoutPaymentHost') {
		subject = 'Invitation to book has expired';
		// previewText = 'Your reservation is expired';
		previewText = ' ';
  }
  
  if (type === 'invitationExpiredGuest') {
		subject = 'Your invitation to book has expired';
		previewText = ' ';
		const title = getShortenedListingTitle();
		notification = `Your invitation to book ${title ? "’"+title+"’" : ''} on ${sitename} has expired. If you still want to book your trip, send a booking request through the listing page. Once it’s approved again by the host, you’ll have an additional 24 hours to complete your booking.`
  }

  if (type === 'invitationExpiredHost') {
		subject = 'Your invitation to book has expired';
		previewText = ' ';
  }

	return {
		subject,
		previewText,
		notification
	};

	function getShortenedMessage() {
		let message;
		if (content && content.message) {
			if (content.message.length > 38) {
				message = content.message.slice(0, 35) + '...';
			} else {
				message = content.message;
			}
		} else {
			message = '';
		}
		return message;
	}

	function getShortenedListingTitle() {
		let title;
		if (content && content.listTitle) {
			if (content.listTitle.length > 20) {
				title = content.listTitle.slice(0, 17) + '...';
			} else {
				title = content.listTitle;
			}
		} else {
			title = '';
		}
		return title;
	}
}