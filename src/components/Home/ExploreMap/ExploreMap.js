import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ExploreMap.css";
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
} from "react-bootstrap";

// Translation
import { FormattedMessage, injectIntl } from "react-intl";

//local
import messages from "../../../locale/messages";

import map from "./map.png";

class ExploreMap extends React.Component {
  render() {
    return (
      <div>
        <h1 className={s.sectionTitle}>Explore Vegvisits in <span className={s.nowrap}>80+ Countries</span></h1>
        <p className={s.sectionDescription}>
          From bustling city spots to serene nature retreats, all with the touch
          of vegan and vegetarian locals
        </p>
        <img src={map} className={cx(s.mapImage)} />
      </div>
    );
  }
}

export default withStyles(s)(ExploreMap);
