import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import {Table, TBody, TR, TD} from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import {url, sitename} from '../../../config';
import CurrencyView from '../modules/CurrencyView';

class CancelledByHost extends Component {
    static propTypes = {
		content: PropTypes.shape({
			hostName: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
			guestLastName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
			refundToGuest: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
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

      const { content: {guestName, hostName, guestLastName, confirmationCode, checkIn, checkOut, listTitle, listTimeZone, refundToGuest, currency, message, threadId, reservationId } } = this.props;
      const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
      const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';
      const messageURL = url + '/message/' + threadId + '/guest';
      const receiptURL = url + '/users/trips/receipt/' + reservationId;

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
										We are really sorry to let you know that {hostName} has cancelled your reservation for {listTitle} from {checkInDate} - {checkOutDate}. You'll be refunded the total amount of your trip, or the accommodation fee for the nights not stayed if you've already checked-in. You can view your refund <a href={receiptURL}>here</a>.
			        		</div>
                  <EmptySpace height={20} />
									<div>
                    <b>Message from {hostName}:</b>
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
                    We know how stressful host cancellations can be, with little time to look for another accommodation. To discourage it from happening, we monitor all cancellations on Vegvisits and take away hosting privileges if it gets to be too much. Feel free to reach out if you would like some assistance finding a place to stay. We’ll do our best to help!
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

export default CancelledByHost;
