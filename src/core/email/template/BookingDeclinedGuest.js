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

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class BookingDeclinedGuest extends Component {
	static propTypes = {
		content: PropTypes.shape({
			hostName: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      listCity: PropTypes.string.isRequired,
      listState: PropTypes.string.isRequired,
      listCountry: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
			hostJoinedDate: PropTypes.string.isRequired,
			hostLocation: PropTypes.string.isRequired,
			hostProfilePic: PropTypes.string.isRequired,
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

		const profilePic = {
			borderRadius: '999px',
			margin: '0',
			padding: '0',
			lineHeight: '150%',
			borderSpacing: '0',
			width: '125px'
		};

		const userName = {
			color: '#565a5c',
			fontSize: '26px',
			fontWeight: 'bold',
			paddingBottom: '5px',
		};

		const centerText = {
			textAlign: 'center'
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

    };

		const { content: { guestName, confirmationCode, checkIn, checkOut, listCity, listState, listTimeZone } } = this.props;
		const { content: { hostName, hostLastName, hostProfilePic, listTitle, hostJoinedDate, hostLocation } } = this.props;
		let hostJoinedYear = hostJoinedDate != null ? moment(hostJoinedDate).format('YYYY') : '';
		let imageURL;
		if (hostProfilePic) {
			imageURL = avatarBaseUrl() + 'medium_' + hostProfilePic;
		}
		const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';
    const searchURL = `${url}/s?address=${listCity},${listState}`;
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
										Hi {guestName}!
					        		</div>
									<EmptySpace height={20} />
									<div>
										{/* We regret to inform you that your host {hostName} declined your request
					          {' '}{confirmationCode} starting on {checkInDate}. As per the cancellation policy
																				you will be refunded and notified. */}
                    We’re sorry to say that {hostName} declined your request to book {listTitle} from {checkInDate} - {checkOutDate}. We’re sure there’s a good reason for it. But if you haven’t already, it helps to complete your user profile and add verifications, so that hosts feel like they know enough about you to open up their home.
										<EmptySpace height={20} />
										Try looking for other accommodations close by, and if you need some assistance in your search, just reply to this email. We’ll do our best to help!
					        </div>
                  <EmptySpace height={30} />
                  <div style={centerText}>
                      <a href={searchURL} style={buttonStyle}>Search Nearby Listings</a>
                  </div>
									{/* <EmptySpace height={20} />
									<div style={centerText}>
										{
											hostProfilePic && <img style={profilePic} src={imageURL} height={125} />
										}
									</div> */}
									{/* <EmptySpace height={20} /> */}
									<div style={centerText}>
										{/* <span style={userName}>{hostName}</span> */}
										
										{/* <EmptySpace height={5} /> 
										<span>{hostLocation}</span><br /> */}
										{/* <EmptySpace height={3} /> */}
										{/* <span>{sitename} member since {hostJoinedYear}</span> */}
									</div>
									<EmptySpace height={20} />
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

export default BookingDeclinedGuest;
