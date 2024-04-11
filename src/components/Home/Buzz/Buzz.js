import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Buzz.css";
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

//local
import one from "./one.png";
import two from "./two.png";
import three from "./three.png";
import four from "./four.png";
import five from "./five.png";
import six from "./six.png";
import seven from "./seven.png";

// Translation
import { FormattedMessage, injectIntl } from "react-intl";

//local
import messages from "../../../locale/messages";

class Buzz extends React.Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      arrow: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 7000,

      responsive: [
        {
          breakpoint: 1180,
          settings: {
            slidesToShow: 6,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 5,
          },
        },
        {
          breakpoint: 650,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 510,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 440,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    };
    return (
      <div>
        <div className={s.bg}>
          <h1 className={s.sectionTitle}>See What All the Buzz is About</h1>
          <p className={s.sectionDescription}>
            “<FormattedMessage {...messages.vegConnetDesc} />”
          </p>
        </div>
        <div className={s.images}>
          <Slider {...settings}>
            <div className={cx(s.item)}>
              <img src={one} />
            </div>
            <div className={cx(s.item)}>
              <img src={two} />
            </div>
            <div className={cx(s.item)}>
              <img src={three} />
            </div>
            <div className={cx(s.item)}>
              <img src={four} />
            </div>
            <div className={cx(s.item)}>
              <img src={five} />
            </div>
            <div className={cx(s.item)}>
              <img src={six} />
            </div>
            <div className={cx(s.item)}>
              <img src={seven} />
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Buzz);
