import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Transaction.css';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import Link from '../../Link';

class CompletedTransactionItem extends Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
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
      const { data: { listData } } = this.props;
      const timeZone = data.listData ? data.listData.timeZone : null;
    	let date = data.createdAt != null ? moment(data.createdAt).format('DD-MM-YYYY') : 'Pending';
    	let checkInDate = (data.checkIn != null && timeZone) ? moment(data.checkIn).tz(timeZone).format('MMM DD, YYYY') : '';
    	let checkOutDate = (data.checkOut != null && timeZone) ? moment(data.checkOut).tz(timeZone).format('MMM DD, YYYY') : '';
		  let totalAmount = Number(data.total) - Number(data.hostServiceFee);
        return (
            <tr>
	          <td className={className}>{date}</td>
	          <td className={className}>Reservation</td>
	          <td className={className}>
	          	<ul className={s.listLayout}>
		          <li>
		          	{checkInDate} - {checkOutDate} &nbsp;
					{data.listData && <Link to={"/users/trips/receipt/" + data.id}>{data.confirmationCode}</Link>}
					{!data.listData && <span>{data.confirmationCode}</span>}
		          </li>
		          <li>
		          	{data.guestData ? data.guestData.firstName : ''}
		          </li>
		          <li>
					{data.listData ? data.listData.title : ''}
		          </li>
		        </ul>
	          </td>
	          <td className={className}>
				<CurrencyConverter
					amount={totalAmount}
					from={data.currency}
					className={s.currencyColor}
				/>	          
	          </td>
	          <td className={className} />
	        </tr>
        );
    }
}

export default withStyles(s)(CompletedTransactionItem);
