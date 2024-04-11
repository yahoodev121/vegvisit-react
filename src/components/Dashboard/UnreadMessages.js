import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
	Button,
	Form,
	Grid,
	Row, FormGroup,
	Col,
	ControlLabel,
	FormControl,
	FieldGroup,
	Panel,
	Label
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Inbox.css';

//Components
import InboxItem from './InboxItem/InboxItem';
import Loader from '../Loader';

// Locale
import messages from '../../locale/messages';

class UnreadMessages extends React.Component {

	static propTypes = {
		formatMessage: PropTypes.any,
		userId: PropTypes.string.isRequired,
		loading: PropTypes.bool.isRequired,
		getUnreadThreads: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.number.isRequired,
			listData: PropTypes.shape({
				city: PropTypes.string.isRequired,
				state: PropTypes.string.isRequired,
				country: PropTypes.string.isRequired,
        userType: PropTypes.string.isRequired,
        timeZone: PropTypes.string.isRequired,
			}),
			guestProfile: PropTypes.shape({
				profileId: PropTypes.number.isRequired,
				picture: PropTypes.string,
				displayName: PropTypes.string.isRequired,
			}),
			hostProfile: PropTypes.shape({
				profileId: PropTypes.number.isRequired,
				picture: PropTypes.string,
				displayName: PropTypes.string.isRequired,
			}),
			threadItemUnread: PropTypes.shape({
        type: PropTypes.string.isRequired,
        messageType: PropTypes.string.isRequired,
				content: PropTypes.string,
				startDate: PropTypes.string,
				endDate: PropTypes.string,
				isRead: PropTypes.bool.isRequired,
				sentBy: PropTypes.string.isRequired,
				createdAt: PropTypes.string.isRequired,
				reservation: PropTypes.shape({
					id: PropTypes.number,
					paymentState: PropTypes.string,
					reservationState: PropTypes.string,
					basePrice: PropTypes.number
				})
			}),
			actionThreadItem: PropTypes.shape({
				id: PropTypes.number.isRequired,
				threadId: PropTypes.number.isRequired,
				content: PropTypes.string,
				sentBy: PropTypes.string.isRequired,
				isRead: PropTypes.bool.isRequired,
				type: PropTypes.string.isRequired,
				startDate: PropTypes.string,
				endDate: PropTypes.string,
				createdAt: PropTypes.string.isRequired,
				messageType: PropTypes.string.isRequired,
			}),
		}))
	};

	static defaultProps = {
		loading: true,
		getUnreadThreads: []
	};

	label(status, noStyle) {
		const { type, messageType, reservationState } = this.props;
		let style, label;

		switch (status) {
			case 'inquiry':
				label = <FormattedMessage {...messages.messageStatus1} />
				style = 'info';
				break;
			case 'preApproved':
				label = <FormattedMessage {...messages.messageStatus13} />
				style = 'primary';
				break;
			case 'declined':
				label = <FormattedMessage {...messages.messageStatus3} />
				style = 'danger';
				break;
			case 'approved':
				label = <FormattedMessage {...messages.messageStatus4} />
				style = 'success';
				break;
			case 'pending':
				label = <FormattedMessage {...messages.messageStatus5} />
				style = 'warning';
				break;
			case 'cancelledByHost':
				label = <FormattedMessage {...messages.messageStatus6} />
				style = 'danger';
				break;
			case 'cancelledByGuest':
				label = <FormattedMessage {...messages.messageStatus7} />
				style = 'danger';
				break;
			case 'intantBooking':
				label = <FormattedMessage {...messages.messageStatus8} />
				style = 'success';
				break;
			case 'confirmed':
				label = <FormattedMessage {...messages.messageStatus8} />
				style = 'success';
				break;
			case 'expired':
        label = <FormattedMessage {...messages.messageStatus9} />
				style = 'danger';
        break;
      case 'inquiryExpired':
        label = <FormattedMessage {...messages.messageStatus19} />
				style = 'danger';
				break;
			case 'requestToBook':
				label = <FormattedMessage {...messages.messageStatus10} />
				style = 'primary';
				break;
			case 'bookingRequest':
				label = <FormattedMessage {...messages.messageStatus12} />
				style = 'primary';
				break;
			case 'bookingRequestAccepted':
				label = <FormattedMessage {...messages.messageStatus17} />
			  style = 'warning';
				break;
			case 'bookingRequestAcceptedHost':
				label = <FormattedMessage {...messages.messageStatus2} />
				style = 'black';
				break;
			case 'completed':
				label = 'Trip Completed';
				style = 'success';
				break;
			case 'bookingAccepted':
				label = <FormattedMessage {...messages.messageStatus13} />
				style = 'success';
				break;
			case 'paymentExpire':
				label = <FormattedMessage {...messages.messageStatus9} />
				style = 'danger';
        break;
      case 'inquiryPreApproved':
        label = <FormattedMessage {...messages.messageStatusInvited} />
			  style = 'warning';
        break;
		}

		if (noStyle) {
			return label;
		}
		return <Label bsStyle={style}>{label}</Label>
	}

	render() {
		const { loading, getUnreadThreads, userId } = this.props;

		if (loading) {
			return <Loader type={"text"} />
		} else {
			if (getUnreadThreads != null && getUnreadThreads.length > 0) {
				return (
					<div className={cx(s.progressContainerResponsive, s.space5, s.spaceTop5)}>
						<Row>
							<Col xs={12} sm={12} md={12} lg={12}>
								{
									<Panel className={cx("dashboardMessage", s.panelHeader)}>
										<ul className={s.listLayout}>
											{
												getUnreadThreads.map((item, index) => {
													let unreadType;
													if (item.threadItemUnread.messageType == 'requestToBook' && item.threadItemUnread.type == 'preApproved') {
														unreadType = 'bookingAccepted';
													} else if (item.threadItemUnread.messageType == 'requestToBook' && item.threadItemUnread.type != 'preApproved' && item.threadItemUnread.type != 'expired' && item.threadItemUnread.type != 'paymentExpire' && item.threadItemUnread.type != 'approved' && item.threadItemUnread.type != 'completed') {
														unreadType = 'bookingRequest';
													} else if (item.threadItemUnread.messageType == 'inquiry' && item.threadItemUnread.type == 'inquiry') {
														unreadType = 'inquiry';
													} else if (item.threadItemUnread.messageType == 'inquiry' && item.threadItemUnread.type == 'preApproved') {
														unreadType = 'inquiryPreApproved';
													} else if (item.threadItemUnread.type == 'cancelledByHost') {
														unreadType = 'cancelledByHost';
													} else if (item.threadItemUnread.type == 'cancelledByGuest') {
														unreadType = 'cancelledByGuest';
													} else if (item.threadItemUnread.messageType == 'requestToBook' && item.threadItemUnread.type == 'expired') {
                            unreadType = 'expired';
                          } else if (item.threadItemUnread.messageType == 'inquiry' && item.threadItemUnread.type == 'expired') {
														unreadType = 'expired';
													} else if (item.threadItemUnread.messageType == 'requestToBook' && item.threadItemUnread.type == 'paymentExpire' ) {
														unreadType = 'paymentExpire';
													} else if ( item.threadItemUnread.type == 'completed') {
														unreadType = 'completed';
													} else if (item.threadItemUnread.messageType == 'requestToBook' && item.threadItemUnread.type == 'approved') {
														unreadType = 'approved';
													} else {
														unreadType = item.threadItemUnread.type
													}

													let type;
													if (userId === item.host) {
														type = 'host';
													} else {
														type = 'guest';
													}
													
													if (item.threadItemUnread != null && item.guestProfile && item.hostProfile) {
														return <InboxItem
															key={index}
															threadId={item.id}
															type={type}
															profileId={type === 'host' ? item.guestProfile.profileId : item.hostProfile.profileId}
															picture={type === 'host' ? item.guestProfile.picture : item.hostProfile.picture}
															displayName={type === 'host' ? item.guestProfile.displayName : item.hostProfile.displayName}
                              /* 
                                If there is a message content then it will be displayed
                                If content is an empty string, the content will be defined by InboxItem (see logic there), otherwise (if null) unreadType and the label function determine it
                              */
															content={item.threadItemUnread.content != null ? item.threadItemUnread.content : this.label(unreadType, true)}
															createdAt={item.threadItemUnread.createdAt}
															city={item.listData.city}
															state={item.listData.state}
                              country={item.listData.country}
                              timeZone={item.listData.timeZone}
															startDate={item.threadItemUnread.startDate}
															endDate={item.threadItemUnread.endDate}
															sentBy={item.threadItemUnread.sentBy}
															read={item.threadItemUnread.isRead}
															bookingRequest={this.label('bookingRequest')}
															bookingRequestAccepted={type === 'host' ? this.label('bookingRequestAcceptedHost') : this.label('bookingRequestAccepted')}

															// Status should be based on the actionThreadItem
															status={this.label(item.actionThreadItem.type)}
															reqStatus={item && item.actionThreadItem && item.actionThreadItem.type}
															messageType={item && item.actionThreadItem && item.actionThreadItem.messageType}
															
															bookingAccepted={this.label('bookingAccepted')}
                              inquiryPreApproved={this.label('inquiryPreApproved')}
                              inquiryExpired={this.label('inquiryExpired')}
															intantBookingLabel={this.label('intantBooking')}
															cancelHost={this.label('cancelledByHost')}
															cancelGuest={this.label('cancelledByGuest')}
															expiredPayment={this.label('expired')}
															paymentExpire={this.label('paymentExpire')}
															completed={this.label('completed')}
															requestCompleted={this.label('approved')}
															isCurrentStatus={item.threadItemUnread.type}
															isMessageType={item.threadItemUnread.messageType}
															firstName = {type === 'host' ? item.guestProfile.firstName : item.hostProfile.firstName}
															reservationState = {item && item.threadItemUnread && item.threadItemUnread.reservation && item.threadItemUnread.reservation.reservationState}
															paymentState = {item && item.threadItemUnread && item.threadItemUnread.reservation && item.threadItemUnread.reservation.paymentState}
															reservation = { item && item.threadItemUnread && item.threadItemUnread.reservation }
															basePrice = { item && item.threadItemUnread && item.threadItemUnread.reservation && item.threadItemUnread.reservation.basePrice }
														/>
													} else {
														return <li />
													}
												})
											}
										</ul>
									</Panel>
								}
							</Col>
						</Row>
					</div>
				);
			} else {
				return <div />
			}
		}
	}
}

export default withStyles(s)(UnreadMessages);

