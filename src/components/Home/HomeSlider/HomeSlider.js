import React from 'react';
import PropTypes from 'prop-types';
import Slider  from 'react-slick';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import s from './HomeSlider.css';
import * as FontAwesome from 'react-icons/lib/fa';
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

// Component
import HomeItem from '../HomeItem';

const nextArrowStyle = {
  right: '-12px',
  background: '#fff', color: '#484848', zIndex: '5', width: 'auto', height: 'auto', top: '35%',
  fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
  border: '2px solid transparent', boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.14)'
};

const prevArrowStyle = {
  left: '-12px',
  background: '#fff', color: '#484848', zIndex: '5', width: 'auto', height: 'auto', top: '35%',
  fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
  border: '2px solid transparent', boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.14)'
};

const nextArrowMobileStyle = {
  display: 'none', right: '10px', 
  background: '#fff', color: '#484848', zIndex: '5', width: 'auto', height: 'auto', top: '35%',
  fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
  border: '2px solid transparent', boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.14)'
};

const prevArrowMobileStyle = {
  display: 'none', left: '10px',
  background: '#fff', color: '#484848', zIndex: '5', width: 'auto', height: 'auto', top: '35%',
  fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
  border: '2px solid transparent', boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.14)'
};


function SampleNextArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={nextArrowStyle}
      onClick={onClick}
    >
      <FontAwesome.FaAngleRight className={s.navigationIcon} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={prevArrowStyle}
      onClick={onClick}
    >
      <FontAwesome.FaAngleLeft className={s.navigationIcon} />
    </div>
  );
}

function MobileNextArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={nextArrowMobileStyle}
      onClick={onClick}
    >
    
    </div>
  );
}

function MobilePrevArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={prevArrowMobileStyle}
      onClick={onClick}
    >
     
    </div>
  );
}



class SlideComponent extends React.Component {

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      listPhotos: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
      })),
      coverPhoto: PropTypes.number,
      listingData: PropTypes.shape({
        basePrice: PropTypes.number,
        currency: PropTypes.string,
      }),
      settingsData: PropTypes.arrayOf(PropTypes.shape({
        listsettings: PropTypes.shape({
          itemName: PropTypes.string,
        }),
      })),
      id: PropTypes.number,
      beds: PropTypes.number,
      title: PropTypes.string,
      bookingType: PropTypes.string,
      reviewsCount: PropTypes.number,
      reviewsStarRating: PropTypes.number,
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string
    }))
  };

  static defaultProps = {
    data: []
  }

  constructor(props) {
    super(props);
    this.state = {
      isClient: false
    };
  }

  componentDidMount() {
    this.setState({
      isClient: true
    });
  }
  
  render() {
    const { data } = this.props;
    const { isClient } = this.state;

    const settings = {
      dots: false,
      infinite: false,
      nextArrow:  <SampleNextArrow />,
      prevArrow:  <SamplePrevArrow />,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
      {
        breakpoint: 768,
        settings: {
          //arrows: false,
          nextArrow:  <MobileNextArrow />,
          prevArrow:  <MobilePrevArrow />,
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
          swipe: true,
          swipeToSlide: true,
          touchMove: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          //arrows: false,
          nextArrow:  <MobileNextArrow />,
          prevArrow:  <MobilePrevArrow />,
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          swipe: true,
          swipeToSlide: true,
          touchMove: true,
          centerMode: true
        }
      }]
    };

    return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              {
               <Slider {...settings} className={cx('row homeSlickSlider', s.noMargin)}>
                {
                  data.length > 0 && data.map((item, index) => {
                    if(item.listPhotos.length > 0){
                      return (
                        <div className={cx('col-md-12 col-sm-12 col-xs-12')} key={index}>
                          <HomeItem 
                            id={item.id}
                            title={item.title}
                            basePrice={item.listingData.basePrice}
                            currency={item.listingData.currency}
                            roomType={item.settingsData && item.settingsData[0] && item.settingsData[0].listsettings && item.settingsData[0].listsettings.itemName ? item.settingsData[0].listsettings.itemName : undefined}
                            houseType={item.settingsData && item.settingsData[1] && item.settingsData[1].listsettings && item.settingsData[1].listsettings.itemName ? item.settingsData[1].listsettings.itemName : undefined}
                            beds={item.beds}
                            listPhotos={item.listPhotos}
                            coverPhoto={item.coverPhoto}
                            photo={item.listPhotos[0].name}
                            bookingType={item.bookingType}
                            reviewsCount={item.reviewsCount}
                            reviewsStarRating={item.reviewsStarRating}
                            wishListStatus={item.wishListStatus}
                            isListOwner={item.isListOwner}
                            city={item.city}
                            state={item.state}
                            country={item.country}
                          />
                        </div>
                      )
                    }
                  })
                }                
              </Slider>
              }
            </Col>
          </Row>  
        </Grid>
    );
    
  }
};

export default withStyles(s)(SlideComponent);
