// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import { ProgressBar } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TabBarStep3.css';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

class TabBarStep3 extends Component {

  static propTypes = {
    nextPage: PropTypes.any,
    formatMessage: PropTypes.any,
  };

  render() {
    const { nextPage } = this.props;

    return (
      <div className={cx(s.progressContainer, 'hidden-xs')}>
        <a className={s.linkReset} onClick={() => nextPage("guest-requirements")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Guest Requirements" >
            <FormattedMessage {...messages.guestRequirements} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("house-rules")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="House Rules" >
            <FormattedMessage {...messages.houseRules} />
          </div>
        </a>

        {/* <a className={s.linkReset} onClick={() => nextPage("review-how-guests-book")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Review GuestBook" >
            <FormattedMessage {...messages.reviewGuestBook} />
          </div>
        </a> */}

        <a className={s.linkReset} onClick={() => nextPage("advance-notice")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Notice & Check-In">
            <FormattedMessage {...messages.advanceNotice} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("booking-window")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Cancellation Policy" >
            <FormattedMessage {...messages.bookingWindow} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("min-max-nights")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Min Max Nights" >
            <FormattedMessage {...messages.minMaxNights} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("pricing")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Pricing" >
            <FormattedMessage {...messages.tabPricing} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("calendar")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Calendar" >
            <FormattedMessage {...messages.tabCalendar} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("discount")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Discount" >
            <FormattedMessage {...messages.tabDiscount} />
          </div>
        </a>

        {/* <a className={s.linkReset} onClick={() => nextPage("booking-scenarios")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Booking" >
            <FormattedMessage {...messages.tabBooking} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("local-laws")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection, s.progressStyle)} title="Local Laws" >
            <FormattedMessage {...messages.tabLocalLaws} />
          </div>
        </a> */}

        <div>
          <ProgressBar className={s.leanProgress} />
        </div>
      </div>
    );
  }

}

export default withStyles(s)(TabBarStep3);
