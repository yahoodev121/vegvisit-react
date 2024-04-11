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
  FormControl,
  Checkbox
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Component
import AccommodationItem from "./AccommodationItem";

import submit from './submit';

class Accommodation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accommodations: []
    };
  }

  componentDidMount() {
    console.log('accommodation-component-did-mount');
    const { formData, dispatch } = this.props;
    if (formData.values && formData.values.accommodations) {

    } else {
      this.addAccommodationItem()
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { formData } = props;
    if (formData.values && formData.values.accommodations) {
      return {
        accommodations: formData.values.accommodations
      }
    } else {
      return null;
    }
  }

  async addAccommodationItem() {
    let {accommodations} = this.state;
    const { formData, dispatch } = this.props;

    let formAccommodations = [];
    if (formData && formData.values && formData.values.accommodations) {
      formAccommodations = formData.values.accommodations;
    }

    formAccommodations.push({
      type: '',
      price: '',
      seasonal_pricing: [],
      deposit_percent: '',
      description: '',
      photos: []
    })

    accommodations.push('');
    this.setState({accommodations});
    await dispatch(change('RetreatForm', 'accommodations', formAccommodations));
  }

  render() {
    const { handleSubmit } = this.props;
    const { accommodations } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>Accommodations</h3>

              {
                accommodations.map((item, index) => (
                    <AccommodationItem key={index} index={index} data={item}/>
                ))
              }

              <Button bsStyle="link" className={s.btnAdd} onClick={() => {this.addAccommodationItem()}}>+ Add another accommodation option</Button>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Accommodation = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Accommodation);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Accommodation)));
