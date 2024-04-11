// General
import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux Form
import {Field, reduxForm, formValueSelector, change} from "redux-form";

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
} from "react-bootstrap";
import s from "./ListRetreat.css";

// Component

import submit from "./submit";

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      category: null,
      eventType: "Retreat",
    };
  }

  renderFormControlCheckbox = ({
    input: { value, onChange },
    id,
    label,
    checked,
    meta: { touched, error },
    children,
    className,
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <Col xs={12} md={3}>
        <Checkbox
          id={id}
          inline
          onChange={(e) => {
            let newValue;
            if (!value) newValue = [id];
            else
              newValue = [...value, id].filter((value, index, self) => {
                return self.indexOf(value) === index;
              });
            if (!e.target.checked)
              newValue = newValue.filter((each) => each !== id);
            onChange(newValue);
          }}
          checked={checked}
        >
          {label}
        </Checkbox>
      </Col>
    );
  };

  renderFormControlSelect = ({
    input,
    label,
    meta: { touched, error },
    children,
    className,
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <FormControl componentClass="select" {...input} className={className}>
          {children}
        </FormControl>
      </div>
    );
  };

  static getDerivedStateFromProps(props, state) {
    const { categories, formData } = props;

    if (
      categories &&
      categories.length > 0 &&
      formData &&
      formData.values &&
      formData.values.eventType
    ) {
      return {
        categories,
        eventType: formData.values.eventType,
        category: formData.values.category,
      };
    } else {
      return null;
    }
  }

  async onFocus() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', true));
    await dispatch(change('RetreatForm', 'tipForm', 'Category'));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  async handleCategoryChange(name, value) {
    const { formData, index, dispatch } = this.props;
    let formCategories = formData.values.categories;
    let data = formCategories[index];
    data = {
      ...data,
      [name]: value
    }
    formCategories[index] = data;
    await dispatch(change('RetreatForm', 'categories', formCategories));
  }

  async handleInputChange(event, name) {
    console.log('handle-input-change:', event);
    let input = null;
    if (event.target) {
      input = event.target.value;
    } else {
      input = event;
    }
    await this.handleCategoryChange(name, input);
  }

  render() {
    const { handleSubmit, formData, index } = this.props;
    const { categories, eventType, category } = this.state;

    return (
      <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.searchCategory} />
              </h3>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Field
                    name={`category_${index}`}
                    component={this.renderFormControlSelect}
                    className={cx(s.formControlSelect, s.jumboSelect)}
                    onChange={async (e) => {await this.handleInputChange(e, "category")}}
                  >
                    <option value="0">Choose one</option>
                    {categories
                      .filter(
                        (category) =>
                          category.parentId === 0 &&
                          category.eventType === formData.values.eventType
                      )
                      .map((value, key) => {
                        return (
                          <option value={value.id} key={key}>
                            {value.name}
                          </option>
                        );
                      })}
                  </Field>
                  {
                    Number(formData.values['category_' + index]) !== 0 && (
                      <Grid>
                        <Row className="show-grid">
                          {categories
                            .filter(
                              (each) =>
                                formData.values['category_' + index] &&
                                each.parentId === Number(formData.values['category_' + index])
                            )
                            .map((subCategory) => (
                              <Field
                                key={subCategory.id}
                                id={subCategory.id}
                                name={`subCategory_${index}`}
                                component={this.renderFormControlCheckbox}
                                label={subCategory.name}
                                onChange={async (e) => {await this.handleInputChange(e, "subCategory")}}
                                checked={formData.values['subCategory_' + index] && Object.values(formData.values['subCategory_' + index]).includes(subCategory.id)}
                              />
                            ))}
                        </Row>
                      </Grid>
                    )
                  }
                </FormGroup>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Category = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit,
})(Category);

const mapState = (state) => ({
  categories: state.category.categories,
  formData: state.form.RetreatForm,
});

const mapDispatch = {};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(Category))
);
