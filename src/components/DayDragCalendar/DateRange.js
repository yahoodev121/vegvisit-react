import React from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Redux Action
import { change, formValueSelector } from 'redux-form';

import moment from 'moment';
import 'moment-timezone';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';

import { DateRangePicker, isInclusivelyAfterDay } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';


class DateRange extends React.Component {
    static propTypes = {
      timeZone: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            focusedInput: null,
            startDate: null,
            endDate: null,
            isCurrentStatus: 2,
            from: undefined,
            to: undefined,
            dateRange: [],
        };

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }

    componentDidMount() {
        const { defaultStartDate, defaultEndDate, isCurrentStatus } = this.props;
        const { timeZone } = this.props;

        this.setState({
            isCurrentStatus: isCurrentStatus
        })

        if (defaultStartDate) {
            const defaultStartDateHostTZ = moment(defaultStartDate).tz(timeZone, true);
            this.setState({
                startDate: moment(defaultStartDateHostTZ),
            });
        }

        if (defaultEndDate) {
            const defaultEndDateHostTZ = moment(defaultEndDate).tz(timeZone, true);
            this.setState({
                endDate: moment(defaultEndDateHostTZ),
            });
        }



    }

    componentDidUpdate(prevProps, prevState) {
        const { defaultStartDate, defaultEndDate, isCurrentStatus } = this.props;
        const { timeZone } = this.props;
        if (isCurrentStatus !== prevProps.isCurrentStatus) {
          this.setState({
            isCurrentStatus: isCurrentStatus
          })
        }
        if (defaultStartDate && !moment(defaultStartDate).isSame(prevProps.defaultStartDate)) {
            const defaultStartDateHostTZ = moment(defaultStartDate).tz(timeZone, true);
            this.setState({
                startDate: moment(defaultStartDateHostTZ),
            });
        }

        if (defaultEndDate && !moment(defaultEndDate).isSame(prevProps.defaultEndDate)) {
            const defaultEndDateHostTZ = moment(defaultEndDate).tz(timeZone, true);
            this.setState({
                endDate: moment(defaultEndDateHostTZ),
            });
        }
    }


    async onDatesChange({ startDate, endDate }) {
        const { formName, change, startDateName, endDateName, resetCalendar } = this.props;
        const { isCurrentStatus } = this.state;
        const { onChange } = this.props;
        const { timeZone } = this.props;
        let startDateHostTZ, endDateHostTZ;
        startDateHostTZ = startDate ? startDate.clone().tz(timeZone, true) : null;
        endDateHostTZ = endDate ? endDate.clone().tz(timeZone, true) : null;
        // This is what is shown in the DateRangePicker, so we do not convert it to the host time zone
        this.setState({ startDate, endDate });

        // this is essential for saving
        change(formName, 'startDate', startDateHostTZ);
        change(formName, 'endDate', endDateHostTZ);

        await resetCalendar();

        // if (startDate != null && endDate != null) {
        //     onChange(`'${moment(startDate).format("YYYY-MM-DD")}' AND '${moment(endDate).format("YYYY-MM-DD")}'`);
        // }
    }

    onFocusChange(focusedInput) {
        this.setState({ focusedInput });
    }


    render() {
        const { focusedInput, startDate, endDate, isCurrentStatus } = this.state;
        const { timeZone } = this.props;

        let condition;
        if (timeZone) {
          condition = (day) => {
            const today = moment().tz(timeZone);
            let dayHostTZ = moment(day);
            dayHostTZ.tz(timeZone, true);
            return !isInclusivelyAfterDay(dayHostTZ, today);
          }
        }

        return (
            <div>
                <DateRangePicker
                    {...this.props}
                    onDatesChange={this.onDatesChange}
                    onFocusChange={this.onFocusChange}
                    focusedInput={focusedInput}
                    startDate={startDate}
                    endDate={endDate}
                    startDateId="start_date_id"
                    endDateId="end_date_id"
                    numberOfMonths={1}
                    startDatePlaceholderText={"Start Date"}
                    endDatePlaceholderText={"End Date"}
                    hideKeyboardShortcutsPanel
                    onFocusChange={focusedInput => this.setState({ focusedInput })}
                    isOutsideRange={condition}
                    readOnly
                />
            </div>
        );
    }
}

const selector = formValueSelector('ListPlaceStep3'); // <-- same as form name

const mapState = (state) => ({
  timeZone: state.form.ListPlaceStep1.values.timeZone,
});

const mapDispatch = {
    change
};

export default withStyles(s)(connect(mapState, mapDispatch)(DateRange));

