import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import CurrencyView from '../modules/CurrencyView';

class NewInquiry extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      receiverName: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
      senderName: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkout: PropTypes.string.isRequired,
      personCapacity: PropTypes.number.isRequired,
      listTimeZone: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '15px',
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
    const { content: { checkIn, checkOut, personCapacity, listTitle, listTimeZone, total, currency } } = this.props;
    let messageURL = url + '/message/' + threadId + '/guest';
    if (type === "host") {
      messageURL = url + '/message/' + threadId + '/host';
    }

    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';

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
                    You’ve got a new booking inquiry from {senderName}!
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
                  {total > 0 && <EmptySpace height={20} />}
                  {total > 0 && <div>
                    <b>Total Earnings:</b> <CurrencyView amount={total} currency={currency} />
                  </div>}
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
                    <a href={messageURL} style={buttonStyle}>Respond to {senderName}</a>
                  </div>
                  <EmptySpace height={5} />
                  <p style={textStyle}>
                    Reply to {senderName} by clicking the button above. If your place is available, you’ll have the option to pre-approve the booking. If not, it’s always nice to send a quick message back so {senderName} knows to keep looking. (Do not reply to this email directly or your message will go to our team’s inbox instead of to {senderName} 😉.)
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

export default NewInquiry;