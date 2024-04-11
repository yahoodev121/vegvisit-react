import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import {url, sitename} from '../../../config';

class ForgotPasswordEmail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      token: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  };

  render() {

    const linkText = {
      color: '#56aa4eff',
      fontSize: '18px',
      textDecoration: 'none',
      cursor: 'pointer',
    }

    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding:'35px'
    };
    const { content: {token, email, name} } = this.props;
    let verificationURL = url + `/password/verification?token=${token}&email=${email}`;

    return (
      <Layout>
        {/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
        <Body textStyle={textStyle}>
          <div>
            Hi {name},
          </div>
          <EmptySpace height={20} />
          <div>
          We’ve received a request to change the password on your account, and we’re here to help!
          </div>
          <EmptySpace height={20} />
          <div>
          Simply click here to <a href={verificationURL} style={linkText}>Reset your password</a>.
          </div>
          <EmptySpace height={20} />
          <div>
          Don’t worry, if you didn’t request this, your password is still safe and you can ignore this email.
          </div>
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

export default ForgotPasswordEmail;