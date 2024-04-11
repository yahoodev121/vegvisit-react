import React from "react";
import Slider from "react-slick";
import * as FontAwesome from "react-icons/lib/fa";
import PropTypes from "prop-types";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ExperienceCarousel.css";
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

import image1 from "./image1.jpg";
import image2 from "./image2.jpg";
import image3 from "./image3.jpg";
import image4 from "./image4.jpg";
import image5 from "./image5.jpg";

const nextArrowStyle = {
  right: "-25px",
  background: "rgb(0 0 0 / 60%)",
  color: "#fff",
  zIndex: "5",
  width: "50px",
  height: "50px",
  top: "48%",
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
  top: "48%",
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
  top: "48%",
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
  top: "48%",
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

class ExperienceCarousel extends React.Component {
  render() {
    const settings = {
      dots: false,
      infinite: false,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      speed: 500,
      slidesToShow: 3.5,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2.5,
          },
        },
        {
          breakpoint: 650,
          settings: {
            slidesToShow: 1.5,
          },
        },
        {
          breakpoint: 440,
          settings: {
            nextArrow: <MobileNextArrow />,
            prevArrow: <MobilePrevArrow />,
            slidesToShow: 1.2,
          },
        },
      ],
    };

    const items = [
      {
        title: "Bed & Breakfast (B&B)",
        description: "Low prices, new connections",
        price: "Starting from 15$",
        image: image1,
        link: '/s?listType=stays_with&category=1'
      },
      {
        title: "Adventurous Activities",
        description: "Adventurous Activities",
        price: "Starting from 20$",
        image: image2,
        link: '/s?listType=stays_with&category=8'
      },
      {
        title: "Boutique Hotels and Hostels",
        description: "Top picks from our community",
        price: "Starting from 25$",
        image: image3,
        link: '/s?listType=stays_with&category=5'
      },
      {
        title: "Skill Learning",
        description: "Skill Learning",
        price: "Starting from 15$",
        image: image4,
        link: '/s?listType=stays_with&category=11'
      },
      {
        title: "City stays",
        id: "id5",
        description: "A home away from home",
        price: "Starting from 30$",
        image: image5,
        link: '/s?listType=stays_with&category=2'
      },
    ];

    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h1 className={s.sectionTitle}>Stays with Experiences</h1>
            <p className={s.sectionDescription}>
              Live the Journey: <span className={s.nowrap}>Where Stays Become Stories</span>
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
                          <img src={item.image} className={s.itemImage} />
                          <h3 className={s.itemTitle}>{item.title}</h3>
                          <p className={s.itemDescription}>
                            {item.description}
                          </p>
                          <p className={s.itemPrice}>{item.price}</p>
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
                        <div style={{display: 'inline-block', height: 0, paddingBottom: '100%', width: '100%', background: `url(${item.image})`, backgroundSize: 'cover'}}>
                          {/*<img src={item.image} className={s.gridItemImage} />*/}
                        </div>
                        <h3 className={s.gridItemTitle}>{item.title}</h3>
                        <p className={s.gridItemDescription}>
                          {item.description}
                        </p>
                        <p className={s.gridItemPrice}>{item.price}</p>
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

export default withStyles(s)(ExperienceCarousel);
