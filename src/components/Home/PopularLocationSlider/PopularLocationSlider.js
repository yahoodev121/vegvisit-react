import React from 'react';
import PropTypes from 'prop-types';
import Slider  from 'react-slick';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import s from './PopularLocationSlider.css';
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
import PopularLocationItem from '../PopularLocationItem';

const nextArrowStyle = {
  right: '-15px',
  background: '#fff', color: '#484848', zIndex: '5', width: 'auto', height: 'auto', top: '50%',
  fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
  border: '2px solid transparent', boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.14)'
};

const prevArrowStyle = {
  left: '-5px',
  background: '#fff', color: '#484848', zIndex: '5', width: 'auto', height: 'auto', top: '50%',
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
      <FontAwesome.FaAngleRight className={s.navigationIcon} />
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
      <FontAwesome.FaAngleLeft className={s.navigationIcon} />
    </div>
  );
}

class PopularLocationSlideComponent extends React.Component {

  static propTypes = {
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
      slidesToShow: 5,
      slidesToScroll: 5,
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
        <div className="popularLocation">
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} className={s.paddingLeft}>
              {
                isClient && <Slider {...settings}>
                {
                  data.length > 0 && data.map((item, index) => {
                    if(item.isEnable == 'true'){
                      return (
                        <div className={cx('col-md-12 col-sm-12 col-xs-12', s.paddingRight)} key={index}>
                          <PopularLocationItem 
                            id={item.id}
                            location={item.location}
                            image={item.image}
                            locationAddress={item.locationAddress}
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
          </div> 
        </Grid>
    );
    
  }
};

export default withStyles(s)(PopularLocationSlideComponent);
