import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Button,
  Form,
  Row, FormGroup,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Rating.css';

// Components
import StarRating from '../../StarRating';
// import ListCoverPhoto from '../../ListCoverPhoto';
import Avatar from '../../Avatar';

import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

class GuestDetails extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    data: PropTypes.shape({
      firstName: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      profileId: PropTypes.string.isRequired
    }),
  };

  render() {
    const { data: { firstName, lastName, picture, profileId } } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <div className={cx(s.content)}>
          <Avatar
            source={picture}
            height={190}
            width={190}
            className={s.imgResponsive}
          />
        </div>
        <h1 className={cx(s.titleText, s.space1)}>
          <Link to={"/users/show/" + profileId}>{firstName}</Link>
        </h1>
      </div>
    );
  }
}


export default injectIntl(withStyles(s)(GuestDetails));
