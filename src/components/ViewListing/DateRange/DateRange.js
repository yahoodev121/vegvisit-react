import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import _ from 'lodash';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

import { DateRangePicker, isInclusivelyBeforeDay, isInclusivelyAfterDay } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';

// Redux
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';


// Redux Action
import { change } from 'redux-form';
import { checkAvailability } from '../../../actions/checkAvailability';

import { getSpecialPricingData } from '../../../actions/Listing/getSpecialPricingData';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Locale
import messages from '../../../locale/messages';


class DateRange extends React.Component {
  static propTypes = {
    minimumNights: PropTypes.string.isRequired,
    maximumNights: PropTypes.string.isRequired,
    checkAvailability: PropTypes.any.isRequired,
    blockedDates: PropTypes.array.isRequired,
    listId: PropTypes.number.isRequired,
    formName: PropTypes.string.isRequired,
    maxDaysNotice: PropTypes.string.isRequired,
    formatMessage: PropTypes.any,
    timeZone: PropTypes.string.isRequired,
  };

  static defaultProps = {
    blockedDates: [],
    maxDaysNotice: 'unavailable'
  }

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null,
      blockedDates: [],
      blockedDatesValues: [],
      blockedDatesSet: new Set()
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.isDayBlocked = this.isDayBlocked.bind(this);
  }

  componentDidMount() {
    const { bookingStartDate, bookingEndDate, blockedDates, timeZone } = this.props;
    const { formName } = this.props;
    const { blockedDatesSet } = this.state;

    if (formName == 'BookingForm') {
      if (bookingStartDate && bookingEndDate) {
        this.setState({
          startDate: moment(bookingStartDate),
          endDate: moment(bookingEndDate)
        });
      }
    }

    blockedDates.forEach(day => {
      if (day.calendarStatus != 'available' && timeZone) {
        blockedDatesSet.add(moment(day.blockedDates).tz(timeZone).format('YYYY-MM-DD'));
      }
    });

    this.setState({ blockedDatesSet });
    this.setState({ blockedDatesValues: blockedDates });
  }

  static getDerivedStateFromProps(props, state) {
    const { bookingStartDate, bookingEndDate, blockedDates, isBook, timeZone } = props;
    const { formName } = props;
    const { blockedDatesSet } = state;

    blockedDates.forEach(day => {
      if (day.calendarStatus != 'available' && timeZone) {
        blockedDatesSet.add(moment(day.blockedDates).tz(timeZone).format('YYYY-MM-DD'));
      }
    });

    if (formName == 'BookingForm') {
      if (bookingStartDate && bookingEndDate && !(moment(bookingStartDate).isSame(state.startDate) && moment(bookingEndDate).isSame(state.endDate))) {
        return {
          startDate: moment(bookingStartDate),
          endDate: moment(bookingEndDate),
          blockedDatesSet,
          blockedDatesValues: blockedDates
        };
      } else if(!(bookingStartDate && bookingEndDate) && isBook && (state.startDate !== null || state.endDate !== null)) {
        return {
          startDate: null,
          endDate: null,
          blockedDatesSet,
          blockedDatesValues: blockedDates
        };
      }
    }

    if (!(_.isEqual(blockedDatesSet, state.blockedDatesSet) && _.isEqual(blockedDates, state.blockedDatesValues))) {
      return {
        blockedDatesSet,
        blockedDatesValues: blockedDates
      };
    }

    return null;
  }

  async onDatesChange({ startDate, endDate }) {
    //const { focusedInput } = this.state;
    const { focusedInput, blockedDatesSet, blockedDatesValues } = this.state;
    const { listId, formName, checkAvailability, change, maximumNights, timeZone } = this.props;
    const { getSpecialPricingData } = this.props;

    let startDateHostTZ, endDateHostTZ;
    startDateHostTZ = startDate ? startDate.clone().tz(timeZone, true) : null;
    endDateHostTZ = endDate ? endDate.clone().tz(timeZone, true) : null;
    /* console.log(`startDate was: ${startDate ? startDate.format('YYYY-MM-DD h:mm:ss a ZZ') : ''}`, startDate);
    console.log(`endDate was: ${endDate ? endDate.format('YYYY-MM-DD h:mm:ss a ZZ') : ''}`, endDate);
    console.log(`Setting startDate to host time zone ${timeZone}: ${startDateHostTZ ? startDateHostTZ.format('YYYY-MM-DD h:mm:ss a ZZ') : ''}`, startDateHostTZ);
    console.log(`Setting endDate to host time zone ${timeZone}: ${endDateHostTZ ? endDateHostTZ.format('YYYY-MM-DD h:mm:ss a ZZ') : ''}`, endDateHostTZ); */

    // this is used in the DateRangePicker, so it does not need to be converted to the host time zone
    this.setState({ startDate, endDate });
    // this is essential for saving to the db, so we need to use the host time zone value
    await change(formName, 'startDate', startDateHostTZ);
    await change(formName, 'endDate', endDateHostTZ);
    if ((focusedInput === END_DATE || focusedInput === START_DATE) && endDateHostTZ) {
      await getSpecialPricingData(listId, moment(startDateHostTZ).format('YYYY-MM-DD'), moment(endDateHostTZ).format('YYYY-MM-DD'), timeZone);
      await checkAvailability(listId, moment(moment(startDateHostTZ)).format('YYYY-MM-DD'), moment(moment(endDateHostTZ)).format('YYYY-MM-DD'), maximumNights);
    }
  }

  async onFocusChange(focusedInput) {
    const { startDate} = this.state;
    const { change , formName } = this.props;

    this.setState({ focusedInput });
    if (focusedInput === START_DATE) {
      // this.setState({ endDate: null });
    }

    await change(formName, 'isBook', false);

  }
  /** Blocked Dates **/
  /* isDayBlocked(day){
    const { blockedDates } = this.props;
    let days = [];

    if(blockedDates.length > 0){
      blockedDates.map((item, key) => {
        days.push(moment(item.blockedDates));
      });
    }

    return days.filter(d => d.isSame(day, 'day')).length > 0;
  }*/
  isDayBlocked(day) {
    const { blockedDatesSet, focusedInput } = this.state;
    const { timeZone } = this.props;
    if (blockedDatesSet && timeZone && day) {
      const dayHostTimeZone = moment(day).clone().tz(timeZone, true);
      if (focusedInput === START_DATE) {
        return blockedDatesSet.has(dayHostTimeZone.format('YYYY-MM-DD'));
      } else {
        const previousDayHostTimeZone = dayHostTimeZone.clone().subtract(1, 'days');
        return (blockedDatesSet.has(dayHostTimeZone.format('YYYY-MM-DD')) && blockedDatesSet.has(previousDayHostTimeZone.format('YYYY-MM-DD')));
      }
    } else {
      return null;
    }
  }


  render() {
    const { focusedInput, startDate, endDate } = this.state;
    const { minimumNights, maximumNights, blockedDates, maxDaysNotice, timeZone } = this.props;
    const { formatMessage } = this.props.intl;
    let condition, maximumEndDate;
    
    if (!timeZone || maxDaysNotice === 'unavailable') {
      condition = day => {
        return true;
      }
    } else {
      const today = moment().tz(timeZone);
      let breakPoint;
      if (maxDaysNotice === '3months') {
        breakPoint = today.clone().add(3, 'months');
      } else if (maxDaysNotice === '6months') {
        breakPoint = today.clone().add(6, 'months');
      } else if (maxDaysNotice === '9months') {
        breakPoint = today.clone().add(9, 'months');
      } else if (maxDaysNotice === '12months') {
        breakPoint = today.clone().add(12, 'months');
      }
      condition = (day) => {
        let dayHostTZ = moment(day).clone();

        // shouldn't be needed for isInclusivelyAfterDay but to be sure
        dayHostTZ.tz(timeZone, true);

        if (maxDaysNotice !== 'available') {
          return !isInclusivelyAfterDay(dayHostTZ, today) ||
          isInclusivelyAfterDay(dayHostTZ, breakPoint)
        } else {
          return !isInclusivelyAfterDay(dayHostTZ, today);
        }
      }
    }
    /*if (maximumNights > 0) {
      maximumEndDate = moment().add(maximumNights + 1, 'days');
    }

    if (startDate && maximumNights > 0) {
      maximumEndDate = startDate.clone().add(maximumNights + 1, 'days');
    }

    if (focusedInput === END_DATE) {
      condition = day => !isInclusivelyAfterDay(day, moment()) || isInclusivelyAfterDay(day, maximumEndDate);
    }

    if (focusedInput === START_DATE) {
      condition = day => !isInclusivelyAfterDay(day, moment());
    }*/




    // Disable all by default
    /*condition = day =>
        !isInclusivelyAfterDay(day, today) ||
        isInclusivelyAfterDay(day, today)*/

    // 3 months into the future
    /*condition = day =>
      !isInclusivelyAfterDay(day, today) ||
      isInclusivelyAfterDay(day, breakPoint)*/
    // 3 months into the future



    return (
      <div>
        <DateRangePicker
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          numberOfMonths={1}
          startDatePlaceholderText={formatMessage(messages.checkIn)}
          endDatePlaceholderText={formatMessage(messages.checkOut)}
          startDateId="start_date_id"
          endDateId="end_date_id"
          minimumNights={Number(minimumNights) > 0 ? Number(minimumNights) : 1}
          isDayBlocked={day => this.isDayBlocked(day)}
          isOutsideRange={condition}
          hideKeyboardShortcutsPanel
          readOnly
        />
      </div>
    );
  }
}

const bookingFormSelector = formValueSelector('BookingForm');

const mapState = state => ({
  isLoading: state.viewListing.isLoading,
  availability: state.viewListing.availability,
  bookingStartDate: bookingFormSelector(state, 'startDate'),
  bookingEndDate: bookingFormSelector(state, 'endDate'),
  isBook: bookingFormSelector(state, 'isBook'),


});

const mapDispatch = {
  checkAvailability,
  change,
  getSpecialPricingData
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DateRange)));
