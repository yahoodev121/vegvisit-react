import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
// Redux
import { connect } from 'react-redux';
import {
	Row,
	Col
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

class CancelDetails extends Component {
	static propTypes = {
		userType: PropTypes.string.isRequired,
		formatMessage: PropTypes.any,
		cancelData: PropTypes.shape({
			guestServiceFee: PropTypes.number,
			hostServiceFee: PropTypes.number,
			refundToGuest: PropTypes.number,
			payoutToHost: PropTypes.number,
			total: PropTypes.number,
			currency: PropTypes.string,
		})
	};

	render() {
		const { userType } = this.props;
		const { cancelData: { cancellationPolicy, guestServiceFee, refundToGuest, payoutToHost, currency } } = this.props;
		let earnedAmount = 0, missedEarnings = 0, refund = 0;
		earnedAmount = payoutToHost;
		// missedEarnings = refundToGuest - guestServiceFee;
		refund = refundToGuest;
		const { reservationData: { id: reservationId, total, hostServiceFee} } = this.props;
		missedEarnings = total - earnedAmount - hostServiceFee;

		// if(cancellationPolicy == 'Flexiable') {
		// 	missedEarnings = refundToGuest;
		// 	earnedAmount = payoutToHost;
		// } else if(cancellationPolicy == 'Moderate') {
		// 	missedEarnings = refundToGuest - guestServiceFee;
		// 	earnedAmount = payoutToHost;
		// } else {
		// 	missedEarnings = refundToGuest;
		// 	earnedAmount = payoutToHost;
		// }

		return (
			<div className={s.spaceTop6}>
				<h4 className={s.space4}>
					<span><FormattedMessage {...messages.payment} /></span>
				</h4>

				{
					userType === 'host' && earnedAmount > 0 && <Row className={s.textBold}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span><FormattedMessage {...messages.earnedAmount} /></span>
						</Col>
						<Col xs={5} sm={5} className={s.textRight}>
							<span>
								<CurrencyConverter
									amount={earnedAmount}
									from={currency}
                  noConversion={true}
								/>
							</span>
						</Col>
					</Row>
				}

				{
					userType === 'host' && <Row className={cx(s.textBold, s.spaceTop2)}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span><FormattedMessage {...messages.missedEarnings} /></span>
						</Col>
						<Col xs={5} sm={5} className={s.textRight}>
							<span>
								<CurrencyConverter
									amount={missedEarnings}
									from={currency}
                  noConversion={true}
								/>
							</span>
						</Col>
					</Row>
				}

				{
					userType === 'guest'  && <Row className={cx(s.textBold, s.spaceTop2)}>
						<Col xs={7} sm={7} className={s.textLeft}>
							<span><FormattedMessage {...messages.refundAmount} /></span>
						</Col>
						<Col xs={5} sm={5} className={s.textRight}>
							<span>
								<CurrencyConverter
									amount={refund}
									from={currency}
                  noConversion={true}
								/>
							</span>
						</Col>
					</Row>
				}
        <br /><Link to={"/users/trips/receipt/" + reservationId}><FormattedMessage {...messages.viewReceipt} /></Link>

			</div>
		);
	}
}

const mapState = (state) => ({
});

const mapDispatch = {
};

export default withStyles(s)(connect(mapState, mapDispatch)(CancelDetails));

