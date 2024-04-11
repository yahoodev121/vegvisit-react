import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field, reduxForm } from 'redux-form';
import submit from './submit';
import validate from './validate';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'react-apollo'
// Redux
import { connect } from 'react-redux';

// Locale
import messages from '../../locale/messages';
import iconOne from './mail.png';
import iconTwo from './avatar.png';
import iconThree from './lock.png';

// Helper
import PopulateData from '../../helpers/populateData';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './RegisterForm.css';
import {
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Checkbox,
  Image,
  Dropdown } from 'react-bootstrap';

// reCAPTCHA
import ReCAPTCHA from 'react-google-recaptcha';
import { googleCaptcha } from '../../config';

class RegisterForm extends Component {

  static propTypes = {
    formatMessage: PropTypes.func,
  };

  constructor (props) {
    super(props);

    let now = new Date();
    let currentYear = now.getFullYear();
    let years = PopulateData.generateData(1920, currentYear, "desc");
    let days = PopulateData.generateData(1, 31);
    let months = PopulateData.generateData(0, 11);
    this.state = { dateOfBirthData: {
      years: years,
      months: months,
      days: days
    }};
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const {formatMessage} = this.props.intl;
    return (
    <div>
      {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      <FormControl {...input} placeholder={label} type={type} className={className} />
    </div>
  )}

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const {formatMessage} = this.props.intl;
    return (
      <div>
        <FormControl componentClass="select" {...input} className={className}>
          {children}
        </FormControl>
      </div>
    )
  }

  renderCaptcha = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
    const { formatMessage } = this.props.intl;
    let siteKey = googleCaptcha.sitekey;
    return (
        <div>
          {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
          <ReCAPTCHA
              sitekey={siteKey}
              onChange={input.onChange}
          />
        </div>
    )
  }

  render() {
    const { error, handleSubmit, submitting, dispatch, initialValues } = this.props;
    const {formatMessage} = this.props.intl;
    const { dateOfBirthData } = this.state;
    let bookingData;
    if (this.props.listingId && this.props.bookDetails) {
      bookingData = {
        listingId: this.props.listingId,
        bookDetails: this.props.bookDetails
      }
    } else if (initialValues && initialValues.refer && typeof initialValues.refer === 'string') {
      const regex = /\/rooms\/(?<roomId>[1-9][0-9]*)/;
      const found = initialValues.refer.match(regex);
      if (found && found.groups && found.groups.roomId) {
        bookingData = {
          listingId: found.groups.roomId,
          type: 'inquiry'
        }
      }
    }


    return (
      <form onSubmit={handleSubmit((values, dispatch, props) => submit(values, dispatch, props, bookingData))} className="SelectFocus">
        {error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormGroup className={s.formGroup}>
          <Field name="firstName" 
            type="text" 
            component={this.renderFormControl} 
            label={formatMessage(messages.firstName)} 
            className={cx(s.formControlInput, s.backgroundTwo)} 
            
          />
         
        </FormGroup>
        <FormGroup className={s.formGroup}>
          <Field name="lastName" 
            type="text" 
            component={this.renderFormControl} 
            label={formatMessage(messages.lastName)} 
            className={cx(s.formControlInput, s.backgroundTwo)} 
          />
          
        </FormGroup>
        <FormGroup className={s.formGroup}>
          <Field name="email" 
            type="text" 
            component={this.renderFormControl} 
            label={formatMessage(messages.email)} 
            className={cx(s.formControlInput, s.backgroundOne)} 
          />
          
        </FormGroup>
        <FormGroup className={s.formGroup}>
          <Field name="password" 
            type="password" 
            component={this.renderFormControl} 
            label={formatMessage(messages.password)} 
            className={cx(s.formControlInput, s.backgroundThree)} 
          />
          
        </FormGroup>

        {/* <div className={s.Birthpadding}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <ControlLabel className={s.paddingBottom}>{formatMessage(messages.birthDay)}</ControlLabel>
            </Col>
            <Col xs={5} sm={5} md={5} lg={5}>
              <FormGroup className={s.birthForm}>
                <Field name="month" component={this.renderFormControlSelect} className={s.birthForm}>
                  <option value="">{formatMessage(messages.month)}</option>
                  {
                    dateOfBirthData.months.map((item, key) => {
                      return (
                        <option key={key} value={item}>{item + 1}</option>
                      )
                    })
                  }
                </Field>
              </FormGroup>
            </Col>

            <Col xs={3} sm={3} md={3} lg={3} className={s.noPadding}>
              <FormGroup controlId="formControlsSelect">
                <Field name="day" component={this.renderFormControlSelect} className={s.birthForm}>
                  <option value="">{formatMessage(messages.day)}</option>
                  {
                    dateOfBirthData.days.map((item, key) => {
                      return (
                        <option key={key} value={item}>{item}</option>
                      )
                    })
                  }
                </Field>
              </FormGroup>
            </Col>

            <Col xs={4} sm={4} md={4} lg={4}>
              <FormGroup controlId="formControlsSelect">
                <Field name="year" component={this.renderFormControlSelect} className={s.birthForm}>
                  <option value="">{formatMessage(messages.year)}</option>
                  {
                    dateOfBirthData.years.map((item, key) => {
                      return (
                        <option key={key} value={item}>{item}</option>
                      )
                    })
                  }
                </Field>
              </FormGroup>
            </Col>
          </Row>
          <p className={s.labelText}>{formatMessage(messages.emailDescription)}</p>
        </div> */}

        <FormGroup className={s.formGroup}>
          <Field name="reCaptcha"
              component={this.renderCaptcha}
          />
        </FormGroup>

        <FormGroup className={s.formGroup}>
          <Button 
            className={cx(s.button, s.btnPrimary)} 
            bsSize="large" 
            block type="submit" 
            disabled={submitting}
            > 
          {formatMessage(messages.signUp)}
          </Button>
        </FormGroup>

      </form>
    )
  }

}

RegisterForm = reduxForm({
  form: 'RegisterForm', // a unique name for this form
  validate
})(RegisterForm);

const mapState = state => ({
  bookDetails: state.book.bookDetails,
  listingId: state.book && state.book.data && state.book.data.id ? state.book.data.id : undefined
})

const mapDispatch = {
}

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch)
)(RegisterForm);
