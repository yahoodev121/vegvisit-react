import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';

// Redux
import { connect } from 'react-redux';
import { change, reset, initialize } from 'redux-form';

// Compose
import { graphql, gql, compose } from 'react-apollo';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';


// Toastr
import { toastr } from 'react-redux-toastr';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';


// External Component
import { DateUtils } from 'react-day-picker';
import {
  Button,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Form
} from 'react-bootstrap';

// Loader
import Loader from '../Loader';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./DayDragCalendar.css';
import c from './SaveCalendar.css';

// Locale
import messages from '../../locale/messages';

import validate from './validate';
import AvailableDates from './AvailableDates';
import DateRange from './DateRange';

import { getListingDataStep3 } from '../../actions/getListingDataStep3';
import { getListBlockedDates } from '../../actions/Listing/getListBlockedDates';
class SaveCalendar extends Component {

  static propTypes = {
    change: PropTypes.func,
    formName: PropTypes.string,
    selectedDays: PropTypes.array,
    start: PropTypes.any,
    end: PropTypes.any,
    timeZone: PropTypes.string,
  };

  static defaultProps = {
    selectedDays: [],
    start: undefined,
    end: undefined,
    formName: 'ListPlaceStep3',
    formNameValue: 'CalendarPrice',
    isCurrentStatus: 2,
  };

  constructor(props) {
    super(props);
    this.state = {
      dateRange: [],
      isLoading: false
    };
    this.chooseDates = this.chooseDates.bind(this);
  }

  componentDidMount() {
    this.setState({ isCurrentStatus: 2 });
  }

  componentDidUpdate(prevProps, prevState) {
    const { start, end, isStartDate, isEndDate } = this.props;

    let dateRange = [], rangeStart, rangeEnd;

    if (start && !end && !moment(start).isSame(prevProps.start)) {
      rangeStart = new Date(start);
      dateRange.push(rangeStart);
      this.setState({ dateRange });
    } else if (start && end && (!moment(start).isSame(prevProps.start) || !moment(end).isSame(prevProps.end))) {
      rangeStart = new Date(start);
      rangeEnd = new Date(end);

      if (!DateUtils.isSameDay(rangeStart, rangeEnd)) {
        dateRange.push(rangeStart);

        rangeStart = new Date(+rangeStart);

        while (rangeStart < end) {

          dateRange.push(rangeStart);
          var newDate = rangeStart.setDate(rangeStart.getDate() + 1);
          rangeStart = new Date(newDate);
        }
      }
      this.setState({ dateRange });
    }
  }



  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl
          {...input}
          placeholder={label}
          type={type}
          className={className}
          maxLength={3}
        />
      </div>
    )
  }

  renderDateRange = ({ input, label, meta: { touched, error }, formName, numberOfMonths, startDateName, endDateName, index, defaultStartDate, defaultEndDate, isCurrentStatus, resetCalendar }) => {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, change } = this.props;

    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <DateRange
          {...input}
          formName={formName}
          numberOfMonths={numberOfMonths}
          index={index}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
          isCurrentStatus={isCurrentStatus}
          resetCalendar={resetCalendar}
        //displayFormat={"DD/MM/YYYY"}
        />
      </div>
    )
  }

  async handleSave() {
    const { change, formName, start, end, selectedDays, timeZone } = this.props;
    const { resetCalendar, mutate, listId, getListingDataStep3, getListBlockedDates } = this.props;
    const { formatMessage } = this.props.intl;
    const { minNight, maxNight, houseRules, additionalRules, securityDeposit, checkInEnd, checkInStart } = this.props;
    const { cancellationPolicy, maxDaysNotice, bookingNoticeTime } = this.props;
    const { basePrice, cleaningPrice, currency, isStartDate, isEndDate } = this.props;
    const { dateRange } = this.state;

    let minNightValues = minNight != '' ? minNight : 0;
    let maxNightValues = maxNight != '' ? maxNight : 0;
    let checkInEndValue = checkInEnd != '' ? checkInEnd : 'flexible';
    let checkInStartValue = checkInStart != '' ? checkInStart : 'flexible';
    let isCancel = cancellationPolicy ? cancellationPolicy : '1';
    let isMaxDays = maxDaysNotice ? maxDaysNotice : 'unavailable';
    let isBooking = bookingNoticeTime ? bookingNoticeTime : 58;

    let updatedSelectedDays = [];
    if (timeZone) {
      updatedSelectedDays = dateRange.map(selectedDate => {
        return moment(selectedDate).tz(timeZone, true);
      })
    }

    let successMsg = formatMessage(messages.selectedDatesSuccess);
    let errorMsg = formatMessage(messages.selectedDatesError);

    let dateRangeNew = [], rangeStart, rangeEnd;
    if (isStartDate && !isEndDate) {
      rangeStart = isStartDate.clone();
      dateRangeNew.push(rangeStart);
    } else if (isStartDate && isEndDate) {
      rangeStart = isStartDate.clone();
      rangeEnd = isEndDate.clone();

      if (!DateUtils.isSameDay(rangeStart.toDate(), rangeEnd.toDate())) {
        dateRangeNew.push(rangeStart);
        while (rangeStart < isEndDate) {
            rangeStart = rangeStart.clone();
            rangeStart.add(1, 'days');
            dateRangeNew.push(rangeStart);
        }
      }
    }

    this.setState({ isLoading: true });
    if (dateRangeNew && dateRangeNew.length > 0) {
      dateRangeNew.forEach(async (item, index) => {
        let selectedIndex = updatedSelectedDays.findIndex(selectedDay =>
          DateUtils.isSameDay(selectedDay.toDate(), item.toDate())
        );

        if (selectedIndex < 0) {
          updatedSelectedDays.push(item);
        }
      });

      const { data } = await mutate({
        variables: {
          listId,
          blockedDates: updatedSelectedDays,
          calendarStatus: 'blocked'
        }
      })

      this.setState({ isLoading: false });

      if (data && data.UpdateBlockedDates && data.UpdateBlockedDates.status == '200') {
        //await change(formName, "blockedDates", updatedSelectedDays);
        await change("blockedDates", updatedSelectedDays);
        await getListingDataStep3(listId);
        await getListBlockedDates(
          listId,
          minNightValues,
          maxNightValues,
          checkInEndValue,
          checkInStartValue,
          houseRules,
          isCancel,
          isMaxDays,
          isBooking,
          basePrice,
          cleaningPrice,
          currency,
          additionalRules,
          securityDeposit,
        );
        await getListingDataStep3(listId);
        await resetCalendar();

        toastr.success("Success!", successMsg);
      } else {
        toastr.error("Error!", errorMsg);
      }

    }
  }

  chooseDates(e) {
    this.setState({ isCurrentStatus: e });
  }


  render() {
    const { selectedDays, start, end, formName, resetCalendar, listId, timeZone, resetDatePickerChange } = this.props;
    const { error, handleSubmit, pristine, submitting, dispatch } = this.props;
    const { initialValues } = this.props;
    const { formatMessage } = this.props.intl;
    const { minNight, maxNight, houseRules, additionalRules, securityDeposit, houseDescription, checkInEnd, checkInStart } = this.props;
    const { cancellationPolicy, maxDaysNotice, bookingNoticeTime, isStartDate, isEndDate } = this.props;
    const { basePrice, cleaningPrice, currency } = this.props;
    const { isCurrentStatus } = this.state;

    const { dateRange, isLoading } = this.state;
    let convertStart = start ? moment(start).format('YYYY-MM-DD') : null;
    let convertEnd = end ? moment(end).format('YYYY-MM-DD') : null;
    let isBlock = 1, isAvailable = 2;

    return (
      <div>
        {
          (start || isStartDate) && <Col lg={12} md={12} sm={12} xs={12} className={cx(c.saveCalendarContainer, c.CalendarPopup)}>
            <div className={c.innerCPopup}>
              <FormGroup className={cx(c.formGroup, c.textLeft)}>

                <Button bsStyle="link"
                  className={cx(c.noPadding, c.space3)}
                  onClick={() => { resetCalendar() }}>
                  <svg viewBox="0 0 24 24" role="img"
                    style={{ height: '16px', width: '16px', display: 'block', fill: 'rgb(118, 118, 118)' }}>
                    <path d="m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22"></path>
                  </svg>
                </Button>
              </FormGroup>
              <div className={c.aBlockWrap}>
                <div className={c.aBWLeft}>
                  <Button
                    className={cx(c.btnBg, { [c.active]: isCurrentStatus == 2 })}
                    onClick={() => this.chooseDates(isAvailable)}
                  >
                    Available
            </Button>
                </div>
                <div className={c.aBWRight}>
                  <Button
                    // className={s.selectLanguage}
                    className={cx(c.btnBg, { [c.active]: isCurrentStatus == 1 })}
                    onClick={() => this.chooseDates(isBlock)}
                  >
                    Block
            </Button>
                </div>
              </div>
              <FormGroup className={cx(c.formGroup, c.sDateWrap)}>
                <label>
                  <FormattedMessage {...messages.selectedDates} />
                </label>
              </FormGroup>
              {/* <FormGroup>
                <div className={cx(c.selectedDatesBox)}>
                  {convertStart}
                  <svg className={c.arrowIcon} viewBox="0 0 1000 1000">
                    <path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path>
                  </svg>
                  {convertEnd ? convertEnd : convertStart}
                </div>
              </FormGroup> */}

              <FormGroup>
                <Field
                  name="blockedDates"
                  component={this.renderDateRange}
                  defaultStartDate={start}
                  defaultEndDate={end}
                  formName={formName}
                  isCurrentStatus={isCurrentStatus}
                  resetCalendar={resetDatePickerChange}
                />
              </FormGroup>

              {
                isCurrentStatus == 2 && <AvailableDates
                  start={start}
                  end={end}
                  listId={listId}
                  selectedDays={selectedDays}
                  resetCalendar={resetCalendar}
                  dateRange={dateRange}
                  minNight={minNight}
                  maxNight={maxNight}
                  houseRules={houseRules}
                  additionalRules={additionalRules}
                  securityDeposit={securityDeposit}
                  checkInEnd={checkInEnd}
                  checkInStart={checkInStart}
                  cancellationPolicy={cancellationPolicy}
                  maxDaysNotice={maxDaysNotice}
                  bookingNoticeTime={bookingNoticeTime}
                  cleaningPrice={cleaningPrice}
                  basePrice={basePrice}
                  currency={currency}
                  isStartDate={isStartDate}
                  isEndDate={isEndDate}
                  timeZone={timeZone}
                />
              }

              {
                isCurrentStatus == 1 && <FormGroup className={cx(c.formGroup, c.buttonLeft)}>
                  <Loader
                    type={"button"}
                    buttonType={"button"}
                    show={isLoading}
                    className={cx(c.btnPrimary, c.btnlarge)}
                    disabled={isLoading}
                    label={formatMessage(messages.blockDates)}
                    handleClick={() => { this.handleSave() }}
                    containerClass={c.loaderContainer}
                  />
                </FormGroup>
              }

              <Button
                className={cx(c.btnPrimaryBorder, c.btnlarge, c.buttonRight)}
                onClick={() => { resetCalendar() }}
              >
                <FormattedMessage {...messages.deSelect} />
              </Button>
            </div>
          </Col>

        }
      </div>
    );
  }

}

const mapState = (state) => ({});

const mapDispatch = {
  change,
  getListingDataStep3,
  getListBlockedDates
};

export default compose(
  injectIntl,
  withStyles(s, c),
  connect(mapState, mapDispatch),
  graphql(gql`
    mutation (
      $listId: Int!, 
      $blockedDates: [String],
      $calendarStatus: String
    ) {
          UpdateBlockedDates (
            listId: $listId, 
            blockedDates: $blockedDates,
            calendarStatus: $calendarStatus
        ) {
          status
        }
        }
  `)
)(SaveCalendar);

