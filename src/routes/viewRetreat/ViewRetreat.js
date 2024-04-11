// General
import React from "react";
import PropTypes from "prop-types";
import { graphql, gql, compose } from "react-apollo";
import { Field, reduxForm } from "redux-form";

// Translation
import { injectIntl, FormattedMessage } from "react-intl";
// Redux
import { connect } from "react-redux";

// Style
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../index.css";
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Alert,
} from "react-bootstrap";
import cx from "classnames";
import * as FontAwesome from "react-icons/lib/fa";
// Components
import FilesViewer from "../../components/ViewRetreat/FilesViewer/FilesViewer";
import RetreatHeader from "../../components/ViewRetreat/RetreatHeader/RetreatHeader";
import RetreatBenefits from "../../components/ViewRetreat/RetreatBenefits/RetreatBenefits";
import RetreatFeature from "../../components/ViewRetreat/RetreatFeature/RetreatFeature";
import RetreatMeals from "../../components/ViewRetreat/RetreatMeals/RetreatMeals";
import RetreatTeachers from "../../components/ViewRetreat/RetreatTeachers/RetreatTeachers";
import RetreatAccommodation from "../../components/ViewRetreat/RetreatAccommodation/RetreatAccommodation";
import RetreatLocation from "../../components/ViewRetreat/RetreatLocation/RetreatLocation";
import RetreatIncludes from "../../components/ViewRetreat/RetreatIncludes/RetreatIncludes";
import ListingIntro from "../../components/ViewListing/ListingIntro";
import Calendar from "../../components/ViewListing/Calendar";
import ListingDetails from "../../components/ViewListing/ListingDetails";
import Reviews from "../../components/ViewListing/Reviews";
import HostDetail from "../../components/ViewListing/HostDetail";
import LocationMap from "../../components/ViewListing/LocationMap";
import Loader from "../../components/Loader";
import NotFound from "../notFound/NotFound";
import Sticky from "../../components/ViewListing/Sticky";
import HomeSlider from "../../components/Home/HomeSlider";
import AvailabilityCalendar from "../../components/ViewListing/AvailabilityCalendar";
import StarRating from "../../components/StarRating";
import CurrencyConverter from "../../components/CurrencyConverter";
import BookingModal from "../../components/ViewListing/BookingModal";
import SimilarListings from "../../components/ViewListing/SimilarListings";
import Footer from "../../components/Footer/Footer";

import moment from "moment";
import AutoAffix from "react-overlays/lib/AutoAffix";
// ES6 Imports
import Scroll from "react-scroll"; // Imports all Mixins
import { scroller } from "react-scroll"; //Imports scroller mixin, can use as scroller.scrollTo()
// Locale
import messages from "../../locale/messages";

import { openBookingModal } from "../../actions/BookingModal/modalActions";

class ViewRetreat extends React.Component {
  static propTypes = {
    retreat: PropTypes.object,
  };
  static defaultProps = {
    retreat: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      showInfo: true,
    };
  }

  // Dismiss info alert
  handleDismissInfo() {
    this.setState({ showInfo: false });
  }

  render() {
    const {
      retreat, initialFilter, searchSettings
    } = this.props
    return (
      <div>
        <div className="container d-flex flex-column">
          <RetreatHeader retreat={retreat} />
          <FilesViewer title={retreat.UserListing.title} images={retreat.UserListing.listPhotos} />
          <div className={cx(s.wFull, s.flex, s.gap4)}>
            <div className={s.flex1}>
              <RetreatBenefits benefits={JSON.parse(retreat.UserListing.listingRetreat.benefits)} />
              <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>Summary</h4>
                <div className={s.pl4} dangerouslySetInnerHTML={{ __html: retreat.UserListing.listingRetreat.summary }} />
              </div>
              <RetreatFeature retreat={retreat} />
              <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>Description</h4>
                <div className={s.pl4} dangerouslySetInnerHTML={{ __html: retreat.UserListing.listingRetreat.full_description }} />
              </div>
              <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>What Makes This Retreat Special</h4>
                <div className={s.pl4} dangerouslySetInnerHTML={{ __html: retreat.UserListing.listingRetreat.special }} />
              </div>
              <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>Program</h4>
                <div className={s.pl4} dangerouslySetInnerHTML={{ __html: retreat.UserListing.listingRetreat.itinerary }} />
              </div>
              <RetreatMeals retreat={retreat} />
              <RetreatTeachers teachers={retreat.UserListing.listingRetreat.teachers} />
            </div>
            <div className={s.w380px}>

            </div>
          </div>
          <RetreatAccommodation accommodations={retreat.UserListing.listingRetreat.accommodations} />
          <RetreatLocation retreat={retreat} initialFilter={initialFilter} searchSettings={searchSettings} />
          <RetreatIncludes includes={retreat.UserListing.listingRetreat.includes} notIncludes={retreat.UserListing.listingRetreat.not_includes} />
          <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
            <h4>How To Get There</h4>
            <div className={s.pl4} dangerouslySetInnerHTML={{ __html: retreat.UserListing.listingRetreat.travelHelp }} />
          </div>
        </div>
      </div>
    );
  }
}
const mapState = (state) => ({

});
const mapDispatch = {

};
export default compose(
  withStyles(s),
  connect(mapState, mapDispatch),
)(ViewRetreat);
