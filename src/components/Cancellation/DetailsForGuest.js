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
import bannerone from './background_debtcancellation.jpg';
import defaultPic from './large_no_image.jpeg';

// Helpers
import { listingBaseUrl } from '../../helpers/cdnImages'

// Common functionality
import calcPrice from './calcPrice';

class DetailsForGuest extends React.Component {

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
    hostEmail: PropTypes.string.isRequired,
    guestName: PropTypes.string.isRequired,
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
      hostFees: PropTypes.number.isRequired,
      remainingNights: PropTypes.number,
      interval: PropTypes.number.isRequired,
      nights: PropTypes.number.isRequired,
      discountPerNight: PropTypes.number.isRequired,
      numberOfNightsWithRefundRestriction: PropTypes.number.isRequired,
      firstNightsRefundable: PropTypes.number.isRequired,
      cleaningFeeRefund: PropTypes.number.isRequired
    }).isRequired,
    message: PropTypes.string,
    initialize: PropTypes.any,
    submit: PropTypes.any,
    base: PropTypes.string,
    toCurrency: PropTypes.string,
  };

  static defaultProps = {};

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
    const { reservationId, userType, firstName, hostEmail, checkIn, checkOut, guests, title, timeZone, listId, picture, profileId, guestName } = this.props;
    const { basePrice, cleaningPrice, guestServiceFee, hostServiceFee, total, currency, threadId, hostId, confirmationCode } = this.props;
    const { cancelData: { policyName, accomodation, guestFees, hostFees, remainingNights, interval, nights, discountPerNight, numberOfNightsWithRefundRestriction, firstNightsRefundable, cleaningFeeRefund } } = this.props;
    const { message, discount, holdeData, guestEmail } = this.props;
    const { base, toCurrency } = this.props;

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

    let isDisabled = true, cancellationData = {};
    let checkInDate = (checkIn != null && timeZone) ? moment(checkIn).tz(timeZone).format('Do MMM YYYY') : '';
    let checkOutDate = (checkOut != null && timeZone) ? moment(checkOut).tz(timeZone).format('Do MMM YYYY') : '';

    let refundableNightPrice = 0, nonRefundableNightPrice = 0, refundWithoutGuestFee = 0;
    let updatedGuestFee = 0, refundableGuestFee = 0, updatedHostFee = 0, payoutToHost = 0, subtotal = 0;
    let priceRemainingNightsWithoutRefundRestriction = 0, remainingNightsWithoutRefundRestriction = 0, specialPriceRemainingNightsWithoutRefundRestriction = false;
    let priceRemainingNightsWithRefundRestriction = 0, remainingNightsWithRefundRestriction = 0, specialPriceRemainingNightsWithRefundRestriction = false;
    let priceNoRefundNights = 0, noRefundNights = 0, specialPriceNoRefundNights = false;

    let cleaningFeeNonRefundable = cleaningPrice - cleaningFeeRefund;
    let nonRefundableGuestFee = guestServiceFee;

    if (remainingNights >= 0) {
      const momentCheckOut = moment(checkOut);
      const momentRemainingNightsStart = momentCheckOut.clone();
      momentRemainingNightsStart.subtract(remainingNights, 'days');
      const momentRemainingNightsWithoutRefundRestrictionStart = momentRemainingNightsStart.clone();
      momentRemainingNightsWithoutRefundRestrictionStart.add(numberOfNightsWithRefundRestriction, 'days');
      const momentCheckIn = moment(checkIn);
      
      updatedGuestFee = guestServiceFee * ((100 - guestFees) / 100);
      refundableGuestFee = guestServiceFee * (guestFees / 100);
      nonRefundableGuestFee = guestServiceFee - refundableGuestFee;

      ({priceForDays: priceRemainingNightsWithoutRefundRestriction, nights: remainingNightsWithoutRefundRestriction, isSpecialPrice: specialPriceRemainingNightsWithoutRefundRestriction} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentRemainingNightsWithoutRefundRestrictionStart, momentCheckOut, discountPerNight));
      ({priceForDays: priceRemainingNightsWithRefundRestriction, nights: remainingNightsWithRefundRestriction, isSpecialPrice: specialPriceRemainingNightsWithRefundRestriction} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentRemainingNightsStart, momentRemainingNightsWithoutRefundRestrictionStart, discountPerNight));
      ({priceForDays: priceNoRefundNights, nights: noRefundNights, isSpecialPrice: specialPriceNoRefundNights} = calcPrice(basePrice, holdeData.bookingSpecialPricing, momentCheckIn, momentRemainingNightsStart, discountPerNight));

      refundableNightPrice = priceRemainingNightsWithoutRefundRestriction * (accomodation / 100)
        + priceRemainingNightsWithRefundRestriction * (firstNightsRefundable / 100)
        + refundableGuestFee
        + cleaningFeeRefund;

      const payoutAmount = total - (refundableNightPrice - refundableGuestFee);
      payoutToHost = Math.max(0, payoutAmount - hostServiceFee * ((100 - hostFees) / 100));
      updatedHostFee = payoutAmount - payoutToHost;
    } else {
      refundableNightPrice = 0;
      payoutToHost = total - hostServiceFee;
      updatedHostFee = hostServiceFee;
      updatedGuestFee = guestServiceFee;
    }

    nonRefundableNightPrice = (total + guestServiceFee) - refundableNightPrice;

    subtotal = total + guestServiceFee;


    cancellationData = {
      reservationId,
      cancellationPolicy: policyName,
      refundToGuest: refundableNightPrice,
      payoutToHost: payoutToHost,
      guestServiceFee: updatedGuestFee,
      hostServiceFee: updatedHostFee,
      total: subtotal,
      currency,
      threadId,
      cancelledBy: 'guest',
      checkIn,
      checkOut,
      listTimeZone: timeZone,
      guests,
      guestName,
      hostName: firstName,
      listTitle: title,
      confirmationCode,
      hostEmail,
      guestEmail
    };
    if (message) {
      isDisabled = false;
    }

    return (
      <div>
        <Col xs={12} sm={12} md={5} lg={5} >
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
              nonRefundableNightPrice > 0 && <Row>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textLeft}>
                  {noRefundNights > 0 && <NightsCalculationLabels
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={noRefundNights}
                    specialPrice={specialPriceNoRefundNights ? priceNoRefundNights : null}
                  />}
                  <NightsCalculationLabels
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={remainingNightsWithoutRefundRestriction}
                    specialPrice={specialPriceRemainingNightsWithoutRefundRestriction ? priceRemainingNightsWithoutRefundRestriction : null}
                    accomodationPercentage={100 - accomodation}
                    restrictionNights={remainingNightsWithRefundRestriction}
                    restrictionPercentage={100 - firstNightsRefundable}
                    restrictionSpecialPrice={specialPriceRemainingNightsWithRefundRestriction ? priceRemainingNightsWithRefundRestriction : null}
                  />
                  {nonRefundableGuestFee > 0 && 
                    <span><FormattedMessage {...messages.serviceFee} />{guestFees != 0 ? ` * ${100 - guestFees}%` : ''}<br /></span>
                  }
                  {cleaningFeeNonRefundable > 0 && 
                    <span><FormattedMessage {...messages.cleaningFee} /><br /></span>
                  }
                  <span className={cx(s.textHigh, s.textBold)}>
                    <FormattedMessage {...messages.nonRefundable} />
                  </span><br />
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textRight}>
                  {noRefundNights > 0 && <NightsCalculationResults
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={noRefundNights}
                    specialPrice={specialPriceNoRefundNights ? priceNoRefundNights : null}
                  />}
                  <NightsCalculationResults
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={remainingNightsWithoutRefundRestriction}
                    specialPrice={specialPriceRemainingNightsWithoutRefundRestriction ? priceRemainingNightsWithoutRefundRestriction : null}
                    accomodationPercentage={100 - accomodation}
                    restrictionNights={remainingNightsWithRefundRestriction}
                    restrictionPercentage={100 - firstNightsRefundable}
                    restrictionSpecialPrice={specialPriceRemainingNightsWithRefundRestriction ? priceRemainingNightsWithRefundRestriction : null}
                  />
                  {nonRefundableGuestFee > 0 &&
                    <span>
                      <CurrencyConverter
                        amount={nonRefundableGuestFee}
                        from={currency}
                      /><br />
                    </span>
                  }
                  {cleaningFeeNonRefundable > 0 && 
                    <span>
                      <CurrencyConverter
                        amount={cleaningFeeNonRefundable}
                        from={currency}
                      /><br />
                    </span>
                  }
                  <span>
                    { toCurrency !== currency && 
                      <span className={cx(s.textLine)}>{'('}
                          <CurrencyConverter
                            amount={nonRefundableNightPrice}
                            from={currency}
                          />
                        {') '}
                      </span>
                    }
                    <span className={cx(s.textHigh, s.textBold, s.textLine)}>
                      <CurrencyConverter
                        amount={nonRefundableNightPrice}
                        from={currency}
                        noConversion={true}
                      />
                    </span>
                  </span>
                </Col>
              </Row>
            }

            {
              refundableNightPrice > 0 && <Row>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textLeft}>
                  <NightsCalculationLabels
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={remainingNightsWithoutRefundRestriction}
                    specialPrice={specialPriceRemainingNightsWithoutRefundRestriction ? priceRemainingNightsWithoutRefundRestriction : null}
                    accomodationPercentage={accomodation}
                    restrictionNights={remainingNightsWithRefundRestriction}
                    restrictionPercentage={firstNightsRefundable}
                    restrictionSpecialPrice={specialPriceRemainingNightsWithRefundRestriction ? priceRemainingNightsWithRefundRestriction : null}
                  />
                  {refundableGuestFee > 0 && 
                    <span><FormattedMessage {...messages.serviceFee} />{guestFees != 100 ? ` * ${guestFees}%` : ''}<br /></span>
                  }
                  {cleaningFeeRefund > 0 && 
                    <span><FormattedMessage {...messages.cleaningFee} /><br /></span>
                  }
                  <span className={cx(s.textHigh, s.textBold)}>
                    <FormattedMessage {...messages.refundable} />
                  </span><br />
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className={s.textRight}>
                  <NightsCalculationResults
                    basePrice={basePrice}
                    discountPerNight={discountPerNight}
                    currency={currency}
                    nights={remainingNightsWithoutRefundRestriction}
                    specialPrice={specialPriceRemainingNightsWithoutRefundRestriction ? priceRemainingNightsWithoutRefundRestriction : null}
                    accomodationPercentage={accomodation}
                    restrictionNights={remainingNightsWithRefundRestriction}
                    restrictionPercentage={firstNightsRefundable}
                    restrictionSpecialPrice={specialPriceRemainingNightsWithRefundRestriction ? priceRemainingNightsWithRefundRestriction : null}
                  />
                  {refundableGuestFee > 0 &&
                    <span>
                      <CurrencyConverter
                        amount={refundableGuestFee}
                        from={currency}
                      /><br />
                    </span>
                  }
                  {cleaningFeeRefund > 0 && 
                    <span>
                      <CurrencyConverter
                        amount={cleaningFeeRefund}
                        from={currency}
                      /><br />
                    </span>
                  }
                  <span>
                    { toCurrency !== currency && 
                      <span>{'('}
                          <CurrencyConverter
                            amount={refundableNightPrice}
                            from={currency}
                          />
                        {') '}
                      </span>
                    }
                    <span className={cx(s.textHigh, s.textBold)}>
                      <CurrencyConverter
                        amount={refundableNightPrice}
                        from={currency}
                        noConversion={true}
                      />
                    </span>
                  </span>
                </Col>
              </Row>
            }

            <div className={cx(s.spaceTop3)}>
              {/* {refundableNightPrice > 0 && <p className={cx(s.landingStep)}><span><FormattedMessage {...messages.refundCost1} /></span></p>} */}
              <p className={cx(s.landingStep)}><span>{refundableNightPrice > 0 ? <FormattedMessage {...messages.refundCost1} /> : <FormattedMessage {...messages.refundCost2} />}</span></p>
              {toCurrency !== currency &&
                <p className={cx(s.landingStep)}>
                  <FormattedMessage {...messages.currencyNotePaymentServiceProvider} values={{currency: currency}}/>
                </p>
              }
            </div>
            
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
              to={"/trips/current"}
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
      </div >
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

export default withStyles(s)(connect(mapState, mapDispatch)(DetailsForGuest));
