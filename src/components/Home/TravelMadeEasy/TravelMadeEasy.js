import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TravelMadeEasy.css';
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

//local
import messages from '../../../locale/messages';

import one from './one.jpg';
import imageOne from './veg.png';
import two from './two.jpg';
import imageTwo from './map.png';
import three from './three.jpg';
import imageThree from './eco.png';


class TravelMadeEasy extends React.Component {




  render() {

    return (
      <Grid fluid>
        <div className={s.travelMade}>
          <div className={s.travelHeading}><FormattedMessage {...messages.travelMadeEasyTitle} /></div>
          <Row className={s.paddingTop}>
            <Col lg={4} md={4} sm={4} xs={12}>
              <div className={s.leftImage} style={{ backgroundImage: `url(${one})` }}>
                <div className={s.centerContent}>
                  <img src={imageOne} />
                  <h1><FormattedMessage {...messages.travelMadeEasyOne} /></h1>
                  <p><FormattedMessage {...messages.travelMadeEasyOneDesc} /></p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={12} className={s.marginTop}>
              <div className={s.leftImage} style={{ backgroundImage: `url(${three})` }}>
                <div className={s.centerContent}>
                  <img src={imageThree} />
                  <h1><FormattedMessage {...messages.travelMadeEasyThree} /></h1>
                  <p><FormattedMessage {...messages.travelMadeEasyThreeDesc} /></p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={12} className={s.marginTop}>
              <div className={s.leftImage} style={{ backgroundImage: `url(${two})` }}>
                <div className={s.centerContent}>
                  <img src={imageTwo} />
                  <h1><FormattedMessage {...messages.travelMadeEasyTwo} /></h1>
                  <p><FormattedMessage {...messages.travelMadeEasyTwoDesc} /><br /> <FormattedMessage {...messages.travelMadeEasyTwoDescSub} /></p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }
}

export default withStyles(s)(TravelMadeEasy);
