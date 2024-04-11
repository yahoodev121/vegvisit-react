import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field, reduxForm } from 'redux-form';
import submit from './submit';
import validate from './validate';
import { injectIntl } from 'react-intl';
import messages from './messages';
import { connect } from 'react-redux';

// Style
import cx from 'classnames';
import {
  Button,
  Form,
  Grid,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BannerSettingsForm.css';

class BannerSettingsForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    title: PropTypes.string.isRequired,
  };

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {

    return (
      <div>
      {touched && error && <span className={s.errorMessage}>{error}</span>}
        <FormControl
          {...input}
          className={className}
          componentClass="textarea"
           >
          {children}
        </FormControl>
      </div>
    )
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{error}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} />
      </div>
  )}


  render() {

    const { error, handleSubmit, submitting, dispatch, initialValues, title } = this.props;
    const {formatMessage} = this.props.intl;

    return (
      <div className={cx(s.pagecontentWrapper)}>
        <div className={s.contentBox}>
          <h1 className={s.headerTitle}>{title}</h1>
            <Col xs={12} sm={12} md={8} lg={8} className={s.blockcenter}>
              <Panel className={s.panelHeader}>
                <form onSubmit={handleSubmit(submit)}>
                  {error && <strong>{formatMessage(error)}</strong>}
                  <FormGroup className={s.formGroup}>
                  <Row>
                    <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3}>
                      <label className={s.labelText} >Title</label>
                    </Col>
                    <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                      <Field name="title" type="text" component={this.renderFormControl} label={"Title"} />
                    </Col>
                    </Row>
                  </FormGroup>
                  
                  <FormGroup className={s.formGroup}>
                  <Row>
                    <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} >
                      <label className={s.labelText} >Content</label>
                    </Col>
                    <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                      <Field name="content" component={this.renderFormControlTextArea} className={s.formControlInput} />
                    </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup className={s.formGroup}>
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Button bsSize="small" className={cx(s.button, s.btnPrimary, s.btnlarge)} type="submit" disabled={submitting} >Save</Button>
                    </Col>
                    </Row>
                  </FormGroup>
                </form> 
              </Panel>
            </Col>
          </div>
        </div>
    );
  }

}

BannerSettingsForm = reduxForm({
  form: 'BannerSettingsForm', // a unique name for this form
  validate
})(BannerSettingsForm);

export default injectIntl(withStyles(s)(BannerSettingsForm));
