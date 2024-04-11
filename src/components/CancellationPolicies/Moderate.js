import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Tooltip
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CancellationPolicies.css';

class Moderate extends React.Component {

  static propTypes = {
    siteName: PropTypes.string.isRequired
  };

  render() {
    const { siteName } = this.props;
    return (
      <div>
        <div >
          <h3>Moderate: Full refund 5 days prior to check-in</h3>
          <ul className={s.subText}>
            <li>
              If the host charges a cleaning fee, it is refundable as long as the guest cancels prior to 11AM of the listing’s local time on the day of check-in.
              </li>
            <li>
              Accommodation fees (the total nightly rate you're charged) are refundable in certain circumstances as outlined below.
            </li>
            <li>
              Service fees are not refundable.
            </li>
            <li>
              If there is a complaint from either party, notice must be given to {siteName} within 24 hours of check-in.
            </li>
            <li>{siteName} will mediate when necessary, and has the final say in all disputes.</li>
            <li>A reservation is officially canceled when the guest clicks the cancellation button on the cancellation confirmation page, which they can find in Trips > Upcoming Trips > Cancel.</li>
            <li>
              Cancellation policies may be superseded by extenuating circumstances, or cancellations by {siteName} for any other reason permitted under the Terms of Service. Please review these exceptions.
            </li>
            <li>
              Depending on the refund method, a small processing fee may be applied to cover the cost of transferring funds securely back to guests.
            </li>
          </ul>
        </div>
        <div className={cx(s.lineGraph, s.hidesm)}>
          <Row className={s.graphContainer}>
            <Col lg={4} md={4} sm={4} xs={12} className={cx(s.timeLine, s.refund)}>
              <div className={s.timeLinePoint}>
                <Tooltip placement="top" id="tooltip-top" className={s.toolTop}>
                  5 days Prior
                    </Tooltip>
                <div className={s.toolMarker}></div>
                <div className={s.toolLable}>
                  Sun, Jun 07 <br />
                  11:00 AM
                    </div>

              </div>
              <div className={s.FlexibleTop}>
                <p>
                For a full refund of accommodation fees, cancellation must be made 5 days prior to 11AM of the listing’s local time on the day of check-in. For example, if check-in is on Friday, cancel by the previous Sunday before 11AM.
            </p>
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={12} className={cx(s.timeLine, s.semiRefund)}>
              <div className={s.timeLinePoint}>
                <Tooltip placement="top" id="tooltip-top" className={s.toolTop}>
                  Check in
                      </Tooltip>
                <div className={s.toolMarker}></div>
                <div className={s.toolLable}>
                  Fri, Jun 12 <br />
                  11:00 AM
                    </div>
              </div>
              <div className={s.FlexibleTop}>
                <p>
                  If the guest cancels less than 5 days in advance, the first night is non-refundable but 50% of the accommodation fees for the remaining nights are refunded.
            </p>
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={12} className={cx(s.timeLine, s.partialRefund)} >
              <div className={s.timeLinePoint}>
                <Tooltip placement="top" id="tooltip-top" className={s.toolTop}>
                  Check Out
                      </Tooltip>
                <div className={s.toolMarker}></div>
                <div className={s.toolLable}>
                  Sun, Jun 14 <br />
                  11:00 AM
                    </div>
              </div>
              <div className={s.FlexibleTop}>
                <p>
                If the guest arrives and decides to leave early, 50% of the accommodation fees for the nights not fully spent (until 11AM) 24 hours after the cancellation occurs are refunded.
            </p>
              </div>
            </Col>
            <div className={s.toolText}>
              Example
                </div>
          </Row>
        </div>

      </div>
    );
  }
}
export default withStyles(s)(Moderate);