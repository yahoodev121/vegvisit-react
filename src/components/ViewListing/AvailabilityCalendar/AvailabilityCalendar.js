import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DayPickerRangeController, isInclusivelyBeforeDay, isInclusivelyAfterDay } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';
import MomentLocaleUtils from 'react-day-picker/moment';

import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import c from './AvailabilityCalendar.css';
// import S from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
// import 'react-dates/initialize';

import s from '!isomorphic-style-loader!css-loader!./AvailabilityCalendar.css';

// External Component
import DayPicker, { DateUtils } from 'react-day-picker';

// Redux
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Locale
import messages from '../../../locale/messages';

// Redux Actions
import { checkAvailability } from '../../../actions/checkAvailability';

// import CustomizableCalendarDay from './CustomizableCalendarDay';
// import CustomDayContents from './CustomDayContents';
import CurrencyConverter from '../../CurrencyConverter';

class AvailabilityCalendar extends React.Component {
  static propTypes = {
    listId: PropTypes.number.isRequired,
    blockedDates: PropTypes.array,
    smallDevice: PropTypes.bool,
    verySmallDevice: PropTypes.bool
  };

  static defaultProps = {
    blockedDates: [],
    listId: null,
    smallDevice: false,
    verySmallDevice: false
  }

  constructor(props) {
    super(props);
    this.renderDay = this.renderDay.bind(this);
    this.isSelectableDate = this.isSelectableDate.bind(this);
  }

  isSelectableDate(day) {
    const { blockedDates } = this.props;
    let dateRangeValue = moment(day).format('YYYY-MM-DD');
    let isSameDate = false;
    blockedDates && blockedDates.map((item, key) => {
      let dateValue = moment(item.blockedDates).format('YYYY-MM-DD');
      if (dateRangeValue == dateValue) {
        isSameDate = true;
      }
    })
    return (isSameDate) ? true : false;
  }

  renderDay(day) {
    const { listingData: { currency } } = this.props;
    const { blockedDates } = this.props;
    const date = day.getDate();
    let dateRangeValue = moment(day).format('YYYY-MM-DD');
    return (
      <div>
        <div className={'dateFontWeight'}>{date}</div>
        {
          blockedDates && blockedDates.map((item, key) => {
            let dateValue = moment(item.blockedDates).format('YYYY-MM-DD');
            if (dateRangeValue == dateValue) {
              return (
                <div className={'priceAlignment'}>
                  <CurrencyConverter
                    amount={item.isSpecialPrice}
                    //from={currency}
                    //isCurrency={currency}
                  />
                </div>
              );
            }
          })
        }
      </div >
    );
  }

  render() {
    const { smallDevice, verySmallDevice, listId } = this.props;
    const { loading, blockedDates } = this.props;
    const { formatMessage } = this.props.intl;
    const modifiers = {
      available: day => this.isSelectableDate(day)
    };

    return (
      <div className={cx(s.pageContent)}>
        {
          !loading && <Col xs={12} sm={12} md={8} lg={8} className={cx(s.sectionContainer, s.boxContainer, s.horizontalLineThrough, 'horizontalLineThrough')}>
            <h1 className={cx(c.sectionAvailableTitleText, 'sectionAvailableTitleText')}>
              <FormattedMessage {...messages.availablilityterm} />
            </h1>
            <div className={cx(s.calendarContainer, 'availabilityCalendar')}>
              <DayPicker
                modifiers={modifiers}
                canChangeMonth={true}
                renderDay={this.renderDay}
                localeUtils={MomentLocaleUtils}
              />
            </div>
          </Col>
        }
      </div>
    );
  }
}

export default injectIntl(withStyles(s)((AvailabilityCalendar)));
