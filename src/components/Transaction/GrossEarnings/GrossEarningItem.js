import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { FormattedMessage } from 'react-intl';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Transaction.css';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';
class GrossEarningItem extends Component {
	static propTypes = {
		className: PropTypes.string.isRequired,
		formatMessage: PropTypes.any,
		data: PropTypes.shape({
			id: PropTypes.number.isRequired,
			total: PropTypes.number.isRequired,
			guestServiceFee: PropTypes.number.isRequired,
			hostServiceFee: PropTypes.number.isRequired,
			currency: PropTypes.string.isRequired,
			checkIn: PropTypes.string.isRequired,
			checkOut: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
			listData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        timeZone: PropTypes.string.isRequired
			}).isRequired,
			guestData: PropTypes.shape({
				firstName: PropTypes.string.isRequired
			}).isRequired,
			hostTransaction: PropTypes.shape({
				createdAt: PropTypes.string.isRequired
			}).isRequired,
		})
	};

	render() {
    const { className, data } = this.props;
    const { data: { listData: { timeZone } } } = this.props;
		let date = data.hostTransaction != null ? moment(data.hostTransaction.createdAt).format('DD-MM-YYYY') : 'Pending';
		let checkInDate = (data.checkIn != null && timeZone) ? moment(data.checkIn).tz(timeZone).format('MMM DD, YYYY') : '';
		let checkOutDate = (data.checkOut != null && timeZone) ? moment(data.checkOut).tz(timeZone).format('MMM DD, YYYY') : '';
		// let totalAmount = Number(data.total) - Number(data.hostServiceFee);
		let totalAmount = Number(data.total);

		let payoutAmount = data && data.cancellationDetails && data.cancellationDetails;

		let isAmount = 0;

		if (payoutAmount) {
			isAmount = data && data.cancellationDetails && data.cancellationDetails.payoutToHost ? data.cancellationDetails.payoutToHost : totalAmount;
		} else {
			isAmount = data && data.cancellationDetails && data.cancellationDetails.payoutToHost ? data.cancellationDetails.payoutToHost : totalAmount;
		}


		return (
			<tr>
				<td className={className}>{date}</td>
				<td className={className}><FormattedMessage {...messages.reservation} /></td>
				<td className={className}>
					<p>
						{checkInDate} - {checkOutDate} &nbsp;
						{data.listData && <Link to={"/users/trips/receipt/" + data.id}>{data.confirmationCode}</Link>}
						{!data.listData && <span>{data.confirmationCode}</span>}
					</p>
				</td>
				<td className={className}>
					<CurrencyConverter
						//amount={totalAmount}
						amount={isAmount}
						from={data.currency}
					/>
				</td>
				<td className={className} />
			</tr>
		);
	}
}

export default withStyles(s)(GrossEarningItem);
