// General
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

// Redux Form
import { Field, reduxForm, formValueSelector } from "redux-form";

// Translation
import { injectIntl, FormattedMessage } from "react-intl";

// Locale
import messages from "../../locale/messages";

// Helpers
import validate from "./validate";

// Redux
import { connect } from "react-redux";

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
  FormControl, Checkbox,
} from 'react-bootstrap';
import s from "./ListRetreat.css";

import submit from "./submit";

class RetreatStyle extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { listingFields, valid } = props;
    if (listingFields != undefined) {
      this.state = {
        isDisabled: !valid,
        retreatStyle: listingFields.retreatStyle,
        selected: [],
      };
    } else {
      this.state = {
        isDisabled: !valid,
        retreatStyle: [],
        selected: [],
      };
    }
  }

  componentDidMount() {
    const { valid } = this.props;

    if (valid) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { valid, listingFields, formData } = props;

    let data = {};

    if (formData.values && formData.values.RetreatStyle) {
      console.log('Retreat-style-values:', formData.values.RetreatStyle);
      data = {
        selected: formData.values.RetreatStyle
      }
    }

    if (
      listingFields != undefined &&
      !_.isEqual(listingFields.retreatStyle, state.retreatStyle)
    ) {
      return {
        ...data,
        isDisabled: !valid,
        retreatStyle: listingFields.retreatStyle,
      };
    } else {
      return {
        ...data
      };
    }
  }

  renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <Col xs={12} md={3}>
        <Checkbox id={id} inline onChange={e => {
          let newValue;
          if (!value) newValue = [id];
          else newValue = ([...value, id].filter((value, index, self) => {
            return self.indexOf(value) === index;
          }))
          if (!e.target.checked) newValue = newValue.filter(each => each !== id)
          onChange(newValue)
        }} checked={checked}>{label}</Checkbox>
      </Col>
    )
  }

  render() {
    const { error, handleSubmit, existingList } = this.props;
    const { retreatStyle, selected } = this.state;

    return (
      <Grid fluid>
        <Row className={cx(s.landingContainer)}>
          <Col xs={12}>
            <div>
              <p>{JSON.stringify(error)}</p>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.retreatStyle} />
              </h3>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Grid fluid>
                    <Row className="show-grid">
                      {
                        retreatStyle.map((each, index) => (
                          <Field id={each.id} key={index} name="RetreatStyle" component={this.renderFormControlCheckbox} label={each.itemName} checked={selected.includes(each.id)}/>
                        ))
                      }
                    </Row>
                  </Grid>
                </FormGroup>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

RetreatStyle = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit,
})(RetreatStyle);

const mapState = (state) => ({
  existingList: state.location.isExistingList,
  listingFields: state.listingFields.data,
  formData: state.form.RetreatForm,
});

const mapDispatch = {};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(RetreatStyle))
);
