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
import { generateCheckInString } from '../../../helpers/checkInHelper'
import moment from 'moment';
import 'moment-timezone';

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class BookingConfirmationGuest extends Component {

	static propTypes = {
		content: PropTypes.shape({
			checkIn: PropTypes.any,
			checkOut: PropTypes.any,
			hostName: PropTypes.any,
			guestName: PropTypes.any,
			listTitle: PropTypes.any,
			listCity: PropTypes.any,
			threadId: PropTypes.any,
			hostJoinedDate: PropTypes.any,
			hostLocation: PropTypes.any,
			hostProfilePic: PropTypes.any,
			hostEmail: PropTypes.any,
			hostContactNumber: PropTypes.any,
			allowedCheckInTime: PropTypes.any,
			allowedCheckOutTime: PropTypes.any,
			reservationId: PropTypes.any,
			listState: PropTypes.any,
      listCountry: PropTypes.any,
      listStreet: PropTypes.any,
      listBuildingName: PropTypes.any,
      listZipcode: PropTypes.any,
      listTimeZone: PropTypes.string
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

		const { content: { reservationId, guestName, listTitle, listCity, threadId, listState, listCountry, listStreet, listBuildingName, listZipcode, listTimeZone } } = this.props;
		const { content: { hostName, hostLastName, hostProfilePic, hostJoinedDate, hostLocation } } = this.props;
		const { content: { hostEmail, hostContactNumber } } = this.props;
		const { content: { checkIn, checkOut, allowedCheckInTime, allowedCheckOutTime } } = this.props;

    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';

		let messageURL = url + '/message/' + threadId + '/guest';
		// let contactURL = url + '/message/' + threadId + '/guest';
		let hostJoinedYear = hostJoinedDate != null ? moment(moment(hostJoinedDate)).format('YYYY') : '';
		let imageURL;
		if (hostProfilePic) {
			imageURL = avatarBaseUrl() + 'medium_' + hostProfilePic;
		}

		let receiptURL = url + '/users/trips/receipt/' + reservationId;
		let guestPage = url + '/page/guest';

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
										Hi {guestName},
					        </div>
									<EmptySpace height={20} />
									<div>
										Pack your bags - you're going to {listCity}!
									</div>
									<EmptySpace height={20} />
									<div>
										We hope you have an amazing experience staying at {listTitle}! Before the trip, reach out to your host to discuss arrival details, and feel free to check out some of our <a href={guestPage}>tips</a> on how you can be a great guest!
					        </div>
									<EmptySpace height={20} />
									<div style={centerText}>
										{
											hostProfilePic && <img style={profilePic} src={imageURL} height={125} />
										}
									</div>
									<EmptySpace height={20} />
									<div style={centerText}>
										<span style={userName}>{hostName}</span><br />
										<EmptySpace height={5} />
										{hostLocation != null && hostLocation != '' && hostLocation != undefined && <span>{hostLocation}</span>}
										{hostLocation != null && hostLocation != '' && hostLocation != undefined && <br />}
										{/* <EmptySpace height={3} /> */}
										<span>{sitename} member since {hostJoinedYear}</span>
									</div>

									<EmptySpace height={30} />
									<div style={centerText}>
										<a href={messageURL} style={buttonStyle}>Contact Host</a>
									</div>
									<EmptySpace height={40} />
								</TD>
							</TR>
						</TBody>

					</Table>

					<Table width="100%">
						<TBody>
							{
								(checkInDate || checkOutDate || allowedCheckInTime || allowedCheckOutTime) &&
								<TR style={textStyle}>
									<TD style={chekIN}>
										<span style={subTitle}>Check In</span><br />
										<EmptySpace height={10} />
										<span>{checkInDate}</span><br />
										<EmptySpace height={1} />
										<span>
											{generateCheckInString(allowedCheckInTime, allowedCheckOutTime)}
										</span>
									</TD>
									<TD style={space}><EmptySpace height={10} /></TD>
									<TD style={chekIN}>
										<span style={subTitle}>Check Out</span><br />
										<EmptySpace height={10} />
										<span>{checkOutDate}</span><br />
										<EmptySpace height={1} />
										<span>{
											checkInData
										}</span>
									</TD>
								</TR>
							}


							<TR style={textStyle}>
								{
									(listCity || listState || listCountry) &&
									<TD style={chekIN}>
										<div>
											<span style={subTitle}>Location Address</span><br />
                      <EmptySpace height={10} />
											<span>{listStreet}{listBuildingName ? ', ' + listBuildingName : ''}</span><br />
											<EmptySpace height={10} />
											<span>{listZipcode}{' '}{listCity},{' '}{listState},{' '}{listCountry}</span>
										</div>
									</TD>
								}
								<TD><EmptySpace height={10} /></TD>
								{
									(hostEmail || hostContactNumber) &&
									<TD style={chekIN}>
										<div>
											<span style={subTitle}>Host Information</span><br />
											<EmptySpace height={10} />
											<span>{hostEmail}</span><br />
											<EmptySpace height={10} />
											<span>{hostContactNumber}</span>
											<EmptySpace height={10} />
										</div>
									</TD>
								}
							</TR>

							<TR style={textStyle}>
								<TD><EmptySpace height={10} /></TD>
								<TD><EmptySpace height={10} /></TD>
								<TD style={centerText}>
									<div>
										<a href={receiptURL} style={linkText}> View Receipt</a>
									</div>
								</TD>
							</TR>

						</TBody>
					</Table>
					<EmptySpace height={50} />
				</div>
				<Footer />
				<EmptySpace height={20} />
			</Layout>
		);
	}
}

export default BookingConfirmationGuest;
