import React from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { Field, reduxForm, autofill, change } from 'redux-form';
import validate from './validate';

import moment from 'moment';
import submit from './submit';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

import { DateRangePicker, VERTICAL_ORIENTATION, HORIZONTAL_ORIENTATION } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';

import {
    Grid,
    Button,
    Form,
    Row,
    FormGroup,
    Col,
    ControlLabel,
    FormControl
} from 'react-bootstrap';

// Redux  Action
import { setPersonalizedValues } from '../../actions/personalized';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Locale
import messages from '../../locale/messages';

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

    async onDatesChange({ startDate, endDate }) {
        const { dispatch } = this.props;
        this.setState({ startDate, endDate });
        if (startDate != null && endDate != null) {
            await dispatch(change('RetreatForm', 'startDate', moment(startDate).format('YYYY-MM-DD')));
            await dispatch(change('RetreatForm', 'endDate', moment(endDate).format('YYYY-MM-DD')));
        }
    }

    onFocusChange(focusedInput) {
        this.setState({ focusedInput });
    }

    componentDidUpdate(prevProps, prevState) {
        const { personalized } = this.props;
        if (prevProps.personalized !== personalized) {
            if ((prevProps.personalized.geography !== personalized.geography) && personalized.location != '' && personalized.chosen == 1) {
                if (personalized.searchType !== "retreats") {
                    this.setState({
                        focusedInput: 'startDate',
                    })
                }
            }
            if (prevProps.personalized.category !== personalized.category) {
                if (personalized.searchType === "retreats") {
                    this.setState({
                        focusedInput: 'startDate',
                    })
                }
            }
        }
    }

    render() {
        const { focusedInput, startDate, endDate } = this.state;
        const { handleSubmit } = this.props;
        const { formatMessage } = this.props.intl;
        return (
            <Grid fluid>
                <Row style={{
                    maxWidth: '912px',
                    width: '100%',
                    display: 'block',
                    margin: '0 auto',
                    marginBottom: '10px',
                }}>
                    <Col xs={12}>
                        <div>
                            <h3 style={{ margin: '0 0 18px 0' }}><FormattedMessage {...messages.dates} /></h3>
                            <form onSubmit={handleSubmit}>
                                <div className="listRetreatDates">
                                    <DateRangePicker
                                        onDatesChange={this.onDatesChange}
                                        onFocusChange={this.onFocusChange}
                                        focusedInput={focusedInput}
                                        startDate={startDate}
                                        endDate={endDate}
                                        startDateId="start_date_id"
                                        endDateId="end_date_id"
                                        numberOfMonths={2}
                                        startDatePlaceholderText={" " + formatMessage(messages.startDate)}
                                        endDatePlaceholderText={formatMessage(messages.endDate)}
                                        hideKeyboardShortcutsPanel
                                        readOnly
                                    />
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}


DateRange = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(DateRange);


const mapState = state => ({
    personalized: state.personalized,
});

const mapDispatch = {
    setPersonalizedValues,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DateRange)));

