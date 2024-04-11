import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import 'moment-timezone';

import { graphql, compose } from 'react-apollo';

// Redux
import { connect } from 'react-redux';

import {
	Row,
	Col,
	Label
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Inbox.css';

// Component
import Avatar from '../../Avatar';
import Link from '../../Link';

// Redux Action
import { readMessage } from '../../../actions/message/readMessage';

// Locale
import messages from '../../../locale/messages';

// Graphql 
import GetAllThreadQuery from '../AllThreadsQuery.graphql';
import { Stats } from 'fs';


class InboxItem extends Component {
	static propTypes = {
		formatMessage: PropTypes.any,
    type: PropTypes.string.isRequired,
    messageType: PropTypes.string,
		status: PropTypes.string.isRequired,
		threadId: PropTypes.number.isRequired,
		profileId: PropTypes.number.isRequired,
		picture: PropTypes.string,
		displayName: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		startDate: PropTypes.string,
		endDate: PropTypes.string,
		sentBy: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
		read: PropTypes.bool.isRequired,
		account: PropTypes.shape({
			userId: PropTypes.string.isRequired
		}),
		readMessage: PropTypes.any.isRequired
	};

	static defaultProps = {
		createdAt: null,
		startDate: null,
		endDate: null,
		picture: null,
		status: null,
		sentBy: null,
		read: false,
	}



	label(status, noStyle) {
		const { type, messageType } = this.props;
		let style, label;
		let approveMessage, approveColor, preApproveMessage, preApproveMessageColor, isBookingStatus;
		if (status === 'bookingRequestAccepted' && type === 'host') {
			approveMessage = <FormattedMessage {...messages.messageStatus15} />//waiting for payment(Host)
			approveColor = 'black'
		} else {
			approveMessage = <FormattedMessage {...messages.messageStatus16} />//complete booking(guest)
			approveColor = 'black'
		}


		if (status === 'preApproved' && type === 'host') {
      if (messageType === 'inquiry') {
        preApproveMessage = <FormattedMessage {...messages.messageStatusInvited} />
        preApproveMessageColor = 'warning'
      } else {
        preApproveMessage = <FormattedMessage {...messages.messageStatus2} />
        preApproveMessageColor = 'black'
      }
		} else {
      if (messageType === 'inquiry') {
        preApproveMessage = <FormattedMessage {...messages.messageStatusInvited} />
        preApproveMessageColor = 'warning'
      } else {
        preApproveMessage = <FormattedMessage {...messages.messageStatus17} />
        preApproveMessageColor = 'warning'
      }
		}

		if (status === 'requestToBook' && type === 'host') {
			isBookingStatus = <FormattedMessage {...messages.messageStatus12} />
		} else {
			isBookingStatus = <FormattedMessage {...messages.messageStatus14} />
		}

		switch (status) {
			case 'inquiry':
				label = <FormattedMessage {...messages.messageStatus1} />
				style = 'info';
				break;
			case 'preApproved':
				label = preApproveMessage
				style = preApproveMessageColor;
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
        if (messageType === 'inquiry') {
          label = <FormattedMessage {...messages.messageStatus19} />
        } else {
          label = <FormattedMessage {...messages.messageStatus9} />
        }
				style = 'danger';
				break;
			// case 'requestToBook':
			// 	label = <FormattedMessage {...messages.messageStatus10} />
			// 	style = 'primary';
			// 	break;
			case 'completed':
				label = <FormattedMessage {...messages.inboxCompleted} />
				style = 'success';
				break;
			case 'bookingRequest':
				label = <FormattedMessage {...messages.messageStatus12} />
				style = 'primary';
				break;
			case 'bookingRequestAccepted':
				label = approveMessage
				style = approveColor;
				break;
			case 'bookingAccepted':
				label = <FormattedMessage {...messages.messageStatus13} />
				style = 'success';
				break;
			case 'paymentExpire':
				label = <FormattedMessage {...messages.messageStatus9} />
				style = 'danger';
				break;
		}
		if (noStyle) {
			return label;
		}
		return <Label bsStyle={style}>{label}</Label>
	}


	render() {
		const { type, threadId, profileId, picture, displayName, content, createdAt, startDate, endDate } = this.props;
		const { city, state, country, timeZone, status, sentBy, read, messageType, currentStatus } = this.props;
		const { formatMessage } = this.props.intl;
		const { account: { userId } } = this.props;
		const { readMessage } = this.props;
		let createdDate = createdAt != null ? moment(createdAt).format('MM/DD/YYYY') : '';
		let start = (startDate != null && timeZone) ? '(' + moment(startDate).tz(timeZone).format('MM/DD/YYYY') : '';
		let end = (endDate != null && timeZone) ? ' - ' + moment(endDate).tz(timeZone).format('MM/DD/YYYY') + ')' : '';
		let isRead, statusValue;
		if (userId !== sentBy && read === false) {
			isRead = s.threadSubjectUnread;
		}
		let isValue;
		if (messageType == 'preApproved') {
			isValue = '#ffa500'
		}

		let isCurrentStatus = currentStatus && currentStatus.type;

		let messageValue;
		if (content) {
			messageValue = content;
		}
		else if (messageType == 'requestToBook' && status == 'preApproved' && type == 'host') {
			messageValue = <FormattedMessage {...messages.messageStatus15} />
		}
		else if (messageType == 'requestToBook' && status == 'declined') {
			messageValue = <FormattedMessage {...messages.messageStatus3} />
    }
    else if (status == 'intantBooking' && type == 'guest') {
			messageValue = <FormattedMessage {...messages.messageStatusRequestApproved} />
		}
		else if (messageType == 'inquiry' && status == 'preApproved' && type == 'guest') {
			messageValue = <FormattedMessage {...messages.bookingAcceptedInquiry} />
		}
		else if (messageType == 'inquiry' && status == 'preApproved' && type == 'host') {
			messageValue = <FormattedMessage {...messages.bookingAcceptedInquiryHost} />
    }
    else if (messageType == 'inquiry' && status == 'expired') {
			messageValue = <FormattedMessage {...messages.messageStatusBookingNotCompleted} />
		}
		else if (messageType == 'requestToBook' && status == 'preApproved' && type == 'guest') {
			messageValue = <FormattedMessage {...messages.bookingAcceptedRequest} />
    }
    else if (messageType == 'requestToBook' && status == 'paymentExpire' && type == 'guest') {
			messageValue = <FormattedMessage {...messages.messageStatusBookingNotCompleted} />
    }
    else if (messageType == 'requestToBook' && status == 'paymentExpire' && type == 'host') {
			messageValue = <FormattedMessage {...messages.messageStatusBookingNotCompleted} />
		}
		else {
			messageValue = this.label(status, true)
		}

		return (
			<div className={s.PanelBody}>
				<div className={s.circle} style={{ borderColor: isValue }}>
				</div>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} className={s.threadAuthor}>
						<div className={s.displayTable}>
							<div className={s.displayTableRow}>
								<div className={s.displayTableCellIcon}>
									<div className={s.threadAvatar}>
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
								</div>
								<div className={cx(s.displayTableCell, s.contentSection)}>
									<div className={s.displayTable}>
										<div className={s.displayTableRow}>
											<div className={cx(s.displayTableCell, s.nameWidth, s.displayBlock, s.paddingR20)}>
												<Link to={"/users/show/" + profileId}> {displayName}  </Link>
												<div>
													<time>{createdDate}</time>
												</div>
											</div>
											<div className={cx(s.displayTableCell, s.addressWidth, s.displayBlock)}>
												<Link
													to={"/message/" + threadId + "/" + type}
													className={cx(s.textMuted)}
													onClick={() => readMessage(threadId, type)}
												>
													<div className={cx(s.threadBody)}>
														<span className={cx(isRead)}>
															{messageValue}
														</span>
														<div className={cx(s.textMuted)}>
															<span>{city}, {state}, {country} {start} {end}</span>
														</div>
														<div className={cx(s.spaceTop2, s.previewLink)}><FormattedMessage {...messages.viewMessage} /></div>
													</div>
												</Link>
											</div>
											<div className={cx(s.displayTableCell, s.displayBlock, s.btnWidth)}>
												{
													messageType == 'requestToBook' && (status == 'inquiry' || status == 'requestToBook') && this.label("bookingRequest")
													|| messageType == 'requestToBook' && (status == 'completed') && this.label("completed") ||
													this.label(status)
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapState = (state) => ({
	account: state.account.data
});

const mapDispatch = {
	readMessage
};


export default compose(
	injectIntl,
	withStyles(s),
	connect(mapState, mapDispatch),
	graphql(GetAllThreadQuery, {
		name: 'GetAllThreads',
		options: {
			ssr: false,
			pollInterval: 5000,
			fetchPolicy: 'network-only',
		}
	})
)(InboxItem);
