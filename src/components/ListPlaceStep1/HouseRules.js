// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux Form
import { Field, reduxForm } from 'redux-form';

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
  FormControl,
  InputGroup
} from 'react-bootstrap';
import s from './ListPlaceStep1.css';

// Internal Components
import CustomCheckbox from '../CustomCheckbox';
import ListPlaceTips from '../ListPlaceTips';

import updateStep3 from './updateStep3';

class HouseRules extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any
  };

  constructor(props) {
    super(props);

    const { listingFields, valid } = this.props;
    let houseRules = [];
    if (listingFields != undefined) {
      houseRules = listingFields.houseRules;
    }
    this.state = {
      houseRules: houseRules,
      isDisabled: !valid,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { listingFields, valid } = props;
    if(listingFields != undefined && !_.isEqual(listingFields.houseRules, state.houseRules)) {
      return {
        houseRules: listingFields.houseRules,
        isDisabled: !valid
      };
    } else if (!valid !== state.isDisabled) {
      return {
        isDisabled: !valid
      }
    } else {
      return null;
    }
  }

  checkboxGroup = ({ label, name, options, input }) => (
    <ul className={s.listContainer}>
      {
        options.map((option, index) => {
          if (option.isEnable === "1") {
            return (
              <li className={s.listContent} key={index}>
                <span className={s.checkBoxSection}>
                  <CustomCheckbox
                    name={`${input.name}[${index}]`}
                    value={option.id}
                    checked={input.value.indexOf(option.id) !== -1}
                    className={'icheckbox_square-green'}
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
        }
        )
      }
    </ul>
  );

  // renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
  //   const { formatMessage } = this.props.intl;
  //   return (
  //     <div>
  //       {/* {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>} */}
  //       <FormControl {...input} placeholder={label} type={type} className={className} />
  //     </div>
  // )}

  renderFormControl = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} disabled={isDisabled} />
      </div>
    )
  }


  renderFormControl1 = ({ input, label, type, meta: { touched, error }, className, suffix }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={s.inputAddon}>
        {/* <InputGroup>
          <InputGroup.Addon className={s.addonStyle}>
            $
          </InputGroup.Addon> */}
          <FormControl {...input} placeholder={label} type={type} className={className} />
       {/*  </InputGroup> */}
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
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


  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const securityDeposit = (number) => number ? number.replace(/[^\d\.]/g, '') : '';
    const { houseRules, isDisabled } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContentWithTip}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.setHouseRules} /></h3>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>
                  <FormGroup className={s.formGroup}>
                    <Field name="houseRules" component={this.checkboxGroup} options={houseRules} />
                  </FormGroup>

                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.rulesoptional} />
                  </ControlLabel>
                  <h3 className={cx(s.noMarginMaximum, s.maximumSpace2)}>
                    <span className={cx(s.infomessage, s.infoFont)}>
                      <FormattedMessage {...messages.rulesinfo} />
                    </span>
                  </h3>

                  <FormGroup className={s.formGroup}>
                    <Field name="additionalRules"
                      type="textarea"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    // component={this.renderFormControl} 
                    //label={formatMessage(messages.titleLabel)} 
                    // className={cx(s.formControlInput, s.jumboInput)} 

                    />
                  </FormGroup>
                </div>

                <FormGroup className={cx(s.formGroup, s.spaceTop6)}>
                  <ControlLabel className={cx(s.landingLabel, s.space1)}>
                    <FormattedMessage {...messages.securityDepositoptional} />
                  </ControlLabel>
                  <div className={s.space3}>
                    <span><FormattedMessage {...messages.securityDepositinfo} /></span>
                  </div>
                  <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                    <Field name="securityDeposit"
                      type="text"
                      component={this.renderFormControl1}
                      parse={securityDeposit}
                      className={cx(s.formControlInput, s.commonBorder, s.depositInput)}
                    />
                    <ControlLabel className={cx(s.landingLabel, s.depositDescText, s.spaceTop1)}>
                      * <FormattedMessage {...messages.securityDepositinfo2} />
                    </ControlLabel>
                  </Col>
                </FormGroup>




                <div className={s.nextPosition}>
                  <div className={s.nextBackButton}>
                    <hr className={s.horizontalLineThrough} />
                    <FormGroup className={s.formGroup}>
                      <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                        <Button className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} onClick={() => previousPage("guest-requirements")}>
                          <FormattedMessage {...messages.back} />
                        </Button>
                        <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} disabled={isDisabled} onClick={() => nextPage("advance-notice")}>
                          <FormattedMessage {...messages.next} />
                        </Button>
                      </Col>
                    </FormGroup>
                  </div>
                </div>
              </form>
            </div>
          </Col>
          <ListPlaceTips page={"house-rules"} />
        </Row>
      </Grid>
    );
  }
}

HouseRules = reduxForm({
  form: 'ListPlaceStep3', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateStep3,
  onSubmit: updateStep3
})(HouseRules);

const mapState = (state) => ({
  listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(HouseRules)));
