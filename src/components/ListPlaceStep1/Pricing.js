// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, autofill } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';


// Helpers
import validateStep3 from './validateStep3';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {
  Grid,
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl } from 'react-bootstrap';
import s from './ListPlaceStep1.css';

// Component
import ListPlaceTips from '../ListPlaceTips';

import updateStep3 from './updateStep3';

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
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { valid } = props;
    if (!valid !== state.isDisabled) {
      return { isDisabled: !valid}
    } else {
      return null;
    }
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
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
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
      </div>
  )}

  render() {
    const { autofill } = this.props;
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { isDisabled } = this.state;
    const { formatMessage } = this.props.intl;
    const { base, availableCurrencies } = this.props;
    const phoneParser = (number) => number ? number.replace(/[^\d\.]/g, '') : '';
    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContentWithTip}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.pricing} /></h3>
              <p className={cx(s.landingStep3, s.space4)}><span><FormattedMessage {...messages.pricingDescription} /></span></p>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>

                  <FormGroup className={cx(s.formGroup, s.space4)}>
                    <ControlLabel className={s.landingStep3}>
                      <FormattedMessage {...messages.basePrice} />
                    </ControlLabel>
                    <Field 
                      name="basePrice" 
                      type="text"
                      component={this.renderFormControl} 
                      label={formatMessage(messages.basePriceLabel)} 
                      className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)} 
                      parse={phoneParser}
                      onChange={(event, newValue, previousValue, name) => {
                          if (newValue === '0'){
                            autofill('cleaningPrice', '0');
                        }
                      }}
                    />
                  </FormGroup>

                  <FormGroup className={cx(s.formGroup, s.space4)}>
                    <ControlLabel className={s.landingStep3}>
                      <FormattedMessage {...messages.cleaningPrice} />
                    </ControlLabel>
                    <Field 
                      name="cleaningPrice" 
                      type="text" 
                      component={this.renderFormControl} 
                     // label={formatMessage(messages.cleaningPrice)} 
                      className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)} 
                    />
                  </FormGroup>


                  {/* <FormGroup className={cx(s.formGroup, s.space4)}>
                    <ControlLabel className={s.landingStep3}>
                      <FormattedMessage {...messages.securitydeposit} />
                    </ControlLabel>
                    <Field 
                      name="securitydeposit" 
                      type="text" 
                      component={this.renderFormControl}     
                      className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)} 
                    />
                  </FormGroup> */}


                  <FormGroup className={s.formGroup}>
                    <ControlLabel className={s.landingStep3}>
                      <FormattedMessage {...messages.currency} />
                    </ControlLabel>

                    <Field name="currency" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                      {
                        availableCurrencies.map((currency, key) =>{
                          if(currency.isEnable === true && currency.isPayment === true) {
                            return <option key={key} value={currency.symbol}>{currency.symbol}</option>
                          }
                        })
                      }
                    </Field>

                  </FormGroup>

                </div>
                <div className={s.nextPosition}>
               <div className={s.nextBackButton}>
                <hr className={s.horizontalLineThrough} />

                <FormGroup className={s.formGroup}>
                  <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                    <Button 
                      className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} 
                      onClick={() => previousPage("min-max-nights")}
                    >
                      <FormattedMessage {...messages.back} />
                    </Button>
                    <Button 
                      className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} 
                      disabled={isDisabled} 
                      onClick={() => nextPage("calendar")}
                    >
                      <FormattedMessage {...messages.next} />
                    </Button>
                  </Col>
                </FormGroup>
                </div>
                </div>
              </form>
            </div>
          </Col>
          <ListPlaceTips page={"pricing"}/>
        </Row>
      </Grid>
    );
  }
}

Pricing = reduxForm({
  form: 'ListPlaceStep3', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateStep3,
  onSubmit: updateStep3
})(Pricing);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  availableCurrencies: state.currency.availableCurrencies,
  base: state.currency.base,
});

const mapDispatch = {
  autofill
};

export default injectIntl(withStyles(s) (connect(mapState, mapDispatch)(Pricing)));
