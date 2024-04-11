// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import {Field, reduxForm, formValueSelector, change} from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Helpers
import validate from './validate';

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
import s from './ListRetreat.css';

// Component
import ListPlaceTips from '../ListPlaceTips';

import submit from './submit';

class Title extends Component {
  static TITLE_LENGTH = 80;

  constructor(props) {
    super(props);

    const { valid } = props;
    let isDisabled = true;
    if (valid) {
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
        <FormControl {...input} placeholder={label} type={type} className={className} maxLength={Title.TITLE_LENGTH} />
      </div>
    )
  }

  async onFocus() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', true));
    await dispatch(change('RetreatForm', 'tipForm', 'Title'));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage, invalid } = this.props;
    const { formatMessage } = this.props.intl;
    const { isDisabled, chars_left } = this.state;

    return (
      <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.retreatTitle} /></h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={s.formGroup}>
                    <Field name="title"
                      type="text"
                      component={this.renderFormControl}
                      label={formatMessage(messages.titleLabel)}
                      className={cx(s.formControlInput, s.jumboInput)}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Title = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Title);

const selector = formValueSelector('ListPlaceStep2');


const mapState = (state) => ({
  listingFields: state.listingFields.data,
  title: selector(state, 'title')
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Title)));
