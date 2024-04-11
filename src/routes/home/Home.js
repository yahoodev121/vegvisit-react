import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, gql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import cx from 'classnames';
import Home from '../../components/Home';
import { FormattedMessage } from 'react-intl';

//Components
import BannerCaption from '../../components/Home/BannerCaption';
import HomeSlider from '../../components/Home/HomeSlider';
import PopularLocationSlider from '../../components/Home/PopularLocationSlider';
import NewsBox from '../../components/Home/NewsBox';
import SearchForm from '../../components/Home/SearchForm';
import Loader from '../../components/Loader';
import SeeAll from '../../components/Home/SeeAll';
import SliderAnimation from '../../components/Home/SliderAnimation';
import SpaceFree from '../../components/Home/SpaceFree';
import HomeKindofTrip from '../../components/Home/HomeKindofTrip';
import SliderVideo from '../../components/Home/SliderVideo';
import PopularLocationGrid from '../../components/Home/PopularLocationGrid';
//  import CalendarBig from '../../components/CalendarBig';

//import ReadyToEarn from '../../components/Home/ReadyToEarn';

// Graphql
import getRecommendQuery from './getRecommend.graphql';
import getImageBannerQuery from './getImageBanner.graphql';
import getMostViewedListingQuery from './getMostViewedListing.graphql';
import getPopularLocationQuery from './getPopularLocation.graphql';

import { getListingFieldsValues } from '../../actions/getListingFieldsValues';

// Locale
import messages from '../../locale/messages';
import { readFile } from 'fs';
import TravelMadeEasy from '../../components/Home/TravelMadeEasy/TravelMadeEasy';
import VegConnect from '../../components/Home/VegConnect/VegConnect';
import Quotes from '../../components/Home/Quotes/Quotes';
import Reviews from "../../components/Home/Reviews/Reviews";
import HowItWorks from '../../components/Home/HowItWorks/HowItWorks';
import WelcomeHome from "../../components/Home/WelcomeHome/WelcomeHome";
import ExploreMap from "../../components/Home/ExploreMap/ExploreMap";
import ExperienceCarousel from "../../components/Home/ExperienceCarousel/ExperienceCarousel";
import RetreatsCarousel from "../../components/Home/RetreatsCarousel/RetreatsCarousel";
import HostToday from "../../components/Home/HostToday/HostToday";
import Buzz from "../../components/Home/Buzz/Buzz";
import GiveBack from "../../components/Home/GiveBack/GiveBack";

class Homepage extends React.Component {
  static propTypes = {
    getRecommendData: PropTypes.shape({
      loading: PropTypes.bool,
      getRecommendData: PropTypes.array
    }),
    getImageBannerData: PropTypes.shape({
      loading: PropTypes.bool,
      getImageBanner: PropTypes.object
    }),
    getMostViewedListingData: PropTypes.shape({
      loading: PropTypes.bool,
      GetMostViewedListing: PropTypes.array
    }),
    getPopularLocationData: PropTypes.shape({
      loading: PropTypes.bool,
      GetMostViewedListing: PropTypes.array
    }),
    formatMessage: PropTypes.func,
  };

  static defaultProps = {
    getRecommendData: {
      loading: true
    },
    getImageBannerData: {
      loading: true
    },
    getMostViewedListingData: {
      loading: true
    },
    getPopularLocationData: {
      loading: true
    }
  }

  render() {
    const { getRecommendData, getImageBannerData, getMostViewedListingData, getBannerData, getPopularLocationData, layoutType } = this.props;

    return (
      <div className={s.root}>
        {layoutType && (layoutType == 1 || layoutType == 3) && (
          <SliderAnimation layoutType={layoutType} data={getBannerData} />
        )}
        {/* {layoutType && layoutType == 3 && <SliderVideo data={getBannerData} />} */}
        <div className={s.container}>
          {layoutType && layoutType == 2 && (
            <div className={s.pageContainer}>
              <BannerCaption data={getBannerData} />
            </div>
          )}
          {layoutType && layoutType == 2 && (
            <div className={s.pageContainer}>
              <SearchForm />
            </div>
          )}
          {getRecommendData.loading &&
            getImageBannerData.loading &&
            getMostViewedListingData.loading && (
              <div>
                <Loader type="text" />
              </div>
            )}
        </div>
        <div className={s.welcomeHome}>
          <WelcomeHome />
        </div>
        <div className={s.exploreMap}>
          <ExploreMap />
        </div>
        <div className={s.experience}>
          <ExperienceCarousel />
        </div>
        <div className={s.retreats}>
          <RetreatsCarousel />
        </div>
        <div className={s.container}>
          <div className={s.pageContainer}>
            <Quotes />
          </div>
          <div className={s.pageContainer}>
            <Reviews />
          </div>
        </div>
        <div className={s.hostToday}>
          <HostToday />
        </div>
        <div className={s.buzz}>
          <Buzz />
        </div>
        <div className={s.giveBack}>
          <GiveBack />
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(gql`
        query getBanner{
          getBanner {
            id
            title
            content
          }
        }
      `, {
      name: 'getBannerData',
      options: {
        ssr: true
      }
    }),
  graphql(getRecommendQuery, {
    name: 'getRecommendData',
    options: {
      //ssr: false
      ssr: true,
      fetchPolicy: 'network-only'
    }
  }),
  graphql(getMostViewedListingQuery, {
    name: 'getMostViewedListingData',
    options: {
      //ssr: false
      ssr: true,
      fetchPolicy: 'network-only'
    }
  }),
  graphql(getImageBannerQuery, {
    name: 'getImageBannerData',
    options: {
      //ssr: false
      ssr: true
    }
  }),
  graphql(getPopularLocationQuery, {
    name: 'getPopularLocationData',
    options: {
      //ssr: false
      ssr: true
    }
  }),
)(Homepage);
