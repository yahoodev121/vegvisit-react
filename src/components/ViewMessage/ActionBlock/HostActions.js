import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import {
	Button,
	Col,
	Panel
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';
import * as FontAwesome from 'react-icons/lib/fa';

// Redux action
import { sendMessageAction } from '../../../actions/message/sendMessageAction';
// Component
import CountDown from '../../CountDown';
import Link from '../../Link';

import { checkAvailableDates } from '../../../helpers/checkAvailableDates';
import history from '../../../core/history';

// Locale
import messages from '../../../locale/messages';

import { sendEmail } from '../../../core/email/sendEmail';

class HostActions extends Component {
	static propTypes = {
		actionType: PropTypes.string.isRequired,
		sendMessageAction: PropTypes.any.isRequired,
		threadId: PropTypes.number.isRequired,
		reservationId: PropTypes.number,
		threadType: PropTypes.string.isRequired,
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		personCapacity: PropTypes.number.isRequired,
		guestDisplayName: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		formatMessage: PropTypes.any,
		hostDisplayName: PropTypes.string.isRequired,
		guestLastName: PropTypes.any,
		guestLocation: PropTypes.any,
		guestProfilePic: PropTypes.any,
		guestJoinedDate: PropTypes.any,
		checkIn: PropTypes.any,
		checkOut: PropTypes.any,
		guests: PropTypes.any,
		allowedCheckInTime: PropTypes.any,
		allowedCheckOutTime: PropTypes.any,
		hostContactNumber: PropTypes.any,
		guestContactNumber: PropTypes.any,
		hostLocation: PropTypes.any,
		hostJoinedDate: PropTypes.any,
		hostProfilePic: PropTypes.any,
		hostemail: PropTypes.any,
		city: PropTypes.any,
		state: PropTypes.any,
    country: PropTypes.any,
    street: PropTypes.string,
    buildingName: PropTypes.string,
    zipcode: PropTypes.string,
    timeZone: PropTypes.string,
		paymentState: PropTypes.string,
    reservationState: PropTypes.string,
    total: PropTypes.number.isRequired,
		listId: PropTypes.number,
	};

	constructor(props) {
		super(props);
		this.state = {
				isExpired: false
		};
	}

	async sendMessage(type) {
		const { sendMessageAction, threadId, threadType, startDate, endDate, personCapacity } = this.props;
		const { guestEmail, guestDisplayName, hostDisplayName, title, hostProfilePic, hostemail, messageType } = this.props;
		const { total, reservationId, guestLastName, guestLocation, guestProfilePic, guestJoinedDate } = this.props;
		const { hostContactNumber, guestContactNumber, hostLocation, hostJoinedDate, city, state, country, street, buildingName, zipcode, timeZone, listId } = this.props;
		const { checkIn, checkOut, guests, allowedCheckInTime, allowedCheckOutTime } = this.props;

		
		if (type === 'preApproved') {

			const datesAvailableAndValid = await checkAvailableDates(listId, startDate, endDate);
			if (!datesAvailableAndValid) {
				this.setState({ isExpired: true });
				return;
			}

			sendMessageAction(
				threadId,
				threadType,
				null,
				type,
				startDate,
				endDate,
				personCapacity,
				reservationId,
				guestDisplayName,
				hostDisplayName,
				null,
				guestEmail,
				startDate,
				hostLocation,
				hostProfilePic,
				hostJoinedDate,
				messageType,
				title,
				endDate,
        city,
        state,
        country,
        timeZone,
				state,
				country,
				total
			);

			let content1 = {
				guestName: guestDisplayName,
				hostName: hostDisplayName,
				listTitle: title,
				threadId: threadId,
				checkIn,
				checkOut,
				listCity: city,
				listState: state,
				listCountry: country
			}
		}
		else if (type === 'approved') {

			sendMessageAction(
				threadId,
				threadType,
				null,
				'approved',
				startDate,
				endDate,
				personCapacity,
				reservationId,
				guestDisplayName,
				hostDisplayName,
				null,
				guestEmail,
				startDate,
				hostLocation,
				hostProfilePic,
				hostJoinedDate,
				messageType,
				title,
				endDate,
        city,
        state,
        country,
        timeZone,
				null,
				null,
				total
			);

			let content1 = {
				listTitle: title,
				reservationId,
				threadId,
				confirmationCode: '',
				guestName: guestDisplayName,
				guestLastName,
				guestLocation,
				guestProfilePic,
				guestJoinedDate,
				checkIn,
				checkOut,
				guests,
				allowedCheckInTime,
				allowedCheckOutTime,
				hostContactNumber,
        guestContactNumber,
        hostName: hostDisplayName,
				hostJoinedDate,
				hostLocation,
				guestEmail,
				hostProfilePic,
				hostEmail: hostemail,
				listCity: city,
				listState: state,
        listCountry: country,
        listStreet: street,
        listBuildingName: buildingName,
        listZipcode: zipcode,
        listTimeZone: timeZone
			}

			await sendEmail(guestEmail, 'bookingConfirmedToGuest', content1);
			const { status, response } = await sendEmail(hostemail, 'bookingConfirmedToHost', content1);

		}
		else if (type === 'declined') {
			sendMessageAction(threadId, threadType, null, type, startDate, endDate, personCapacity, reservationId, guestDisplayName, hostDisplayName, null, guestEmail, startDate, hostLocation, hostProfilePic, hostJoinedDate, messageType, title, endDate, city, state, country, timeZone);
		}
		else {
			sendMessageAction(threadId, threadType, null, type, startDate, endDate, personCapacity, reservationId, null, null, null, null, startDate, hostLocation, hostProfilePic, hostJoinedDate, messageType, title, endDate, city, state, country, timeZone,);
    }

		history.push('/inbox/host');
		// Should be `/message/${threadId}/host` but that is where we are and therefore we need to refresh/reload the data
		/* setTimeout(() => {
				history.push(`/message/${threadId}/host`);
		}, 500); */
		// window.location.reload(); // We cannot do that because this will stop all ongoing actions in the client, at least we would have to set a timeout!!!
	}


	// Inquiry
	inquiry(guestDisplayName) {
		const { createdAt, messageType, listId } = this.props;
		let startDate = moment();
		let next24Hours = moment(createdAt).add(23, 'hours').add(59, 'minutes');
		// let distance = next24Hours - startDate;
		let options = { endDate: next24Hours };

		return (
			<Panel className={cx(s.space5, s.contextPadding)}>
				{
					messageType !== 'requestToBook' && <div> <h4>
						<strong><FormattedMessage {...messages.hostAction1} /> {guestDisplayName} <FormattedMessage {...messages.hostAction2} /></strong>
					</h4>
						<p className={s.spaceTop2}><FormattedMessage {...messages.hostAction3} /> {guestDisplayName} <FormattedMessage {...messages.hostAction4} /></p>
						{
							// distance > 0 &&
							<p className={s.spaceTop2}>
								<FontAwesome.FaClockO className={cx(s.textGray, s.timerIcon)} />
								<FormattedMessage {...messages.hostResponseTime1} /> <CountDown options={options} /> <FormattedMessage {...messages.hostResponseTime2} /> {guestDisplayName}.
							</p>
						}</div>
				}

				{
					messageType == 'requestToBook' && <div>
						<h4><strong>{guestDisplayName} <FormattedMessage {...messages.guestRequest} /></strong></h4>
						{
							// distance > 0 && 
              <div><p className={s.spaceTop2}>
                  <FontAwesome.FaClockO className={cx(s.textGray, s.timerIcon)} />
                  <FormattedMessage {...messages.inquiryhostResponseTime1} /> <CountDown options={options} />.
							  </p>
								<p className={s.spaceTop2}>
									<FormattedMessage {...messages.inquiryhostResponseTime2} /> {' '} {guestDisplayName} {' '}<FormattedMessage {...messages.inquiryhostResponseTime3} />
								</p>
              </div>
						}
					</div>
				}

				{
					messageType == 'requestToBook' && <Col md={12} className={cx(s.spaceTop2, s.noPadding)}>
						<Button className={s.btnPrimary} onClick={() => this.sendMessage('preApproved')} disabled={this.state.isExpired}>
							<FormattedMessage {...messages.approve} />
						</Button>
						<Button className={cx(s.btnPrimaryBorder, s.btnRight)} onClick={() => this.sendMessage('declined')}>
							<FormattedMessage {...messages.decline} />
						</Button>
						{this.state.isExpired && <div className={s.errorMessage}> <FormattedMessage {...messages.bookingPeriodExpiredHost} /><a href={'/become-a-host/' + listId + '/calendar'}> <FormattedMessage {...messages.bookingPeriodExpiredHost2} /></a></div>}
					</Col>
				}

				{
					messageType !== 'requestToBook' && <Col
						md={12}
						className={cx(s.spaceTop2, s.noPadding)}
					>
						<Button
							className={s.btnPrimary}
							onClick={() => this.sendMessage('preApproved')}
							disabled={this.state.isExpired}
						>
							<FormattedMessage {...messages.preApprove} />
						</Button>
						{this.state.isExpired && <div className={s.errorMessage}> <FormattedMessage {...messages.bookingPeriodExpiredHost} /><a href={'/become-a-host/' + listId + '/calendar'}> <FormattedMessage {...messages.bookingPeriodExpiredHost2} /></a></div>}
					</Col>
				}
			</Panel>
		);
	}

	// Request to book
	requestToBook(guestDisplayName) {
		const { createdAt, listPublishStatus, messageType, total, listId } = this.props;
		let startDate = moment();
		let next24Hours = moment(createdAt).add(23, 'hours').add(59, 'minutes');
		// let distance = next24Hours - startDate;
		let options = { endDate: next24Hours };


		if (messageType == 'requestToBook' && total == 0) {
			
			return (
				<Panel className={cx(s.space5, s.contextPadding)}>
					{
						messageType == 'requestToBook' && total == 0 && <div>
							<h4><strong>{guestDisplayName} <FormattedMessage {...messages.guestRequest} /></strong></h4>
							{
								// distance > 0 && 
                <div><p className={s.spaceTop2}>
                    <FontAwesome.FaClockO className={cx(s.textGray, s.timerIcon)} />
                    <FormattedMessage {...messages.inquiryhostResponseTime1} /> <CountDown options={options} />.
								  </p>
									<p className={s.spaceTop2}>
										<FormattedMessage {...messages.inquiryhostResponseTime2} /> {' '} {guestDisplayName} {' '}<FormattedMessage {...messages.inquiryhostResponseTime3} />
									</p>
                </div>
							}
						</div>
					}
					{
						listPublishStatus && <Col md={12} className={cx(s.spaceTop2, s.noPadding)}>
							<Button className={s.btnPrimary} onClick={() => this.sendMessage('approved')} disabled={this.state.isExpired}>
								<FormattedMessage {...messages.approve} />
							</Button>
							<Button className={cx(s.btnPrimaryBorder, s.btnRight)} onClick={() => this.sendMessage('declined')}>
								<FormattedMessage {...messages.decline} />
							</Button>
							{this.state.isExpired && <div className={s.errorMessage}> <FormattedMessage {...messages.bookingPeriodExpiredHost} /><a href={'/become-a-host/' + listId + '/calendar'}> <FormattedMessage {...messages.bookingPeriodExpiredHost2} /></a></div>}
						</Col>
					}
				</Panel>
			);
		} 
		else {
		
			return (
				<Panel className={cx(s.space5, s.contextPadding)}>
					<h4><strong>{guestDisplayName} <FormattedMessage {...messages.guestRequest} /></strong></h4>
					{
						// distance > 0 && 
            <p className={s.spaceTop2}>
							<FormattedMessage {...messages.hostResponseTime1} /> <CountDown options={options} /> <FormattedMessage {...messages.hostResponseTime2} />
						</p>
					}
					{
						listPublishStatus && <Col md={12} className={cx(s.spaceTop2, s.noPadding)}>
							<Button className={s.btnPrimary} onClick={() => this.sendMessage('approved')} disabled={this.state.isExpired}>
								<FormattedMessage {...messages.approve} />
							</Button>
							<Button className={cx(s.btnPrimaryBorder, s.btnRight)} onClick={() => this.sendMessage('declined')}>
								<FormattedMessage {...messages.decline} />
							</Button>
							{this.state.isExpired && <div className={s.errorMessage}> <FormattedMessage {...messages.bookingPeriodExpiredHost} /><a href={'/become-a-host/' + listId + '/calendar'}> <FormattedMessage {...messages.bookingPeriodExpiredHost2} /></a></div>}
						</Col>
					}
				</Panel>
			);
		}
	}

	// Inquiry pre-approved
	approved(guestDisplayName) {
		const { messageType } = this.props;
		return (
			<Panel className={cx(s.space5, s.contextPadding)}>
				{
					messageType == 'requestToBook' &&
					<h4><strong><FormattedMessage {...messages.requestApprovedHost} /></strong></h4>
				}
				{
					messageType == 'inquiry' &&
					<h4><strong><FormattedMessage {...messages.requestApprovedHostInquiry} /></strong></h4>
				}
				<p className={s.spaceTop2}>
					{guestDisplayName + ' '}<FormattedMessage {...messages.timeToExpire} />
				</p>
        <p className={s.spaceTop2}>
					<FormattedMessage {...messages.timeToExpire2} />
				</p>
			</Panel>
		);
	}

	// Request to book/ Inquiry declined
	declined(guestDisplayName) {
		return (
			<Panel className={cx(s.space5, s.contextPadding)}>
				<h4><strong><FormattedMessage {...messages.requestDeclined} /></strong></h4>
				<p className={s.spaceTop2}>
					<FormattedMessage {...messages.declinedInfo} /> {' '} {guestDisplayName}{' '}<FormattedMessage {...messages.declinedInfo1} />
				</p>
			</Panel>
		);
	}

	// Booking confirmed by host/ instant booking
	bookingConfirmed(guestDisplayName) {
		const { reservationId } = this.props;
		return (
			<Panel className={cx(s.space5, s.contextPadding)}>
				<h4><strong><FormattedMessage {...messages.bookingIsConfirmed} /></strong></h4>
				<p className={s.spaceTop2}>
					<FormattedMessage {...messages.contactGuest} />{' '}{guestDisplayName}{'!'}
					<br /><br /><FormattedMessage {...messages.contactGuest1} />
				</p>
				<Col md={12} className={cx(s.spaceTop2, s.noPadding)}>
					<Link to={"/cancel/" + reservationId + "/host"} className={cx(s.linkBtn, s.btnPrimary)}>
						<FormattedMessage {...messages.cancelReservation} />
					</Link>
				</Col>
			</Panel>
		);
	}

	// Pre-approved or approved by host is expired
	expired(guestDisplayName, total) {
		const { paymentState, messageType } = this.props;
		if (paymentState === 'expired') {
			return (
				<Panel className={cx(s.space5, s.contextPadding)}>
					<h4><strong>{guestDisplayName}<FormattedMessage {...messages.bookingPaymentExpiredHostTitle} /></strong></h4>
          <p className={s.spaceTop2}>
						<FormattedMessage {...messages.bookingPaymentExpiredHostInfo} values={{guest: guestDisplayName}}/>
					</p>
          <p>
            <FormattedMessage {...messages.bookingPaymentExpiredHostInfo1} values={{guest: guestDisplayName}}/>
          </p>
				</Panel>
			);
		} else if (messageType === 'inquiry') {
			return (
				<Panel className={cx(s.space5, s.contextPadding)}>
					<h4><strong>{guestDisplayName}<FormattedMessage {...messages.bookingExpiredHostTitle} /></strong></h4>
					<p className={s.spaceTop2}>
						<FormattedMessage {...messages.bookingExpiredHostInfo} values={{guest: guestDisplayName}}/>
					</p>
          <p className={s.spaceTop2}>
						<FormattedMessage {...messages.bookingExpiredHostInfo1} values={{guest: guestDisplayName}}/>
					</p>
				</Panel>
			);
		}
		else if (total == 0) {
			return (
				<Panel className={cx(s.space5, s.contextPadding)}>
					<h4><strong>{guestDisplayName}'s <FormattedMessage {...messages.bookingIsExpired} /></strong></h4>
					<p className={s.spaceTop2}>
						<FormattedMessage {...messages.bookingIsExpiredFreeListing1} values={{guest: guestDisplayName}}/>
					</p>
          <p>
            <FormattedMessage {...messages.bookingIsExpiredFreeListing2} values={{guest: guestDisplayName}}/>
          </p>
				</Panel>
			);
		} else {
			return (
				<Panel className={cx(s.space5, s.contextPadding)}>
					<h4><strong>{guestDisplayName}'s <FormattedMessage {...messages.bookingIsExpired} /></strong></h4>
					<p className={s.spaceTop2}>
						<FormattedMessage {...messages.bookingIsExpired1} values={{guest: guestDisplayName}}/>
					</p>
          <p>
            <FormattedMessage {...messages.bookingIsExpired2} values={{guest: guestDisplayName}}/>
          </p>
				</Panel>
			);
		}
	}

	// Booking is cancelled by host
	cancelled(guestDisplayName) {
		return (
			<Panel className={cx(s.space5, s.contextPadding)}>
				{/* <h4><strong><FormattedMessage {...messages.bookingRequestCancel1} /></strong></h4> */}
				<h4><strong>{guestDisplayName}<FormattedMessage {...messages.bookingRequestCancel3} /></strong></h4>
				{/* <p className={s.spaceTop2}>
					{guestDisplayName}'s <FormattedMessage {...messages.bookingRequestCancel3} />
				</p> */}
			</Panel>
		);
	}

	completed() {
		const { guestDisplayName, reservationId } = this.props;
		return (
			<Panel className={cx(s.space5, s.contextPadding)}>
				<h4><strong>Trip completed! We hope you had a great experience hosting {guestDisplayName}!</strong></h4>
				<p className={s.spaceTop2}>
					If you haven’t already left a review for {guestDisplayName}, please leave one here:
                </p>
				<Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
					<Link to={"/review/write/" + reservationId} className={cx(s.linkBtn, s.btnPrimary)}>
						<FormattedMessage {...messages.submitYourReview} />
					</Link>
				</Col>
			</Panel>
		);
	}

	render() {
		const { actionType, guestDisplayName, content, messageType, reservationId, total } = this.props;

		if (actionType === 'inquiry') {
			return this.inquiry(guestDisplayName, content);
		} else if (actionType === 'preApproved') {
			return this.approved(guestDisplayName);
		} else if (actionType === 'declined') {
			return this.declined(guestDisplayName);
		} else if (actionType === 'intantBooking' || actionType === 'approved') {
			return this.bookingConfirmed(guestDisplayName);
		} else if (actionType === 'requestToBook') {
			return this.requestToBook(guestDisplayName);
		} else if (actionType === 'expired') {
			return this.expired(guestDisplayName, total);
		} else if (actionType === 'paymentExpire') {
			return this.expired(guestDisplayName, total);
		} else if (actionType === 'cancelledByHost' || actionType === 'cancelledByGuest') {
			return this.cancelled(guestDisplayName);
		} else if (actionType === 'completed') {
			return this.completed();
		}

	}
}

const mapState = (state) => ({
});

const mapDispatch = {
	sendMessageAction,
};

export default withStyles(s)(connect(mapState, mapDispatch)(HostActions));