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
import s from './OverlayImageBanner.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';

// History
import history from '../../../core/history';



class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
    siteName: PropTypes.string.isRequired
  };


  handleClick() {
    history.push('/become-a-host?mode=new');
}

  render() {
    const { refer, siteName } = this.props;


    return (



      <Grid fluid className={s.overlayImageSection}>
          <Row className={s.overmobile}>
            <div className={s.overlayBg}>
              <div className={s.overlayContent}>
                <h2>Ready to earn?</h2>
                <Button className={s.brnStarted} onClick={this.handleClick} >Get started</Button>
              </div>
            </div>
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
