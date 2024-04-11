import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import { first } from 'rxjs/operators';

class ConfirmEmail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      token: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  };

  render() {
    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'normal',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: '#5DAD41',
      backgroundColor: '#5DAD41',
      color: '#ffffff',
      borderTopWidth: '1px',
    };

    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px'
    };
    const { content: { token, email, name } } = this.props;
    const { content: { bookingListing, bookingStartDate, bookingEndDate, bookingGuests, bookingMessageType, bookingPreApprove, resendWhileBooking } } = this.props;
    let verificationURL = url + `/user/verification?confirm=${token}&email=${email}`;
    let firstName = name && typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : '';
    const bookingDataAvailable = 
      (bookingMessageType === 'requestToBook' && bookingListing && bookingStartDate && bookingEndDate && bookingGuests && typeof(bookingPreApprove) === 'boolean') ||
      (bookingMessageType === 'inquiry' && bookingListing);
    let verificationAndContinueURL;
    if (bookingDataAvailable) {
      if (bookingMessageType === 'requestToBook') {
        verificationAndContinueURL = verificationURL+'&bookingListing='+bookingListing+'&bookingStartDate='+bookingStartDate+'&bookingEndDate='+bookingEndDate+'&bookingGuests='+bookingGuests+'&bookingMessageType='+bookingMessageType+'&bookingPreApprove='+bookingPreApprove;
      } else if (bookingMessageType === 'inquiry') {
        verificationAndContinueURL = verificationURL+'&bookingListing='+bookingListing+'&bookingMessageType='+bookingMessageType;
      }
    }
    
    return (
      <Layout>
        {/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
        <Body textStyle={textStyle}>
          <div>
            Hi{firstName ? ' ' + firstName : ''},
          </div>
          <EmptySpace height={20} />
          <div>
            Welcome to {sitename}! In order to get started, you need to confirm your email address.
          </div>
          <EmptySpace height={20} />
          <div>
            <a style={buttonStyle} href={resendWhileBooking && bookingDataAvailable ? verificationAndContinueURL : verificationURL}>Confirm my email</a>
          </div>
          {!resendWhileBooking && bookingDataAvailable &&
            <span>
              <EmptySpace height={20} />
              <div>
                If you're in the middle of a booking request or sending a message, click here:
              </div>
              <EmptySpace height={20} />
              <div>
                <a style={buttonStyle} href={verificationAndContinueURL}>Confirm my email and continue on</a>
              </div>
            </span>
          }
          <EmptySpace height={30} />
          <div>
            Thanks! <br />
            The {sitename} Team
          </div>
        </Body>
        <Footer />
        <EmptySpace height={20} />
      </Layout>
    );
  }

}

export default ConfirmEmail;