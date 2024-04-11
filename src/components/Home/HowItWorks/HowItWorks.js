import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HowItWorks.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Carousel,
} from 'react-bootstrap';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../locale/messages';

//local
import iconOne from './location-pin.png';
import iconTwo from './air-freight.png';
import iconThree from './review.png';

// History
import history from '../../../core/history';


class HowItWorks extends React.Component {

  // handleClick() {
  //   history.push('/become-a-host?mode=new');
  // }
  handleClick() {
    history.push('/whyhost');
  }
  


  render() {

    return (
      <Grid fluid>
        <div className={s.howItWork}>
          <div className={s.heading}>
            <h1><FormattedMessage {...messages.howItWorkTitle} /></h1>
            <p><FormattedMessage {...messages.howItWorkSubTitle} /></p>
          </div>
          <div className={s.sectionTwo}>
            <div className={s.displayFlex}>
              <Col lg={4} md={4} sm={4} xs={12} className={s.rightBorder}>
                <div className={s.left}>
                  <img src={iconOne} />
                  <div className={s.innerHeading}><FormattedMessage {...messages.howItWorkSubOne} /></div>
                  <div className={s.innerContent}><FormattedMessage {...messages.howItWorkDesc1} /></div>
                </div>
              </Col>
              <Col lg={4} md={4} sm={4} xs={12} className={s.rightBorder}>
                <div className={s.left}>
                  <img src={iconTwo} />
                  <div className={s.innerHeading}><FormattedMessage {...messages.howItWorkSubTwo} /></div>
                  <div className={s.innerContent}><FormattedMessage {...messages.howItWorkDesc2} /></div>
                </div>
              </Col>
              <Col lg={4} md={4} sm={4} xs={12}>
                <div className={s.leftNoBorder}>
                  <img src={iconThree} />
                  <div className={s.innerHeading}><FormattedMessage {...messages.howItWorkSubThree} /></div>
                  <div className={s.innerContent}><FormattedMessage {...messages.howItWorkDesc3} /></div>
                </div>
              </Col>
            </div>
          </div>
          <div className={s.buttons}>
            <div className={s.explore}>
              <Button>
                <a href="/s" className={s.linkText}><FormattedMessage {...messages.howItWorkBtnOne} /></a>
              </Button>
            </div>
            <div className={cx(s.becomeaHost, s.responsiveMargin)}>
              <Button onClick={this.handleClick}>
                <FormattedMessage {...messages.howItWorkBtnTwo} />
              </Button>
            </div>
          </div>
        </div>
      </Grid>
    );
  }
}

export default withStyles(s)(HowItWorks);
