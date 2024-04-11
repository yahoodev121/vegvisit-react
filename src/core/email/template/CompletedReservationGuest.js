import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class CompletedReservationGuest extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      reservationId: PropTypes.number.isRequired,
      hostName: PropTypes.string.isRequired,
      hostLastName: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      guestEmail: PropTypes.string.isRequired,
      guestLastName: PropTypes.string.isRequired,
      guestLocation: PropTypes.string.isRequired,
      guestProfilePic: PropTypes.string.isRequired,
      guestJoinedDate: PropTypes.string.isRequired,
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
      borderColor: '#439a45',
      backgroundColor: '#439a45',
      color: '#ffffff',
      borderTopWidth: '1px',

    }
    const tagStyle = {
      color: '#0074c2',
    }

    const bookingTitle = {
      paddingBottom: '20px',
      fontWeight: 'bold',
      fontSize: '20px',
      lineHeight: '25px',
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
    }

    const centerText = {
			textAlign:'center'
      }
      
    const { content: { reservationId } } = this.props;
    const { content: { guestName, guestLastName, guestLocation, guestProfilePic, guestEmail } } = this.props;
    const { content: { hostName, hostLastName, hostProfilePic, listTitle, hostJoinedDate, hostLocation } } = this.props;
    // let guestJoinedYear = guestJoinedDate != null ? moment(guestJoinedDate).format('YYYY') : '';
    let hostJoinedYear = hostJoinedDate != null ? moment(hostJoinedDate).format('YYYY') : '';
    let imageURL;
    if (hostProfilePic) {
      imageURL = avatarBaseUrl() + 'medium_' + hostProfilePic;
    }

    let messageURL = url + '/review/write/' + reservationId;

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
                    We hope you had an amazing trip!
                    </h1>
                  <EmptySpace height={20} />
                  <div>
                    Please help {hostName} and the Vegvisits community by leaving a review. Reading your feedback will help other travelers make a more educated decision when deciding whether to book {hostName}’s space. It’ll only take a few minutes, we promise!
                  </div>
                  <EmptySpace height={30} />
                  <div>
                    <a href={messageURL} style={buttonStyle}>Write a Review</a>
                  </div>

                  <EmptySpace height={20} />
                  <div>
                    Post your pictures from your trip on Instagram or Facebook with #Vegvisits to be featured on our page! Also, if you’re inspired to write about your travel experience for the Vegvisits Blog, reply to this email - we’d really love to hear from you!
                  </div>
                  <EmptySpace height={20} />
                </TD>
              </TR>
            </TBody>
          </Table>
          <EmptySpace height={20} />
        </div>
        <Footer />
        <EmptySpace height={20} />
      </Layout>
    );
  }

}

export default CompletedReservationGuest;