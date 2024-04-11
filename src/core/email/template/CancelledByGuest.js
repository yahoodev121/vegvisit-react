import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import CurrencyView from '../modules/CurrencyView';

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class CancelledByGuest extends Component {
	static propTypes = {
		content: PropTypes.shape({
			hostName: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
			payoutToHost: PropTypes.number.isRequired,
			currency: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired,
			hostJoinedDate: PropTypes.string.isRequired,
			hostLocation: PropTypes.string.isRequired,
			hostProfilePic: PropTypes.string.isRequired,
      cancellationPolicy: PropTypes.string.isRequired,
      reservationId: PropTypes.number.isRequired,
      threadId: PropTypes.number.isRequired,
		}).isRequired
	};

	render() {
		const textStyle = {
			color: '#484848',
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px',
		};

		const userName = {
			color: '#565a5c',
			fontSize: '26px',
			fontWeight: 'bold',
			paddingBottom: '5px',
		};
		const profilePic = {
			borderRadius: '999px',
			margin: '0',
			padding: '0',
			lineHeight: '150%',
			borderSpacing: '0',
			width: '125px'
		}
		const centerText = {
			textAlign: 'center'
    }
    
    const linkText = {
      color: '#56aa4eff',
      fontSize: '18px',
      textDecoration: 'none',
      cursor: 'pointer',
    }

    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: '#5DAD41',
      backgroundColor: '#5DAD41',
      color: '#ffffff',
      borderTopWidth: '1px',
    }

		const { content: { guestName, hostName, confirmationCode, checkIn, checkOut, listTitle, listTimeZone, payoutToHost, currency, message, cancellationPolicy, reservationId, threadId } } = this.props;
    const { content: { hostJoinedDate, hostLocation, hostProfilePic } } = this.props;
    
    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';
    const receiptURL = url + '/users/trips/receipt/' + reservationId;
    const messageURL = url + '/message/' + threadId + '/host';

		let hostJoinedYear = hostJoinedDate != null ? moment(hostJoinedDate).format('YYYY') : '';
		let momentStartDate = moment(checkIn).startOf('day');
		let today = moment();
		let interval = momentStartDate.diff(today, 'days');
		let isPastDay = false;
		if (interval < 0) {
			isPastDay = true;
		}
		let imageURL;
		if (hostProfilePic) {
			imageURL = avatarBaseUrl() + 'medium_' + hostProfilePic;
		}


		return (
			<Layout>
				{/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
				<div>
					<Table width="100%" >
						<TBody>
							<TR>
								<TD style={textStyle}>
									<EmptySpace height={20} />
									<div>
										Hi {hostName}!
			        				</div>
									<EmptySpace height={20} />
									<div>
										We're really sorry to let you know that {guestName}'s reservation for {listTitle} from {checkInDate} - {checkOutDate} has been cancelled.{' '}
                    As per your {cancellationPolicy} cancellation policy, you can view your updated payout <a href={receiptURL} style={linkText}>here</a>.
										<EmptySpace height={20} />
										<div>
											<b>Message from {guestName}:</b>
										</div>
										<EmptySpace height={20} />
										<div>
											{message}
										</div>
                    <EmptySpace height={20} />
                    <div>
                      <a href={messageURL} style={buttonStyle}>Reply Back</a>
                    </div>
                    <EmptySpace height={30} />
                    <div>
                      Your calendar has been updated to show that the previously booked dates are now available. We’re sorry it didn’t work out, and hope that you can host again soon!
                    </div>
									</div>
									<EmptySpace height={40} />
									<div>
										Thanks for your understanding, <br />
										The {sitename} Team
			        		</div>
								</TD>
							</TR>
						</TBody>
					</Table>
					<EmptySpace height={40} />
				</div>
				<Footer />
				<EmptySpace height={20} />
			</Layout>
		);
	}
}

export default CancelledByGuest;
