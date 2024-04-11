import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
// Redux
import { connect } from 'react-redux';
import {
	Row,
	Col,
	Tooltip,
	OverlayTrigger
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';
import * as FontAwesome from 'react-icons/lib/fa';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import LinkWithTooltip from '../../LinkWithTooltip'

// Helper
import { convert } from '../../../helpers/currencyConvertion';

// Locale
import messages from '../../../locale/messages';

class PaymentDetails extends Component {
	static propTypes = {
		formatMessage: PropTypes.any,
		userType: PropTypes.string.isRequired,
		basePrice: PropTypes.number.isRequired,
		cleaningPrice: PropTypes.number.isRequired,
		monthlyDiscount: PropTypes.number,
		weeklyDiscount: PropTypes.number,
		currency: PropTypes.string.isRequired, // as specified in the listing
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
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
    toCurrency: PropTypes.string.isRequired,
	};

	static defaultProps = {
		startDate: null,
		endDate: null,
		basePrice: 0,
		cleaningPrice: 0,
		monthlyDiscount: 0,
		weeklyDiscount: 0
	};

	render() {
		const { startDate, endDate, basePrice, cleaningPrice, currency, monthlyDiscount, weeklyDiscount, userType } = this.props;
		const { serviceFees, base, rates, toCurrency } = this.props;
		const { reservationData } = this.props;
		const { formatMessage } = this.props.intl;

		//let guestServiceFee = 10;
		//let hostServiceFee = 20;
		let guestServiceFee = 0, hostServiceFee = 0;
		let currentDay, bookingSpecialPricing = [], isSpecialPriceAssigned = false;
		let isSpecialPricingAssinged = (reservationData && reservationData.bookingSpecialPricing.length > 0) ? true : false;
		let isSpecialPrice, isDayTotal = 0, isCleaningPrice = 0;
    let isGuestServiceFee = 0, isHostServiceFee = 0;
    const paymentState = reservationData && reservationData.paymentState;
    const noCurrencyConversion = (paymentState === 'completed');

		let momentStartDate, momentEndDate, dayDifference, priceForDays = 0;
		let discount = 0, discountType, total = 0, hostEarnings = 0, isAverage = 0;
    
    const reservationStartDate = reservationData && reservationData.checkIn;
    const reservationEndDate = reservationData && reservationData.checkOut;

		if (reservationStartDate != null && reservationEndDate != null) {
			momentStartDate = moment(reservationStartDate);
			momentEndDate = moment(reservationEndDate);
			dayDifference = momentEndDate.diff(momentStartDate, 'days');

			if (dayDifference > 0) {
				if (isSpecialPricingAssinged) {
          const reservationSpecialPriceAverage = reservationData && reservationData.isSpecialPriceAverage;
          priceForDays = Number(reservationSpecialPriceAverage) * Number(dayDifference);
					/* reservationData && reservationData.bookingSpecialPricing && reservationData.bookingSpecialPricing.map((item, index) => {
						priceForDays = priceForDays + Number(item.isSpecialPrice);
					}); */
				} else {
          const reservationBasePrice = reservationData && reservationData.basePrice;
					priceForDays = Number(reservationBasePrice) * Number(dayDifference);
        }
        isAverage = Number(priceForDays) / Number(dayDifference);
        isDayTotal = isAverage.toFixed(2) * dayDifference;
        priceForDays = isDayTotal;
			}
		}

		isCleaningPrice = reservationData && reservationData.cleaningPrice;
		isGuestServiceFee = reservationData && reservationData.guestServiceFee;
    isHostServiceFee = reservationData && reservationData.hostServiceFee;
    const reservationCurrency = reservationData && reservationData.currency;
    
    discount = reservationData && reservationData.discount;
		if (dayDifference >= 7) {
			if (monthlyDiscount > 0 && dayDifference >= 28) {
				// discount = (Number(priceForDays) * Number(monthlyDiscount)) / 100;
				discountType = monthlyDiscount + "% " + formatMessage(messages.monthlyDiscount);
			} else {
				if (weeklyDiscount > 0) {
					// discount = (Number(priceForDays) * Number(weeklyDiscount)) / 100;
					discountType = weeklyDiscount + "% " + formatMessage(messages.weeklyDiscount);
				}
			}
		}

    /* 
    TODO: Check service fee calculation and persistence to reservation table when using fixed amount and arbitrary currency
    Idea would be to save it to the reservation table in the currency specified there
    if (serviceFees) {
			if (serviceFees.guest.type === 'percentage') {
				guestServiceFee = isGuestServiceFee;
			} else {
				guestServiceFee = convert(base, rates, isGuestServiceFee, serviceFees.guest.currency, currency);
			}

			if (serviceFees.host.type === 'percentage') {
				hostServiceFee = isHostServiceFee;
			} else {
				hostServiceFee = convert(base, rates, isHostServiceFee, serviceFees.host.currency, currency);
			}
		} */
    guestServiceFee = isGuestServiceFee;
    hostServiceFee = isHostServiceFee;
    
    const reservationTotal = reservationData && reservationData.total;

		if (userType === 'host') {
      // total = (priceForDays + isCleaningPrice) - discount;
      total = reservationTotal;
		} else {
      // total = (priceForDays + guestServiceFee + isCleaningPrice) - discount;
      total = reservationTotal + guestServiceFee;
		}

		hostEarnings = total - hostServiceFee;

		
		return (
			<div>
				<h4 className={s.space4}>
					<span><FormattedMessage {...messages.payment} /></span>
				</h4>
				{
					<Row className={s.textGray}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span>
								<CurrencyConverter
									//amount={basePrice}
									amount={isAverage}
									from={reservationCurrency}
                  noConversion={noCurrencyConversion}
								/>
							</span>
							<span>
								x {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
							</span>
							{
								isSpecialPricingAssinged && 
                <LinkWithTooltip
									tooltip={formatMessage(userType === 'guest' ? messages.specialPriceNote : messages.specialPriceNoteHost)}
									// href="#"
									id="tooltip-1"
                  className={cx(s.tooltip)}
								>
									<span className={cx(s.toolTipColor)}>
										<FontAwesome.FaQuestion className={s.instantIcon} />
									</span>
								</LinkWithTooltip>
							}
						</Col>
						<Col xs={5} sm={5} className={s.textRight}>
							<CurrencyConverter
								amount={priceForDays}
								from={reservationCurrency}
                noConversion={noCurrencyConversion}
							/>
						</Col>

					</Row>
				}
				{
					isCleaningPrice > 0 && <Row className={s.textGray}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span><FormattedMessage {...messages.cleaningPrice} /></span>
						</Col>
						<Col xs={5} sm={5} className={s.textRight}>
							<span>
								<CurrencyConverter
									amount={isCleaningPrice}
									from={reservationCurrency}
                  noConversion={noCurrencyConversion}
								/>
							</span>
						</Col>
					</Row>
				}

				{
					discount > 0 && <Row className={s.textGray}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span>{discountType}</span>
						</Col>
						<Col xs={5} sm={5} className={cx(s.textRight, s.discountText)}>
							<span>
								- <CurrencyConverter
									amount={discount}
									from={reservationCurrency}
                  noConversion={noCurrencyConversion}
								/>
							</span>
						</Col>
					</Row>
				}

				{
					userType === 'guest' && guestServiceFee > 0 && <Row className={s.textGray}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span><FormattedMessage {...messages.serviceFee} />
                <LinkWithTooltip
                  tooltip={formatMessage(messages.serviceFeeNote)}
                  id="tooltip-1"
                  className={cx(s.tooltip)}
                >
                  <span className={s.iconSection}>
                    <FontAwesome.FaQuestion className={s.toolTipColor} />
                  </span>
                </LinkWithTooltip>
              </span>
						</Col>
						<Col xs={5} sm={5} className={s.textRight}>
							<span>
								<CurrencyConverter
									amount={guestServiceFee}
									from={reservationCurrency}
                  noConversion={noCurrencyConversion}
								/>
							</span>
						</Col>
					</Row>
				}

				{
					userType === 'guest' && <hr className={s.horizontalLine} />
				}

				<Row className={cx(s.textBold, s.spaceTop2)}>
					<Col xs={6} sm={6} className={s.textLeft}>
						<span><FormattedMessage {...messages.subTotal} /></span>
					</Col>
					<Col xs={6} sm={6} className={s.textRight}>
						<span>
							<CurrencyConverter
								amount={total}
								from={reservationCurrency}
                noConversion={noCurrencyConversion}
							/>
						</span>
            {
              userType === 'guest' && toCurrency !== reservationCurrency && !noCurrencyConversion &&
                <span>
                  {' ('}
                  <CurrencyConverter
                    amount={total}
                    from={reservationCurrency}
                    noConversion={true}
                  />
                  {')'}
                </span>
            }
					</Col>
				</Row>

				{
					userType === 'host' && hostServiceFee > 0 && <Row className={s.textGray}>
						<Col xs={6} sm={6} className={s.textLeft}>
							<span><FormattedMessage {...messages.serviceFee} />
                <LinkWithTooltip
                  tooltip={formatMessage(messages.serviceFeeNote)}
                  id="tooltip-1"
                  className={cx(s.tooltip)}
                >
                  <span className={s.iconSection}>
                    <FontAwesome.FaQuestion className={s.toolTipColor} />
                  </span>
                </LinkWithTooltip>
              </span>
						</Col>
						<Col xs={6} sm={6} className={s.textRight}>
							<span>
								-
			                	<CurrencyConverter
									amount={hostServiceFee}
									from={reservationCurrency}
                  noConversion={noCurrencyConversion}
								/>
							</span>
						</Col>
					</Row>
				}

				{
					userType === 'host' && <hr className={s.horizontalLine} />
				}


				{
					userType === 'host' && <Row className={cx(s.textBold, s.spaceTop2, s.space3)}>
						<Col xs={6} sm={6} className={s.textLeft}>
							<span><FormattedMessage {...messages.youEarn} /></span>
						</Col>
						<Col xs={6} sm={6} className={s.textRight}>
							<span>
								<CurrencyConverter
									amount={hostEarnings}
									from={reservationCurrency}
                  noConversion={noCurrencyConversion}
								/>
							</span>
              {
                toCurrency !== reservationCurrency && !noCurrencyConversion &&
                  <span>
                    {' ('}
                    <CurrencyConverter
                      amount={hostEarnings}
                      from={reservationCurrency}
                      noConversion={true}
                    />
                    {')'}
                  </span>
              }
						</Col>
					</Row>
				}
        {
					userType === 'host' && !noCurrencyConversion && (reservationCurrency !== toCurrency) &&
            <div className={cx(s.spaceTop2)}>
              <FormattedMessage {...messages.currencyNotePaymentServiceProvider} values={{currency: reservationCurrency}}/>
            </div>
        }
        {
          userType === 'guest' && !noCurrencyConversion && total > 0 && toCurrency !== currency &&
            <div className={cx(s.spaceTop2)}>
              <FormattedMessage {...messages.bookingCurrencyNotePaypal} values={{currency: currency}}/>
					  </div>
				}
			</div>
		);
	}
}

const mapState = (state) => ({
	serviceFees: state.book.serviceFees,
	base: state.currency.base,
  rates: state.currency.rates,
  toCurrency: state.currency.to,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(PaymentDetails)));

