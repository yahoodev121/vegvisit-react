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

class Participants extends Component {

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
    const { handleSubmit } = this.props;
    const phoneParser = (number) => number ? number.replace(/[^\d\.]/g, '') : '';
    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.participants} /></h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={cx(s.formGroup, s.space4)}>
                    <Row>
                      <Col xs={6}>
                        <Field
                          name="minPart"
                          type="text"
                          label="Min"
                          component={this.renderFormControl}
                          className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)}
                          parse={phoneParser}
                        />
                      </Col>
                      <Col xs={6}>
                        <Field
                          name="maxPart"
                          type="text"
                          label="Max"
                          component={this.renderFormControl}
                          className={cx(s.formControlInput, s.jumboSelect, s.formControlInputMaxWidth)}
                          parse={phoneParser}
                        />
                      </Col>
                    </Row>
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

Participants = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Participants);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  availableCurrencies: state.currency.availableCurrencies,
  base: state.currency.base,
});

const mapDispatch = {
  autofill
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Participants)));
