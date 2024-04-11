import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class ConfirmDocumentVerification extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      verificationStatus: PropTypes.string.isRequired,
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
      textColor: '#0074c2',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px'
    };

    const tagStyle = {
      color: '#0074c2',
    }

    const centerText = {
      textAlign: 'center'
    }

    const { content: { verificationStatus, name } } = this.props;
    let verificationURL = url + `/user/verification`;

    return (
      <Layout>
        {/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
        {
          (verificationStatus === 'approved') &&

          <Body textStyle={textStyle}>
            <div>
              Hi {name},
          </div>
            {/* <EmptySpace height={20} />
          <div>
            Welcome to {sitename}!
          </div> */}
            <EmptySpace height={20} />
            <div>
              Thank you for submitting your photo ID. It has just been approved, and your profile now reflects this additional verification.
          </div>
            <EmptySpace height={40} />
            <div style={centerText}>
              <a style={buttonStyle} href={verificationURL}>Check your profile</a>
            </div>
            <EmptySpace height={30} />
            <div>
              Thanks! <br />
              The {sitename} Team
          </div>
          </Body>
        }

        {
          (verificationStatus === 'rejected') && <Body textStyle={textStyle}>
            <div>
              Hi {name},
          </div>
            {/* <EmptySpace height={20} />
          <div>
            Welcome to {sitename}!
          </div> */}
            <EmptySpace height={20} />
            <div>
              Thank you for submitting your photo ID. Having it verified really helps strengthen your profile, and makes traveling or hosting a lot easier.
          </div>
            <EmptySpace height={20} />
            <div>
              Unfortunately, it has been rejected at this time. There could be a few reasons for this, but please email <a style={tagStyle}>team@vegvisits.com</a>, so we can help you get it all straightened out.
          </div>
            <EmptySpace height={40} />
            <div style={centerText}>
              <a style={buttonStyle} href={verificationURL}>Check your profile</a>
            </div>
            <EmptySpace height={30} />
            <div>
              Thanks! <br />
              The {sitename} Team
          </div>
          </Body>
        }


        <Footer />
        <EmptySpace height={20} />
      </Layout>
    );
  }

}

export default ConfirmDocumentVerification;