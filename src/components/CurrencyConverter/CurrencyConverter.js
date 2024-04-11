import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Translation
import { injectIntl, IntlProvider, FormattedNumber } from 'react-intl';

// Helper
import { convert } from '../../helpers/currencyConvertion';

class CurrencyConverter extends Component {

  static propTypes = {
    from: PropTypes.string,
    amount: PropTypes.number,
    base: PropTypes.string,
    rates: PropTypes.object,
    superSymbol: PropTypes.bool,
    className: PropTypes.string,
    toCurrency: PropTypes.string,
    noConversion: PropTypes.bool, // if true, will not convert to a different currency (toCurrency). The component is then just used for displaying a fixed currency amount.
    toFixedCurrency: PropTypes.string, // if set, the component will convert to this currency but not react to changes of toCurrency.
  };

  static defaultProps = {
    amount: 0,
    superSymbol: false,
  }

  constructor(props) {
    super(props);
    const { base, rates } = props;
    if (base != undefined && rates != undefined) {
      this.state = {
        base: base,
        rates: rates
      }
    } else {
      this.state = {
        base: null,
        rates: null
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { base, rates } = props;
    if (base != undefined && rates != undefined && (base != state.base || !_.isEqual(rates, state.rates))) {
      return { base: base, rates: rates };
    } else {
      return null;
    }
  }

  render() {
    const { from, amount, superSymbol, className, toCurrency, locale, isCurrency, noConversion, toFixedCurrency } = this.props;
    const { base, rates } = this.state;

    const { formatNumber } = this.props.intl;

    let targetCurrency;
    let convertedAmount = amount;
    let fromCurrency = from || base;

    if (rates != null && !noConversion) {
      convertedAmount = convert(base, rates, amount, fromCurrency, toFixedCurrency ? toFixedCurrency : toCurrency);
    }

    if (noConversion) {
      targetCurrency = fromCurrency
    } else if (toFixedCurrency) {
      targetCurrency = toFixedCurrency;
    } else if (toCurrency) {
      targetCurrency = toCurrency;
    } else {
      targetCurrency = base;
    }

    return (
      <span className={className}>
     
        <FormattedNumber
          value={convertedAmount}
          style="currency"
          currency={targetCurrency}
          minimumFractionDigits={convertedAmount % 1 === 0 ? 0 : 2}
          maximumFractionDigits={convertedAmount % 1 === 0 ? 0 : 2}
          currencyDisplay={"symbol"}
        />
        {
          superSymbol && <sup>{targetCurrency}</sup>
        }

      </span>
    )
  }

}

const mapState = (state) => ({
  base: state.currency.base,
  toCurrency: state.currency.to,
  rates: state.currency.rates,
  locale: state.intl.locale
});

const mapDispatch = {};

export default injectIntl(connect(mapState, mapDispatch)(CurrencyConverter));


