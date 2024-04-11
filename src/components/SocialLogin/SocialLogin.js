import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
 Image
} from 'react-bootstrap';
import cx from 'classnames';
import s from './SocialLogin.css';
import { FormattedMessage } from 'react-intl';
// Locale
import messages from '../../locale/messages';
import googleIcon from './googleIcon.png'


class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string
  };

  render() {
    const { refer } = this.props;
    let FbURL = '/login/facebook';
    let GoogleURL = '/login/google';
    if (refer) {
      FbURL = '/login/facebook?refer=' + refer;
      GoogleURL = '/login/google?refer=' + refer;
    }

    return (
      <div>
        <div className={s.formGroup}>

          <a className={s.facebook} href={FbURL}>
            <svg
              className={s.icon}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z"
              />
            </svg>
            <FormattedMessage {...messages.facebookLogin} />
          </a>
        </div>

        <div className={s.formGroup}>
          <a className={cx(s.google)} href={GoogleURL}>
           <div className={s.googleIcon}>
           <Image src={googleIcon} responsive/>
           </div>
            {/* <svg
              className={s.icon}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={'M30 13h-4V9h-2v4h-4v2h4v4h2v-4h4m-15 2s-2-1.15-2-2c0 0-.5-1.828 1-3 ' +
              '1.537-1.2 3-3.035 3-5 0-2.336-1.046-5-3-6h3l2.387-1H10C5.835 0 2 3.345 2 7c0 ' +
              '3.735 2.85 6.56 7.086 6.56.295 0 .58-.006.86-.025-.273.526-.47 1.12-.47 1.735 ' +
              '0 1.037.817 2.042 1.523 2.73H9c-5.16 0-9 2.593-9 6 0 3.355 4.87 6 10.03 6 5.882 ' +
              '0 9.97-3 9.97-7 0-2.69-2.545-4.264-5-6zm-4-4c-2.395 0-5.587-2.857-6-6C4.587 ' +
              '3.856 6.607.93 9 1c2.394.07 4.603 2.908 5.017 6.052C14.43 10.195 13 13 11 ' +
              '13zm-1 15c-3.566 0-7-1.29-7-4 0-2.658 3.434-5.038 7-5 .832.01 2 0 2 0 1 0 ' +
              '2.88.88 4 2 1 1 1 2.674 1 3 0 3-1.986 4-7 4z'}
              />
            </svg> */}
            <FormattedMessage {...messages.googleLogin} />
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SocialLogin);
