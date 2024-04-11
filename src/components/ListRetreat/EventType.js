// General
import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux Form
import { Field, reduxForm, formValueSelector, change } from "redux-form";

// Redux
import { connect } from "react-redux";

// Helpers
import validate from "./validate";

// Translation
import { injectIntl, FormattedMessage } from "react-intl";

// Locale
import messages from "../../locale/messages";

// Style
import withStyles from "isomorphic-style-loader/lib/withStyles";
import cx from "classnames";
import {
  Grid,
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Checkbox,
  Radio,
} from "react-bootstrap";
import s from "./ListRetreat.css";

// Component

import submit from "./submit";

class EventType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventTypes: ["Retreat", "Teacher Training"],
      eventType: ''
    };

    this.setInitData();
  }

  static getDerivedStateFromProps(props, state) {
    const { formData } = props;
    if (formData.values && formData.values.eventType) {
      return {
        eventType: formData.values.eventType
      }
    } else {
      return null;
    }
  }

  async setInitData() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'eventType', "Retreat"));
  }

  renderFormControlRadioButton = ({
    input: { value, onChange },
    id,
    label,
    checked,
    meta: { touched, error },
    children,
    className,
  }) => {
    const { formatMessage } = this.props.intl;
    const { change } = this.props;
    return (
      <Radio
        id={id}
        name="eventType"
        inline
        onChange={(e) => {
          onChange(id);
          change("category", null);
        }}
        checked={checked}
      >
        {label}
      </Radio>
    );
  };

  async onFocus() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
    await dispatch(change('RetreatForm', 'tipForm', 'EventType'));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  render() {
    const { handleSubmit } = this.props;
    const { eventTypes, eventType } = this.state;

    return (
      <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.eventType} />
              </h3>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  {eventTypes.map((each, index) => (
                    <Field
                      id={each}
                      key={index}
                      name="eventType"
                      component={this.renderFormControlRadioButton}
                      label={each}
                      checked = {eventType == each}
                    />
                  ))}
                </FormGroup>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

EventType = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit,
})(EventType);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  formData: state.form.RetreatForm,
});

const mapDispatch = {
  change,
};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(EventType))
);
