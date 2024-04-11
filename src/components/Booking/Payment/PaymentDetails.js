import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import moment from 'moment';

import {
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import * as FontAwesome from 'react-icons/lib/fa';
import logoUrl from './logo-small.jpg';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Payment.css';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import LinkWithTooltip from '../../LinkWithTooltip'

// Locale
import messages from '../../../locale/messages';

class PaymentDetails extends Component {
  static propTypes = {
    basePrice: PropTypes.number.isRequired,
    cleaningPrice: PropTypes.number,
    securityDeposit:PropTypes.number,
    currency: PropTypes.string.isRequired,
    dayDifference: PropTypes.number.isRequired,
    discount: PropTypes.number,
    discountType: PropTypes.string,
    priceForDays: PropTypes.number.isRequired,
    serviceFees: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    formatMessage: PropTypes.any,
    bookingSpecialPricing: PropTypes.array,
    isSpecialPriceAssigned: PropTypes.bool,
  };

  static defaultProps = {
    bookingSpecialPricing: [],
    isSpecialPriceAssigned: false,
  };


  render() {
    const { basePrice, cleaningPrice, securityDeposit, currency, dayDifference } = this.props;
    const { priceForDays, serviceFees, discount, discountType, total } = this.props;
    const { formatMessage } = this.props.intl;
    const { bookingSpecialPricing, isSpecialPriceAssigned, isAverage } = this.props;
    const { base, toCurrency } = this.props;

    return (
      <div>
        <div>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <table className={cx('table')}>
                <tbody>
                  <tr className={s.tableText}>
                    <td className={cx(s.noBorder)}>
                      <div className={s.specialPriceText}>
                        <span>
                          <CurrencyConverter
                            //amount={basePrice}
                            amount={isAverage}
                            from={currency}
                          />
                        </span>
                        <span>
                          x {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
                        </span>
                      </div>
                      <div className={s.specialPriceIcon}>
                        {
                          isSpecialPriceAssigned && <LinkWithTooltip
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
                      <span>
                        <CurrencyConverter
                          amount={priceForDays}
                          from={currency}
                        />
                      </span>
                    </td>
                  </tr>
                  {
                    cleaningPrice > 0 && <tr className={s.tableText}>
                      <td className={cx(s.noBorder)}><FormattedMessage {...messages.cleaningFee} /></td>
                      <td className={cx(s.noBorder, 'text-right')}>
                        <span>
                          <CurrencyConverter
                            amount={cleaningPrice}
                            from={currency}
                          />
                        </span>
                      </td>
                    </tr>
                  }
                  {
                    serviceFees > 0 && <tr className={s.tableText}>
                      <td className={cx(s.noBorder)}><FormattedMessage {...messages.serviceFee} />
                      <div className={s.specialPriceIcon}>
                          <LinkWithTooltip
                            tooltip={formatMessage(messages.serviceFeeNote)}
                            id="tooltip-1"
                            className={cx(s.tooltip, 'paymentTooltip')}
                          >
                            <span className={s.iconSection}>
                              <FontAwesome.FaQuestion className={s.toolTipColor} />
                            </span>
                          </LinkWithTooltip>
                        
                      </div>
                      </td>
                      <td className={cx(s.noBorder, 'text-right')}>
                        <span>
                          <CurrencyConverter
                            amount={serviceFees}
                            from={currency}
                          />
                        </span>

                        

                      </td>
                    </tr>
                  }
                  {
                    discount > 0 && <tr className={s.tableText}>
                      <td className={cx(s.noBorder)}>{discountType}</td>
                      <td className={cx(s.noBorder, 'text-right')}>
                        - <span>
                          <CurrencyConverter
                            amount={discount}
                            from={currency}
                          />
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
        <div className={cx(s.totalValue, s.space2)}>
          <Col xs={12} sm={12} md={12} lg={12} className={s.smPadding}>
            <table className={cx('table')}>
              <tbody>
                <tr className={cx(s.totalText, currency === toCurrency ? s.textLarge : null)}>
                  <td className={cx(s.noBorder)}><FormattedMessage {...messages.total} /></td>
                  <td className={cx(s.noBorder, 'text-right')}>
                    <span>
                      <CurrencyConverter
                        amount={total}
                        from={currency}
                        superSymbol
                      />
                    </span>
                  </td>
                </tr>
                { currency !== toCurrency &&
                  <tr className={cx(s.totalText, s.textLarge)}>
                  <td className={cx(s.noBorder)}><FormattedMessage {...messages.total} /></td>
                  <td className={cx(s.noBorder, 'text-right')}>
                    <span>
                      <CurrencyConverter
                        amount={total}
                        from={currency}
                        noConversion={true}
                        superSymbol
                      />
                    </span>
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </Col>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  base: state.currency.base,
  toCurrency: state.currency.to,
});

const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(PaymentDetails)));
