// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

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
  FormControl,
  Checkbox
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Component

import submit from './submit';

class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foods: [],
      selected: [],
    };
  }

  renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <Checkbox id={id} inline onChange={e => {
        let newValue;
        if (!value) newValue = [id];
        else newValue = ([...value, id].filter((value, index, self) => {
          return self.indexOf(value) === index;
        }))
        if (!e.target.checked) newValue = newValue.filter(each => each !== id)
        onChange(newValue)
      }} className={s.retreatCheckbox} checked={checked}>{label}</Checkbox>
    )
  }

  static getDerivedStateFromProps(props, state) {
    const { listingFields, formData } = props;

    let data = {};
    if (formData.values && formData.values.food) {
      data = {
        selected: formData.values.food
      };
    }

    if (listingFields && listingFields.retreatFood && listingFields.retreatFood.length > 0) {
      let foods = listingFields.retreatFood;
      let names = foods.map(item=>item.itemName);
      names.sort();
      let results = [];
      for (let i = 0; i < names.length; i ++) {
        for (let j = 0; j < foods.length; j ++) {
          if (names[i] === foods[j].itemName) {
            results.push(foods[j]);
            break;
          }
        }
      }
      return { ...data, foods: results };
    } else {
      return { ...data };
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const { foods, selected } = this.state;

    return (
        <Grid fluid>
          <Row className={s.landingContainer}>
            <Col xs={12}>
              <div>
                <h3 className={s.landingContentTitle}>Food Type</h3>
                <p>
                  <span>Please note that all retreats must be vegan or vegetarian -  free from all animal meat including animals that live in the sea</span>
                </p>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    {
                      foods.map((each, index) => (
                        <Field id={each.id} key={index} name="food" component={this.renderFormControlCheckbox} label={each.itemName} checked={selected.includes(each.id)}/>
                      ))
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

Food = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Food);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Food)));
