import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label,
  Image,
} from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ImageBanner.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';

// Images
import centerImage from './fullimage.jpg';
import quotesImage from './quotes.png'


class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
    siteName: PropTypes.string.isRequired
  };

  render() {
    const { refer, siteName } = this.props;


    return (
      <Grid fluid className={s.container}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className={s.quoteImgSection}>
                <img src={quotesImage} className={s.quoteImg} />
              </div>
              <div className={s.mainSection}>
                <p className={s.descriptionText}>
                  <FormattedMessage {...messages.imageBanner1} />
                </p>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className={s.centerimgsection}>
                <div className={s.bannerSection} style={{ backgroundImage: `url(${centerImage})` }} />
              </div>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapState = state => ({
  siteName: state.siteSettings.data.siteName

});

const mapDispatch = {
};

export default withStyles(s)(connect(mapState, mapDispatch)(SocialLogin));
