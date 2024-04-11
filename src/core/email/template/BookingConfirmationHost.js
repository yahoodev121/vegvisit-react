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
import { checkInData } from '../../../helpers/timeHelper';
import { generateCheckInString } from '../../../helpers/checkInHelper'
import { url, sitename } from '../../../config';

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class BookingConfirmationHost extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      reservationId: PropTypes.number.isRequired,
      threadId: PropTypes.number.isRequired,
      confirmationCode: PropTypes.number,
      guestName: PropTypes.string.isRequired,
      guestEmail: PropTypes.string.isRequired,
      guestLastName: PropTypes.string.isRequired,
      guestLocation: PropTypes.string.isRequired,
      guestProfilePic: PropTypes.string.isRequired,
      guestJoinedDate: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      guests: PropTypes.number.isRequired,
      allowedCheckInTime: PropTypes.string.isRequired,
      allowedCheckOutTime: PropTypes.string.isRequired,
      guestContactNumber: PropTypes.number.isRequired,
      listTimeZone: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '10px',
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

    const profilePic = {
      borderRadius: '999px',
      margin: '0',
      padding: '0',
      lineHeight: '150%',
      borderSpacing: '0',
      width: '125px'
    }

    const userName = {
      color: '#565a5c',
      fontSize: '26px',
      fontWeight: 'bold',
      paddingBottom: '5px',
    }

    const subTitle = {
      color: '#565a5c',
      fontSize: '18px',
      fontWeight: 'bold',
      paddingBottom: '5px',
    }

    const linkText = {
      color: '#56aa4eff',
      fontSize: '18px',
      textDecoration: 'none',
      cursor: 'pointer',
    }

    const space = {
      paddingBottom: '20px',
      verticalAlign: 'top'
    }
    
    
    const { content: { reservationId, threadId } } = this.props;
    const { content: { guestName, guestLastName, guestLocation, guestProfilePic, guestContactNumber, guestJoinedDate, guestEmail } } = this.props;
    const { content: { checkIn, checkOut, guests, allowedCheckInTime, allowedCheckOutTime, confirmationCode, listTimeZone } } = this.props;

    const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';
    const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('dddd, Do MMM, YYYY') : '';

    let checkInDateShort = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('MMMM Do') : '';
    let guestJoinedYear = guestJoinedDate != null ? moment(moment(guestJoinedDate)).format('YYYY') : '';
    
    let receiptURL = url + '/users/trips/receipt/' + reservationId;
    let messageURL = url + '/message/' + threadId + '/host';
    let imageURL;
    if (guestProfilePic) {
      imageURL = avatarBaseUrl() + 'medium_' + guestProfilePic;
    }

    let hostPage = url + '/page/host';

    return (
      <Layout>
        {/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
        <div>
          <Table width="100%" >
            <TBody>
              <TR>
                <TD style={textStyle}>
                  <EmptySpace height={20} />
                  <h1 style={bookingTitle}>
                    New booking confirmed! <br />
                    <span>{guestName} arrives on </span> <br />
                    <span>{checkInDateShort}</span>
                  </h1>
                  <EmptySpace height={20} />
                  <div>
                    We hope you have an amazing experience hosting {guestName}! Make sure to confirm arrival details before the trip, and feel free to check out our <a href={hostPage}>tips</a> on how you can be a great host!
                    </div>
                  <EmptySpace height={20} />
                  <div>
                    {
                      guestProfilePic && <img style={profilePic} src={imageURL} height={125} />
                    }
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    <span style={userName}>{guestName}</span><br />
                    {guestLocation && <div><EmptySpace height={5} />
                      <span>{guestLocation}</span><br /></div>}
                    <EmptySpace height={1} />
                    <span>{sitename} member since {guestJoinedYear}</span>
                  </div>
                  <EmptySpace height={30} />
                  <div>
                    <a href={messageURL} style={buttonStyle}>Contact Guest</a>
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
                <TD style={space}>
                  <span style={subTitle}>Check In</span><br />
                  <EmptySpace height={10} />
                  <span>{checkInDate}</span><br />
                  <EmptySpace height={1} />
                  <span>
                    {generateCheckInString(allowedCheckInTime, allowedCheckOutTime)}
                  </span>
                </TD>
                <TD style={space}><EmptySpace height={10} /></TD>
                <TD style={space}>
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
                <TD style={space}>
                  <div>
                    <span style={subTitle}>Guests</span><br />
                    <EmptySpace height={10} />
                    <span>{guests}</span>
                  </div>
                </TD>
                <TD><EmptySpace height={10} /></TD>
                {
                (guestEmail || guestContactNumber) &&
                <TD style={space}>
                  <div>
                    <span style={subTitle}>Guest Information</span><br />
                    <EmptySpace height={10} />
                    <span>{guestEmail}</span>
                    <EmptySpace height={10} />
                    <span>{guestContactNumber}</span>
                    <EmptySpace height={10} />
                  </div>
                </TD>
                }
              </TR>
                
              <TR style={textStyle}>
                <TD><EmptySpace height={10} /></TD>
                <TD><EmptySpace height={10} /></TD>
                <TD>
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

export default BookingConfirmationHost;