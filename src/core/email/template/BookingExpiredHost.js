import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import moment from 'moment';
import 'moment-timezone';

class BookingExpiredHost extends Component {
	static propTypes = {
		content: PropTypes.shape({
			guestName: PropTypes.string.isRequired,
			hostName: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
      threadId: PropTypes.number.isRequired,
      checkIn: PropTypes.object.isRequired,
      checkOut: PropTypes.object.isRequired,
      total: PropTypes.number.isRequired,
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

		const tagStyle = {
			color: '#0074c2',
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

		const { content: { hostName, guestName, listTitle, listTimeZone, confirmationCode, threadId, checkIn, checkOut, total } } = this.props;
		// let messageURL = url + '/message/' + threadId + '/host';
    const inboxURL = url + '/inbox/host';
    const messageURL = url + '/message/' + threadId + '/host';
    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';

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
                    We noticed that you didn’t respond to a booking request for {listTitle} from {checkInDate} - {checkOutDate} within the required 24 hour time period. You can review all of your past messages from guests <a href={inboxURL}>here</a> to see what you’ve missed!
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    If your place is still available, ask {guestName} to submit another booking request through your accommodation’s listing page. Once it’s approved by you, {guestName}
                    {total > 0 && <span> will then be able to pay and complete the booking.</span>}
                    {!total && <span>’s booking will be confirmed.</span>}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    <a href={messageURL} style={buttonStyle}>Message {guestName}</a>
                  </div>
                  <EmptySpace height={30} />
                  <div>
                    If your place is unavailable, it’s always better to respond by declining the booking request rather than not answer at all. This way the guest knows to look for another place to stay. Lastly, if you’re no longer hosting, please un-list or delete your listing, as we like to keep all our accommodations up-to-date for travelers 😊.
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    If you have any questions, just reply to this email - we’re always here to help!
                  </div>
                  <EmptySpace height={40} />
                  <div>
                    Thanks! <br />
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

export default BookingExpiredHost;
