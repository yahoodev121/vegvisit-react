import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label,
} from 'react-bootstrap';
import * as FontAwesome from 'react-icons/lib/fa';
import logoUrl from './logo-small.jpg';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Payment.css';
import { FormattedMessage, injectIntl } from 'react-intl';

// Component
import PaymentDetails from './PaymentDetails';
import PaymentForm from './PaymentForm';
import Avatar from '../../Avatar';
import CurrencyConverter from '../../CurrencyConverter';
import ListCoverPhoto from '../../ListCoverPhoto';
import { connect } from 'react-redux';

// Helper
import { convert } from '../../../helpers/currencyConvertion';
import { calculatePrice } from '../../../helpers/calculatePrice';

// Locale
import messages from '../../../locale/messages';

class Payment extends Component {

  static propTypes = {
    listId: PropTypes.number.isRequired,
    hostId: PropTypes.string.isRequired,
    guestId: PropTypes.string.isRequired,
    guestEmail: PropTypes.string.isRequired,
    hostDisplayName: PropTypes.string.isRequired,
    hostPicture: PropTypes.string,
    coverPhoto: PropTypes.number,
    listTitle: PropTypes.string.isRequired,
    allowedPersonCapacity: PropTypes.number.isRequired,
    listType: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
    houseRules: PropTypes.arrayOf(PropTypes.shape({
      listsettings: PropTypes.shape({
        itemName: PropTypes.string.isRequired
      })
    })),
    checkIn: PropTypes.object.isRequired,
    checkOut: PropTypes.object.isRequired,
    guests: PropTypes.number.isRequired,
    preApprove: PropTypes.bool.isRequired,
    basePrice: PropTypes.number.isRequired,
    cleaningPrice: PropTypes.number,
    currency: PropTypes.string.isRequired,
    weeklyDiscount: PropTypes.number,
    monthlyDiscount: PropTypes.number,
    listPhotos: PropTypes.array,
    serviceFees: PropTypes.shape({
      guest: PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired
      }).isRequired,
      host: PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    base: PropTypes.string.isRequired,
    rates: PropTypes.object.isRequired,
    bookingType: PropTypes.string.isRequired,
    policyName: PropTypes.string.isRequired,
    formatMessage: PropTypes.any,
    toCurrency: PropTypes.string,
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { guestEmail, hostDisplayName, hostPicture, coverPhoto, listPhotos, bookingType, policyName } = this.props;
    const { listId, listTitle, listType, city, state, country, timeZone, allowedPersonCapacity } = this.props;
    const { houseRules, hostId, guestId, hostEmail } = this.props;
    const { guests, checkIn, checkOut, preApprove } = this.props;
    const { basePrice, cleaningPrice, currency, weeklyDiscount, monthlyDiscount, messageType } = this.props;
    const { serviceFees, base, rates, toCurrency, specialPricing, bookingData, securityDeposit } = this.props;
    let listBlockedPrice;
    if (bookingData && bookingData.listBlockedPrice && bookingData.listBlockedPrice instanceof Array) {
      listBlockedPrice = bookingData.listBlockedPrice;
    }
    let { discount, discountType, guestServiceFee, hostServiceFee, totalWithoutFees, isSpecialPriceAssigned, bookingSpecialPricing, isAverage, dayDifference, priceForDays, total } = calculatePrice(checkIn, checkOut, timeZone, listBlockedPrice, basePrice, serviceFees, base, rates, currency, monthlyDiscount, formatMessage, weeklyDiscount, cleaningPrice, messages);

    let checkInDate = (checkIn != null && timeZone) ? moment(checkIn).tz(timeZone).format('ddd, Do MMM') : '';
    let checkOutDate = (checkOut != null && timeZone) ? moment(checkOut).tz(timeZone).format('ddd, Do MMM') : '';

    let initialValues = {
      listId,
      listTitle,
      hostId,
      guestId,
      guests,
      checkIn,
      checkOut,
      basePrice,
      currency,
      cleaningPrice,
      discount,
      discountType,
      guestServiceFee,
      hostServiceFee,
      total: totalWithoutFees,
      bookingType,
      paymentType: '1',
      guestEmail,
      isSpecialPriceAssigned,
      bookingSpecialPricing: JSON.stringify(bookingSpecialPricing),
      isSpecialPriceAverage: isAverage.toFixed(2),
      dayDifference,
      messageType,
      paymentCurrency: base
    };


    return (

      <Grid>
        <Row>
          <Col md={5} mdPush={7}>
            <div className={cx(s.summaryCard, s.colCenter)}>
              <ListCoverPhoto
                className={cx(s.bannerImage, s.backgroundCover)}
                coverPhoto={coverPhoto}
                listPhotos={listPhotos}
                photoType={"x_medium"}
                bgImage
              />
              <div className={cx(s.hostProfilePhoto, s.pullRight, s.space3)}>
                <div className={cx(s.profileAvatarLink, s.profileAvatarSection)}>
                  <Avatar
                    source={hostPicture}
                    title={hostDisplayName}
                    className={s.profileAvatar}
                  />
                </div>
              </div>
              <Panel className={s.panelHeader}>
                <div className={cx(s.textMuted, s.space2)}>
                  <span><FormattedMessage {...messages.hostedBy} /> {hostDisplayName}</span>
                </div>
                <div className={cx(s.textLarge, s.space1)}>
                  <span>{listTitle}</span>
                </div>
                <div className={cx(s.textMuted)}>
                  <ul className={s.listStyle}>
                    <li>
                      {listType}
                    </li>
                  </ul>
                  <div> {city}, {state}, {country} </div>
                </div>
                <div className={s.spaceTop2}>
                  <hr className={s.horizondalLine} />
                  <Row className={cx(s.spaceTop3, s.space3)}>
                    <Col xs={5} sm={5}>
                      <div className={cx(s.textGray, s.space1)}>
                        <span><FormattedMessage {...messages.checkIn} /></span>
                      </div>
                      <div className={s.checkInDate}>{checkInDate}</div>
                    </Col>
                    <Col xs={1} sm={1}>
                      <FontAwesome.FaChevronRight className={cx(s.textGray, s.chevronIcon)} />
                    </Col>
                    <Col xs={5} sm={5} className={cx(s.pullRight, s.textLeft)}>
                      <div className={cx(s.textGray, s.space1)}>
                        <span><FormattedMessage {...messages.checkOut} /></span>
                      </div>
                      <div className={s.checkInDate}>{checkOutDate}</div>
                    </Col>
                  </Row>
                  <hr className={s.horizondalLine} />
                </div>

                <PaymentDetails
                  basePrice={basePrice}
                  cleaningPrice={cleaningPrice}
                  currency={currency}
                  dayDifference={dayDifference}
                  priceForDays={priceForDays}
                  discount={discount}
                  discountType={discountType}
                  serviceFees={guestServiceFee}
                  total={total}
                  bookingSpecialPricing={bookingSpecialPricing}
                  isSpecialPriceAssigned={isSpecialPriceAssigned}
                  isAverage={isAverage}
                  securityDeposit={securityDeposit}
                />
                <div>
                  <span><FormattedMessage {...messages.cancellationPolicy} />: </span>
                  {/* <span>{policyName}</span> */}
                  <a href={'/cancellation-policies/' + policyName} target="_blank"><span>{policyName}</span></a>
                  <div className={s.spaceTop2}>
                    {
                      total > 0 && toCurrency !== currency &&
                      <div className={s.spaceTop2}>
                        <FormattedMessage {...messages.paymentCurrencyNotePaypal} values={{currency: currency}}/>
                      </div>
                    }
                  </div>
                  <div className={s.spaceTop2}>
                    {
                      securityDeposit > 0 &&
                      <span>Security Deposit: <FormattedMessage {...messages.securityDepositinfo1} />{' '}
                        <CurrencyConverter
                          amount={securityDeposit}
                          from={currency}
                        />
                      </span>
                    }
                  </div>
                </div>
              </Panel>
            </div>
          </Col>
          <Col md={7} mdPull={5}>
            <PaymentForm
              hostDisplayName={hostDisplayName}
              houseRules={houseRules}
              allowedPersonCapacity={allowedPersonCapacity}
              initialValues={initialValues}
              listId={listId}
              bookingType={bookingType}
              hostEmail={hostEmail}
              hostPicture={hostPicture}
              hostId={hostId}
              guestId={guestId}
              total={total}
              basePrice={basePrice}  
              timeZone={timeZone}
            />
          </Col>
        </Row>
      </Grid>

    );
  }
}

const mapState = (state) => ({
  messageType: state.book.bookDetails ? state.book.bookDetails.messageType : null,
});

const mapDispatch = {

};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Payment)));

