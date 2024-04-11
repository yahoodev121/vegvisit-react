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
import s from './CountingSection.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';



class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
    siteName: PropTypes.string.isRequired
  };

  render() {
    const { refer, siteName } = this.props;


    return (



      <Grid>
      <Row className={s.countingsection}>
      <Col xs={12} sm={12} md={12} lg={12}>
        <div className={cx(s.seperator, s.boxseperator)}></div>
        <div className={s.mainhedding}>
          <h1><FormattedMessage {...messages.countingSectiontitle} /></h1>
        </div>
        <Col xs={12} sm={4} md={4} lg={4}>
          <h3>3.9M</h3>
          <p className={s.common}><FormattedMessage {...messages.countingSectiontagline1} /></p>
        </Col>

        <Col xs={12} sm={4} md={4} lg={4}>
          <h3>900K</h3>
          <p className={s.common}><FormattedMessage {...messages.countingSectiontagline2} /></p>
        </Col>

        <Col xs={12} sm={4} md={4} lg={4}>
          <h3>15K</h3>
          <p className={s.common}><FormattedMessage {...messages.countingSectiontagline3} /></p>
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
