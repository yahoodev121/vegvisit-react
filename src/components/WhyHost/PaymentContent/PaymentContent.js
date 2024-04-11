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
import s from './PaymentContent.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';

//Images
import block1 from './clock.png';
import block2 from './Money.png';
import block3 from './court.png';
import block4 from './booking.png';




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
        <Row className={s.Paymentsection}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={cx(s.seperator, s.boxseperator)}></div>
            <div className={s.mainhedding}>
              <h1><FormattedMessage {...messages.paymentContenttitle} /></h1>
            </div>
            <div className={s.displayFlex}>
              <div className={s.displayInline}>
                <div className={s.alignCenter}>
                  <img src={block1} className={s.iconSection} />
                </div>
                <div className={s.steps}>
                  <h4 className={s.common}><FormattedMessage {...messages.paymentContentheading1} /></h4>
                  <p className={s.common}><FormattedMessage {...messages.paymentContentdesc1} /></p>
                  <p className={s.common}><FormattedMessage {...messages.paymentSection1} /></p>
                  <ul className={s.listSection}>
                    <li>
                      <FormattedMessage {...messages.paymentSection2} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.paymentSection3} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.paymentSection4} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.paymentSection5} />
                    </li>
                  </ul>
                </div>
              </div>

              <div className={s.displayInline}>
                <div className={s.alignCenter}>
                  <img src={block2} className={s.iconSection} />
                </div>
                <div className={s.steps}>
                  <h4 className={s.common}><FormattedMessage {...messages.paymentContentheading2} /></h4>
                  <p className={s.common}><FormattedMessage {...messages.paymentContentdesc2} /></p>
                  <ul className={s.listSection}>
                    <li>
                      <FormattedMessage {...messages.paymentSection6} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.paymentSection7} />
                    </li>
                  </ul>
                  <p className={s.common}>
                    <FormattedMessage {...messages.paymentSection8} />
                  </p>
                </div>
              </div>

              <div className={s.displayInline}>
                <div className={s.alignCenter}>
                  <img src={block3} className={s.iconSection} />
                </div>
                <div className={s.steps}>
                  <h4 className={s.common}><FormattedMessage {...messages.paymentContentheading3} /></h4>
                  <p className={s.common}><FormattedMessage {...messages.paymentContentdesc3} /></p>
                  {/* <a href="#">Lorem ipsum dolor sit amet</a> */}
                </div>
              </div>

              <div className={s.displayInline}>
                <div className={s.alignCenter}>
                  <img src={block4} className={s.iconSection} />
                </div>
                <div className={s.steps}>
                  <h4 className={s.common}><FormattedMessage {...messages.paymentContentheading4} /></h4>
                  <p className={s.common}><FormattedMessage {...messages.paymentContentdesc4} /></p>
                  {/* <a href="#">Lorem ipsum dolor sit amet</a> */}
                </div>
              </div>
            </div>
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
