// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Helpers
import validateStep2 from './validateStep2';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Internal Components
import CustomCheckbox from '../CustomCheckbox';

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
  FormControl
} from 'react-bootstrap';
import s from './ListPlaceStep1.css';

// Component
import ListPlaceTips from '../ListPlaceTips/ListPlaceTips';

import updateStep2 from './updateStep2';

class AdditionalServices extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any
  };

  // Used in calculations but without effect currently
  static DETAILS_MAX_LENGTH = 300;

  constructor(props) {
    super(props);

    const { valid } = props;
    this.state = {
      isDisabled: !valid,
      chars_left: AdditionalServices.DETAILS_MAX_LENGTH
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { moreDetails } = this.props;
    let max_chars = moreDetails ? AdditionalServices.DETAILS_MAX_LENGTH - moreDetails.length : AdditionalServices.DETAILS_MAX_LENGTH;
    this.setState({
      chars_left: max_chars
    });
  }

  static getDerivedStateFromProps(props, state) {
    const { valid } = props;
    const { moreDetails } = props;
    let max_chars = moreDetails ? AdditionalServices.DETAILS_MAX_LENGTH - moreDetails.length : AdditionalServices.DETAILS_MAX_LENGTH;
    if (max_chars !== state.chars_left || !valid !== state.isDisabled) {
      return {
        isDisabled: !valid,
        chars_left: max_chars
      };
    } else {
      return null;
    }
  }

  handleChange(event) {
    var input = event.target.value;
    let max_chars = AdditionalServices.DETAILS_MAX_LENGTH;
    this.setState({
      chars_left: max_chars - input.length
    });
  }
  
  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
      </div>
    )
  }
  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} maxLength={AdditionalServices.DETAILS_MAX_LENGTH} />
      </div>
    )
  }

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl
          {...input}
          className={className}
          placeholder={label}
          componentClass={"textarea"} rows={5}
        />

      </div>
    )
  }

  checkboxGroup = ({ label, name, options, input }) => (
    <ul className={cx(s.listContainer, s.spaceTop2)}>
        { options && options.services.length > 0 && options.services.map((option, index) =>{ 
            if(option.isEnable === "1") {
              return (
                <li className={s.listContent} key={index}>
                  <span className={s.checkBoxSection}>
                    <CustomCheckbox
                      name={`${input.name}[${index}]`}
                      className={'icheckbox_square-green'}
                      value={option.id}
                      checked={input.value.indexOf(option.id) !== -1}
                      onChange={event => {
                        const newValue = [...input.value];
                        if (event === true) {
                          newValue.push(option.id);
                        } else {
                          newValue.splice(newValue.indexOf(option.id), 1);
                        }
                        return input.onChange(newValue);
                      }}
                    />
                  </span>
                  <span className={cx(s.checkBoxSection, s.checkBoxLabel)}>
                    <label className={cx(s.checkboxLabel, s.noPadding)}>{option.itemName}</label>
                  </span>
                </li>
              )
            }
          })
        }
    </ul>
  );

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage, invalid, listingFields } = this.props;
    const { formatMessage } = this.props.intl;
    const { isDisabled, chars_left } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContentWithTip}>
            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.additionalServices} /></h3>
            <div>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>

                  <FormGroup className={cx(s.formGroup, s.spaceTop3)}>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.additionalServicesSubTitle} />
                    </ControlLabel>
                    {/* <Field name="services" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                      {listingFields && listingFields.services.map((item, key) => {
                        return (
                          item.isEnable == "1" && <option value={item.id} key={item.id}>{item.itemName}</option>
                        )
                      })
                      }
                    </Field> */}
                    <Field name="services" component={this.checkboxGroup} options={listingFields} />
                  </FormGroup>


                  <FormGroup className={s.formGroup}>
                    <ControlLabel className={cx(s.landingLabel, s.subTitle, s.spaceTop3)}>
                      <FormattedMessage {...messages.serviceMoreDetails} />
                    </ControlLabel>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.serviceMoreDetailsTitle} />
                    </ControlLabel>
                    <Field name="moreDetails"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    // label={formatMessage(messages.descriptionLabel)}
                    />
                  </FormGroup>

                </div>
                <div className={s.nextPosition}>
                  <div className={s.nextBackButton}>
                    <hr className={s.horizontalLineThrough} />

                    <FormGroup className={s.formGroup}>
                      <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                        <Button className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} onClick={() => previousPage("more-details")}>
                          <FormattedMessage {...messages.back} />
                        </Button>
                        <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} onClick={() => nextPage("title")} disabled={isDisabled} >
                          <FormattedMessage {...messages.next} />
                        </Button>
                      </Col>
                    </FormGroup>
                  </div>
                </div>
              </form>
            </div>
          </Col>
          <ListPlaceTips page={"additional-services"} />
        </Row>
      </Grid>
    );
  }
}

AdditionalServices = reduxForm({
  form: 'ListPlaceStep2', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateStep2,
  onSubmit: updateStep2
})(AdditionalServices);

const selector = formValueSelector('ListPlaceStep2');


const mapState = (state) => ({
  listingFields: state.listingFields.data,
  moreDetails: selector(state, 'moreDetails')
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(AdditionalServices)));
