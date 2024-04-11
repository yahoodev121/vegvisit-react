import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

class CurrencyView extends Component {
    static propTypes = {
    	amount: PropTypes.number.isRequired,
    	currency: PropTypes.string.isRequired
    };

    render() {
    	const { amount, currency } = this.props;
    	const { formatNumber } = this.props.intl;
        return (
            <span>
            	{formatNumber(amount.toFixed(2), {style: 'currency', currency })}
            </span>
        );
    }
}

export default injectIntl(CurrencyView);
