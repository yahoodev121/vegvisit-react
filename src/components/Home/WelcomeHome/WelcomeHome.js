import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./WelcomeHome.css";
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

import image from "./image.png";

class WelcomeHome extends React.Component {
  render() {
    return (
      <Grid fluid>
        <h1 className={s.sectionTitle}>Welcome Home</h1>
        <Row className={s.paddingTop}>
          <Col lg={7} md={7} sm={7} xs={12}>
            <div className={s.WelcomeHomeDescription}>
              <div className={cx("hidden-xs")}>
                <p>
                  We're not just an ordinary travel community. We're a
                  plant-based one. A second family, made up of kindred spirits
                  who respect you, support you, hell, even downright admire you.
                  Whether you've been vegan for years or just trying out the
                  plant-based thing, you've come to the right spot.
                </p>
                <p>
                  Maybe you're looking for a place to relax and just be (and
                  eat) without worry, or perhaps you're planning a retreat that
                  will set you on the path to greener pastures (or gardens).
                  Vegvisits is a community where amazing travel experiences take
                  place, fueled by mutual trust and understanding. If you travel
                  with us, your host just gets you. If you host with us, your
                  guest appreciates you. And the rest is magic.
                </p>
              </div>
              <div className={cx("hidden-lg hidden-md hidden-sm")}>
                <p>
                  We're not just an ordinary travel community. We're a
                  plant-based one. A second family, made up of kindred spirits
                  who respect you, support you. Hell, even downright admire you.
                  Whether you've been vegan for years or just trying out the
                  plant-based thing, you've come to the right spot.
                </p>
                <p>
                  Maybe you're looking for a place to relax and just be (and
                  eat) without worry, or perhaps you're planning a retreat that
                  will set you on the path to greener pastures (or gardens).
                  Vegvisits is a community where amazing travel experiences take
                  place, fueled by mutual trust and understanding. If you travel
                  with us, your host just gets you. If you host with us, your
                  guest appreciates you. And the rest is magic.
                </p>
              </div>
              <div className={s.linkWrapper}>
                <a
                  href={"/about-us"}
                  className={cx(
                    s.btn,
                    s.btnPrimary,
                    s.btnRound,
                    s.btnLearnMore
                  )}
                >
                  <FormattedMessage {...messages.learnMore} />
                </a>
              </div>
            </div>
          </Col>
          <Col lg={5} md={5} sm={5} xs={12} className={s.welcomeImageWrapper}>
            <img src={image} className={cx(s.welcomeImage)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(s)(WelcomeHome);
