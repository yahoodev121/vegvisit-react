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
import s from "./ViewListing.css";
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
import Photos from "../../components/ViewListing/Photos";
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
import withoutTawkTo from "../../components/withoutTawkTo";
import Footer from "../../components/Footer/Footer";

import moment from "moment";
// Graphql
import BlockedDatesQuery from "./BlockedDates.graphql";
import ListingDataQuery from "./getListingData.graphql";
import MoreReviewsQuery from "./MoreReviews.graphql";
import SimilarListsQuery from "./getSimilarListing.graphql";
import AutoAffix from "react-overlays/lib/AutoAffix";
// ES6 Imports
import Scroll from "react-scroll"; // Imports all Mixins
import { scroller } from "react-scroll"; //Imports scroller mixin, can use as scroller.scrollTo()
// Locale
import messages from "../../locale/messages";

import { openBookingModal } from "../../actions/BookingModal/modalActions";

// Or Access Link,Element,etc as follows
let Link = Scroll.Link;
let Element = Scroll.Element;
let Events = Scroll.Events;
let scroll = Scroll.animateScroll;
let scrollSpy = Scroll.scrollSpy;
var durationFn = function(deltaTop) {
  return deltaTop;
};
class ViewListing extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    listId: PropTypes.number.isRequired,
    preview: PropTypes.bool,
    isAdmin: PropTypes.bool,
    account: PropTypes.shape({
      userId: PropTypes.string,
      userBanStatus: PropTypes.number,
    }),
    ListingBlockedDates: PropTypes.shape({
      loading: PropTypes.bool,
      UserListing: PropTypes.shape({
        blockedDates: PropTypes.array,
      }),
    }),
    getListingData: PropTypes.shape({
      loading: PropTypes.bool,
      UserListing: PropTypes.object,
    }),
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    similarListsData: PropTypes.shape({
      loading: PropTypes.bool,
      getSimilarListing: PropTypes.array,
    }),
    openBookingModal: PropTypes.func,
    info: PropTypes.string,
    inquiry: PropTypes.bool,
  };
  static defaultProps = {
    getListingData: {
      loading: false,
      UserListing: {
        userId: null,
      },
    },
    ListingBlockedDates: {
      loading: true,
      UserListing: {
        blockedDates: [],
      },
    },
    account: {
      userId: null,
      userBanStatus: 0,
    },
    isAdmin: false,
    inquiry: false,
  };

  constructor(props) {
    super(props);
    this.handleDismissInfo = this.handleDismissInfo.bind(this);
    this.state = {
      // Show info alert
      showInfo: true,
    };
  }

  // Dismiss info alert
  handleDismissInfo() {
    this.setState({ showInfo: false });
  }

  render() {
    const {
      listId,
      title,
      getListingData: { loading, UserListing },
      preview,
    } = this.props;
    const { ListingBlockedDates } = this.props;
    const { listReviewsData } = this.props;
    const { openBookingModal, baseCurrency } = this.props;
    const {
      account: { userId, userBanStatus },
      isAdmin,
    } = this.props;
    const {
      lat,
      lng,
      startDate,
      endDate,
      similarListsData,
      similarListsData: { getSimilarListing },
    } = this.props;
    const isBrowser = typeof window !== "undefined";
    const smallDevice = isBrowser
      ? window.matchMedia("(max-width: 640px)").matches
      : undefined;
    const { info, inquiry } = this.props;

    let basePriceValue =
      UserListing &&
      UserListing.listingData &&
      UserListing.listingData.basePrice
        ? UserListing.listingData.basePrice
        : 0;
    let currencyValue =
      UserListing && UserListing.listingData && UserListing.listingData.currency
        ? UserListing.listingData.currency
        : "USD";

    if (isBrowser && loading && !UserListing) {
      return <Loader type="text" />;
    }
    let isHost = false;
    if (UserListing) {
      if (userId && userId === UserListing.userId) {
        isHost = true;
      } else if (isAdmin) {
        isHost = true;
      }
    }
    if (preview && !isHost) {
      return <NotFound title={title} />;
    }
    if (!loading && !UserListing) {
      return <NotFound title={title} />;
    }
    let reviewsCount = UserListing.reviewsCount;
    let reviewsStarRating = UserListing.reviewsStarRating;
    let starRatingValue = 0;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Number(reviewsStarRating / reviewsCount);
    }
    const listType = UserListing.listType;

    return (
      <div className={s.root}>
        <div className={s.container}>
          {UserListing && (
            <div className={s.pageContainer}>
              {info === "notAvailable" && this.state.showInfo && (
                <Alert bsStyle="info" onDismiss={this.handleDismissInfo}>
                  <h4>
                    <FormattedMessage
                      {...messages.datesNotAvailableOrValidHeader}
                    />
                  </h4>
                  <p>
                    <FormattedMessage
                      {...messages.datesNotAvailableOrValidText}
                    />
                  </p>
                </Alert>
              )}
              <Photos data={UserListing} loading={loading} />
              <Element name="test1" className="element">
                <Grid fluid>
                  <Row className={cx(s.pageContent)}>
                    <Col
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      className={s.stickyContainer}
                    >
                      <Row>
                        <AutoAffix
                          viewportOffsetTop={0}
                          container={this}
                          affixClassName={s.showAffix}
                        >
                          <div className={cx(s.zPanel, s.panelDefault)}>
                            <div className={cx("stickHeader", s.viewHeader)}>
                              <div className={s.headerNav}>
                                <div className={s.textColor}>
                                  <ul
                                    className={cx("list-inline", s.stickyMenu)}
                                  >
                                    <li>
                                      <Link
                                        className={cx(s.textList)}
                                        activeClass={s.active}
                                        to="test1"
                                        spy={true}
                                        smooth={true}
                                        offset={-50}
                                        duration={800}
                                        onSetActive={this.handleSetActive}
                                      >
                                        <FormattedMessage
                                          {...messages.overview}
                                        />
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className={cx(s.textList)}
                                        activeClass={s.active}
                                        to="test2"
                                        spy={true}
                                        smooth={true}
                                        offset={-80}
                                        duration={800}
                                        onSetActive={this.handleSetActive}
                                      >
                                        <FormattedMessage
                                          {...messages.reviews}
                                        />
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className={cx(s.textList)}
                                        activeClass={s.active}
                                        to="test3"
                                        spy={true}
                                        smooth={true}
                                        offset={-70}
                                        duration={800}
                                        onSetActive={this.handleSetActive}
                                      >
                                        <FormattedMessage
                                          {...messages.theHost}
                                        />
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className={cx(s.textList)}
                                        activeClass={s.active}
                                        to="test4"
                                        spy={true}
                                        smooth={true}
                                        offset={-70}
                                        duration={800}
                                        onSetActive={this.handleSetActive}
                                      >
                                        <FormattedMessage
                                          {...messages.location}
                                        />
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AutoAffix>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </Element>

              <Grid fluid>
                <Row className={s.pageContent}>
                  <Col xs={12} sm={12} md={8} lg={8} className={s.LeftGrid}>
                    <Grid fluid className={s.padR0}>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={cx(s.padding4, s.listingIntroSection)}
                      >
                        <ListingIntro
                          data={UserListing}
                          reviewsCount={UserListing.reviewsCount}
                          reviewsStarRating={UserListing.reviewsStarRating}
                        />
                      </Col>

                      <Col xs={12} sm={12} md={12} lg={12}>
                        <hr />
                      </Col>
                    </Grid>

                    <Grid
                      fluid
                      className={cx(
                        s.horizontalLineThrough,
                        s.noBorder,
                        s.padR0
                      )}
                    >
                      <ListingDetails
                        data={UserListing}
                        isHost={isHost}
                        userBanStatus={userBanStatus}
                        inquiry={inquiry}
                        info={info}
                      />
                    </Grid>
                    {/* <Grid fluid>
                  <div className={cx(s.availabilityCalendar, 'availableCalendar')}>
                    <AvailabilityCalendar
                      listId={listId}
                      smallDevice={smallDevice}
                      //verySmallDevice={verySmallDevice}
                      loading={ListingBlockedDates.loading}
                      blockedDates={
                        ListingBlockedDates.UserListing != null ?
                          ListingBlockedDates.UserListing.listBlockedPrice : undefined
                      }
                      listingData={UserListing.listingData || undefined}
                    />
                  </div>
                </Grid> */}

                    <Element name="test2" className="element">
                      <Grid fluid className={cx(s.horizontalLineThrough)}>
                        <Reviews
                          reviewsCount={UserListing.reviewsCount}
                          reviewsStarRating={UserListing.reviewsStarRating}
                          data={listReviewsData}
                          listId={listId}
                        />
                      </Grid>
                    </Element>

                    <Element name="test3" className="element">
                      <Grid fluid className={cx(s.horizontalLineThrough)}>
                        <HostDetail
                          id={UserListing.id}
                          userId={UserListing.userId}
                          hostEmail={UserListing.user.email}
                          personCapacity={UserListing.personCapacity}
                          city={UserListing.city}
                          listingData={UserListing.listingData || undefined}
                          profile={UserListing.user.profile || undefined}
                          blockedDates={
                            ListingBlockedDates.UserListing != null
                              ? ListingBlockedDates.UserListing.blockedDates
                              : undefined
                          }
                          isHost={isHost}
                          userBanStatus={userBanStatus}
                          listTitle={UserListing.title}
                          timeZone={UserListing.timeZone}
                        />
                      </Grid>
                    </Element>

                    <Element name="test4" className="element">
                      <Grid fluid className={cx(s.paddingTop2)}>
                        <LocationMap data={UserListing} />
                      </Grid>
                    </Element>
                  </Col>

                  <Col xs={12} sm={12} md={4} lg={4} className={s.newSticky}>
                    {!smallDevice && !loading && (
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={cx(
                          s.columnBox,
                          s.responsiveNopadding,
                          "hidden-xs hidden-sm"
                        )}
                      >
                        {/* <Sticky> */}
                        <Calendar
                          id={UserListing.id}
                          loading={ListingBlockedDates.loading}
                          blockedDates={
                            ListingBlockedDates.UserListing != null
                              ? ListingBlockedDates.UserListing.blockedDates
                              : undefined
                          }
                          personCapacity={UserListing.personCapacity}
                          listingData={UserListing.listingData || undefined}
                          isHost={isHost}
                          bookingType={UserListing.bookingType}
                          userBanStatus={userBanStatus}
                          startDate={startDate}
                          endDate={endDate}
                          reviewsCount={UserListing.reviewsCount}
                          reviewsStarRating={UserListing.reviewsStarRating}
                          hostDetails={UserListing}
                          listType={listType}
                          listingRetreat={UserListing.listingRetreat}
                        />
                        {/* </Sticky> */}
                      </Col>
                    )}
                    {!smallDevice && loading && (
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={cx(
                          s.columnBox,
                          s.webDevice,
                          s.responsiveNopadding,
                          "hidden-xs hidden-sm"
                        )}
                      >
                        {/* <Sticky> */}
                        <Calendar
                          id={UserListing.id}
                          loading={ListingBlockedDates.loading}
                          blockedDates={
                            ListingBlockedDates.UserListing != null
                              ? ListingBlockedDates.UserListing.blockedDates
                              : undefined
                          }
                          personCapacity={UserListing.personCapacity}
                          listingData={UserListing.listingData || undefined}
                          isHost={isHost}
                          bookingType={UserListing.bookingType}
                          userBanStatus={userBanStatus}
                          startDate={startDate}
                          endDate={endDate}
                          reviewsCount={UserListing.reviewsCount}
                          reviewsStarRating={UserListing.reviewsStarRating}
                          hostDetails={UserListing}
                          listType={listType}
                          listingRetreat={UserListing.listingRetreat}
                        />
                        {/* </Sticky> */}
                      </Col>
                    )}

                    {/* {
  smallDevice && <Col xs={12} sm={12} md={4} lg={4} className={cx(s.columnBox, s.mobDevice, 'hidden-xs hidden-sm')}>
    <Calendar
      id={UserListing.id}
      loading={ListingBlockedDates.loading}
      blockedDates={
        ListingBlockedDates.UserListing != null ?
          ListingBlockedDates.UserListing.blockedDates : undefined
      }
      personCapacity={UserListing.personCapacity}
      listingData={UserListing.listingData || undefined}
      isHost={isHost}
      bookingType={UserListing.bookingType}
      userBanStatus={userBanStatus}
      startDate={startDate}
      endDate={endDate}
      reviewsCount={UserListing.reviewsCount}
      reviewsStarRating={UserListing.reviewsStarRating}
      hostDetails = {UserListing}
    />
  </Col>
} */}
                  </Col>
                </Row>
              </Grid>

              {/* {
                  similarListsData && similarListsData.getSimilarListing && similarListsData.getSimilarListing.length > 0 && <Grid fluid className={cx(s.space2)}>
                    <Row className={cx(s.pageContent, s.space3, s.sliderMargin)}>
                      <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.space2)}>
                        <h2 className={cx(s.sectionTitleText, s.space2)}><FormattedMessage {...messages.similarListings} /></h2>
                      </Col>
                      <HomeSlider data={similarListsData.getSimilarListing} />
                    </Row>
                  </Grid>
                } */}

              {similarListsData &&
                similarListsData.getSimilarListing &&
                similarListsData.getSimilarListing.length > 0 && (
                  <Grid fluid className={cx(s.space2, s.noPaddingMobile)}>
                    <Row
                      className={cx(s.pageContent, s.space3, s.sliderMargin)}
                    >
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={cx(s.spaceTop2, s.space2)}
                      >
                        <h2 className={cx(s.sectionTitleText, s.space2)}>
                          <FormattedMessage {...messages.similarListings} />
                        </h2>
                      </Col>
                      <SimilarListings
                        data={similarListsData.getSimilarListing}
                      />
                    </Row>
                  </Grid>
                )}
              <div className={cx(s.space10, "visible-sm visible-xs hidden-lg")}>
                <Footer />
              </div>
            </div>
          )}
          <div className={cx(s.stickyBookButton, "visible-sm visible-xs")}>
            <div className={cx(s.filtersFooter)}>
              <div className={s.filtersContainer}>
                <Row className={s.footerContainer}>
                  <div className={s.displayTable}>
                    <div className={cx(s.smSpace, s.displayTableCell)}>
                      <div className={s.bookItPriceAmount}>
                        {UserListing && UserListing.bookingType === "instant" && (
                          <span>
                            <FontAwesome.FaBolt className={s.instantIcon} />
                          </span>
                        )}
                        <div className={s.bookItPrice}>
                          <CurrencyConverter
                            from={currencyValue || baseCurrency}
                            amount={basePriceValue || 0}
                            className={s.bookItPrice}
                          />
                        </div>
                        <span className={s.bookItNight}>
                          {" "}
                          <FormattedMessage {...messages.perNight} />
                        </span>
                      </div>
                      <div>
                        <div className={s.reviewSection}>
                          <StarRating name={"review"} value={starRatingValue} />
                        </div>
                        <div>
                          <span>
                            {reviewsCount > 0 && (
                              <span>
                                {reviewsCount}{" "}
                                {reviewsCount > 1 ? (
                                  <FormattedMessage {...messages.reviews} />
                                ) : (
                                  <FormattedMessage {...messages.review} />
                                )}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={s.displayTableCell}>
                      <BookingModal
                        id={UserListing.id}
                        loading={ListingBlockedDates.loading}
                        // blockedDates={
                        //   ListingBlockedDates.getBlockedDates && ListingBlockedDates.getBlockedDates.length > 0 ?
                        //     ListingBlockedDates.getBlockedDates : undefined
                        // }
                        blockedDates={
                          ListingBlockedDates.UserListing != null
                            ? ListingBlockedDates.UserListing.blockedDates
                            : undefined
                        }
                        personCapacity={UserListing.personCapacity}
                        listingData={UserListing.listingData || undefined}
                        isHost={isHost}
                        bookingType={UserListing.bookingType}
                        startDate={startDate}
                        endDate={endDate}
                        userBanStatus={userBanStatus}
                        reviewsCount={UserListing.reviewsCount}
                        reviewsStarRating={UserListing.reviewsStarRating}
                        hostDetails={UserListing}
                      />
                      <Button
                        className={cx(s.requestBookButton, s.fullWidth)}
                        onClick={openBookingModal}
                      >
                        <FormattedMessage {...messages.requestToBook} />
                      </Button>
                    </div>
                  </div>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapState = (state) => ({
  account: state.account.data,
  isAdmin: state.runtime.isAdminAuthenticated,
});
const mapDispatch = {
  openBookingModal,
};
export default compose(
  withoutTawkTo,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(ListingDataQuery, {
    name: "getListingData",
    options: (props) => ({
      variables: {
        listId: props.listId,
        preview: props.preview,
      },
      fetchPolicy: "network-only",
      ssr: true,
    }),
  }),
  graphql(BlockedDatesQuery, {
    name: "ListingBlockedDates",
    options: (props) => ({
      variables: {
        listId: props.listId,
        preview: props.preview,
      },
      fetchPolicy: "network-only",
      ssr: false,
    }),
  }),
  graphql(MoreReviewsQuery, {
    name: "listReviewsData",
    options: (props) => ({
      variables: {
        listId: props.listId,
      },
      fetchPolicy: "network-only",
      ssr: false,
    }),
  }),
  graphql(SimilarListsQuery, {
    name: "similarListsData",
    options: (props) => ({
      variables: {
        listId: props.listId,
        lat: props.lat,
        lng: props.lng,
      },
      fetchPolicy: "network-only",
      ssr: false,
    }),
  })
)(ViewListing);
