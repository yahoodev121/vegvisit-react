import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import FaTree from "react-icons/lib/fa/tree";

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

import LocationSearchForm from '../LocationSearchForm';
import VideoSearchForm from '../VideoSearchForm/VideoSearchForm';
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
                <div className={cx('homeBannerSlider', 'hidden-sm hidden-xs')}>
                    <div className={cx(s.homePosition, 'homePosition')}>
                        <div className={cx(s.homeCarsoual, 'homeCarsoual')}>
                            <Slider {...settings}>
                                {homeBannerImages && homeBannerImages.data && homeBannerImages.data.map((item, key) => {
                                    return (
                                        <div key={item.id}>
                                            <div className={s.bgHeight}>
                                                <div className="sliderBg" style={{ backgroundImage: `url(${path}${item.name})` }}>

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
                            layoutType && layoutType == 1 && <div className={s.container}>
                                {
                                    !loading && getBanner && <div className={s.sliderContent}>
                                        <h1 className={cx(s.noMargin, s.bannerCaptionText)}>
                                            <span className={s.bannerCaptionHighlight}>{getBanner.title}</span>
                                            {' '} {getBanner.content}
                                        </h1>
                                        <div className={s.searchbox}>
                                            <LocationSearchForm />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {
                            layoutType && layoutType == 3 && <div className={cx(s.container, s.FormBookWrap)}>
                                {
                                    !loading && getBanner && <div className={s.BookWrap}>
                                        <h1>{getBanner.title}</h1>
                                        <h3>{getBanner.content}</h3>

                                        <VideoSearchForm />
                                        <h3 className={s.fullWidth}>
                                            <FaTree /> For each booking you make, a tree will be planted in an area suffering from deforestation by animal agriculture.
                                        </h3>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={cx('homeSliderMobile', 'visible-xs visible-sm', 'hidden-md hidden-lg')}>
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
                                                            className="sliderBg"
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
                            layoutType && layoutType == 1 && <Grid>
                                {
                                    !loading && getBanner && <div className={s.sliderContent}>
                                        <h1 className={cx(s.noMargin, s.bannerCaptionText)}>
                                            <span className={s.bannerCaptionHighlight}>{getBanner.title}</span>
                                            {' '} {getBanner.content}
                                        </h1>
                                        <div className={s.searchbox}>
                                            <LocationSearchForm />
                                        </div>
                                    </div>
                                }
                            </Grid>
                        }
                        {
                            layoutType && layoutType == 3 && <div className={cx(s.container, s.height100)}>
                                <div className={s.FormBookWrap}>
                                    {
                                        !loading && getBanner && <div className={s.BookWrap}>
                                            <h1 className={cx("hidden-xs")}>{getBanner.title}</h1>
                                            <h1 className={cx("hidden-lg hidden-md hidden-sm")}>Experience<br/>The World Of<br/>Plant-Based Travel</h1>
                                            <h3>{getBanner.content}</h3>

                                            <VideoSearchForm />
                                            <h3 className={s.width100}>
                                                <FaTree /> For each booking you make, a tree will be planted in an area suffering from deforestation by animal agriculture.
                                            </h3>
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

