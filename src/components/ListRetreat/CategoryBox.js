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
import Category from './Category';

class CategoryBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    const { formData, dispatch } = this.props;

    if (formData.values && formData.values.category_0) {

    } else {
      this.addCategoryItem()
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { formData } = props;
    if (formData.values && formData.values.categories) {
      return {
        categories: formData.values.categories
      }
    } else {
      return null;
    }
  }

  async addCategoryItem() {
    const { formData, dispatch } = this.props;
    let formCategories = [];
    if (formData && formData.values && formData.values.categories) {
      formCategories = formData.values.categories;
    }

    formCategories.push({
      category: '',
      subCategory: '',
    })

    this.setState({categories: formCategories});
    await dispatch(change('RetreatForm', 'categories', formCategories));
  }

  render() {
    const { handleSubmit, formData } = this.props;
    const { categories } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <h3 className={s.landingContentTitle}>Categories</h3>

            {
              categories.map((item, index) => (
                <Category key={'category-' + index} index={index} />
              ))
            }

            <Button bsStyle="link" className={s.btnAdd} onClick={() => {this.addCategoryItem()}}>+ Add Category</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

CategoryBox = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit,
})(CategoryBox);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
});

const mapDispatch = {};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(CategoryBox))
);
