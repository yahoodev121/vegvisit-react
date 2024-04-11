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
 * Displays values (might be several lines) for cancellation calculation details.
 * Use it in conjunction with @see {@link NightsCalculationLabels}
 */
class NightsCalculationResults extends React.Component {

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
      <span>
        {(!specialPrice && accomodationPercentage > 0) &&
          <span>

            {/* <span>
              <CurrencyConverter
                amount={nights*basePrice*accomodationPercentage/100}
                from={currency}
              />
            </span><br />
            {discountPerNight > 0 &&
            <span>
            <span>
              - <CurrencyConverter
                amount={nights*discountPerNight*accomodationPercentage/100}
                from={currency}
              />
            </span><br /></span>
            } */}

            <span>
              <CurrencyConverter
                amount={nights*(basePrice-discountPerNight)*accomodationPercentage/100}
                from={currency}
              />
            </span><br />
          </span>
        }
        {!restrictionSpecialPrice && (restrictionNights > 0 && restrictionPercentage > 0) && 
          <span>

            {/* <span>
              <CurrencyConverter
                amount={restrictionNights*basePrice*restrictionPercentage/100}
                from={currency}
              />
            </span><br />
            {discountPerNight > 0 &&
            <span>
            <span>
              - <CurrencyConverter
                amount={restrictionNights*discountPerNight*restrictionPercentage/100}
                from={currency}
              />
            </span><br /></span>
            } */}

            <span>
              <CurrencyConverter
                amount={restrictionNights*(basePrice-discountPerNight)*restrictionPercentage/100}
                from={currency}
              />
            </span><br />
          </span>
        }
        {(specialPrice > 0 && accomodationPercentage > 0) &&
          <span>
            <CurrencyConverter
              amount={specialPrice*accomodationPercentage/100}
              from={currency}
            />
            <br />
          </span>
        }
        {(restrictionSpecialPrice > 0 && restrictionPercentage > 0) &&
          <span>
            <CurrencyConverter
              amount={restrictionSpecialPrice*restrictionPercentage/100}
              from={currency}
            />
            <br />
          </span>
        }
      </span>
    );
  }
}

export default injectIntl(withStyles(s)(NightsCalculationResults));

