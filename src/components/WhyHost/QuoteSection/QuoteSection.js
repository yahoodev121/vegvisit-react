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
import s from './QuoteSection.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';

// Images
import qutoimage from './quto.jpg';
import capinetImage from './cabinet.jpg';


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
      <Grid fluid className={s.container}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={cx(s.seperator, s.boxseperator)}></div>
            <div className={s.mainhedding}>
              <h1><FormattedMessage {...messages.withVegVisits} /></h1>
            </div>
            <div className={s.quotesection}>
              <div className={cx(s.contentarea, s.leftsidecontent)}>
                <div className={s.padding5}>
                  <h2 className={s.quotesectionH2}>
                    <FormattedMessage {...messages.quoteSection1} />
                  </h2>
                  <p className={s.subtext}>
                    <FormattedMessage {...messages.quoteSection2} />
                  </p>
                </div>
                <div className={s.spaceTop5}>
                  <h2 className={s.quotesectionH2}>
                    <FormattedMessage {...messages.quoteSection3} />
                  </h2>
                  <ul className={s.listSection}>
                    <li>
                      <FormattedMessage {...messages.quoteSection4} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.quoteSection5} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.quoteSection6} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.quoteSection7} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.quoteSection8} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.quoteSection9} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className={s.imagearea}>
                {/* <Image src={capinetImage} alt="image"  /> */}
                <div className={cx(s.bannerSection, s.bannerOne)} style={{ backgroundImage: `url(${capinetImage})` }} />
              </div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={s.quotesection}>
              <div className={s.imagearea}>
                {/* <Image src={qutoimage} alt="image"  /> */}
                <div className={s.bannerSectionTwo} style={{ backgroundImage: `url(${qutoimage})` }} />
              </div>
              <div className={cx(s.contentarea, s.rightsidecontent)}>
                <h2 className={s.quotesectionH2}><FormattedMessage {...messages.quoteText1} /></h2>
                <p className={s.subtext}>
                  <FormattedMessage {...messages.quotetagline1} />
                </p>
                <div className={s.btnWidth}>
                  <Button className={s.btnlearn} onClick={this.handleClick}>
                    <FormattedMessage {...messages.listYourSpace} />
                  </Button>
                </div>
                <p className={s.linkText}>
                  <FormattedMessage {...messages.quoteSection10} /> <a href={"/page/faq's"}><FormattedMessage {...messages.quoteSection11} />.</a>
                </p>
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
