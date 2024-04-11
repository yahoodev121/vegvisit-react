import React from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

import moment from 'moment';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

import { DateRangePicker, VERTICAL_ORIENTATION, HORIZONTAL_ORIENTATION } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';

// Redux  Action
import { setPersonalizedValues } from '../../../actions/personalized';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Locale
import messages from '../../../locale/messages';

/* const isBrowser = typeof window !== 'undefined';
const smallDevice = isBrowser ? window.matchMedia('(max-width: 400px)').matches : undefined;
const orientation = smallDevice ? VERTICAL_ORIENTATION : HORIZONTAL_ORIENTATION;*/

class DateRange extends React.Component {
  static propTypes = {
    onChange: PropTypes.any,
    numberOfMonths: PropTypes.number,
    setPersonalizedValues: PropTypes.any,
    formatMessage: PropTypes.any,
    personalized: PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);

    const { personalized } = props;
    if (personalized != undefined && personalized.startDate && personalized.endDate) {
      this.state = {
        focusedInput: null,
        startDate: moment(personalized.startDate),
        endDate: moment(personalized.endDate),
      };
    } else {
      this.state = {
        focusedInput: null,
        startDate: null,
        endDate: null,
      };
    }

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    const { setPersonalizedValues } = this.props;
    this.setState({ startDate, endDate });
    if (startDate != null && endDate != null) {
      setPersonalizedValues({ name: 'startDate', value: moment(startDate).format('YYYY-MM-DD') });
      setPersonalizedValues({ name: 'endDate', value: moment(endDate).format('YYYY-MM-DD') });
    }
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  componentDidUpdate(prevProps, prevState) {
    const { personalized } = this.props;
    if (prevProps.personalized !== personalized) {
      if((prevProps.personalized.geography !== personalized.geography) && personalized.location != '' && personalized.chosen == 1) {
        if(personalized.searchType !== "retreats") {
          this.setState({
            focusedInput: 'startDate',
          })
        }
      }
      if(prevProps.personalized.category !== personalized.category) {
        if(personalized.searchType === "retreats") {
          this.setState({
            focusedInput: 'startDate',
          })
        }
      }
    }
  }

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    const { numberOfMonths } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <DateRangePicker
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          startDateId="start_date_id"
          endDateId="end_date_id"
          numberOfMonths={numberOfMonths}
          startDatePlaceholderText={formatMessage(messages.checkIn)}
          endDatePlaceholderText={formatMessage(messages.checkOut)}
          hideKeyboardShortcutsPanel
          readOnly
        />
      </div>
    );
  }
}


const mapState = state => ({
  personalized: state.personalized,
});

const mapDispatch = {
  setPersonalizedValues,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DateRange)));

