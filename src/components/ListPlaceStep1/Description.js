// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';


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
import ListPlaceTips from '../ListPlaceTips';

// Helpers
import validateStep2 from './validateStep2';

import updateStep2 from './updateStep2';

class Description extends Component {

  static propTypes = {
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

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { formatMessage } = this.props.intl;
    const { isDisabled } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContentWithTip}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.description} /></h3>
              <strong className={s.landingStep2}><span><FormattedMessage {...messages.descriptionSubheading} /></span></strong>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>
                  <FormGroup className={s.formGroup}>
                    <Field name="description"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    // label={formatMessage(messages.descriptionLabel)}
                    />
                  </FormGroup>

                  <FormGroup className={cx(s.formGroup, s.spaceTop3)}>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.descriptionLabel1} />
                    </ControlLabel>
                    <Field name="kitchen" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                      <option value=''>Select Options</option>
                      <option value='Vegan'>Vegan</option>
                      <option value='Vegetarian'>Vegetarian</option>
                    </Field>
                  </FormGroup>

                  <FormGroup className={cx(s.formGroup, s.spaceTop3)}>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.descriptionLabel2} />
                    </ControlLabel>
                    <Field name="nonVeg" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                      <option value=''>Select Options</option>
                      <option value='Yes'>Yes</option>
                      <option value='No'>No</option>
                    </Field>
                  </FormGroup>
                </div>
               
                {/* <div className={cx(s.landingMainContent, s.spaceTop4)}>
                  <h3 className={s.landingContentTitle}><FormattedMessage {...messages.shareMoreDetails} /></h3>
                  <ControlLabel className={cx(s.landingLabel, s.subTitle, s.spaceTop3)}>
                    <FormattedMessage {...messages.aboutYourPlace} />
                  </ControlLabel>
                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.aboutYourPlaceSubTitle} />
                  </ControlLabel>
                  <FormGroup className={s.formGroup}>
                    <Field name="aboutPlaces"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    // label={formatMessage(messages.descriptionLabel)}
                    />
                  </FormGroup>

                  <ControlLabel className={cx(s.landingLabel, s.subTitle, s.spaceTop3)}>
                    <FormattedMessage {...messages.aboutYourKitchen} />
                  </ControlLabel>
                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.aboutYourKitchenSubTitle} />
                  </ControlLabel>

                  <FormGroup className={s.formGroup}>
                    <Field name="aboutKitchen"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    // label={formatMessage(messages.descriptionLabel)}
                    />
                  </FormGroup>

                </div> */}
                <div className={s.nextPosition}>
                  <div className={s.nextBackButton}>
                    <hr className={s.horizontalLineThrough} />

                    <FormGroup className={s.formGroup}>
                      <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                        <Button className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} onClick={() => previousPage("photos")}>
                          <FormattedMessage {...messages.back} />
                        </Button>
                        <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} onClick={() => nextPage("more-details")} disabled={isDisabled} >
                          <FormattedMessage {...messages.next} />
                        </Button>
                      </Col>
                    </FormGroup>
                  </div>
                </div>
              </form>
            </div>
          </Col>
          <ListPlaceTips page={"description"} />
        </Row>
      </Grid>
    );
  }
}

Description = reduxForm({
  form: 'ListPlaceStep2', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateStep2,
  onSubmit: updateStep2
})(Description);

const mapState = (state) => ({
  listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Description)));
