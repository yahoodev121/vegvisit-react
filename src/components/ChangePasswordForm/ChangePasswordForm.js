import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux form
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import submit from './submit';
import validate from './validate';

// Locale
import messages from '../../locale/messages';

// Style
import {
  Button, 
  Form, 
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ChangePasswordForm.css';

class ChangePasswordForm extends React.Component {

  static propTypes = {    
    formatMessage: PropTypes.any,
    initialValues: PropTypes.shape({
      registeredType: PropTypes.string.isRequired,
    }).isRequired
  };

  static defaultProps = {
    initialValues: {
      registeredType: 'email'
    }
  };

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={s.formGroup}>
        <Col xs={12} sm={5} md={5} lg={5} className={s.textRight}>
          <label className={s.labelText} >{label}</label>
        </Col>
         <Col xs={12} sm={7} md={7} lg={7} className={s.space2}>
          {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
          <FormControl {...input} type={type} className={cx(s.formControlInput, s.commonBorder)} />
        </Col>
      </FormGroup>
      );
    }

  render() {
    const { error, handleSubmit, submitting, dispatch, initialValues, title } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={'inputFocusColor'}>
        <Panel className={s.panelHeader} header={formatMessage(messages.changePassword)}>
          <Col xs={12} sm={12} md={7} lg={7}>
            {/* <form onSubmit={handleSubmit(submit)}> */}
            <form onSubmit={handleSubmit((values, dispatch) => submit(values, dispatch, this.props, formatMessage))}>
              <Row>
                {error && <strong>{error}</strong>}
                  {
                    initialValues && initialValues.registeredType === 'email' &&  <Field 
                      name="oldPassword" 
                      type="password" 
                      component={this.renderFormControl} 
                      label={formatMessage(messages.oldPassword)} 
                      className={s.commonBorder}
                    />
                  }
                  <Field name="newPassword" type="password" component={this.renderFormControl} label={formatMessage(messages.newPassword)} className={s.commonBorder} />
                  <Field name="confirmPassword" type="password" component={this.renderFormControl} label={formatMessage(messages.confirmPassword)}  className={s.commonBorder} />
                  <FormGroup className={s.formGroup}>
                    <Col xs={12} sm={12} md={12} lg={12} className={cx(s.textRight, s.space2)}>
                  <Button className={cx(s.button, s.btnSuccess )} type="submit" disabled={submitting}>
                    <FormattedMessage {...messages.updatePassword} />
                  </Button>
                    </Col>
                  </FormGroup>
              </Row>
            </form>
          </Col>
        </Panel>   
        </div>
      );
  }
}

ChangePasswordForm = reduxForm({
  form: 'ChangePasswordForm', // a unique name for this form
  validate
})(ChangePasswordForm);

export default injectIntl(withStyles(s)(ChangePasswordForm));
