import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './VegConnect.css';
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

//local
import one from './one.png';
import two from './two.png';
import three from './three.png';
import four from './four.png';
import five from './five.png';
import six from './six.png';
import seven from './seven.png';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

//local
import messages from '../../../locale/messages';

class VegConnect extends React.Component {




  render() {

    return (
      <Grid fluid>
        <div className={s.bg}>
          <p className={s.content}>
            “<FormattedMessage {...messages.vegConnetDesc} />”
           </p>
          <div className={s.images}>
            <div className={cx(s.displayTable, s.displayMobile)}>
              <div className={s.displatRow}>
                <div className={cx(s.displayTableCell)}>
                  <img src={one} />
                </div>
                <div className={cx(s.displayTableCell)}>
                  <img src={two} className={s.marginMobile} />
                </div>
                <div className={cx(s.displayTableCell)}>
                  <img src={three} />
                </div>
                <div className={cx(s.displayTableCell)}>
                  <img src={four} className={s.petaimg} />
                </div>
              </div>
              <div className={s.displatRow}>
                <div className={cx(s.displayTableCell)}>
                  <img src={five}/>
                </div>
                <div className={cx(s.displayTableCell)}>
                  <img src={six} className={s.marginMobile}/>
                </div>
                <div className={cx(s.displayTableCell)}>
                  <img src={seven}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    );
  }
}

export default withStyles(s)(VegConnect);
