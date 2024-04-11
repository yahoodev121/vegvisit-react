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

class CancelDetailsHost extends Component {
	static propTypes = {
		content: PropTypes.shape({
			hostName: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
			guestLastName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
			listTitle: PropTypes.string.isRequired,
			refundToGuest: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
      reservationId: PropTypes.number.isRequired,
		}).isRequired
	};

	static defaultProps = {
		content: {
			refundToGuest: 0
		}
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
    
    const linkText = {
      color: '#56aa4eff',
      fontSize: '18px',
      textDecoration: 'none',
      cursor: 'pointer',
    }

    const { content: { guestName, hostName, guestLastName, confirmationCode, checkIn, checkOut, listTitle, listTimeZone, refundToGuest, currency, reservationId } } = this.props;
    
    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';
    const receiptURL = url + '/users/trips/receipt/' + reservationId;

		let momentStartDate = moment(checkIn).startOf('day');
		let today = moment();
		let interval = momentStartDate.diff(today, 'days');
		let isPastDay = false;
		if (interval < 0) {
			isPastDay = true;
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
										This is a confirmation email to let you know that {guestName}’s reservation for {listTitle} from {checkInDate} - {checkOutDate} has been cancelled. You can view your updated payout <a href={receiptURL} style={linkText}>here</a>.
			        		</div>
									<EmptySpace height={20} />
									<div>
                    Just a heads up, after three cancellations in a year we may have to take away hosting privileges. We know it’s not fun trying to find another accommodation last minute, or if you’re a host, expecting a guest that doesn’t show up. So we try our best to keep cancellations at a minimum, and trust that all our members do as well!
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

export default CancelDetailsHost;
