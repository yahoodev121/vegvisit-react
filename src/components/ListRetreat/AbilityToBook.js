// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import {Field, reduxForm, autofill, change} from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Helpers
import validate from './validate';

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

import submit from './submit';

class AbilityToBook extends Component {

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
      return { isDisabled: !valid }
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
    )
  }

  async onFocus() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', true));
    await dispatch(change('RetreatForm', 'tipForm', 'AbilityToBook'));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  render() {
    const { autofill } = this.props;
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { isDisabled } = this.state;
    const { formatMessage } = this.props.intl;
    const { base, availableCurrencies } = this.props;
    const phoneParser = (number) => number ? number.replace(/[^\d\.]/g, '') : '';
    return (
      <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>
                Ability to Book
              </h3>
              <p>
                <span>What`s the minimum days before retreat guests can book?</span>
              </p>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={cx(s.formGroup, s.space4)}>
                    <Field
                      name="min_days"
                      type="text"
                      component={this.renderFormControl}
                      className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)}
                      parse={phoneParser}
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

AbilityToBook = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(AbilityToBook);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  availableCurrencies: state.currency.availableCurrencies,
  base: state.currency.base,
});

const mapDispatch = {
  autofill
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(AbilityToBook)));
