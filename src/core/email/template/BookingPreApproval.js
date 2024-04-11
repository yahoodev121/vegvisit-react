import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import { checkInData } from '../../../helpers/timeHelper';
import moment from 'moment';
import 'moment-timezone';

class BookingPreApproval extends Component {

	static propTypes = {
		content: PropTypes.shape({
			checkIn: PropTypes.any,
			checkOut: PropTypes.any,
			hostName: PropTypes.any,
			guestName: PropTypes.any,
			listTitle: PropTypes.any,
      listCity: PropTypes.any,
      listTimeZone: PropTypes.string,
			threadId: PropTypes.any,
			hostJoinedDate: PropTypes.any,
			hostLocation: PropTypes.any,
			hostProfilePic: PropTypes.any,
			hostEmail: PropTypes.any,
			hostContactNumber: PropTypes.any,
			allowedCheckInTime: PropTypes.any,
			allowedCheckOutTime: PropTypes.any,
			reservationId: PropTypes.any,
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
		const bookingTitle = {
			paddingBottom: '25px',
			fontWeight: 'bold',
			fontSize: '40px',
			lineHeight: '48px',
			margin: '0',
			padding: '0',
			textAlign: 'center'

		}


		const linkText = {
			color: '#56aa4eff',
			fontSize: '16px',
			textDecoration: 'none',
			cursor: 'pointer',
		};

		const profilePic = {
			borderRadius: '999px',
			margin: '0',
			padding: '0',
			lineHeight: '150%',
			borderSpacing: '0',
			width: '125px'
		};

		const subTitle = {
			color: '#565a5c',
			fontSize: '18px',
			fontWeight: 'bold',
			paddingBottom: '5px',
		}

		const userName = {
			color: '#565a5c',
			fontSize: '26px',
			fontWeight: 'bold',
			paddingBottom: '5px',
		}

		const centerText = {
			textAlign: 'center'
		}

		const space = {
			paddingBottom: '20px',
		}

		const chekIN = {
			textAlign: 'center',
			paddingBottom: '20px',
			verticalAlign: 'top'
		}

		const { content: { guestName, listTitle, listCity, listTimeZone, threadId } } = this.props;
		const { content: { checkIn, checkOut } } = this.props;

		let checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
		let checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';
		let messageURL = url + '/message/' + threadId + '/guest';

		return (
			<Layout>
				{/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
				<Body textStyle={textStyle}>
                    <div>
                        Hi {guestName}!
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        Great news! Your request to book {listTitle} in {listCity} from {checkInDate} to {checkOutDate} has been approved! You can now complete your booking!
                        <p>
                          Once you’ve confirmed your reservation, we’ll send an itinerary for your trip, along with your host contact information so you can easily get in touch.
                        </p>
                    </div>
                    <EmptySpace height={30} />
                    <div style={centerText}>
                        <a href={messageURL} style={buttonStyle}>Finish Booking</a>
                    </div>
                    <EmptySpace height={30} />
                    <div>
                        Just a heads up, others can still book for these dates. If this is your first choice, we recommend completing your booking soon to secure your trip!
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        Happy traveling! <br />
                        The {sitename} Team
                    </div>
                </Body>
				<Footer />
				<EmptySpace height={20} />
			</Layout>
		);
	}
}

export default BookingPreApproval;
