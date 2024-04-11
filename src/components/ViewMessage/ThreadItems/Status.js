import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import 'moment-timezone';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';

class Status extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        messageType: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        timeZone: PropTypes.string,
        isActive: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        type: null,
        messageType: null,
        createdAt: null
    };

    label(status) {
        switch (status) {
            case 'inquiry':
                return 'Inquiry';
            case 'preApproved':
                return 'Pre Approved';
            case 'declined':
                return 'Declined';
            // case 'approved':
            //     return 'Approved';
            case 'pending':
                return 'Pending';
            case 'cancelledByHost':
                return 'Cancelled by host';
            case 'cancelledByGuest':
                return 'Cancelled by guest';
            case 'intantBooking':
                return 'Booking Confirmed';
            case 'confirmed':
                return 'Booking Confirmed';
            case 'expired':
                return 'Expired';
            case 'requestToBook':
                return 'Request to book';
            case 'completed':
                return 'Completed';
            case 'paymentExpire' :
                return 'Booking Expired'
        }
    }

    render() {
        const { type, messageType, createdAt, timeZone, isActive } = this.props;
        let date;
        if (createdAt) {
          let dateObject = moment(createdAt);
          date = dateObject.format('MM/DD/YYYY');
          if (timeZone && type && type.startsWith('cancelled')) {
            const dateObjectHostTime = dateObject.tz(timeZone);
            date += ` (${dateObjectHostTime.format('MM/DD/YYYY, h:mm:ss a')} ${timeZone})`;
          }
        } else {
          date = '';
        }
        return (
            <div className={cx(s.inlineStatus, s.space5, isActive ? s.textBold : '')}>
                <div className={cx(s.horizontalText)}>
                    <span className={s.textWrapper}>
                        {
                            type === 'inquiry' && messageType === 'requestToBook' &&
                            <span>Request to book</span>
                        }
                        {
                            type === 'preApproved' && messageType === 'requestToBook' &&
                            <span>Approved</span>
                        }
                        {
                            type === 'inquiry' && messageType === 'inquiry' &&
                            <span>Inquiry</span>
                        }

                        {
                            type === 'preApproved' && messageType === 'inquiry' &&
                            <span>Pre-Approved</span>
                        }

                        {
                            type !== 'inquiry' && type !== 'preApproved' &&
                            <span>{this.label(type)}</span>
                        }
                        {
                            type === 'approved' && messageType === 'requestToBook'  && 
                            <span>Booking Confirmed</span>
                        }
                        <span> {date}</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(Status);

