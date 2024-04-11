// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import {Field, reduxForm, autofill, change} from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Helpers
import validate from './validate';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {
  Checkbox,
  Grid,
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl, Radio
} from 'react-bootstrap';
import s from '!isomorphic-style-loader!css-loader!sass-loader!./ListRetreat.css';
import 'react-dates/initialize';

import moment from 'moment';
import submit from './submit';

import { DateRangePicker } from "react-dates";

class Pricing extends Component {

  static propTypes = {
    autofill: PropTypes.func,
    previousPage: PropTypes.any,
    nextPage: PropTypes.any
  };

  constructor(props) {
    super(props);

    const { valid } = props;
    this.state = {
      isDisabled: !valid,
      periodType: 'One-time',
      periodTypes: ["One-time", "Multiple dates", "Open for specific period"],
      startDates: [''],
      endDates: [''],
      focusedInputs: [null],
      isYearRound: false,
      isUnavailableDates: false,
      unStartDates: [''],
      unEndDates: [''],
      unFocusedInputs: [null]
    };

    this.onFocusChange = this.onFocusChange.bind(this);
    this.onUnFocusChange = this.onUnFocusChange.bind(this);
  }

  onFocusChange(focusedInput, index) {
    let {focusedInputs} = this.state;
    focusedInputs[index] = focusedInput;
    this.setState({ focusedInputs });
  }

  onUnFocusChange(focusedInput, index) {
    let {unFocusedInputs} = this.state;
    unFocusedInputs[index] = focusedInput;
    this.setState({ unFocusedInputs });
  }

  static getDerivedStateFromProps(props, state) {
    const { valid, availableCurrencies, formData, dispatch } = props;
    let {startDates, endDates} = state;
    if (formData.values && !formData.values.currency) {
      dispatch(change('RetreatForm', 'currency', availableCurrencies[0].symbol));
    }

    console.log('pricing-get-derived-states');

    let data = {};
    if (formData.values && formData.values.retreat_dates) {
      if ((startDates.length == 1 && startDates[0] == '') || startDates.length == 0) {
        startDates = [];
        endDates = [];
        for (let i = 0; i < formData.values.retreat_dates.length; i ++) {
          let item = formData.values.retreat_dates[i];
          startDates.push(moment(item.split(':')[0], 'YYYY-MM-DD'));
          endDates.push(moment(item.split(':')[1], 'YYYY-MM-DD'));
        }
        console.log('pricing-set-start-dates:', startDates);
        data = {
          startDates: startDates,
          endDates: endDates
        }
      }
    }

    if (!valid !== state.isDisabled) {
      return { ...data, isDisabled: !valid }
    } else {
      return { ...data };
    }
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className="errorMessage">{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} />
      </div>
    )
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
      </div>
    )
  }

  renderFormControlRadioButton = ({input: { value, onChange }, id, index, label, selected, meta: { touched, error }, children, className,}) => {
    const { formatMessage } = this.props.intl;
    return (
      <Radio
        id={id}
        name="periodType"
        inline
        onChange={(e) => {
          if (e.target.checked) {
            this.setState({periodType: id})
            this.resetRetreatDates()
          }
        }}
        checked={selected}
        onMouseEnter={() => {this.onFocus('OftenRetreat' + index)}} onMouseLeave={() => this.onBlur()}
      >
        {label}
      </Radio>
    );
  };

  addRetreatDate() {
    let {startDates, endDates, focusedInputs} = this.state;
    startDates.push('');
    endDates.push('');
    focusedInputs.push(null);
    this.setState({startDates, endDates, focusedInputs});
  }

  addUnavailableDate() {
    let {unStartDates, unEndDates, unFocusedInputs} = this.state;
    unStartDates.push('');
    unEndDates.push('');
    unFocusedInputs.push(null);
    this.setState({unStartDates, unEndDates, unFocusedInputs});
  }

  async onDatesChange(startDate, endDate, index) {
    const { dispatch } = this.props;
    let {startDates, endDates} = this.state;
    startDates[index] = startDate;
    endDates[index] = endDate;
    this.setState({startDates, endDates});

    let result = [];
    for (let i = 0; i < startDates.length; i ++) {
      if (startDates[i] && endDates[i]) {
        let date = [moment(startDates[i]).format('YYYY-MM-DD'), moment(endDates[i]).format('YYYY-MM-DD')].join(':');
        result.push(date);
      }
    }

    await dispatch(change('RetreatForm', 'retreat_dates', result));
  }

  async onUnDatesChange(startDate, endDate, index) {
    const { dispatch } = this.props;
    let {unStartDates, unEndDates} = this.state;
    unStartDates[index] = startDate;
    unEndDates[index] = endDate;
    this.setState({unStartDates, unEndDates});

    let result = [];
    for (let i = 0; i < unStartDates.length; i ++) {
      if (unStartDates[i] && unEndDates[i]) {
        let date = [moment(unStartDates[i]).format('YYYY-MM-DD'), moment(unEndDates[i]).format('YYYY-MM-DD')].join(':');
        result.push(date);
      }
    }

    await dispatch(change('RetreatForm', 'unavailable_dates', result));
  }

  async resetRetreatDates() {
    const { dispatch } = this.props;
    this.setState({
      startDates: [''],
      endDates: [''],
      focusedInputs: [null],
      unStartDates: [''],
      unEndDates: [''],
      unFocusedInputs: [null],
    });
    await dispatch(change('RetreatForm', 'retreat_dates', []));
    await dispatch(change('RetreatForm', 'unavailable_dates', []));
  }

  async onFocus(name) {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', true));
    await dispatch(change('RetreatForm', 'tipForm', name));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { periodTypes, startDates, endDates, focusedInputs, periodType, isYearRound,
      isUnavailableDates, unStartDates, unEndDates, unFocusedInputs, } = this.state;
    const { formatMessage } = this.props.intl;
    const { base, availableCurrencies } = this.props;
    const numParser = (number) => number ? number.replace(/[^\d\.]/g, '') : '';
    return (
      <Grid fluid>
        <Row className="landingContainer">
          <Col xs={12}>
            <div>
              {/* <h3 className="landingContentTitle"><FormattedMessage {...messages.price} /></h3> */}
              <form onSubmit={handleSubmit}>
                <div>
                  {/* <FormGroup className="formGroup space4" onMouseEnter={() => {this.onFocus('Price')}} onMouseLeave={() => this.onBlur()}> */}
                  {/*   <ControlLabel className="landingStep3" style={{fontWeight: 'bold'}}> */}
                  {/*     <FormattedMessage {...messages.priceAmount} /> */}
                  {/*   </ControlLabel> */}

                  {/*   <Field */}
                  {/*       name="basePrice" */}
                  {/*       type="text" */}
                  {/*       component={this.renderFormControl} */}
                  {/*       className="landingStep3 jumboSelect priceCurrencySelect" */}
                  {/*       parse={numParser} */}
                  {/*   /> */}
                  {/* </FormGroup> */}

                  <FormGroup className="formGroup space4" onMouseEnter={() => {this.onFocus('Currency')}} onMouseLeave={() => this.onBlur()}>
                    <ControlLabel className="landingStep3" style={{fontWeight: 'bold'}}>
                      <FormattedMessage {...messages.currency} />
                    </ControlLabel>

                    <Field name="currency" component={this.renderFormControlSelect} className="landingStep3 jumboSelect priceCurrencySelect" >
                      {
                        availableCurrencies.map((currency, key) => {
                          if (currency.isEnable === true && currency.isPayment === true) {
                            return <option key={key} value={currency.symbol}>{currency.symbol}</option>
                          }
                        })
                      }
                    </Field>
                  </FormGroup>

                  <FormGroup className="formGroup space4">
                    <ControlLabel className="landingStep3" style={{fontWeight: 'bold'}}>
                      <span>How often do your run this retreat?</span>
                    </ControlLabel>

                    <div>
                      {periodTypes.map((each, index) => (
                        <Field
                          id={each}
                          key={index}
                          index={index}
                          name="periodType"
                          component={this.renderFormControlRadioButton}
                          label={each}
                          selected={periodType == each}
                        />
                      ))}
                    </div>
                  </FormGroup>

                  <FormGroup className="formGroup space4">
                    <ControlLabel className="landingStep3" style={{fontWeight: 'bold'}}>
                      <span>Retreat Date</span>
                    </ControlLabel>

                    <div>
                      {
                        startDates.map((each, index) => (
                          <div className="listRetreatDates space3" key={index}>
                            <DateRangePicker
                              onDatesChange={({startDate, endDate}) => {this.onDatesChange(startDate, endDate, index)}}
                              onFocusChange={(focusedInput) => {this.onFocusChange(focusedInput, index)}}
                              focusedInput={focusedInputs[index]}
                              startDate={each}
                              endDate={endDates[index]}
                              numberOfMonths={2}
                              startDatePlaceholderText="Start Date"
                              endDatePlaceholderText="End Date"
                              hideKeyboardShortcutsPanel
                            />
                          </div>
                        ))
                      }
                    </div>

                    { periodType == "Multiple dates" && (<Button bsStyle="link" className="btnAdd" onClick={() => {this.addRetreatDate()}}>+ Add another retreat date</Button>) }
                  </FormGroup>

                  {periodType == "Open for specific period" && (
                    <FormGroup className="formGroup space4">
                      <Checkbox inline onChange={async (e) => {
                        this.setState({isYearRound: e.target.checked})
                        if (e.target.checked) {
                          await dispatch(change('RetreatForm', 'retreat_dates', []));
                          this.setState({
                            startDates: [],
                            endDates: [],
                            focusedInputs: []
                          })
                        } else {
                          this.setState({
                            startDates: [''],
                            endDates: [''],
                            focusedInputs: [null]
                          })
                        }
                        await dispatch(change('RetreatForm', 'isYearRound', e.target.checked));

                      }} checked={isYearRound}>Open all year round</Checkbox>

                      <Checkbox inline onChange={async e => {
                        this.setState({isUnavailableDates: e.target.checked})
                        await dispatch(change('RetreatForm', 'isUnavailableDates', e.target.checked));
                      }} checked={isUnavailableDates}>Choose unavailable dates</Checkbox>
                    </FormGroup>
                  )}

                  {
                    (periodType == "Open for specific period" && isUnavailableDates) && (
                        <FormGroup className="formGroup space4" onMouseEnter={() => {this.onFocus('UnavailableDates')}} onMouseLeave={() => this.onBlur()}>
                          <ControlLabel className="landingStep3">
                            <span>Unavailable Date</span>
                          </ControlLabel>

                          <div>
                            {
                              unStartDates.map((each, index) => (
                                <div className="listRetreatDates space3" key={index}>
                                  <DateRangePicker
                                      onDatesChange={({startDate, endDate}) => {this.onUnDatesChange(startDate, endDate, index)}}
                                      onFocusChange={(focusedInput) => {this.onUnFocusChange(focusedInput, index)}}
                                      focusedInput={unFocusedInputs[index]}
                                      startDate={each}
                                      endDate={unEndDates[index]}
                                      numberOfMonths={2}
                                      startDatePlaceholderText="Start Date"
                                      endDatePlaceholderText="End Date"
                                      hideKeyboardShortcutsPanel
                                  />
                                </div>
                              ))
                            }
                          </div>

                          <Button bsStyle="link" className="btnAdd" onClick={() => {this.addUnavailableDate()}}>+ Add another retreat date</Button>
                        </FormGroup>
                    )
                  }
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Pricing = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Pricing);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  availableCurrencies: state.currency.availableCurrencies,
  base: state.currency.base,
  formData: state.form.RetreatForm,
});

const mapDispatch = {
  autofill
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Pricing)));
