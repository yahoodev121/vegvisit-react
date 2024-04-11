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
} from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './WhyBlock.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';

// Images
import block1 from './fruit1.png';
import block2 from './fruit2.png';
import block3 from './fruit3.png';
import block4 from './fruit4.png';
import block5 from './fruit5.png';
import block6 from './fruit6.png';


class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
    siteName: PropTypes.string.isRequired
  };

  render() {
    const { refer, siteName } = this.props;
    let FbURL = '/login/facebook';
    let GoogleURL = '/login/google';
    if (refer) {
      FbURL = '/login/facebook?refer=' + refer;
      GoogleURL = '/login/google?refer=' + refer;
    }

    return (

      <Grid fluid className={cx(s.whybnb, s.container)}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={s.mainhedding}>
              <h1><FormattedMessage {...messages.hostingBlocktitle} /></h1>
            </div>
            <div className={s.displayFlex}>
              <div className={s.displayInline}>
                <div className={s.imgHeight}>
                  <img src={block1} className={s.imgSection} />
                </div>
                <div>
                  <h3 className={s.subText}>
                    No meat
                  </h3>
                  <p className={s.descriptionText}>
                    Never worry about guests bringing in meat, contaminating your kitchen and filling you home with disagreeable smells.
                  </p>
                </div>
              </div>
              <div className={s.displayInline}>
                <div className={s.imgHeight}>
                  <img src={block2} className={s.imgSection} />
                </div>
                <div>
                  <h3 className={s.subText}>
                    More trust
                  </h3>
                  <p className={s.descriptionText}>
                    Welcome guests into your home that you feel good about. Already having a lot in common makes it all that much easier.
                </p>
                </div>
              </div>
              <div className={s.displayInline}>
                <div className={s.imgHeight}>
                  <img src={block3} className={s.imgSection} />
                </div>
                <div>
                  <h3 className={s.subText}>
                    New friendships
                </h3>
                  <p className={s.descriptionText}>
                    Hosts and guests on Vegvisits meet as strangers but leave as friends, often keeping in touch for years later.
                  </p>
                </div>
              </div>
              <div className={s.displayInline}>
                <div className={s.imgHeight}>
                  <img src={block4} className={s.imgSection} />
                </div>
                <div>
                  <h3 className={s.subText}>
                    Supporting the movement
                </h3>
                  <p className={s.descriptionText}>
                    You can help fellow vegans and vegetarians by providing a space where they really feel at home. No judgements, protein questions, problems finding food, kitchen-sharing nightmares, disgusting smells, etc. And that’s a very cool thing.
                  </p>
                </div>
              </div>
              <div className={s.displayInline}>
                <div className={s.imgHeight}>
                  <img src={block5} className={s.imgSection} />
                </div>
                <div>
                  <h3 className={s.subText}>
                    Making a difference
                  </h3>
                  <p className={s.descriptionText}>
                    Some guests may be transitioning to vegan or vegetarian. Share what you know about plant-based eating and help change lives.
                </p>
                </div>
              </div>
              <div className={s.displayInline}>
                <div className={s.imgHeight}>
                  <img src={block6} className={s.imgSection} />
                </div>
                <div>
                  <h3 className={s.subText}>
                    Giving back
                  </h3>
                  <p className={s.descriptionText}>
                    We want to use what we have to sustain the platform and make it better. But sometimes others need it more than we do. Each year, we plan on giving a percentage of what we make to outreach that spreads awareness of factory farming practices.
                  </p>
                </div>
              </div>
            </div>
            {/* <Col xs={12} sm={6} md={6} lg={6} className={s.whyblock}>
                <h4 className={s.common}><FormattedMessage {...messages.whyblockTitle1} /></h4>
                <p className={s.common}><FormattedMessage {...messages.whyblockdesc1} /></p>
              </Col>

              <Col xs={12} sm={6} md={6} lg={6} className={s.whyblock}>
                <h4 className={s.common}><FormattedMessage {...messages.whyblockTitle2} /></h4>
                <p className={s.common}><FormattedMessage {...messages.whyblockdesc2} /></p>
              </Col> */}
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
