import React, { Component } from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

import {
  Button,
  Grid,
  Row,
  FormGroup,
  Col,
  FormControl,
  FieldGroup,
  Panel
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cancellation.css';

// Components
import Summary from './Summary';
import DetailsForHost from './DetailsForHost';
import DetailsForGuest from './DetailsForGuest';
import NotFound from '../../routes/notFound/NotFound';

// Helpers
import validate from './validate';
import submit from './submit';

// Locale
import messages from '../../locale/messages';

class CancellationPolicy extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    userType: PropTypes.string.isRequired,
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      listId: PropTypes.number.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      guests: PropTypes.number.isRequired,
      hostId: PropTypes.string.isRequired,
      guestId: PropTypes.string.isRequired,
      basePrice: PropTypes.number.isRequired,
      cleaningPrice: PropTypes.number.isRequired,
      guestServiceFee: PropTypes.number.isRequired,
      hostServiceFee: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      confirmationCode: PropTypes.number.isRequired,
      reservationState: PropTypes.string.isRequired,
      listData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        timeZone: PropTypes.string.isRequired,
        listingData: PropTypes.shape({
          cancellation: PropTypes.shape({
            id: PropTypes.number.isRequired,
            policyName: PropTypes.string.isRequired,
            priorDays: PropTypes.number.isRequired,
            accommodationPriorCheckIn: PropTypes.number.isRequired,
            accommodationBeforeCheckIn: PropTypes.number.isRequired,
            accommodationDuringCheckIn: PropTypes.number.isRequired,
            guestFeePriorCheckIn: PropTypes.number.isRequired,
            guestFeeBeforeCheckIn: PropTypes.number.isRequired,
            guestFeeDuringCheckIn: PropTypes.number.isRequired,
            firstNightsRefundRestriction: PropTypes.number.isRequired,
            firstNightsRefundable: PropTypes.number.isRequired,
            guestCancellationTimeThreshold: PropTypes.string.isRequired,
            hostCancellationTimeThreshold: PropTypes.string.isRequired,
          })
        })
      }),
      messageData: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
      hostData: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        picture: PropTypes.string,
        userData: PropTypes.shape({
          email: PropTypes.string.isRequired
        })
      }),
      guestData: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        picture: PropTypes.string,
        userData: PropTypes.shape({
          email: PropTypes.string.isRequired
        })
      }),
      daysUntilCheckIn: PropTypes.shape({
        daysUntilCheckInGuestThreshold: PropTypes.number.isRequired,
        daysUntilCheckInHostThreshold: PropTypes.number.isRequired
      }),
    })
  };

  static defaultProps = {
    data: {
      checkIn: null,
      checkOut: null
    }
  };

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl
          {...input}
          className={className}
          componentClass="textarea"
          placeholder={label}
        >
          {children}
        </FormControl>
      </FormGroup>
    );
  }

  calculateCancellation(interval, nights) {
    const { data, data: { listData: { listingData } } } = this.props;
    let accomodation, guestFees, hostFees, remainingNights, policyName, cancellation, discountPerNight, numberOfNightsWithRefundRestriction, firstNightsRefundable, cleaningFeeRefund, daysUntilCheckInHostThreshold;
    if (data && data.cancellation) {
      ({ data: { cancellation } } = this.props);
    }
    if (!cancellation) {
      ({ data: { listData: { listingData: { cancellation } } } } = this.props);
    }
    if (cancellation) {
      policyName = cancellation.policyName;
      remainingNights = nights;
      discountPerNight = (data.discount && nights) ? data.discount / nights : 0;
      numberOfNightsWithRefundRestriction = 0;
      firstNightsRefundable = cancellation.firstNightsRefundable;
      cleaningFeeRefund = data.cleaningPrice;
      daysUntilCheckInHostThreshold = data.daysUntilCheckIn.daysUntilCheckInHostThreshold;
      if (interval >= cancellation.priorDays) {
        // Prior
        accomodation = cancellation.accommodationPriorCheckIn;
        guestFees = cancellation.guestFeePriorCheckIn;
        hostFees = cancellation.hostFeePriorCheckIn;
      } else if (interval < cancellation.priorDays && interval >= 0) {
        // Before
        accomodation = cancellation.accommodationBeforeCheckIn;
        guestFees = cancellation.guestFeeBeforeCheckIn;
        hostFees = cancellation.hostFeeBeforeCheckIn;
        numberOfNightsWithRefundRestriction = cancellation.firstNightsRefundRestriction;
      } else if (interval < cancellation.priorDays && interval < 0) {
        // During
        accomodation = cancellation.accommodationDuringCheckIn;
        guestFees = cancellation.guestFeeDuringCheckIn;
        hostFees = cancellation.hostFeeDuringCheckIn;
        remainingNights = nights + interval;
        cleaningFeeRefund = 0;
      }
    }
    return { policyName, accomodation, guestFees, hostFees, remainingNights, interval, nights, discountPerNight, numberOfNightsWithRefundRestriction, firstNightsRefundable, cleaningFeeRefund, daysUntilCheckInHostThreshold };
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { userType, data, data: { guestData, hostData, messageData, listData } } = this.props;
    let momentStartDate, momentEndDate, nights, interval, cancelData = {}, placeholder, daysUntilCheckInHostThreshold;

    if (data.checkIn != null && data.checkOut != null) {
      momentStartDate = moment(data.checkIn).startOf('day');
      momentEndDate = moment(data.checkOut).startOf('day');
      nights = momentEndDate.diff(momentStartDate, 'days');
      if (data.daysUntilCheckIn) {
        interval = data.daysUntilCheckIn.daysUntilCheckInGuestThreshold;
        daysUntilCheckInHostThreshold = data.daysUntilCheckIn.daysUntilCheckInHostThreshold;
      }
    }
    if (guestData && hostData && messageData && listData && (typeof interval === 'number' && !Number.isNaN(interval)) && (typeof daysUntilCheckInHostThreshold === 'number' && !Number.isNaN(daysUntilCheckInHostThreshold))) {
      cancelData = this.calculateCancellation(interval, nights);
      const { handleSubmit, submitting, error, pristine } = this.props;
      if (userType === 'host') {
        placeholder = formatMessage(messages.cancellationNote) + ' ' + guestData.firstName + ' ' + formatMessage(messages.cancellationNoteForHost);
      } else {
        placeholder = formatMessage(messages.cancellationNote) + ' ' + hostData.firstName + ' ' + formatMessage(messages.cancellationNoteForGuest);
      }
      return (
        <div>
          <Grid>
            <Row className={s.landingContaiconfirmationCodener}>
              <form onSubmit={handleSubmit(submit)}>
                <Col xs={12} sm={7} md={7} lg={7} >
                  <div className={s.cancelLeftBg}>
                    <Summary
                      userType={userType}
                      firstName={userType === 'host' ? guestData.firstName : hostData.firstName}
                      guests={data.guests}
                      nights={nights}
                      interval={interval}
                      cancelData={cancelData}
                    />
                    <Field
                      className={s.textareaInput}
                      name="message"
                      component={this.renderFormControlTextArea}
                      label={placeholder}
                    />
                    <p className={cx(s.landingStep, s.space3)}>
                      <span><FormattedMessage {...messages.reservationCancel} /></span>
                    </p>
                  </div>
                </Col>
                {
                  userType === 'host' && <DetailsForHost
                    userType={userType}
                    firstName={guestData.firstName}
                    guestEmail={guestData.userData.email}
                    hostName={hostData.firstName}
                    profileId={guestData.profileId}
                    picture={guestData.picture}
                    checkIn={data.checkIn}
                    checkOut={data.checkOut}
                    guests={data.guests}
                    title={listData.title}
                    timeZone={listData.timeZone}
                    listId={data.listId}
                    basePrice={data.basePrice}
                    cleaningPrice={data.cleaningPrice}
                    guestServiceFee={data.guestServiceFee}
                    hostServiceFee={data.hostServiceFee}
                    total={data.total}
                    currency={data.currency}
                    cancelData={cancelData}
                    reservationId={data.id}
                    threadId={data.messageData.id}
                    confirmationCode={data.confirmationCode}
                    holdeData={data}
                    hostEmail={hostData.userData.email}
                  />
                }
                {
                  userType === 'guest' && <DetailsForGuest
                    userType={userType}
                    firstName={hostData.firstName}
                    hostEmail={hostData.userData.email}
                    guestName={guestData.firstName}
                    profileId={hostData.profileId}
                    picture={hostData.picture}
                    checkIn={data.checkIn}
                    checkOut={data.checkOut}
                    guests={data.guests}
                    title={listData.title}
                    timeZone={listData.timeZone}
                    listId={data.listId}
                    basePrice={data.basePrice}
                    cleaningPrice={data.cleaningPrice}
                    guestServiceFee={data.guestServiceFee}
                    hostServiceFee={data.hostServiceFee}
                    total={data.total}
                    currency={data.currency}
                    cancelData={cancelData}
                    reservationId={data.id}
                    threadId={data.messageData.id}
                    confirmationCode={data.confirmationCode}
                    discount={data.discount ? data.discount : 0}
                    holdeData={data}
                    guestEmail={guestData.userData.email}
                  />
                }
              </form>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return <NotFound />
    }

  }
}

CancellationPolicy = reduxForm({
  form: 'CancellationForm', // a unique name for this form
  validate,
  onSubmit: submit
})(CancellationPolicy);

export default injectIntl(withStyles(s)(CancellationPolicy));
