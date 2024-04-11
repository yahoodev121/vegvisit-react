import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Table, TBody, TR, TD} from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import {url, sitename} from '../../../config';

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class CompletedReservationHost extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      reservationId: PropTypes.number.isRequired,
      guestName: PropTypes.string.isRequired,
      guestLastName: PropTypes.string.isRequired,
      guestProfilePic: PropTypes.string.isRequired,
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
      borderColor: '#439a45',
      backgroundColor: '#439a45',
      color: '#ffffff',
      borderTopWidth: '1px',

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
      cursor:'pointer',
    }

    const space={
      paddingBottom:'20px',
    }
    const { content: {reservationId} } = this.props;
    const { content: {guestName, guestLastName,  guestProfilePic} } = this.props;
    let messageURL = url + '/review/write/' + reservationId;
    let imageURL;
    if(guestProfilePic) {
      imageURL = avatarBaseUrl() + 'medium_' + guestProfilePic;
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
                      {
                        guestProfilePic && <img style={profilePic} src={imageURL} height={125} />
                      }
                    </div>
                    <EmptySpace height={20} />
                    <h1 style={bookingTitle}>
                    We hope you enjoyed your experience hosting {guestName}!
                    </h1>
                    <EmptySpace height={20} />
                    <div>
                      Please help {guestName} and the Vegvisits community by leaving a review. Reading your feedback will help others make a more educated decision when deciding whether to host {guestName}. It'll only take a few minutes, we promise!
                    </div>                    
                    <EmptySpace height={20} />
                    <div>
                      <a href={messageURL} style={buttonStyle}>Write a Review</a>
                    </div>
                    <EmptySpace height={30} />
                    <div>
                      Post pictures from your hosting experience on Instagram or Facebook with #Vegvisits to be featured on our page! Also, if you’re inspired to write about being a Vegvisits host for our Blog, let us know by replying to this email. We’d really love to hear from you!
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

export default CompletedReservationHost;



