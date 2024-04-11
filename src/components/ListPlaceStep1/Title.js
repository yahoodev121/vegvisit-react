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

import updateStep2 from './updateStep2';

class Title extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any
  };

  static TITLE_LENGTH = 80;

  constructor (props) {
    super(props);

    const { valid } = props;
    let isDisabled = true;
    if(valid){
      isDisabled = false;
    }
    this.state = {
      isDisabled,
      chars_left: Title.TITLE_LENGTH
    };

    this.handleChange = this.handleChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { valid, title } = props;
    let max_chars = title ? Title.TITLE_LENGTH - title.length : Title.TITLE_LENGTH;
    if (max_chars !== state.chars_left) {
      return {
        isDisabled: !valid,
        chars_left: max_chars
      };
    } else if (!valid !== state.isDisabled) {
      return {
        isDisabled: !valid
      };
    } else {
      return null;
    }
  }

  handleChange(event) {
		var input = event.target.value;
		let max_chars = Title.TITLE_LENGTH;
		this.setState({
			chars_left: max_chars - input.length
		});
	}

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
         {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} maxLength={Title.TITLE_LENGTH}/>
      </div>
  )}

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage, invalid } = this.props;
    const {formatMessage} = this.props.intl;
    const { isDisabled, chars_left } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContent}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.placeTitle} /></h3>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>
                  <h3 className={cx(s.noMarginMaximum, s.maximumSpace2)}>
                    <span className={cx(s.maximumCharcter, s.noPaddingLeft)}>
                      <FormattedMessage {...messages.maximumCharcter} />
                    </span>
                  </h3>
                  <FormGroup className={s.formGroup}>
                    <Field name="title" 
                      type="text" 
                      component={this.renderFormControl} 
                      label={formatMessage(messages.titleLabel)} 
                      className={cx(s.formControlInput, s.jumboInput)} 
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <p className={s.maximumCharColor}>
                    {chars_left} <FormattedMessage {...messages.maximumCharcterLeft} />
                  </p>
                </div>
                <div className={s.nextPosition}>
               <div className={s.nextBackButton}>
                <hr className={s.horizontalLineThrough} />

                <FormGroup className={s.formGroup}>
                  <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                    <Button className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} onClick={() => previousPage("additional-services")}>
                      <FormattedMessage {...messages.back} />
                    </Button>
                    <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} type="submit" disabled={isDisabled}>
                      <FormattedMessage {...messages.next} />
                    </Button>
                  </Col>
                </FormGroup>
                </div>
                </div>
              </form>
            </div>
          </Col>
          <ListPlaceTips />
        </Row>
      </Grid>
    );
  }
}

Title = reduxForm({
  form: 'ListPlaceStep2', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateStep2,
  onSubmit: updateStep2
})(Title);

const selector = formValueSelector('ListPlaceStep2');


const mapState = (state) => ({
  listingFields: state.listingFields.data,
  title: selector(state, 'title')
});

const mapDispatch = {
};

export default injectIntl(withStyles(s) (connect(mapState, mapDispatch)(Title)));
