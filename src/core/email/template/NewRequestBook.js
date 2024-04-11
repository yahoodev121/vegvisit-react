import React from 'react';
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

class NewRequestBook extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      receiverName: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
      senderName: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkout: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
      personCapacity: PropTypes.number.isRequired,
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

    const noteStyle = {
      fontSize: '11px',
    };

    const btnCenter = {
      textAlign: 'center'
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


    const { content: { receiverName, type, senderName, message, threadId } } = this.props;
    const { content: { checkIn, checkOut, personCapacity, listTitle, listTimeZone, total, hostServiceFee, currency } } = this.props;
    // let messageURL = url + '/message/' + threadId + '/guest';
    let messageURL = url + '/message/' + threadId + '/host';
    // if (type === "host") {
    //   messageURL = url + '/message/' + threadId + '/host';
    // }
    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';
    let subtotal = total - hostServiceFee;
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
                    Hi {receiverName},
                    </div>
                  <EmptySpace height={20} />
                  <div>
                    You've got a booking request from {senderName} for {listTitle}! You have 24 hours to accept or decline this request before it expires.
                    </div>
                  <EmptySpace height={20} />
                  <div>
                    <b> Check In:</b> {checkInDate}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    <b> Check Out:</b> {checkOutDate}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    <b> Guests:</b> {personCapacity}
                  </div>
                  {subtotal != 0 && <EmptySpace height={20} />}
                  {subtotal != 0 && <div>
                      <b>Total Earnings:</b> <CurrencyView amount={subtotal} currency={currency} />
                    </div>
                  }
                  {subtotal != 0 && <div>(Due to fluctuations in currency exchange rates, the amount shown is subject to change slightly at the time of booking.)</div>}
                  {message != 'Welcome' && <EmptySpace height={20} />}
                  {message != 'Welcome' && <div>
                    <b> Message:</b>
                  </div>}
                  {message != 'Welcome' && <EmptySpace height={10} />}
                  {message != 'Welcome' && <div>
                    {message}
                  </div>}
                  <EmptySpace height={20} />
                  <div style={btnCenter}>
                    <a href={messageURL} style={buttonStyle}>Accept or Decline</a>
                  </div>
                  <EmptySpace height={5} />
                  <p>
                    Respond to {senderName}’s booking request by clicking the ‘Accept or Decline’ button above. You’ll also be able to send a message if you have any questions before making a decision. (Do not reply to this email directly or your message will go to our team’s inbox instead of to {senderName} 😉)
                  </p>
                  <EmptySpace height={5} />

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

export default NewRequestBook;