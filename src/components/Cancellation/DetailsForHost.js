import React, { Component } from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { FormattedMessage, injectIntl } from 'react-intl';
// Redux
import { connect } from 'react-redux';
import { formValueSelector, initialize, submit } from 'redux-form';

import {
  Row,
  Col,
  Panel,
  FormGroup,
  Button
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cancellation.css';
import logoUrl from './logo-small.jpg';

// Components
import Link from '../Link';
import Avatar from '../Avatar';
import CurrencyConverter from '../CurrencyConverter';
import NightsCalculationLabels from './NightsCalculationLabels';
import NightsCalculationResults from './NightsCalculationResults';

// Locale
import messages from '../../locale/messages';

// Images
import defaultPic from './large_no_image.jpeg';

// Helpers
import { listingBaseUrl } from '../../helpers/cdnImages'

// Common functionality
import calcPrice from './calcPrice';

class DetailsForHost extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    reservationId: PropTypes.number.isRequired,
    confirmationCode: PropTypes.number.isRequired,
    threadId: PropTypes.number.isRequired,
    userType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
    listId: PropTypes.number.isRequired,
    checkIn: PropTypes.string.isRequired,
    checkOut: PropTypes.string.isRequired,
    guests: PropTypes.number.isRequired,
    profileId: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    guestEmail: PropTypes.string.isRequired,
    hostName: PropTypes.string.isRequired,
    picture: PropTypes.string,
    basePrice: PropTypes.number.isRequired,
    cleaningPrice: PropTypes.number.isRequired,
    guestServiceFee: PropTypes.number.isRequired,
    hostServiceFee: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    cancelData: PropTypes.shape({
      policyName: PropTypes.string.isRequired,
      accomodation: PropTypes.number.isRequired,
      guestFees: PropTypes.number.isRequired,
      remainingNights: PropTypes.number,
      interval: PropTypes.number.isRequired,
      nights: PropTypes.number.isRequired,
      discountPerNight: PropTypes.number.isRequired,
      daysUntilCheckInHostThreshold: PropTypes.number.isRequired
    }).isRequired,
    message: PropTypes.string,
    initialize: PropTypes.any,
    submit: PropTypes.any,
    base: PropTypes.string,
    toCurrency: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async handleCancel(cancellationData) {
    const { initialize, submit } = this.props;
    await initialize('CancellationForm', cancellationData, true);
    await submit('CancellationForm');
  }

  render() {
    const { reservationId, userType, firstName, guestEmail, checkIn, checkOut, guests, title, timeZone, listId, picture, profileId, hostName } = this.props;
    const { basePrice, cleaningPrice, guestServiceFee, hostServiceFee, total, currency, threadId, confirmationCode } = this.props;
    const { cancelData: { policyName, nights, daysUntilCheckInHostThreshold, discountPerNight } } = this.props;
    const { message, holdeData, hostEmail } = this.props;
    const { formatMessage } = this.props.intl;
    const { base, toCurrency } = this.props;

    let checkInDate = (checkIn != null && timeZone) ? moment(checkIn).tz(timeZone).format('Do MMM YYYY') : '';
    let checkOutDate = (checkOut != null && timeZone) ? moment(checkOut).tz(timeZone).format('Do MMM YYYY') : '';
    let refundAmount = 0, refundAccommodation = 0, missedEarnings = 0, refundDays = 0, earnedAmount = 0, earnedAccommodation = 0, earnedDays = 0, subtotal = 0, updatedHostFee = 0;
    let specialPriceRefund = false, specialPriceEarning = false;
    let isDisabled = true;

    let coverImage = holdeData && holdeData.listData && holdeData.listData.listPhotos.find(o => o.id == holdeData.listData.coverPhoto);

    let path = listingBaseUrl() + 'x_medium_';
    let showImage;
    if (coverImage) {
      showImage = path + coverImage.name;
    } else if (!coverImage && holdeData.listData && holdeData.listData.listPhotos.length > 0) {
      showImage = path + (holdeData.listData && holdeData.listData.listPhotos[0].name);
    } else {
      showImage = defaultPic;
    }

    let remainingNightsHostCancellation = nights;
    const momentCheckOut = moment(checkOut);
    const momentCheckIn = moment(checkIn);

    if (daysUntilCheckInHostThreshold < -1) {
      remainingNightsHostCancellation = nights + daysUntilCheckInHostThreshold + 1;
      updatedHostFee = hostServiceFee;
      if (remainingNightsHostCancellation >= 0) {
        const momentRemainingNightsStart = momentCheckOut.clone();
        momentRemainingNightsStart.subtract(remainingNightsHostCancellation, 'days');
        ({priceForDays: refundAccommodation, isSpecialPrice: specialPriceRefund} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentRemainingNightsStart, momentCheckOut, discountPerNight));
        ({isSpecialPrice: specialPriceEarning} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentCheckIn, momentRemainingNightsStart, discountPerNight));
        refundAmount =  refundAccommodation + guestServiceFee;
        missedEarnings = refundAccommodation;
        refundDays = remainingNightsHostCancellation;
        earnedAmount = Math.max(0, total - missedEarnings - hostServiceFee);
        updatedHostFee = total - missedEarnings - earnedAmount;
        earnedDays = nights - remainingNightsHostCancellation;
        earnedAccommodation = total - refundAccommodation - cleaningPrice;
      } else {
        earnedAmount = total - hostServiceFee;
        earnedDays = nights;
        earnedAccommodation = total - cleaningPrice;
        ({isSpecialPrice: specialPriceEarning} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentCheckIn, momentCheckOut, discountPerNight));
      }
    } else {
      refundAmount = total + guestServiceFee;
      missedEarnings = total - hostServiceFee;
      earnedAmount = 0;
      refundDays = nights;
      refundAccommodation = total - cleaningPrice;
      ({isSpecialPrice: specialPriceRefund} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentCheckIn, momentCheckOut, discountPerNight));
    }

    subtotal = total + guestServiceFee;

    let cancellationData = {
      reservationId,
      cancellationPolicy: policyName,
      refundToGuest: refundAmount,
      payoutToHost: earnedAmount,
      guestServiceFee: 0,
      hostServiceFee: updatedHostFee,
      total: subtotal,
      currency,
      threadId,
      cancelledBy: 'host',
      checkIn,
      checkOut,
      listTimeZone: timeZone,
      guests,
      hostName,
      guestName: firstName,
      listTitle: title,
      confirmationCode,
      guestEmail,
      hostEmail
    };
    if (message) {
      isDisabled = false;
    }

    return (
      <div>
        <Col xs={12} sm={5} md={5} lg={5}>
          <div className={s.bgCover}>
            <a href={"/rooms/" + listId} target="_blank">
              <div className={s.cancelBg} style={{ backgroundImage: `url(${showImage})` }}>
              </div>
            </a>
          </div>
          <Panel className={s.panelHeader}>
            <Row>
              <Col xs={8} sm={8} md={8} lg={8} >
                <div className={s.textTruncate}>
                  <span className={cx(s.textHigh, s.textBold)}>{firstName}</span><br />
                  {/* <Link to={"/rooms/" + listId}> */}
                  <a href={"/rooms/" + listId} target="_blank">
                    {title}
                  </a>
                  {/* </Link> */}
                </div>
                <br />
                <div>
                  <span>{checkInDate} - {checkOutDate}</span>
                </div>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} className={s.textRight}>
                <div className={s.profileAvatarSection}>
                  <Avatar
                    source={picture}
                    height={65}
                    width={65}
                    title={firstName}
                    className={s.profileAvatar}
                    withLink
                    linkClassName={s.profileAvatarLink}
                    profileId={profileId}
                  />
                </div>
              </Col>
            </Row>
            <hr />
            {
              refundDays > 0 && <Row>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textLeft}>
                  <NightsCalculationLabels
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={refundDays}
                    specialPrice={specialPriceRefund ? refundAccommodation : null}
                  />
                  {earnedDays === 0 && cleaningPrice > 0 && <span>{formatMessage(messages.cleaningFee)}<br /></span>}
                  {earnedDays === 0 && hostServiceFee > 0 && <span>{formatMessage(messages.serviceFee)}<br /></span>}
                  <span className={cx(s.textHigh, s.textBold)}>
                    <FormattedMessage {...messages.missedEarnings} />
                  </span><br />
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textRight}>
                  <NightsCalculationResults
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={refundDays}
                    specialPrice={specialPriceRefund ? refundAccommodation : null}
                  />
                  {earnedDays === 0 && cleaningPrice > 0 &&
                      <span>
                        + <CurrencyConverter
                          amount={cleaningPrice}
                          from={currency}
                        />
                      <br /></span>}
                  {earnedDays === 0 && hostServiceFee > 0 &&
                  <span>
                    - <CurrencyConverter
                      amount={hostServiceFee}
                      from={currency}
                    />
                  <br /></span>}
                  <span>
                    { toCurrency !== currency && 
                      <span className={cx(s.textLine)}>{'('}
                          <CurrencyConverter
                            amount={missedEarnings}
                            from={currency}
                          />
                        {') '}
                      </span>
                    }
                    <span className={cx(s.textHigh, s.textBold, s.textLine)}>
                      <CurrencyConverter
                        amount={missedEarnings}
                        from={currency}
                        noConversion={true}
                      />
                    </span>
                  </span><br />
                </Col>
              </Row>
            }
            {
              earnedDays > 0 && <Row>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textLeft}>
                  <NightsCalculationLabels
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={earnedDays}
                    specialPrice={specialPriceEarning ? earnedAccommodation : null}
                  />
                  {cleaningPrice > 0 && <span>{formatMessage(messages.cleaningFee)}<br /></span>}
                  {updatedHostFee > 0 && <span>{formatMessage(messages.serviceFee)}<br /></span>}
                  <span className={cx(s.textHigh, s.textBold)}>
                    <FormattedMessage {...messages.earnings} />
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textRight}>
                  <NightsCalculationResults
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={earnedDays}
                    specialPrice={specialPriceEarning ? earnedAccommodation : null}
                  />
                  {cleaningPrice > 0 &&
                    <span>
                      + <CurrencyConverter
                        amount={cleaningPrice}
                        from={currency}
                      />
                    <br /></span>
                  }
                  {updatedHostFee > 0 &&
                  <span>
                    - <CurrencyConverter
                      amount={updatedHostFee}
                      from={currency}
                    />
                    <br /></span>
                  }
                  <span>
                    { toCurrency !== currency && 
                      <span>{'('}
                          <CurrencyConverter
                            amount={earnedAmount}
                            from={currency}
                          />
                        {') '}
                      </span>
                    }
                    <span className={cx(s.textHigh, s.textBold)}>
                      <CurrencyConverter
                        amount={earnedAmount}
                        from={currency}
                        noConversion={true}
                      />
                    </span>
                  </span>
                </Col>
              </Row>
            }
            {earnedAmount > 0 &&
            <div className={cx(s.space3, s.spaceTop3)}>
              <p className={cx(s.landingStep)}>
                <FormattedMessage {...messages.totalEarningsProvided} />
              </p>
            </div>}
            {earnedAmount <= 0 &&
            <div className={cx(s.space3, s.spaceTop3)}>
              <p className={cx(s.landingStep)}>
                <FormattedMessage {...messages.noPayout} />
              </p>
            </div>}
            {toCurrency !== currency &&
            <div className={cx(s.space3, s.spaceTop3)}>
              <p className={cx(s.landingStep)}>
                <FormattedMessage {...messages.currencyNotePaymentServiceProvider} values={{currency: currency}}/>
              </p>
            </div>}
            <div className={s.cancellation}>
              <a href={'/cancellation-policies/' + policyName} target="_blank">Cancellation policy: <span className={s.greenColor}>{policyName}</span></a>
            </div>
          </Panel>
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <hr className={cx(s.horizontalLineThrough, s.spaceTop4)} />
        </Col>
        <FormGroup className={s.formGroup}>
          <Col xs={12} sm={12} md={7} lg={7}>
            <Link
              className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft, s.btnWidth)}
              to={"/reservation/current"}
            >
              <FormattedMessage {...messages.keepReservation} />
            </Link>
            <Button
              className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight, s.btnWidth)}
              onClick={() => this.handleCancel(cancellationData)}
              disabled={isDisabled}
            >
              <FormattedMessage {...messages.cancelYourReservation} />
            </Button>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

const selector = formValueSelector('CancellationForm'); // <-- same as form name

const mapState = (state) => ({
  message: selector(state, 'message'),
  base: state.currency.base,
  toCurrency: state.currency.to,
});

const mapDispatch = {
  initialize,
  submit
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DetailsForHost)));
