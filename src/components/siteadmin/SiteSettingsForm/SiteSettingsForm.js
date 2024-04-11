import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field, reduxForm, formValueSelector } from 'redux-form';
import submit from './submit';
import validate from './validate';

// Redux
import { connect } from 'react-redux';

// Style
import {
  Button,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Panel
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SiteSettingsForm.css';
import Uploader from './Uploader';

class SiteSettingsForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      homePageType: null,
    }
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className, maxlength }) => {
    return (
      <Row>
      <FormGroup className={s.formGroup}>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          <label className={s.labelText} >{label}</label>
        </Col>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          {touched && error && <span className={s.errorMessage}>{error}</span>}
          <FormControl {...input} placeholder={label} type={type} className={className} maxlength={maxlength}/>
        </Col>
      </FormGroup>
      </Row>
      );
    }

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {

    return (
      <Row>
      <FormGroup className={s.formGroup}>
        <Col componentClass={ControlLabel} xs={12} sm={3} md={12} lg={12}>
          <label className={s.labelText} >{label}</label>
        </Col>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          {touched && error && <span className={s.errorMessage}>{error}</span>}
          <FormControl
            {...input}
            className={className}
            componentClass="textarea"
          >
            {children}
          </FormControl>
        </Col>
      </FormGroup>
      </Row>
      );
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    return (
      <Row>
      <FormGroup className={s.formGroup}>
        <Col componentClass={ControlLabel} xs={12} sm={3} md={12} lg={12}>
          <label className={s.labelText} >{label}</label>
        </Col>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          <div>
            <FormControl componentClass="select" {...input} className={className} >
              {children}
            </FormControl>
          </div>
        </Col>
      </FormGroup>
      </Row>
  )}


  render() {

    const { error, handleSubmit, submitting, dispatch, initialValues, title } = this.props;
    return (
      <div className={cx(s.pagecontentWrapper)}>
        <div className={s.contentBox}>
          <Row className={s.mar0}>
          <h1 className={s.headerTitle}>{title}</h1>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Panel className={s.panelHeader}>
                <form onSubmit={handleSubmit(submit)}>
                  {error && <strong>{error}</strong>}
                 
                 <Col xs={12} sm={12} md={6} lg={6}>
                 <Row>
                 <FormGroup className={s.formGroup}>
                    <Col xs={12} sm={12} md={12} lg={12} componentClass={ControlLabel}>
                      <label className={s.labelText} >Logo</label>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} componentClass={ControlLabel} className={s.marbtm14}>
                      <Uploader />
                    </Col>                                        
                    </FormGroup>                 
                    </Row>

                  <Field name="logoHeight" type="text" component={this.renderFormControl} label={"Logo Height"} />
                 <Field name="logoWidth" type="text" component={this.renderFormControl} label={"Logo Width"} />
              
                 </Col>


                 <Col xs={12} sm={12} md={6} lg={6}>
                 
                 <Field name="siteName" type="text" component={this.renderFormControl} label={"Site Name"} maxlength={15} />
                  <Field name="siteTitle" type="text" component={this.renderFormControl} label={"Site Title"} />
                  <Field name="metaKeyword" type="text" component={this.renderFormControlTextArea} label={"Meta Keyword"} />
                  <Field name="metaDescription" type="text" component={this.renderFormControlTextArea} label={"Meta Description"} />
                  <Field name="openGraphImage" type="text" component={this.renderFormControl} label={"Open Graph Home Page Image URL"} />
                  <Field name="facebookLink" type="text" component={this.renderFormControl} label={"Facebook URL"} />
                  <Field name="twitterLink" type="text" component={this.renderFormControl} label={"Twitter URL"} />
                  <Field name="instagramLink" type="text" component={this.renderFormControl} label={"Instagram URL"} />
                  <Field name="homePageType" type="text" className={cx(s.formControlSelect, s.fullWithSelect)} component={this.renderFormControlSelect} label={"Home Page Layout"}>
                    <option value={1}>Banner Text with Image Slider Layout</option>
                    <option value={2}>Banner Text Only Layout</option>
                    <option value={3}>Banner Text Layout with Detailed Search form</option>
                  </Field>
                  <Field 
                    name="phoneNumberStatus" 
                    type="text" 
                    className={cx(s.formControlSelect, s.fullWithSelect)} 
                    component={this.renderFormControlSelect} 
                    label={"Phone Number Format"}
                  >
                    <option value={1}>Twilio SMS</option>
                    <option value={2}>Normal Phone Number</option>                    
                  </Field>
                 </Col>
                 
          
                  <FormGroup className={s.formGroup}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Button bsSize="small" className={cx(s.button, s.btnPrimary, s.btnlarge)} type="submit" disabled={submitting} >Save</Button>
                    </Col>
                  </FormGroup>
                </form> 
              </Panel>
            </Col>
            </Row>
          </div>
        </div>
    );
  }

}


SiteSettingsForm = reduxForm({
  form: 'SiteSettingsForm', // a unique name for this form
  validate
})(SiteSettingsForm);

const selector = formValueSelector('SiteSettingsForm');

const mapState = (state) => ({
  homePageType: selector(state, 'homePageType'),
});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(SiteSettingsForm));
