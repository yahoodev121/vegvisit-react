// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {
  Grid,
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import s from './ListPlaceStep1.css';

// Internal Component
import DayCalendar from '../../components/DayCalendar';

// Internal Component
import DayDragCalendar from '../../components/DayDragCalendar';
import defaultPic from './large_no_image.jpeg';

import updateStep3 from './updateStep3';

// Helpers
import { listingBaseUrl } from '../../helpers/cdnImages'


class Calendar extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
    disabledDates: PropTypes.array,
    blockedDates: PropTypes.array,
  };

  static defaultProps = {
    listingSteps: {
      step3: "inactive",
      listing: {
        isPublished: false
      }
    },
    disabledDates: [],
    blockedDates: [],
    availableDatesPrices: [],
    availableDates: []
  };

  constructor(props) {
    super(props);
    this.state = {
      sources: [],
    };
  }


  componentDidMount() {
    const { listBlockedPrice } = this.props;
    let sources = [];
    let sourceObject = {};

    listBlockedPrice && listBlockedPrice.map((item, key) => {
      sourceObject = {};
      sourceObject["isSpecialPrice"] = item.isSpecialPrice;
      sourceObject["blockedDates"] = item.blockedDates;
      sources.push(sourceObject);
    });
    this.setState({ sources });

  }

  static getDerivedStateFromProps(props, state) {
    const { listBlockedPrice } = props;
    let sources = [];
    let sourceObject = {};

    listBlockedPrice && listBlockedPrice.map((item, key) => {
      sourceObject = {};
      sourceObject["isSpecialPrice"] = item.isSpecialPrice;
      sourceObject["blockedDates"] = item.blockedDates;
      sources.push(sourceObject);
    });
    if (!_.isEqual(sources, state.sources)) {
      return { sources };
    } else {
      return null;
    }
  }

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { disabledDates, blockedDates, listId } = this.props;
    const { minNight, maxNight, houseRules, additionalRules, securityDeposit, checkInEnd, checkInStart } = this.props;
    const { cancellationPolicy, maxDaysNotice, bookingNoticeTime } = this.props;
    const { availableDates, availableDatesPrices, baseCurrency, currency, availableCurrencies } = this.props;
    const { basePrice, cleaningPrice, stepTwoDetails } = this.props;

    const { sources } = this.state;

    let isAdminCurrency;
    isAdminCurrency = availableCurrencies && availableCurrencies.find(o => o.isBaseCurrency == true)
    let title = stepTwoDetails && stepTwoDetails.title;
    let description = stepTwoDetails && stepTwoDetails.description;
    let coverPhoto = stepTwoDetails && stepTwoDetails.coverPhoto;
    let coverImage = stepTwoDetails && stepTwoDetails.listPhotos.find(o => o.id == coverPhoto);
    let path = listingBaseUrl() + 'x_medium_';
    let showImage;
    if (coverImage) {
      showImage = path + coverImage.name;
    } else if (!coverImage && stepTwoDetails && stepTwoDetails.listPhotos && stepTwoDetails.listPhotos.length > 0) {
      showImage = path + (stepTwoDetails && stepTwoDetails.listPhotos && stepTwoDetails.listPhotos[0].name);
    } else {
      showImage = defaultPic;
    }

    return (
      <Grid fluid>
        <Row className={cx(s.landingContainer, s.fullWidth)}>
          <Col xs={12} sm={12} md={12} lg={12} className={s.landingContent}>
            <div>
              <h3 className={cx(s.landingContentTitle, s.marginbtm0)}><FormattedMessage {...messages.calendar} /></h3>
              <h3 className={cx(s.noMarginMaximum, s.maximumSpace2)}>
                    <span className={s.infomessage}>
                    <FormattedMessage {...messages.calenderbottomInfo} />
                    </span>
                  </h3>
            
              <div className={s.lableWeight}>
                <p className={cx(s.bookedWidth)}><span className={s.notAvailableColor}></span>Booked</p>
                <p className={s.calenderColorText}><span className={s.bookedColor}></span>Not Available</p>
                <p className={cx(s.calenderColorText, s.availableColorTab)}><span className={cx(s.availableColor)}></span>Available</p>
                <p className={s.calenderColorText}><span className={s.specialColor}></span>Special Price</p>
              </div>
              <h3 className={s.landingStep3}>
                <FormattedMessage {...messages.unBlockInfo} /> <b>Available </b>
                <FormattedMessage {...messages.unBlockInfo1} /> <b>Save.</b>
              </h3>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>

                  <FormGroup className={cx(s.formGroup, s.posRelative)}>
                    {/* <DayCalendar 
                      formName={"ListPlaceStep3"} 
                      disabledDates={disabledDates} 
                      blockedDates={blockedDates}
                    /> */}
                    <div className={s.imagefeed}>
                      <div className={s.caListimg} style={{backgroundImage: `url(${showImage})` }}>
                      </div>
                      <div className={s.caListPara}>
                        <h2>{title}</h2>
                        <p>{description}</p>
                      </div>
                    </div>
                    <DayDragCalendar
                      formName={"ListPlaceStep3"}
                      disabledDates={disabledDates}
                      blockedDates={blockedDates}
                      listId={listId}
                      availableDates={availableDates}
                      availableDatesPrices={availableDatesPrices}
                      sources={sources}
                      minNight={minNight}
                      maxNight={maxNight}
                      houseRules={houseRules}
                      additionalRules={additionalRules}
                      securityDeposit={securityDeposit}
                      checkInEnd={checkInEnd}
                      checkInStart={checkInStart}
                      cancellationPolicy={cancellationPolicy}
                      maxDaysNotice={maxDaysNotice}
                      bookingNoticeTime={bookingNoticeTime}
                      baseCurrency={baseCurrency}
                      currency={currency}
                      isAdminCurrency={isAdminCurrency}
                      basePrice={basePrice}
                      cleaningPrice={cleaningPrice}
                    />
                  </FormGroup>
                </div>
                <div className={s.nextPosition}>
                  <div className={s.nextBackButtonCalendar}>
                    <hr className={s.horizontalLineThrough} />

                    <FormGroup className={s.formGroup}>
                      <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                        <Button
                          className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)}
                          // onClick={() => previousPage("min-max-nights")}
                          onClick={() => previousPage("pricing")}
                        >
                          <FormattedMessage {...messages.back} />
                        </Button>
                        <Button
                          className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)}
                          onClick={() => nextPage("discount")}
                        >
                          <FormattedMessage {...messages.next} />
                        </Button>
                      </Col>
                    </FormGroup>
                  </div>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Calendar = reduxForm({
  form: 'ListPlaceStep3', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  onSubmit: updateStep3
})(Calendar);

// Decorate with connect to read form values
const selector = formValueSelector('ListPlaceStep3'); // <-- same as form name

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  disabledDates: selector(state, 'disabledDates'),
  blockedDates: selector(state, 'blockedDates'),
  listBlockedPrice: selector(state, 'listBlockedPrice'),
  minNight: selector(state, 'minNight'),
  maxNight: selector(state, 'maxNight'),
  houseRules: selector(state, 'houseRules'),
  additionalRules: selector(state, 'additionalRules'),
  securityDeposit: selector(state, 'securityDeposit'),
  checkInStart: selector(state, 'checkInStart'),
  checkInEnd: selector(state, 'checkInEnd'),
  bookingNoticeTime: selector(state, 'bookingNoticeTime'),
  maxDaysNotice: selector(state, 'maxDaysNotice'),
  cancellationPolicy: selector(state, 'cancellationPolicy'),
  availableDates: selector(state, 'availableDates'),
  availableDatesPrices: selector(state, 'availableDatesPrices'),
  currency: selector(state, 'currency'),
  availableCurrencies: state.currency.availableCurrencies,
  basePrice: selector(state, 'basePrice'),
  cleaningPrice: selector(state, 'cleaningPrice'),
  stepTwoDetails: state.calendar.stepTwoDetails,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Calendar)));
