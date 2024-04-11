import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cancellation.css';

// Locale
import messages from '../../locale/messages';

//Component
import CurrencyConverter from '../CurrencyConverter/CurrencyConverter';

/**
 * Displays labels (might be several lines) for cancellation calculation details.
 * Use it in conjunction with @see {@link NightsCalculationResults}
 */
class NightsCalculationLabels extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    basePrice: PropTypes.number.isRequired,
    discountPerNight: PropTypes.number,
    currency: PropTypes.string.isRequired,
    nights: PropTypes.number.isRequired,
    specialPrice: PropTypes.number,
    accomodationPercentage: PropTypes.number,
    restrictionNights: PropTypes.number,
    restrictionPercentage: PropTypes.number,
    restrictionSpecialPrice: PropTypes.number
  };

  static defaultProps = {
    accomodationPercentage: 100,
    restrictionPercentage: 100
  };

  render() {
    const { basePrice, discountPerNight, currency, nights, specialPrice,  accomodationPercentage} = this.props;
    const { restrictionNights, restrictionPercentage, restrictionSpecialPrice } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <span className={s.textTruncate}>
      {(!specialPrice && accomodationPercentage > 0) &&
        <span>

          {/* <span>
            <CurrencyConverter
              amount={basePrice}
              from={currency}
            />
          </span><span> x {nights} {nights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}{accomodationPercentage != 100 ? ` x ${accomodationPercentage}%` : ''}</span><br />
          {discountPerNight > 0 && <span>
          <span>
            <CurrencyConverter
              amount={discountPerNight}
              from={currency}
            />
          </span><span> x {nights} {nights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)} {formatMessage(messages.discountWord)}{accomodationPercentage != 100 ? ` x ${accomodationPercentage}%` : ''}</span><br /></span>
          } */}

          <span>
            <CurrencyConverter
              amount={basePrice}
              from={currency}
            />
          </span><span> x {nights} {nights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}{discountPerNight > 0 ? ` (${Number.parseFloat(discountPerNight*100/basePrice).toFixed(0)}% ${formatMessage(messages.discountWord)})` : ''}{accomodationPercentage != 100 ? ` x ${accomodationPercentage}%` : ''}</span><br />
        </span>
      }
      {!restrictionSpecialPrice && (restrictionNights > 0 && restrictionPercentage > 0) &&
        <span>

          {/* <span>
            <CurrencyConverter
              amount={basePrice}
              from={currency}
            />
          </span><span> x {restrictionNights} {restrictionNights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}{restrictionPercentage != 100 ? ` x ${restrictionPercentage}%` : ''}</span><br />
          {discountPerNight > 0 && <span>
            <span>
              <CurrencyConverter
                amount={discountPerNight}
                from={currency}
              />
            </span><span> x {restrictionNights} {restrictionNights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)} {formatMessage(messages.discountWord)}{restrictionPercentage != 100 ? ` x ${restrictionPercentage}%` : ''}</span><br /></span>
          } */}

          <span>
            <CurrencyConverter
              amount={basePrice}
              from={currency}
            />
          </span><span> x {restrictionNights} {restrictionNights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}{discountPerNight > 0 ? ` (${Number.parseFloat(discountPerNight*100/basePrice).toFixed(0)}% ${formatMessage(messages.discountWord)})` : ''}{restrictionPercentage != 100 ? ` x ${restrictionPercentage}%` : ''}</span><br />
        </span>
      }
      {(specialPrice > 0 && accomodationPercentage > 0) &&
        <span>
          {formatMessage(messages.specialPricing)} ({nights} {nights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}){accomodationPercentage != 100 ? ` x ${accomodationPercentage}%` : ''}
          <br />
        </span>
      }
      {(restrictionSpecialPrice > 0 && restrictionPercentage > 0) &&
        <span>
          {formatMessage(messages.specialPricing)} ({restrictionNights} {restrictionNights > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}){restrictionPercentage != 100 ? ` x ${restrictionPercentage}%` : ''}
          <br />
        </span>
      }
      </span>
    );
  }
}

export default injectIntl(withStyles(s)(NightsCalculationLabels));

