import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import Slider from "react-slick";
import Avatar from "../../Avatar/Avatar";
import s from "./Reviews.css";
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
import messages from "../../../locale/messages";

class Reviews extends React.Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 7000,
      
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0,

      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    return (
      <Grid fluid>
        <Slider {...settings} className="reviewSlider">
          <div className={cx("col-md-12 col-sm-12 col-xs-12")}>
            <div className={s.item}>
              <div className={s.reviewBox}>
                <div className={s.content}>
                  <p>
                    "Nicholas is an amazing person and was a perfect guest. For the time he was here, <b>it was like having a good friend around</b>"
                  </p>
                </div>
              </div>
              <div className={s.authorWrapper}>
                <Avatar
                  isUser
                  type={"small"}
                  height={50}
                  width={50}
                  className={s.userAvatar}
                />
                <h4>Chris, Portland, OR, USA</h4>
                <p>Vegvisits host</p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-12 col-sm-12 col-xs-12")}>
            <div className={s.item}>
              <div className={s.reviewBox}>
                <div className={s.content}>
                  <p>
                    "It is rare to meet someone who lives their values and Pam certainly does… <b>I’m so thankful our paths crossed and was blessed (blissed) to have met and hosted her.</b>"
                  </p>
                </div>
              </div>
              <div className={s.authorWrapper}>
                <Avatar
                  isUser
                  type={"small"}
                  height={50}
                  width={50}
                  className={s.userAvatar}
                />
                <h4>Nancy, New York, USA</h4>
                <p>Vegvisits host</p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-12 col-sm-12 col-xs-12")}>
            <div className={s.item}>
              <div className={s.reviewBox}>
                <div className={s.content}>
                  <p>
                    "Zarah was the perfect guest, super friendly, respectful and <b>has turned out to be a great friend</b>. I’d have her again for free!"
                  </p>
                </div>
              </div>
              <div className={s.authorWrapper}>
                <Avatar
                  isUser
                  type={"small"}
                  height={50}
                  width={50}
                  className={s.userAvatar}
                />
                <h4>Mandie, UK</h4>
                <p>Vegvisits host</p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-12 col-sm-12 col-xs-12")}>
            <div className={s.item}>
              <div className={s.reviewBox}>
                <div className={s.content}>
                  <p>
                    "<b>Alex made me feel like I was actually at home</b>. Very friendly and the trouble taken to see I ate well was beyond first class. If <b>you’re interested in vegan food or curious there would be nowhere better to stay</b>."
                  </p>
                </div>
              </div>
              <div className={s.authorWrapper}>
                <Avatar
                  isUser
                  type={"small"}
                  height={50}
                  width={50}
                  className={s.userAvatar}
                />
                <h4>Joseph, UK</h4>
                <p>Vegvisits guest</p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-12 col-sm-12 col-xs-12")}>
            <div className={s.item}>
              <div className={s.reviewBox}>
                <div className={s.content}>
                  <p>
                    "We had a fantastic stay at The Lodge, and being new to vegan food, it was a <b>great experience in which to get fully immersed</b>"
                  </p>
                </div>
              </div>
              <div className={s.authorWrapper}>
                <Avatar
                  isUser
                  type={"small"}
                  height={50}
                  width={50}
                  className={s.userAvatar}
                />
                <h4>Nathan, England, GB</h4>
                <p>Vegvisits guest</p>
              </div>
            </div>
          </div>
        </Slider>
      </Grid>
    );
  }
}

export default withStyles(s)(Reviews);
