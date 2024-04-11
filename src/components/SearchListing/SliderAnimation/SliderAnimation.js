import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';

import s from './SliderAnimation.css';
import {
    Grid,
    Row,
    Col,
    Image
} from 'react-bootstrap';
import cx from 'classnames';

// Locale
import bannerone from './BannerOne.jpg';
import bannertwo from './BannerTwo.jpg';
import bannerthree from './BannerThree.jpg';
import bannerfour from './BannerFour.jpg';
import arrow from './arrow-down.png';
import messages from '../../../locale/messages';

import RetreatSearchForm from '../RetreatSearchForm/RetreatSearchForm'
import { getHomeBannerImages } from '../../../actions/getHomeBannerImages';


class SliderAnimation extends React.Component {
    static propTypes = {};

    constructor(props) {
        super(props);
        this.scrollTop = this.scrollTop.bind(this);
    }
    scrollTop() {
        window.scrollTo({
            top: screen.height,
            behavior: 'smooth'
        })
    }
    render() {
        const { data: { loading, getBanner }, layoutType, homeBannerImages } = this.props;
        const settings = {
            vertical: true,
            dots: false,
            fade: true,
            infinite: true,
            speed: 6000,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 6000,
            draggable: false,
            touchMove: false,
            pauseOnHover: false,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        // slidesToShow: 3,
                        // slidesToScroll: 3,
                        infinite: true,
                        dots: false,
                        fade: true,
                        pauseOnHover: false,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        // slidesToShow: 3,
                        // slidesToScroll: 1,
                        initialSlide: 0,
                        swipe: true,
                        swipeToSlide: true,
                        touchMove: true,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 0,
                        swipe: true,
                        swipeToSlide: true,
                        touchMove: true,
                        centerMode: true


                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 0,
                        swipe: true,
                        swipeToSlide: true,
                        touchMove: true,
                        centerMode: true


                    }
                }
            ]
        };

        let path = '/images/home/xx_large_';
        let homeBannerFirst;

        if (homeBannerImages && homeBannerImages.data && homeBannerImages.data.length > 0) {
            homeBannerFirst = path + homeBannerImages.data[0].name;
        }

        return (
            <div>
                <div className={cx(s.searchBannerSlider, 'hidden-xs')}>
                    <div className={cx(s.homePosition, 'homePosition')}>
                        <div className={cx(s.homeCarsoual, 'homeCarsoual')}>
                            <Slider {...settings}>
                                {homeBannerImages && homeBannerImages.data && homeBannerImages.data.map((item, key) => {
                                    return (
                                        <div key={item.id}>
                                            <div className={s.bgHeight}>
                                                <div className={cx(s.sliderBg)} style={{ backgroundImage: `url(${path}${item.name})` }}>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Slider>
                            <div className={s.downArrow}>
                                <div className={'visible-xs'}>
                                    <Image src={arrow} responsive onClick={this.scrollTop} />
                                </div>
                            </div>
                        </div>
                        {
                            layoutType && layoutType == 3 && <div className={cx(s.container, s.FormBookWrap)}>
                                {
                                    !loading && <div className={s.BookWrap}>
                                        <h1>Retreats</h1>
                                        <h3>Eat to Live. Live to Experience.</h3>
                                        <RetreatSearchForm />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={cx('homeSliderMobile', 'visible-xs', 'hidden-sm hidden-md hidden-lg')}>
                    <div className={s.homePosition}>
                        <div className={s.homeCarsoual}>
                            <Slider {...settings}>
                                <div className={s.bgHeight}>
                                    {homeBannerImages &&
                                        homeBannerImages.data &&
                                        homeBannerImages.data.map((item, key) => {
                                        return (
                                            <div key={item.id}>
                                            <div className={s.bgHeight}>
                                                <div
                                                className={s.sliderBg}
                                                style={{
                                                    backgroundImage: `url(${path}${item.name})`,
                                                }}
                                                ></div>
                                            </div>
                                            </div>
                                        );
                                        })}
                                </div>


                            </Slider>
                            <div className={s.downArrow}>
                                <div className={'visible-xs'}>
                                    <Image src={arrow} responsive onClick={this.scrollTop} />
                                </div>
                            </div>
                        </div>
                        {
                            layoutType && layoutType == 3 && <div className={cx(s.container, s.height100)}>
                                <div className={s.FormBookWrap}>
                                    {
                                        !loading && <div className={s.BookWrap}>
                                            <h1>Retreats</h1>
                                            <h3>Eat to Live. Live to Experience.</h3>
                                            <RetreatSearchForm />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </div>
        );
    }
}

const mapState = (state) => ({
    homeBannerImages: state.homeBannerImages
});

const mapDispatch = {
    getHomeBannerImages
};

export default withStyles(s)(connect(mapState, mapDispatch)(SliderAnimation));

