import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

// External Component
import moment from 'moment';

// Redux
import { connect } from 'react-redux';

//Images
import Faq from './question.svg'

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Calendar.css';
import {
    Row,
    Col,
    FormGroup,
    Tooltip,
    OverlayTrigger,
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import LinkWithTooltip from '../../LinkWithTooltip'

// Helper
import { convert } from '../../../helpers/currencyConvertion';
import { calculatePrice } from '../../../helpers/calculatePrice';

// Locale
import messages from '../../../locale/messages';

class BillDetails extends Component {
    static propTypes = {
        basePrice: PropTypes.number.isRequired,
        cleaningPrice: PropTypes.number,
        currency: PropTypes.string.isRequired,
        monthlyDiscount: PropTypes.number,
        weeklyDiscount: PropTypes.number,
        startDate: PropTypes.object.isRequired,
        endDate: PropTypes.object.isRequired,
        serviceFees: PropTypes.shape({
            guest: PropTypes.shape({
                type: PropTypes.string.isRequired,
                value: PropTypes.number.isRequired,
                currency: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        base: PropTypes.string.isRequired,
        rates: PropTypes.object.isRequired,
        formatMessage: PropTypes.any,
        specialPricing: PropTypes.array,
        timeZone: PropTypes.string.isRequired,
    };

    static defaultProps = {
        basePrice: 0,
        cleaningPrice: 0,
        monthlyDiscount: 0,
        weeklyDiscount: 0,
        startDate: null,
        endDate: null,
        specialPricing: [],
    }

    render() {
        const { basePrice, cleaningPrice, currency, monthlyDiscount, weeklyDiscount, startDate, endDate, timeZone } = this.props;
        const { serviceFees, base, rates, specialPricing } = this.props;
        const { formatMessage } = this.props.intl;

        let { discount, discountType, guestServiceFee, hostServiceFee, totalWithoutFees, isSpecialPriceAssigned, bookingSpecialPricing, isAverage, dayDifference, priceForDays, total } = calculatePrice(startDate, endDate, timeZone, specialPricing, basePrice, serviceFees, base, rates, currency, monthlyDiscount, formatMessage, weeklyDiscount, cleaningPrice, messages);

        return (
            <FormGroup>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <table className={cx('table')}>
                            <tbody>
                                <tr className={cx(s.positionR)}>
                                    <td className={cx(s.noBorder)}>

                                        <div className={s.specialPriceText}>
                                            <CurrencyConverter
                                                //amount={basePrice}
                                                amount={isAverage}
                                                from={currency}
                                            />
                                            x {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
                                        </div>

                                        <div className={s.specialPriceIcon}>
                                            {
                                                isSpecialPriceAssigned &&
                                                <LinkWithTooltip
                                                  tooltip={formatMessage(messages.specialPriceNote)}
                                                  id="tooltip-1"
                                                  className={cx(s.tooltip, 'paymentTooltip')}
                                                >
                                                  <span className={s.iconSection}>
                                                    <FontAwesome.FaQuestion className={s.toolTipColor} />
                                                  </span>
                                                </LinkWithTooltip>
                                            }
                                        </div>
                                    </td>

                                    <td className={cx(s.noBorder, 'text-right')}>
                                        <CurrencyConverter
                                            amount={priceForDays}
                                            //amount={isDayTotal}
                                            from={currency}
                                        />
                                    </td>

                                </tr>
                                {
                                    discount > 0 && <tr>
                                        <td>{discountType}</td>
                                        <td className={cx('text-right', s.discountText)}>
                                            - <CurrencyConverter
                                                amount={discount}
                                                from={currency}
                                            />
                                        </td>
                                    </tr>
                                }
                                {
                                    guestServiceFee > 0 && <tr>
                                        <td><FormattedMessage {...messages.serviceFee} />
                                          <LinkWithTooltip
                                            tooltip={formatMessage(messages.serviceFeeNote)}
                                            id="tooltip-1"
                                            className={cx(s.tooltip, 'paymentTooltip')}
                                          >
                                            <span className={s.iconSection}>
                                              <FontAwesome.FaQuestion className={s.toolTipColor} />
                                            </span>
                                          </LinkWithTooltip>
                                        </td>
                                        <td className={cx('text-right')}>
                                            <CurrencyConverter
                                                amount={guestServiceFee}
                                                from={currency}
                                            />
                                        </td>
                                    </tr>
                                }
                                {
                                    cleaningPrice > 0 && <tr>
                                        <td><FormattedMessage {...messages.cleaningFee} /></td>
                                        <td className={cx('text-right')}>
                                            <CurrencyConverter
                                                amount={cleaningPrice}
                                                from={currency}
                                            />
                                        </td>
                                    </tr>
                                }
                                <tr>
                                    <td><FormattedMessage {...messages.total} /></td>
                                    <td className={cx('text-right')}>
                                        <CurrencyConverter
                                            amount={total}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </FormGroup>
        );
    }
}

const mapState = (state) => ({
    specialPricing: state.viewListing.specialPricing
});

const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(BillDetails)));


