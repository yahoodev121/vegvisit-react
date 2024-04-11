import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import moment from 'moment';
import 'moment-timezone';
import {
    Grid,
    Row,
    Col,
    Panel,
    Table,
    Tooltip,
    OverlayTrigger,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Receipt.css';
import * as FontAwesome from 'react-icons/lib/fa';

// Components
import CurrencyConverter from '../CurrencyConverter';
import Link from '../Link';
import LinkWithTooltip from '../LinkWithTooltip'

// Helper
import { generateCheckInString } from '../../helpers/checkInHelper';
import isValidNumber from '../../helpers/isValidNumber';


// Locale
import messages from '../../locale/messages';
import ListNotFound from '../../routes/listNotFound/ListNotFound';

class PaymentReceipt extends React.Component {

    static propTypes = {
        formatMessage: PropTypes.any,
        siteName: PropTypes.string.isRequired,
        data: PropTypes.shape({
            id: PropTypes.number.isRequired,
            listId: PropTypes.number.isRequired,
            checkIn: PropTypes.string.isRequired,
            checkOut: PropTypes.string.isRequired,
            basePrice: PropTypes.number.isRequired,
            cleaningPrice: PropTypes.number.isRequired,
            total: PropTypes.number.isRequired,
            discount: PropTypes.number.isRequired,
            discountType: PropTypes.string,
            guestServiceFee: PropTypes.number.isRequired,
            currency: PropTypes.string.isRequired,
            confirmationCode: PropTypes.number.isRequired,
            createdAt: PropTypes.string.isRequired,
            updatedAt: PropTypes.string.isRequired,
            listData: PropTypes.shape({
                id: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                street: PropTypes.string.isRequired,
                city: PropTypes.string.isRequired,
                state: PropTypes.string.isRequired,
                country: PropTypes.string.isRequired,
                zipcode: PropTypes.string.isRequired,
                timeZone: PropTypes.string,
                listingData: PropTypes.shape({
                    checkInStart: PropTypes.string.isRequired,
                    checkInEnd: PropTypes.string.isRequired,
                    currency: PropTypes.string.isRequired,
                }),
                settingsData: PropTypes.arrayOf(PropTypes.shape({
                    id: PropTypes.number,
                    listsettings: PropTypes.shape({
                        itemName: PropTypes.string.isRequired
                    })
                }))
            }),
            hostData: PropTypes.shape({
                displayName: PropTypes.string.isRequired,
            }),
            guestData: PropTypes.shape({
                displayName: PropTypes.string.isRequired,
            }),
            bookingSpecialPricing: PropTypes.array,
            transaction: PropTypes.shape({
              transactionStatus: PropTypes.string,
              total: PropTypes.number.isRequired,
              currency: PropTypes.string.isRequired,
              updatedAt: PropTypes.string.isRequired,
              paymentMethodId: PropTypes.number.isRequired
            }),
            refundStatus: PropTypes.shape({
              transactionStatus: PropTypes.string,
              total: PropTypes.number.isRequired,
              currency: PropTypes.string.isRequired,
              updatedAt: PropTypes.string.isRequired,
              paymentMethodId: PropTypes.number.isRequired
            }),
            hostTransaction: PropTypes.shape({
              transactionStatus: PropTypes.string,
              amount: PropTypes.number.isRequired,
              currency: PropTypes.string.isRequired,
              updatedAt: PropTypes.string.isRequired,
              paymentMethodId: PropTypes.number.isRequired
            }),
            cancellationDetails: PropTypes.shape({
              cancellationPolicy: PropTypes.string.isRequired,
              refundToGuest: PropTypes.number.isRequired,
              payoutToHost: PropTypes.number.isRequired,
              guestServiceFee: PropTypes.number.isRequired,
              hostServiceFee: PropTypes.number.isRequired,
              total: PropTypes.number.isRequired,
              currency: PropTypes.string.isRequired,
              createdAt: PropTypes.string.isRequired,
              cancelledBy: PropTypes.string.isRequired
            }),
        })
    };

    static defaultProps = {
        data: null
    };

    print() {
        window.print();
    }

    render() {
        const { data, siteName, userId } = this.props;
        const { formatMessage } = this.props.intl;

        if (data === null) {
            return <div> <FormattedMessage {...messages.errorMessage} /> </div>;
        } else if (data.listData === null) {
            return <ListNotFound />
        } else {
            const { data, data: { id, checkIn, checkOut, confirmationCode, createdAt, updatedAt, hostId, guestId } } = this.props;
            const { data: { basePrice, cleaningPrice, total, discount, discountType, guestServiceFee, currency, hostServiceFee, isSpecialPriceAverage } } = this.props;
            const { data: { hostData, guestData } } = this.props;
            const { data: { listData: { title, street, city, state, country, zipcode, timeZone } } } = this.props;
            const { data: { listData: { listingData: { checkInStart, checkInEnd, currency: listingCurrency  } } } } = this.props;
            const { data: { listData: { settingsData } } } = this.props;
            const { data: { bookingSpecialPricing } } = this.props;
            const { data: { transaction, refundStatus, hostTransaction, cancellationDetails } } = this.props;

            let roomType = settingsData[0].listsettings.itemName;
            let createdDate = createdAt ? moment(createdAt).format('ddd, MMM Do, YYYY ') : '';
            let updatedDate = updatedAt ? moment(updatedAt).format('ddd, MMM Do, YYYY ') : '';
            let checkInDate = (checkIn && timeZone) ? moment(checkIn).tz(timeZone).format('ddd, Do MMM') : '';
            let checkOutDate = (checkOut && timeZone) ? moment(checkOut).tz(timeZone).format('ddd, Do MMM') : '';
            let paymentDate = transaction && transaction.updatedAt ? moment(transaction.updatedAt).format('ddd, MMM Do, YYYY ') : '';
            let payoutDate = hostTransaction && hostTransaction.updatedAt ? moment(hostTransaction.updatedAt).format('ddd, MMM Do, YYYY ') : '';

            let cancellationDate = '';
            let earnedAmount = 0, missedEarnings = 0, refund = 0;
            if (cancellationDetails) {
              if (cancellationDetails.createdAt && timeZone) {
                cancellationDate = moment(cancellationDetails.createdAt).tz(timeZone).format('LLLL') + ` (${timeZone})`;
              }
              if (isValidNumber(Number(cancellationDetails.payoutToHost)) && isValidNumber(Number(cancellationDetails.refundToGuest))) {
                earnedAmount = Number(cancellationDetails.payoutToHost);
                refund = Number(cancellationDetails.refundToGuest);
                missedEarnings = total - earnedAmount - hostServiceFee;
              }
            }
            

            let refundDate = refundStatus && refundStatus.updatedAt ? moment(refundStatus.updatedAt).format('ddd, MMM Do, YYYY ') : '';
            let momentStartDate, momentEndDate, dayDifference, dayPrice = 0, checkInTime, checkOutTime;
            let isSpecialPricingAssinged = (bookingSpecialPricing && bookingSpecialPricing.length > 0) ? true : false;
            let isAverage = 0, subTotal, userType;
            let isDayTotal = 0;

            if (checkIn != null && checkOut != null) {
                momentStartDate = moment(checkIn);
                momentEndDate = moment(checkOut);
                dayDifference = momentEndDate.diff(momentStartDate, 'days');
                // dayPrice = basePrice * dayDifference;

                if (isSpecialPricingAssinged) {
                    /* bookingSpecialPricing && bookingSpecialPricing.map((item, index) => {
                        dayPrice = dayPrice + Number(item.isSpecialPrice);
                    }); */
                    dayPrice = isSpecialPriceAverage * dayDifference;
                } else {
                    dayPrice = basePrice * dayDifference;
                }
            }

            // if (checkInStart === 'Flexible') {
            //     checkInTime = formatMessage(messages.flexibleCheckIn);
            // } else {
            //     checkInTime = generateTime(checkInStart);
            // }

            // if (checkInEnd === 'Flexible') {
            //     checkOutTime = formatMessage(messages.flexibleCheckOut);
            // } else {
            //     checkOutTime = generateTime(checkInEnd);
            // }

            let checkInString = generateCheckInString(checkInStart, checkInEnd, messages, formatMessage);

            if (userId === hostId) {
                userType = 'host';
                subTotal = total - hostServiceFee;
            } else {
                userType = 'guest';
                subTotal = total + guestServiceFee;
            }

            isAverage = Number(dayPrice) / Number(dayDifference);
            isDayTotal = isAverage.toFixed(2) * dayDifference;
            dayPrice = isDayTotal;

            let conversionFactorToPaymentCurrency;
            if (transaction && ((total + guestServiceFee) > 0)) {
              conversionFactorToPaymentCurrency =  transaction.total / (total + guestServiceFee);
            }

            return (
                <div className={cx(s.containerResponsive, s.spaceTop4)}>
                    <div className={cx(s.space4, s.rowTable)}>
                        <Col xs={12} sm={12} md={3} lg={3} className={s.noPadding}>
                            <span className={s.textBold}>{createdDate}</span><br />
                            <span><FormattedMessage {...messages.receipt} /> # {id}</span>
                        </Col>
                    </div>

                    <div>
                        <Panel className={s.receiptPanel}>
                            <h2><FormattedMessage {...messages.customerReceipt} /></h2>
                            <div className={cx(s.spaceTop1, s.pullRight)}>
                                <a className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, "hidden-print")} onClick={this.print}>
                                    <FormattedMessage {...messages.receiptBtn} />
                                </a>
                            </div>
                            <div className={s.space1}>
                                <h6><FormattedMessage {...messages.confirmationCode} /> </h6>
                            </div>
                            <div className={s.space1}>
                                <h4>{confirmationCode}</h4>
                            </div>
                            <hr />
                            <Row className={s.space4}>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.name} /></span>
                                    <p>{guestData.displayName}</p>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.travelDestination} /></span>
                                    <p>{city}</p>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.duration} /></span>
                                    <p>{dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}</p>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.accommodationType} /></span>
                                    <p>{roomType}</p>
                                </Col>
                            </Row>
                            <hr />

                            <Row className={s.space4}>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.accommodationAddress} /></span>
                                    <h4>{title}</h4>
                                    <p>
                                        <span>{street}</span> <br />
                                        <span>{city}, {state} {zipcode}</span> <br />
                                        <span>{country}</span> <br />
                                    </p>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.accommodationHost} /></span>
                                    <p>{hostData.displayName}</p>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.checkIn} /></span>
                                    <p>
                                        <span>{checkInDate}</span><br />
                                        <span>{checkInString}</span>
                                    </p>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <span className={s.textBold}><FormattedMessage {...messages.checkOut} /></span>
                                    <p>
                                        <span>{checkOutDate}</span><br />
                                        {/* <span>{checkOutTime}</span> */}
                                    </p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h2><FormattedMessage {...messages.reservationCharges} /></h2>
                                    <table className={cx('table', 'table-bordered')}>
                                        <tbody>

                                            <tr className={cx(s.positionR)}>
                                                <th className={s.rowWidth}>
                                                    <CurrencyConverter
                                                        // amount={basePrice}
                                                        amount={isAverage}
                                                        from={currency}
                                                        noConversion={true}
                                                    />
                                                    &nbsp;x {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
                                                    {
                                                        isSpecialPricingAssinged && <LinkWithTooltip
                                                            tooltip={formatMessage(userType === 'guest' ? messages.specialPriceNote : messages.specialPriceNoteHost)}
                                                            // href="#"
                                                            id="tooltip-1"
                                                            className={s.tooltip}
                                                        >
                                                            <span className={s.iconSection}>
                                                                <FontAwesome.FaQuestion className={s.instantIcon} />
                                                            </span>
                                                        </LinkWithTooltip>
                                                    }
                                                </th>

                                                <td>
                                                    <CurrencyConverter
                                                        amount={dayPrice}
                                                        from={currency}
                                                        noConversion={true}
                                                    />
                                                    {userType === 'host' && listingCurrency !== currency &&
                                                      <span>
                                                        {' '}(<CurrencyConverter
                                                            amount={dayPrice}
                                                            from={currency}
                                                            toFixedCurrency={listingCurrency}
                                                        />)
                                                      </span>
                                                    }
                                                </td>

                                            </tr>

                                            {
                                                cleaningPrice > 0 && <tr>
                                                    <th className={s.rowWidth}>
                                                        <FormattedMessage {...messages.cleaningPrice} />
                                                    </th>
                                                    <td>
                                                        <CurrencyConverter
                                                            amount={cleaningPrice}
                                                            from={currency}
                                                            noConversion={true}
                                                        />
                                                        {userType === 'host' && listingCurrency !== currency &&
                                                          <span>
                                                            {' '}(<CurrencyConverter
                                                                amount={cleaningPrice}
                                                                from={currency}
                                                                toFixedCurrency={listingCurrency}
                                                            />)
                                                          </span>
                                                        }
                                                    </td>
                                                </tr>
                                            }
                                            {
                                                discount > 0 && <tr>
                                                    <th className={s.rowWidth}>{discountType}</th>
                                                    <td>
                                                        -{' '}<CurrencyConverter
                                                            amount={discount}
                                                            from={currency}
                                                            noConversion={true}
                                                        />
                                                        {userType === 'host' && listingCurrency !== currency &&
                                                          <span>
                                                            {' '}(<CurrencyConverter
                                                                amount={discount}
                                                                from={currency}
                                                                toFixedCurrency={listingCurrency}
                                                            />)
                                                          </span>
                                                    }
                                                    </td>
                                                </tr>
                                            }
                                            {
                                                userType === 'guest' && guestServiceFee > 0 && <tr>
                                                    <th className={s.rowWidth}><FormattedMessage {...messages.serviceFee} /></th>
                                                    <td>
                                                        <CurrencyConverter
                                                            amount={guestServiceFee}
                                                            from={currency}
                                                            noConversion={true}
                                                        />
                                                    </td>
                                                </tr>
                                            }
                                            {
                                                userType === 'host' && hostServiceFee > 0 && <tr>
                                                    <th className={s.rowWidth}><FormattedMessage {...messages.serviceFee} /></th>
                                                    <td> - &nbsp;
                                                        <CurrencyConverter
                                                            amount={hostServiceFee}
                                                            from={currency}
                                                            noConversion={true}
                                                        />
                                                        {userType === 'host' && listingCurrency !== currency &&
                                                          <span>
                                                            {' '}(<CurrencyConverter
                                                                amount={hostServiceFee}
                                                                from={currency}
                                                                toFixedCurrency={listingCurrency}
                                                            />)
                                                          </span>
                                                        }
                                                    </td>
                                                </tr>
                                            }
                                            <tr>
                                                <th className={s.rowWidth}><FormattedMessage {...messages.total} /></th>
                                                <td>
                                                    <CurrencyConverter
                                                        amount={subTotal}
                                                        from={currency}
                                                        noConversion={true}
                                                    />
                                                    {userType === 'host' && listingCurrency !== currency &&
                                                      <span>
                                                        {' '}(<CurrencyConverter
                                                            amount={subTotal}
                                                            from={currency}
                                                            toFixedCurrency={listingCurrency}
                                                        />)
                                                      </span>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {
                                        userType === 'guest' && transaction && <table className={cx('table', 'table-bordered')}>
                                            <tbody>
                                                <tr>
                                                    <th className={s.rowWidth}><FormattedMessage {...messages.paymentReceived} /> {paymentDate}</th>
                                                    <td>
                                                        <CurrencyConverter
                                                            amount={transaction.total}
                                                            from={transaction.currency}
                                                            noConversion={true}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    }
                                    {
                                        userType === 'host' && hostTransaction && !cancellationDetails && <table className={cx('table', 'table-bordered')}>
                                            <tbody>
                                                <tr>
                                                    <th className={s.rowWidth}><FormattedMessage {...messages.paidOutReceipt} /> {payoutDate}</th>
                                                    <td>
                                                        <CurrencyConverter
                                                            amount={hostTransaction.amount}
                                                            from={hostTransaction.currency}
                                                            noConversion={true}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    }
                                    {
                                        cancellationDetails && <span>
                                          <h2><FormattedMessage {...messages.cancellation} /></h2>
                                          <table className={cx('table', 'table-bordered')}>
                                              <tbody>
                                                  <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.cancellationPolicy} /></th>
                                                      <td>{cancellationDetails.cancellationPolicy}</td>
                                                  </tr>
                                                  <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.cancelledOn} /></th>
                                                      <td>{cancellationDate}</td>
                                                  </tr>
                                                  <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.cancelledBy} /></th>
                                                      <td>{cancellationDetails.cancelledBy.charAt(0).toUpperCase() + cancellationDetails.cancelledBy.slice(1)}</td>
                                                  </tr>
                                                  {userType === 'guest' && refundStatus && <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.refundPaidReceipt} /> {refundDate}</th>
                                                      <td>
                                                          <CurrencyConverter
                                                              amount={refundStatus.total}
                                                              from={refundStatus.currency}
                                                              noConversion={true}
                                                          />
                                                      </td>
                                                  </tr>}
                                                  {userType === 'host' && hostTransaction && <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.paidOutReceipt} /> {payoutDate}</th>
                                                      <td>
                                                          <CurrencyConverter
                                                              amount={hostTransaction.amount}
                                                              from={hostTransaction.currency}
                                                              noConversion={true}
                                                          />
                                                      </td>
                                                  </tr>}
                                                  <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.serviceFee} /></th>
                                                      <td>
                                                          <CurrencyConverter
                                                              amount={userType === 'guest' ? cancellationDetails.guestServiceFee : cancellationDetails.hostServiceFee}
                                                              from={cancellationDetails.currency}
                                                              noConversion={true}
                                                          />
                                                          {userType === 'host' && listingCurrency !== cancellationDetails.currency &&
                                                            <span>
                                                              {' '}(
                                                                <CurrencyConverter
                                                                    amount={cancellationDetails.hostServiceFee}
                                                                    from={cancellationDetails.currency}
                                                                    toFixedCurrency={listingCurrency}
                                                                />
                                                              )
                                                            </span>
                                                          }
                                                      </td>
                                                  </tr>
                                                  {userType === 'host' && <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.earnedAmount} /></th>
                                                      <td>
                                                          <CurrencyConverter
                                                              amount={earnedAmount}
                                                              from={cancellationDetails.currency}
                                                              noConversion={true}
                                                          />
                                                          {userType === 'host' && listingCurrency !== cancellationDetails.currency &&
                                                            <span>
                                                              {' '}(
                                                                <CurrencyConverter
                                                                    amount={earnedAmount}
                                                                    from={cancellationDetails.currency}
                                                                    toFixedCurrency={listingCurrency}
                                                                />
                                                              )
                                                            </span>
                                                          }
                                                      </td>
                                                  </tr>}
                                                  {userType === 'host' && <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.missedEarnings} /></th>
                                                      <td>
                                                          <CurrencyConverter
                                                              amount={missedEarnings}
                                                              from={cancellationDetails.currency}
                                                              noConversion={true}
                                                          />
                                                          {userType === 'host' && listingCurrency !== cancellationDetails.currency &&
                                                            <span>
                                                              {' '}(
                                                                <CurrencyConverter
                                                                    amount={missedEarnings}
                                                                    from={cancellationDetails.currency}
                                                                    toFixedCurrency={listingCurrency}
                                                                />
                                                              )
                                                            </span>
                                                          }
                                                      </td>
                                                  </tr>}
                                                  {userType === 'guest' && <tr>
                                                      <th className={s.rowWidth}><FormattedMessage {...messages.refundAmount} /></th>
                                                      <td>
                                                          <CurrencyConverter
                                                              amount={refund}
                                                              from={cancellationDetails.currency}
                                                              noConversion={true}
                                                          />
                                                      </td>
                                                  </tr>}
                                              </tbody>
                                          </table>
                                        </span>
                                    }
                                    {userType === 'host' && (listingCurrency !== currency || (cancellationDetails && listingCurrency !== cancellationDetails.currency)) && <div className={cx(s.spaceTop1)}><FormattedMessage {...messages.receiptCurrencyNoteHostPayout} /></div>}
                                </Col>
                            </Row>
                        </Panel>
                    </div>
                </div>
            );
        }
    }
}

const mapState = (state) => ({
    siteName: state.siteSettings.data.siteName,
    userId: state.account.data.userId,
});

const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(PaymentReceipt)));
