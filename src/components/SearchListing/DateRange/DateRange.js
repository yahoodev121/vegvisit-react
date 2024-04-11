import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

// Redux
import { connect } from 'react-redux';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import cx from 'classnames';

import { DateRangePicker, DayPickerRangeController, isInclusivelyBeforeDay, isInclusivelyAfterDay } from 'react-dates';

import { START_DATE, END_DATE } from 'react-dates/constants';

// Redux  Action
import { setPersonalizedValues } from '../../../actions/personalized';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

import { formValueSelector } from 'redux-form';

// Locale
import messages from '../../../locale/messages';


class DateRange extends React.Component {
    static propTypes = {
        onChange: PropTypes.any.isRequired,
        numberOfMonths: PropTypes.number.isRequired,
        setPersonalizedValues: PropTypes.any.isRequired,
        formatMessage: PropTypes.any,
        personalized: PropTypes.shape({
            startDate: PropTypes.string,
            endDate: PropTypes.string
        })
    };

    static defaultProps = {
        autoFocusEndDate: false,
        showInputs: false,
        keepOpenOnDateSelect: false,
        initialVisibleMonth: null,
        hideKeyboardShortcutsPanel: true,
        noBorder: true,
        startDateOffset: undefined,
        endDateOffset: undefined,
        renderCalendarDay: undefined,
        renderDayContents: null,
        minimumNights: 0,
        smallDevice: false,
        verySmallDevice: false
    };

    constructor(props) {
        super(props);
        this.state = {
            focusedInput: props.autoFocusEndDate ? END_DATE : START_DATE,
            startDate: null,
            endDate: null,
        };
        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }

    componentDidMount(){
        const { personalized } = this.props;
        if(personalized != undefined){
            if(personalized.startDate && personalized.endDate) {
                this.setState({ 
                    startDate: moment(personalized.startDate),
                    endDate: moment(personalized.endDate)
                });
            } else if(personalized.startDate && !personalized.endDate){
                this.setState({ 
                    startDate: moment(personalized.startDate),
                    endDate: null
                });
            } 
        }
    }

    static getDerivedStateFromProps(props, state) {
      const { personalized, datesValue } = props;
      if (personalized != undefined) {
        if (personalized.startDate && personalized.endDate && 
            !(moment(personalized.startDate).isSame(state.startDate) && moment(personalized.endDate).isSame(state.endDate))
        ) {
          return {
            startDate: moment(personalized.startDate),
            endDate: moment(personalized.endDate),
          };
        } else if (
          datesValue === null &&
          personalized.startDate != null &&
          personalized.endDate === null &&
          !(moment(personalized.startDate).isSame(state.startDate) && state.endDate === null)
        ) {
          return {
            startDate: moment(personalized.startDate),
            endDate: null,
          };
        } else if (
          datesValue === null &&
          personalized.startDate === null &&
          personalized.endDate === null &&
          !(state.startDate === null && state.endDate === null)
        ) {
          return {
            startDate: null,
            endDate: null,
          };
        } else {
          return null;
        }
      }
    }
    

    onDatesChange({ startDate, endDate }) {
        const { onChange, setPersonalizedValues } = this.props;
        this.setState({ startDate, endDate });

        if(startDate != null) {
            setPersonalizedValues({ name: 'startDate', value: moment(startDate).format("YYYY-MM-DD") });
        } else {
            setPersonalizedValues({ name: 'startDate', value: null });
        }

        if (endDate != null) {
            setPersonalizedValues({ name: 'endDate', value: moment(endDate).format("YYYY-MM-DD") });
        } else {
            setPersonalizedValues({ name: 'endDate', value: null });
        }

        if(startDate != null && endDate != null){
            let startDateNew = moment(startDate).startOf('day').add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
            let endDateNew = moment(endDate).subtract(1, 'days').hour(21).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            let dates = ` CAST('${startDateNew}' AS DATETIME) AND CAST('${endDateNew}' AS DATETIME) `;
            onChange(dates);
            //onChange(`'${moment(startDate).format("YYYY-MM-DD")}' AND '${moment(endDate).format("YYYY-MM-DD")}'`);
            //setPersonalizedValues({ name: 'startDate', value: moment(startDate).format("YYYY-MM-DD") });
            //setPersonalizedValues({ name: 'endDate', value: moment(endDate).format("YYYY-MM-DD") });
        }
    }

    onFocusChange(focusedInput) {
        this.setState({
            // Force the focusedInput to always be truthy so that dates are always selectable
            focusedInput: !focusedInput ? START_DATE : focusedInput,
        });
    }


    render() {
        const { focusedInput, startDate, endDate } = this.state;
        const { numberOfMonths, smallDevice, verySmallDevice } = this.props;
        const { formatMessage } = this.props.intl;
        let daySize = (verySmallDevice) ? 35 : 60;
        let verticalHeight = (verySmallDevice) ? '70vh' : '80vh';
        let today = moment(), condition = null;

        //

        condition = day => !isInclusivelyAfterDay(day, today)
        
        return ( 
            <div>
                {
                 !smallDevice && <DayPickerRangeController
                        {...this.props}
                        focusedInput={focusedInput}
                        startDate={(startDate) ? moment(startDate) : null}
                        endDate={(endDate) ? moment(endDate) : null}
                        onDatesChange={this.onDatesChange}
                        onFocusChange={this.onFocusChange}
                        numberOfMonths={1}
                        isOutsideRange={condition}
                        onOutsideClick={() => { console.log('')}}
                    /> 
                }
                {
                 smallDevice && <div className={cx('dateRangeSmall')}>
                        <DayPickerRangeController
                            {...this.props}
                            focusedInput={focusedInput}
                            startDate={(startDate) ? moment(startDate) : null}
                            endDate={(endDate) ? moment(endDate) : null}
                            onDatesChange={this.onDatesChange}
                            onFocusChange={this.onFocusChange}
                            numberOfMonths={1}
                            orientation={'vertical'}
                            verticalHeight={verticalHeight}
                            withFullScreenPortal
                            daySize={daySize}
                            isOutsideRange={condition}
                            onOutsideClick={() => { console.log('')}}
                        />
                    </div> 
                }
            </div>
        );
    }
}


const selector = formValueSelector('SearchForm');

const mapState = (state) => ({
  personalized: state.personalized,
  datesValue: selector(state, 'dates')
});

const mapDispatch = {
    setPersonalizedValues
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DateRange)));

