import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// Redux
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Inbox.css';

// Component
import Avatar from '../../Avatar';
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

// Redux Action
import { readMessage } from '../../../actions/message/readMessage';

class InboxItem extends Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		status: PropTypes.string,
		threadId: PropTypes.number.isRequired,
		profileId: PropTypes.number.isRequired,
		picture: PropTypes.string,
		displayName: PropTypes.string.isRequired,
		content: PropTypes.string,
		createdAt: PropTypes.string.isRequired,
		startDate: PropTypes.string,
		endDate: PropTypes.string,
		sentBy: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		country: PropTypes.string.isRequired,
		read: PropTypes.bool.isRequired,
		account: PropTypes.shape({
			userId: PropTypes.string.isRequired
		}),
		readMessage: PropTypes.any.isRequired,
		firstName: PropTypes.string.isRequired,
		reservationState: PropTypes.string.isRequired,
		paymentState: PropTypes.string.isRequired,
		messageType: PropTypes.string.isRequired,
		reservation: PropTypes.string.isRequired,
		baseprice: PropTypes.number
	};

	static defaultProps = {
		createdAt: null,
		startDate: null,
		endDate: null,
		picture: null,
		status: null,
		sentBy: null,
		read: false
	}

	render() {
		const { type, threadId, profileId, picture, displayName, content, createdAt, startDate, endDate } = this.props;
		const { city, state, country, status, sentBy, read, reqStatus, bookingRequest, bookingRequestAccepted, bookingAccepted } = this.props;
		let createdDate = createdAt != null ? moment(createdAt).format('MM/DD/YYYY') : '';
		let start = startDate != null ? '(' + moment(startDate).format('MM/DD/YYYY') : '';
		let end = endDate != null ? ' - ' + moment(endDate).format('MM/DD/YYYY') + ')' : '';
		const { readMessage, messageType, inquiryPreApproved, inquiryExpired, isMessageType, isCurrentStatus, intantBookingLabel,
			cancelHost, cancelGuest, expiredPayment, completed, requestCompleted,
			paymentExpire } = this.props;
		const { firstName, reservationState, paymentState, reservation, baseprice } = this.props;
		let isStatus
		if (isCurrentStatus == 'inquiry' && isMessageType == 'intantBooking') {
			isStatus = 'completed';
		}
		

		return (
			<li className={s.PanelBody}>
				<div className={s.displayTable}>
					<div className={s.displayTableRow}>
						<div className={cx(s.displayTableCell, s.IconWidth, s.floatLeft)}>
							<Avatar
								source={picture}
								height={70}
								width={70}
								title={displayName}
								className={s.profileAvatar}
								withLink
								linkClassName={s.profileAvatarLink}
								profileId={profileId}
							/>
						</div>
						<div className={cx(s.displayTableCell, s.rightBg)}>
							<div className={s.displayTable}>
								<div className={s.displayTableRow}>
									<div className={cx(s.displayTableCell, s.timeWidth, s.displayBlock)}>
										<div className={s.textTruncate}>
											{/* {baseprice != 0 ? (reservation != null ? (reservationState == 'approved' || reservationState == 'pending') && paymentState == 'pending' ? firstName : displayName : (messageType == 'inquiry' ? firstName : displayName)) : firstName} */}

											{/* { (reservation != null ? (reservationState == 'approved' || reservationState == 'pending') && paymentState == 'pending' ? firstName : displayName : (messageType == 'inquiry' ? firstName : displayName)) } */}

											{
												/*(reservationState != null ? ((reservationState == 'approved' || reservationState == 'completed') && paymentState == 'completed') ? displayName : firstName : (messageType == 'inquiry' ? firstName : displayName))*/
											}
                      {firstName}
										</div>

										<time>{createdDate}</time>
									</div>
									<div className={cx(s.displayTableCell, s.addressWidth, s.displayBlock)}>
										<Link
											to={"/message/" + threadId + "/" + type}
											className={cx(s.textMuted)}
											onClick={() => readMessage(threadId, type)}
										>
											<div className={cx(s.threadBody)}>
												{/* <span>{content != null ? (content != 'Welcome') ? content : '' : this.label(status, true)}</span> */}
												<span>
													{content != null && content}
													{
														messageType == 'requestToBook' && reqStatus == 'preApproved' && !content && <FormattedMessage {...messages.bookingAcceptedRequest} />
													}
													{
														messageType == 'inquiry' && reqStatus == 'preApproved' && !content && <FormattedMessage {...messages.bookingAcceptedInquiry} />
													}
													{
														messageType == 'requestToBook' && reqStatus == 'declined' && !content && <FormattedMessage {...messages.messageStatus3} />
													}
													{
														messageType == 'requestToBook' && reqStatus != 'preApproved' && reqStatus != 'declined'
														&& reqStatus != 'approved' && !content && reqStatus != 'expired' && reqStatus == 'paymentExpire' && <FormattedMessage {...messages.messageStatusBookingNotCompleted} />
													}
													{/* {
														messageType == 'requestToBook' && reqStatus != 'preApproved' && reqStatus != 'declined'
														&& reqStatus != 'approved' && !content  && reqStatus == 'expired' && <FormattedMessage {...messages.messageStatus18} />
													} */}
                          {
														messageType == 'inquiry' && reqStatus === 'expired' && <FormattedMessage {...messages.messageStatusBookingNotCompleted} />
													}
													{
														messageType == 'inquiry' && reqStatus == 'intantBooking' && !content && <FormattedMessage {...messages.messageStatus8} />
													}
													{
														messageType == 'requestToBook' && reqStatus == 'approved' && !content && <FormattedMessage {...messages.messageStatus4} />
													}
													{
														messageType == 'requestToBook' && reqStatus == 'completed' && !content && <FormattedMessage {...messages.inboxCompleted} />
													}
												</span>
												<div className={cx(s.textMuted, s.showLg)}>
													<span>{city}, {state}, {country} {start} {end}</span>
												</div>
												<div className={cx(s.spaceTop2, s.previewLink)}><FormattedMessage {...messages.viewMessage} /></div>
											</div>
										</Link>
									</div>
									<div className={cx(s.displayTableCell, s.btnWidth, s.displayBlock)}>
										{
											messageType == 'requestToBook' && reqStatus == 'preApproved' && bookingRequestAccepted
										}
										{
											messageType == 'requestToBook' && reqStatus != 'preApproved' && reqStatus != 'declined' && reqStatus != 'approved' && reqStatus != 'expired' && reqStatus != 'paymentExpire' && reqStatus != 'completed' && bookingRequest
										}
										{
											messageType == 'requestToBook' && reqStatus == 'declined' && status
										}
										{
											messageType == 'inquiry' && reqStatus == 'inquiry' && status
										}
										{
											messageType == 'inquiry' && reqStatus == 'preApproved' && inquiryPreApproved
										}
										{
											messageType == 'inquiry' && reqStatus == 'intantBooking' && intantBookingLabel
										}
                    {
											messageType == 'inquiry' && reqStatus == 'expired' && inquiryExpired
										}
										{
											reqStatus == 'cancelledByHost' && cancelHost
										}
										{
											reqStatus == 'cancelledByGuest' && cancelGuest
										}
										{
											reqStatus == 'completed' && completed
										}
										{
											messageType == 'requestToBook' && reqStatus == 'expired' && expiredPayment
										}
										{
											messageType == 'requestToBook' && reqStatus == 'paymentExpire' && paymentExpire
										}
										{
											messageType == 'requestToBook' && reqStatus == 'approved' && requestCompleted
										}

									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</li>
		);
	}
}

const mapState = (state) => ({});

const mapDispatch = {
	readMessage
};

export default withStyles(s)(connect(mapState, mapDispatch)(InboxItem));
