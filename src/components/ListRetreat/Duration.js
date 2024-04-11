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

class Duration extends Component {

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
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.duration} /></h3>
              <p>
                <span>How many days?</span>
              </p>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={cx(s.formGroup, s.space4)}>
                    <Field
                      name="duration"
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
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}><span>Seats</span></h3>
              <p>
                <span>How many people can your retreat accommodate?</span>
              </p>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={cx(s.formGroup, s.space4)}>
                    <Field
                      name="Seats"
                      type="text"
                      component={this.renderFormControl}
                      className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)}
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

Duration = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Duration);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  availableCurrencies: state.currency.availableCurrencies,
  base: state.currency.base,
});

const mapDispatch = {
  autofill
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Duration)));
