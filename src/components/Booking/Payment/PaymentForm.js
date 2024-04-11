import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'

// Redux
import { connect } from 'react-redux'

// Redux Form
import {
  Field,
  reduxForm,
  formValueSelector,
  reset,
  getFormValues
} from 'redux-form'
import { graphql, gql, compose } from 'react-apollo'

// PayPal
import { PayPalButton } from 'react-paypal-button-v2'
import { paypalClientId } from '../../../config'

import { Row, FormGroup, Col, FormControl } from 'react-bootstrap'

import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Payment.css'

// Helpers
import validate from './validate'
// import submit from './submit';
import history from '../../../core/history'
import { convert } from '../../../helpers/currencyConvertion'
import log from '../../../helpers/clientLog'
import formatAmountForCurrency from '../../../helpers/formatAmountForCurrency'
import isValidNumber from '../../../helpers/isValidNumber'

// Component
import HouseRules from './HouseRules'
import Loader from '../../Loader'
import Link from '../../Link'

// Locale
import messages from '../../../locale/messages'

import { requestToBook } from '../../../actions/message/contactHost'
import { makePayment } from '../../../actions/booking/makePayment'

class PaymentForm extends Component {
  static propTypes = {
    houseRules: PropTypes.arrayOf(
      PropTypes.shape({
        listsettings: PropTypes.shape({
          itemName: PropTypes.string.isRequired
        })
      })
    ),
    hostDisplayName: PropTypes.string.isRequired,
    allowedPersonCapacity: PropTypes.number.isRequired,
    initialValues: PropTypes.shape({
      listId: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      hostId: PropTypes.string.isRequired,
      guestId: PropTypes.string.isRequired,
      checkIn: PropTypes.object.isRequired,
      checkOut: PropTypes.object.isRequired,
      guests: PropTypes.number.isRequired,
      basePrice: PropTypes.number.isRequired,
      cleaningPrice: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      weeklyDiscount: PropTypes.number,
      monthlyDiscount: PropTypes.number,
      paymentType: PropTypes.number,
      paymentCurrency: PropTypes.string.isRequired
    }).isRequired,
    paymentCurrencyList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        symbol: PropTypes.string.isRequired,
        isEnable: PropTypes.bool.isRequired,
        isPayment: PropTypes.bool.isRequired
      })
    ),
    paymentLoading: PropTypes.bool,
    formatMessage: PropTypes.any,
    preApprove: PropTypes.any
  }

  static defaultProps = {
    paymentCurrencyList: [],
    paymentLoading: false,
    preApprove: true
  }

  constructor (props) {
    super(props)
    this.state = {
			isExpired: false
		};
    this.renderpaymentCurrencies = this.renderpaymentCurrencies.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount () {
  }

  componentDidUpdate (prevProps) {
  }

  renderFormControlSelect = ({
    input,
    label,
    meta: { touched, error },
    children,
    className,
    disabled
  }) => {
    const { formatMessage } = this.props.intl
    return (
      <div>
        {touched && error && (
          <span className={s.errorMessage}>{formatMessage(error)}</span>
        )}
        <FormControl
          disabled={disabled}
          componentClass='select'
          {...input}
          className={className}
        >
          {children}
        </FormControl>
      </div>
    )
  }

  renderFormControlTextArea = ({
    input,
    label,
    meta: { touched, error },
    children,
    className
  }) => {
    const { formatMessage } = this.props.intl
    return (
      <FormGroup>
        {touched && error && (
          <span className={s.errorMessage}>{formatMessage(error)}</span>
        )}
        <FormControl
          {...input}
          className={className}
          componentClass='textarea'
          placeholder={label}
        >
          {children}
        </FormControl>
      </FormGroup>
    )
  }

  renderFormControl = ({
    input,
    label,
    type,
    placeholder,
    meta: { touched, error },
    className
  }) => {
    const { formatMessage } = this.props.intl
    return (
      <div>
        <FormControl
          {...input}
          placeholder={placeholder}
          type={type}
          className={className}
        />
        {touched && error && (
          <span className={s.errorMessage}>{formatMessage(error)}</span>
        )}
      </div>
    )
  }

  calcConvertedAmount (
    total,
    guestServiceFee,
    currencyInformation,
    currency,
    paymentCurrency
  ) {
    const amount = total + guestServiceFee
    let rates = currencyInformation.rates
    let baseCurrency = currencyInformation.base
    let convertedAmount = 0
    convertedAmount = convert(
      baseCurrency,
      rates,
      amount,
      currency,
      paymentCurrency
    )
    return convertedAmount
  }

  calcBaseCurrencyAmount (
    total,
    guestServiceFee,
    currencyInformation,
    currency
  ) {
    const amount = total + guestServiceFee
    let rates = currencyInformation.rates
    let baseCurrency = currencyInformation.base
    let convertedAmount = 0
    convertedAmount = convert(
      baseCurrency,
      rates,
      amount,
      currency,
      baseCurrency
    )
    return { convertedAmount, baseCurrency }
  }

  renderGuests (personCapacity) {
    let rows = []
    for (let i = 1; i <= personCapacity; i++) {
      rows.push(
        <option key={i} value={i}>
          {i} {i > 1 ? 'guests' : 'guest'}
        </option>
      )
    }
    return rows
  }

  renderpaymentCurrencies () {
    const { paymentCurrencyList } = this.props
    let rows = []

    if (paymentCurrencyList != null && paymentCurrencyList.length > 0) {
      paymentCurrencyList.map((item, index) => {
        if (item.isEnable && item.isPayment) {
          rows.push(
            <option key={index} value={item.symbol}>
              {item.symbol}
            </option>
          )
        }
      })
    }
    return rows
  }

  renderPaypal () {
    const {
      total,
      guestServiceFee,
      currency,
      currencyInformation,
      formData,
      dispatch,
      paymentLoading,
      getThreadItems,
      listId
    } = this.props;

    const { formatMessage } = this.props.intl;

    /* If we want the guest to always pay in our base currency
    let { paymentAmount, paymentCurrency } = this.calcBaseCurrencyAmount(
      total,
      guestServiceFee,
      currencyInformation,
      currency
    ); */

    // Payment should be done in host currency
    const paymentAmount = total + guestServiceFee;
    const paymentCurrency = currency;
    const paymentAmountString = formatAmountForCurrency(paymentAmount, paymentCurrency);

    return (
      <span>
        {!this.state.isExpired && !paymentLoading && getThreadItems && !getThreadItems.error && getThreadItems.getThreadItems && getThreadItems.getThreadItems.length > 0 && 
          getThreadItems.getThreadItems[0] && getThreadItems.getThreadItems[0].id && (
          <PayPalButton
            onCancel={(data) => {
              history.push('/rooms/' + listId)
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    reference_id: getThreadItems.getThreadItems[0].id,
                    invoice_id: 'Payment_' + moment.utc().format('YYYYMMDD') + 'Z_t' + getThreadItems.getThreadItems[0].id + '_1',
                    amount: {
                      currency_code: paymentCurrency,
                      value: paymentAmountString
                    }
                  }
                ],
                application_context: {
                  shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                }
              })
            }}
            onApprove={async (data, actions) => {
              // Capture the funds from the transaction
              await this.handleSubmit(
                formData,
                dispatch,
                data.orderID,
                paymentAmountString,
                paymentCurrency
              )
              // return actions.order.capture().then(function(details) {
              // Show a success message to your buyer
              // alert("Transaction completed by " + details.payer.name.given_name);

              // OPTIONAL: Call your server to save the transaction
              // return fetch("/paypal-transaction-complete", {
              //   method: "post",
              //   body: JSON.stringify({
              //     orderID: data.orderID
              //   })
              // });
              // });
            }}
            options={{
              clientId: paypalClientId,
              currency: paymentCurrency
            }}
            onError={error => {
              log.error(
                `components.Booking.Payment.PaymentForm.PaymentForm.renderPaypal: PayPalButton error: ${error.message}`
              );
              const errorTitle = formatMessage(messages.paypalPaymentButtonsErrorTitle);
              const errorMsg = formatMessage(messages.paypalPaymentButtonsError);
              toastr.error(errorTitle, errorMsg);
            }}
            catchError={error => {
              log.error(
                `components.Booking.Payment.PaymentForm.PaymentForm.renderPaypal: PayPalButton transaction declined or errored: ${error.message}`
              );
              const errorTitle = formatMessage(messages.paypalPaymentButtonsErrorTitle);
              const errorMsg = formatMessage(messages.paypalPaymentButtonsTransactionError);
              toastr.error(errorTitle, errorMsg);
            }}
          ></PayPalButton>
        )}
        {paymentLoading && <div><FormattedMessage {...messages.processingPayment}/><Loader type={'circle'} show={true} /></div>}
      </span>
    )
  }

  handleClick () {
    const { dispatch } = this.props
    dispatch(reset('BookingForm'))
  }

  /**
   * Handle standard flow booking requests
   */
  async submitForm () {
    const {
      mutate,
      requestToBook,
      hostDisplayName,
      initialValues,
      message
    } = this.props
    const { listId, timeZone, hostEmail, hostId, guestId } = this.props
    const { dispatch, formData } = this.props

    try {
      const datesAreValid = await this.checkDatesValidity(listId, initialValues.checkIn, initialValues.checkOut);
  
      if (datesAreValid) {
  
        let requestToBookResult = await requestToBook(
          listId,
          hostId,
          message,
          initialValues.checkIn,
          initialValues.checkOut,
          formData.guests,
          hostEmail,
          hostDisplayName,
          initialValues.listTitle,
          timeZone,
          initialValues.total,
          initialValues.currency,
          formData,
          initialValues.hostServiceFee
          // initialValues.bookingSpecialPricing,
          // initialValues.isSpecialPriceAssigned,
          // initialValues.isSpecialPriceAverage,
        )
  
        if (requestToBookResult && requestToBookResult.result === 'success') {
          const { data } = await mutate({
            variables: {
              listId,
              host: hostId,
              guest: guestId,
              checkInStart: moment(initialValues.checkIn),
              checkInEnd: moment(initialValues.checkOut)
            }
          })
      
          if (
            data &&
            data.RequestBookingLists &&
            data.RequestBookingLists.status === '200'
          ) {
            toastr.success(
              'Booking',
              'Your booking request has been sent successfully'
            )
            dispatch(reset('BookingForm'))
            if (isValidNumber(requestToBookResult.threadId)) {
              history.push(`/message/${requestToBookResult.threadId}/guest`)
            } else {
              history.push('/rooms/' + listId)
            }
          }
        }
      } else {
        this.setState({ isExpired: true });
      }
    } catch (error) {
      toastr.error('Error!', 'The request could not be performed successfully.')
      log.error(
        `components.Booking.Payment.PaymentForm.PaymentForm.submitForm: The request could not be performed successfully. Message: ${
          error.message
        }, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      )
    }
  }

  async checkDatesValidity(listId, checkIn, checkOut) {
    let query = `query checkReservation ($checkIn: String!,$checkOut: String!,$listId: Int! ){
      checkReservation(checkIn: $checkIn, checkOut:$checkOut, listId:$listId ){
        id
        listId
        hostId
        guestId
        checkIn
        checkOut
        status
      }
    }`

    const params = {
      listId: listId,
      checkIn: checkIn,
      checkOut: checkOut
    }

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: params
      }),
      credentials: 'include'
    })

    const { data } = await resp.json()

    const datesAreValid = data &&
      data.checkReservation &&
      data.checkReservation.status == '200';

    return datesAreValid ? true : false;
  }

  /**
   * Booking payment and free listing booking request or guest complete free listing contact host flow after invited by host
   * see <form> buttons (type={"button"})
   * @param {*} values Form values
   * @param {*} dispatch Dispatch actions function
   */
  async handleSubmit (
    values,
    dispatch,
    orderID,
    paymentAmount,
    paymentCurrency
  ) {
    const { preApprove, messageType, basePrice, total } = this.props;
    const { formatMessage } = this.props.intl;

    let paymentType = values.paymentType
    // if it is a request or an invitation for a free listing we need to use the Stripe workflow
    if (basePrice == 0 && total == 0) {
      paymentType = 2
    }

    try {

      const datesAreValid = await this.checkDatesValidity(values.listId, values.checkIn, values.checkOut);

      if ( datesAreValid ) {
        let msg = '',
          paymentMethodId,
          createPaymentMethod

        await dispatch(
          makePayment(
            values.listId,
            values.listTitle,
            values.hostId,
            values.guestId,
            values.checkIn,
            values.checkOut,
            values.guests,
            values.message,
            values.basePrice,
            values.cleaningPrice,
            values.currency,
            values.discount,
            values.discountType,
            values.guestServiceFee,
            values.hostServiceFee,
            values.total,
            values.bookingType,
            paymentCurrency,
            paymentType,
            values.guestEmail,
            values.bookingSpecialPricing,
            values.isSpecialPriceAssigned,
            values.isSpecialPriceAverage,
            values.dayDifference,
            paymentMethodId,
            orderID,
            paymentAmount
          )
        )
      } else {
        this.setState({isExpired: true});
        toastr.error(formatMessage(messages.bookingPeriodExpired3), formatMessage(messages.bookingPeriodExpired4));
      }
    } catch (error) {
      toastr.error('Error!', 'The payment could not be performed successfully.')
      log.error(
        `components.Booking.Payment.PaymentForm.PaymentForm.handleSubmit: The payment could not be performed successfully. Message: ${
          error.message
        }, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      )
    }
  }

  render () {
    const {
      hostDisplayName,
      houseRules,
      allowedPersonCapacity,
      paymentLoading,
      initialValues,
      preApprove
    } = this.props
    const {
      handleSubmit,
      submitting,
      error,
      pristine,
      paymentType,
      invalid
    } = this.props
    const { listId, messageType, basePrice, total } = this.props
    const { formatMessage } = this.props.intl
    const isFreeListing = basePrice === 0 && total === 0

    let style = {
      base: {
        color: '#aaa',
        fontWeight: 400,
        fontFamily: 'Quicksand, Open Sans, Segoe UI, sans-serif',
        fontSize: '14px',
        fontSmoothing: 'antialiased',
        ':focus': {
          color: '#aaa'
        },

        '::placeholder': {
          color: '#aaa'
        },

        ':focus::placeholder': {
          color: '#aaa'
        }
      },
      invalid: {
        color: '#303238',
        ':focus': {
          color: '#aaa'
        },
        '::placeholder': {
          color: '#aaa'
        }
      }
    }

    let elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid'
    }

    return (
      <div className={cx(s.bookItPanel, s.spaceTop2)}>
        {/* <form onSubmit={handleSubmit(submit)}> */}
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Row>
            {preApprove && messageType == 'inquiry' && total != 0 && (
              <Col md={10} className={cx(s.textLeft)}>
                <div className={s.h3}>
                  1. <FormattedMessage {...messages.aboutYourTrip} />
                </div>
                {messageType != 'inquiry' && (
                  <div className={cx(s.bookItDetails, s.spaceTop2, s.space4)}>
                    <span>
                      <FormattedMessage {...messages.whoComing} />
                    </span>
                    <Row className={s.spaceTop2}>
                      <Col md={12} lg={5}>
                        <Field
                          name='guests'
                          component={this.renderFormControlSelect}
                          className={s.formControlSelect}
                        >
                          {this.renderGuests(allowedPersonCapacity)}
                        </Field>
                      </Col>
                    </Row>
                  </div>
                )}
                <div>
                  <span>
                    <FormattedMessage {...messages.sayHello} />:
                  </span>
                </div>
                <div>
                  <Field
                    className={s.textArea}
                    name='message'
                    component={this.renderFormControlTextArea}
                    label={
                      messageType == 'requestToBook'
                        ? formatMessage(messages.descriptionInfo)
                        : formatMessage(messages.paymentPageInfo)
                    }
                  />
                </div>
                {houseRules.length > 0 && (
                  <div className={s.space4}>
                    <HouseRules
                      hostDisplayName={hostDisplayName}
                      houseRules={houseRules}
                    />
                  </div>
                )}
              </Col>
            )}
            {((!preApprove && messageType == 'requestToBook') ||
              (preApprove && messageType == 'inquiry' && total == 0)) && (
              <Col md={10} className={cx(s.textLeft)}>
                <div className={s.h3}>
                  <FormattedMessage {...messages.aboutYourTrip} />
                </div>
                {messageType != 'inquiry' && (
                  <div className={cx(s.bookItDetails, s.spaceTop2, s.space4)}>
                    <span>
                      <FormattedMessage {...messages.whoComing} />
                    </span>
                    <Row className={s.spaceTop2}>
                      <Col md={12} lg={5}>
                        <Field
                          name='guests'
                          component={this.renderFormControlSelect}
                          className={s.formControlSelect}
                        >
                          {this.renderGuests(allowedPersonCapacity)}
                        </Field>
                      </Col>
                    </Row>
                  </div>
                )}
                <div>
                  <span>
                    <FormattedMessage {...messages.sayHello} />:
                  </span>
                </div>
                <div>
                  <Field
                    className={s.textArea}
                    name='message'
                    component={this.renderFormControlTextArea}
                    label={
                      messageType == 'requestToBook'
                        ? total != 0
                          ? formatMessage(messages.descriptionInfo)
                          : formatMessage(messages.descriptionInfo2)
                        : formatMessage(messages.paymentPageInfo)
                    }
                  />
                </div>
                {houseRules.length > 0 && (
                  <div className={s.space4}>
                    <HouseRules
                      hostDisplayName={hostDisplayName}
                      houseRules={houseRules}
                    />
                  </div>
                )}
              </Col>
            )}

            <Col md={10} className={cx(s.textLeft)}>
              {// initialValues.total != "0"
              total > 0 && (
                <span>
                  <section>
                    <header className={s.paymentHeader}>
                      <Row>
                        <Col md={12} className={cx(s.textLeft)}>
                          {messageType == 'requestToBook' && preApprove && (
                            <div>
                              <h3>
                                <FormattedMessage {...messages.securepayment} />
                              </h3>

                              <h4 className={cx(s.pullLeft, s.textLight)}>
                                <FormattedMessage
                                  {...messages.securepaymentInfo}
                                />
                              </h4>
                            </div>
                          )}
                          {messageType == 'inquiry' && (
                            <h3 className={s.pullLeft}>
                              2.{' '}
                              <FormattedMessage {...messages.confirmpayment} />
                            </h3>
                          )}
                        </Col>
                      </Row>
                    </header>
                  </section>

                  {((messageType == 'requestToBook' && preApprove) ||
                    (messageType == 'inquiry' && preApprove)) && (
                    <Row className={s.space4}>
                      {/* 
                      // Choose currency label and field
                      <Col xs={12} sm={6} md={6} lg={6}>
                        <span>
                          <FormattedMessage {...messages.chooseCurrency} />
                        </span>
                        <div className={s.selectContainer}>
                          <Field
                            name='paymentCurrency'
                            component={this.renderFormControlSelect}
                            className={s.formControlSelect}
                          > */}
                            {/* <option value="">{formatMessage(messages.chooseCurrencyPayPal)}</option> */}
                            {/* {this.renderpaymentCurrencies()}
                          </Field>
                        </div>
                      </Col> */}
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={s.countryName}
                      >
                        <span className={s.textRegular}>
                          {this.renderPaypal()}
                        </span>
                      </Col>
                    </Row>
                  )}

                  {messageType == 'requestToBook' && preApprove && (
                    <Row className={s.space4}>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <span className={s.textLight}>
                          <FormattedMessage {...messages.loginInfo} />{' '}
                          <a
                            href='https://www.vegvisits.com/page/terms-of-use'
                            target='_blank'
                          >
                            <FormattedMessage {...messages.termsofuse} />
                          </a>
                          <FormattedMessage {...messages.bookingagree} />
                          <a href='/page/community-guidelines' target='_blank'>
                            {' '}
                            <FormattedMessage {...messages.promisetext} />
                          </a>
                        </span>
                      </Col>
                    </Row>
                  )}
                  {messageType == 'inquiry' && (
                    <Row className={s.space4}>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <span className={s.textLight}>
                          <FormattedMessage {...messages.loginInfo} />{' '}
                          <a
                            href='https://www.vegvisits.com/page/terms-of-use'
                            target='_blank'
                          >
                            <FormattedMessage {...messages.termsofuse} />
                          </a>
                          <FormattedMessage {...messages.bookingagree1} />
                          <a href='/page/community-guidelines' target='_blank'>
                            {' '}
                            <FormattedMessage {...messages.promisetext} />
                          </a>
                        </span>
                      </Col>
                    </Row>
                  )}
                </span>
              )}

              {isFreeListing && !preApprove && (
                <div>
                  <span>
                    <FormattedMessage {...messages.paymentBasePriceMessage1} />
                    <br />
                    <br />
                  </span>
                </div>
              )}

              {isFreeListing && preApprove && (
                <div>
                  <span>
                    <FormattedMessage {...messages.paymentBasePriceMessage2} />
                    <br />
                    <br />
                  </span>
                </div>
              )}

              <Row className={s.space4}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  {// initialValues.total == "0"
                  isFreeListing && !preApprove && (
                    <div className={s.cancelBtn}>
                      <Loader
                        type={'button'}
                        buttonType={'submit'}
                        className={cx(s.button, s.btnPrimary, s.btnlarge)}
                        show={paymentLoading}
                        label={formatMessage(messages.bookNow)}
                        disabled={this.state.isExpired}
                      />
                    </div>
                  )}

                  {/* 
                    // Submit form button for payment if needed
                    {initialValues.total != '0' &&
                    (preApprove || messageType == 'inquiry') && (
                      <div className={s.cancelBtn}>
                        <Loader
                          type={'button'}
                          buttonType={'submit'}
                          className={cx(s.button, s.btnPrimary, s.btnlarge)}
                          disabled={submitting || error || !this.state.payable}
                          show={paymentLoading}
                          label={
                            initialValues.total != '0'
                              ? formatMessage(messages.payNow)
                              : formatMessage(messages.bookNow)
                          }
                        />
                      </div>
                    )} */}

                  {initialValues.total == '0' && preApprove && (
                    <div className={s.cancelBtn}>
                      <Loader
                        type={'button'}
                        buttonType={'submit'}
                        className={cx(s.button, s.btnPrimary, s.btnlarge)}
                        disabled={pristine || submitting || error || this.state.isExpired}
                        show={paymentLoading}
                        label={
                          initialValues.total != '0'
                            ? formatMessage(messages.payNow)
                            : formatMessage(messages.bookNow)
                        }
                      />
                    </div>
                  )}
                  {//  initialValues.total != "0" &&
                  total > 0 && messageType == 'requestToBook' && !preApprove && (
                    <div className={s.cancelBtn}>
                      <Loader
                        type={'button'}
                        className={cx(s.button, s.btnPrimary, s.btnlarge)}
                        disabled={pristine || submitting || error || invalid || this.state.isExpired}
                        show={paymentLoading}
                        label={formatMessage(messages.requestToBook)}
                        handleClick={this.submitForm}
                      />
                    </div>
                  )}
                  {this.state.isExpired && <div className={s.errorMessage}> <FormattedMessage {...messages.bookingPeriodExpired} /><a href={'/book/' + listId}> <FormattedMessage {...messages.bookingPeriodExpired2} /></a></div>}

                  {/* 
                  // Cancel button for payment if needed
                  {// bookingType != 'request'
                  !paymentLoading && (preApprove || messageType == 'inquiry') && (
                    <div className={s.spaceTop1}>
                      <Link
                        to={'/rooms/' + listId}
                        className={cx(s.cancelLinkText)}
                        onClick={this.handleClick}
                      >
                        <FormattedMessage {...messages.cancel} />
                      </Link>
                    </div>
                  )}
                  {paymentLoading && (preApprove || messageType == 'inquiry') && (
                    <div className={s.spaceTop1}>
                      <a
                        href='javascript:void(0)'
                        className={cx(s.cancelLinkText)}
                      >
                        <FormattedMessage {...messages.cancel} />
                      </a>
                    </div>
                  )} */}
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

PaymentForm = reduxForm({
  form: 'PaymentForm', // a unique name for this form
  validate
})(PaymentForm)

// Decorate with connect to read form values
const selector = formValueSelector('PaymentForm') // <-- same as form name

const mapState = state => ({
  paymentCurrencyList: state.currency.availableCurrencies,
  paymentLoading: state.book.paymentLoading,
  preApprove: state.book.bookDetails
    ? state.book.bookDetails.preApprove
    : false,
  paymentType: selector(state, 'paymentType'),
  message: selector(state, 'message'),
  messageType: state.book.bookDetails
    ? state.book.bookDetails.messageType
    : null,
  formData: getFormValues('PaymentForm')(state),
  paymentCurrency: selector(state, 'paymentCurrency'),
  currency: selector(state, 'currency'),
  total: selector(state, 'total'),
  guestServiceFee: selector(state, 'guestServiceFee'),
  currencyInformation: state.currency,
  reservationDetails: state.book.reservationDetails
})

const mapDispatch = {
  requestToBook,
}

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(gql`
    mutation RequestBookingLists(
      $listId: Int
      $host: String
      $guest: String
      $checkInStart: String
      $checkInEnd: String
    ) {
      RequestBookingLists(
        listId: $listId
        host: $host
        guest: $guest
        checkInStart: $checkInStart
        checkInEnd: $checkInEnd
      ) {
        status
      }
    }
  `),
  graphql(gql`
    query getThreadItems($listId: Int!, $host: String!, $guest: String!, $messageType: [String], $type: [String], $startDate: String, $endDate: String, $personCapacity: Int, $reservationId: Int) {
      getThreadItems(listId: $listId, host: $host, guest: $guest, messageType: $messageType, type: $type, startDate: $startDate, endDate: $endDate, personCapacity: $personCapacity, reservationId: $reservationId) {
        id
        threadId
        reservationId
        type
        messageType
        status
      }
    }
  `,
  {
    name: 'getThreadItems',
    options: (props) => ({
      variables: {
        listId: props.initialValues.listId,
        guest: props.initialValues.guestId,
        host: props.initialValues.hostId,
        startDate: props.initialValues.checkIn,
        endDate: props.initialValues.checkOut,
        personCapacity: props.initialValues.guests,
        reservationId: (props.reservationDetails && props.reservationDetails.id) ? props.reservationDetails.id : null,
        type: props.preApprove ? ['preApproved'] : null,
        messageType: (props.reservationDetails && props.reservationDetails.id) ? ['requestToBook'] : ['inquiry']
      },
      skip: !props.preApprove || !props.initialValues,
      ssr: false,
      fetchPolicy: 'network-only'
    })
  }),
)(PaymentForm)

