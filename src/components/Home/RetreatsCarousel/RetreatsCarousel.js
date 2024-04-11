import React from "react";
import Slider from "react-slick";
import * as FontAwesome from "react-icons/lib/fa";
import PropTypes from "prop-types";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./RetreatsCarousel.css";
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
} from "react-bootstrap";

// Translation
import { FormattedMessage, injectIntl } from "react-intl";

//local
import messages from "../../../locale/messages";

import NavLink from "../../NavLink";

import img_yoga from "./1_yoga.jpg";
import img_teacher from "./2_teacher training.jpg";
import img_culinary from "./3_culinary.jpg";
import img_wellness from "./4_wellness.jpg";
import img_med from "./5_meditation.jpg";
import img_plant from "./6_plant.png";
import img_spir from "./7_spirituality.jpg";
import img_art from "./8_art.jpg";
import img_adv from "./9_adventure.jpg";

const nextArrowStyle = {
  right: "-25px",
  background: "rgb(0 0 0 / 60%)",
  color: "#fff",
  zIndex: "5",
  width: "50px",
  height: "50px",
  top: "42%",
  fontSize: "40px",
  cursor: "pointer",
  borderRadius: "50%",
  textAlign: "center",
  border: 0,
};

const prevArrowStyle = {
  left: "-17px",
  background: "rgb(0 0 0 / 60%)",
  color: "#fff",
  zIndex: "5",
  width: "50px",
  height: "50px",
  top: "42%",
  fontSize: "40px",
  cursor: "pointer",
  borderRadius: "50%",
  textAlign: "center",
  border: 0,
};

const nextArrowMobileStyle = {
  right: "-20px",
  background: "rgb(0 0 0 / 60%)",
  color: "#fff",
  zIndex: "5",
  width: "40px",
  height: "40px",
  top: "38%",
  fontSize: "40px",
  cursor: "pointer",
  borderRadius: "50%",
  textAlign: "center",
  border: 0,
};

const prevArrowMobileStyle = {
  left: "-12px",
  background: "rgb(0 0 0 / 60%)",
  color: "#fff",
  zIndex: "5",
  width: "40px",
  height: "40px",
  top: "38%",
  fontSize: "40px",
  cursor: "pointer",
  borderRadius: "50%",
  textAlign: "center",
  border: 0,
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={nextArrowStyle} onClick={onClick}>
      <FontAwesome.FaLongArrowRight className={s.navigationIcon} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={prevArrowStyle} onClick={onClick}>
      <FontAwesome.FaLongArrowLeft className={s.navigationIcon} />
    </div>
  );
}

function MobileNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={nextArrowMobileStyle}
      onClick={onClick}
    >
      <FontAwesome.FaLongArrowRight className={s.navigationIcon} />
    </div>
  );
}

function MobilePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={prevArrowMobileStyle}
      onClick={onClick}
    >
      <FontAwesome.FaLongArrowLeft className={s.navigationIcon} />
    </div>
  );
}

class RetreatsCarousel extends React.Component {
  render() {
    const settings = {
      dots: false,
      infinite: false,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 640,
          settings: {
            nextArrow: <MobileNextArrow />,
            prevArrow: <MobilePrevArrow />,
            slidesToShow: 2,
          },
        },
      ],
    };

    const items = [
      {
        title: "Yoga",
        image: img_yoga,
        link: '/s?listType=retreats&category=1'
      },
      {
        title: "Teacher Training",
        image: img_teacher,
        link: '/s?listType=retreats&category=8'
      },
      {
        title: "Culinary",
        image: img_culinary,
        link: '/s?listType=retreats&category=8'
      },
      {
        title: "Wellness",
        image: img_wellness,
        link: '/s?listType=retreats&category=2'
      },
      {
        title: "Meditation",
        image: img_med,
        link: '/s?listType=retreats&category=3'
      },
      {
        title: "Plat medicine",
        id: "id5",
        image: img_plant,
        link: '/s?listType=retreats&category=9'
      },
      {
        title: "Spirituality",
        id: "id5",
        image: img_spir,
        link: '/s?listType=retreats&category=4'
      },
      {
        title: "Art",
        id: "id5",
        image: img_art,
        link: '/s?listType=retreats&category=5'
      },
      {
        title: "Adventure",
        image: img_adv,
        link: '/s?listType=retreats&category=6'
      },
    ];

    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h1 className={s.sectionTitle}>Transformative Retreats</h1>
            <p className={s.sectionDescription}>
              Learn, Move, Recharge, Grow. Oh, the places you can go!
            </p>
            <div className={cx("hidden-xs")}>
              {
                <Slider
                  {...settings}
                  className={cx("row homeSlickSlider", s.sliderMargin)}
                >
                  {items.length > 0 &&
                    items.map((item, index) => {
                      return (
                        <NavLink to={item.link}>
                          <div key={index} className={s.carouselItem}>
                            <div className={s.imageWrapper}>
                              <img src={item.image} className={s.itemImage} />
                            </div>
                            <h3 className={s.itemTitle}>{item.title}</h3>
                          </div>
                        </NavLink>
                      );
                    })}
                </Slider>
              }
            </div>
            <div className={cx("hidden-lg hidden-md hidden-sm")}>
              <Row>
                {items.length > 0 &&
                items.map((item, index) => {
                  return (
                      <Col xs={6} key={index}>
                        <div className={s.mobileGridItem}>
                          <div style={{display: 'inline-block', height: 0, paddingBottom: '100%', width: '100%', background: `url(${item.image})`, backgroundSize: 'cover', borderRadius: '50%'}}>
                            {/*<img src={item.image} className={s.gridItemImage} />*/}
                          </div>
                          <h3 className={s.gridItemTitle}>{item.title}</h3>
                        </div>
                      </Col>
                  );
                })}
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(s)(RetreatsCarousel);
