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
  Checkbox, Radio
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Component
import AccommodationPhotos from "./AccommodationPhotos";

import submit from './submit';

class AccommodationItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: ["Private Room", "Shared Room", "Entire Space"]
    };

    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill');
    }
    this.quillRef = React.createRef();
  }

  componentDidMount() {
    const {data, index, dispatch} = this.props;
    console.log('accommodation-item-mount:', data);
    if (data.type) {
      dispatch(change('RetreatForm', `accommodation_type_${index}`, data.type));
    }

    if (data.price) {
      dispatch(change('RetreatForm', `accommo_price_${index}`, data.price));
    }

    if (data.deposit_percent) {
      dispatch(change('RetreatForm', `accommo_percent_${index}`, data.deposit_percent));
    }

    if (data.description) {
      dispatch(change('RetreatForm', `accommo_description_${index}`, data.description));
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { listingFields } = props;
    console.log('accommodation-derived-state:', listingFields);
    if (listingFields && listingFields.roomType && listingFields.roomType.length > 0) {
      let types = listingFields.roomType.filter(item => item.isEnable == 1)
      return {
        types
      }
    }
    return null;
  }

  async handleAccommodationChange(name, value) {
    const { formData, index, dispatch } = this.props;
    let formAccommodations = formData.values.accommodations;
    let data = formAccommodations[index];
    data = {
      ...data,
      [name]: value + ''
    }
    formAccommodations[index] = data;
    await dispatch(change('RetreatForm', 'accommodations', formAccommodations));
  }

  renderFormInput = ({ input, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} type={type} className={className} />
      </div>
    )
  }

  async handleInputChange(event, name) {
    let input = event.target.value;
    await this.handleAccommodationChange(name, input);
  }

  renderFormControlTextArea = ({
                                 input,
                                 label,
                                 meta: { touched, error },
                                 children,
                                 className,
                               }) => {
    const ReactQuill = this.ReactQuill;
    const { formatMessage } = this.props.intl;

    let modules = {
      toolbar: {
        container: [
          [{ 'header': '1' }, { 'header': '2' }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
          ['link'],
          ['image'],
        ],
        handlers: {
          'image': this.imageHandler
        }
      },
      clipboard: {
        matchVisual: false,
      }
    };

    let formats = [
      'header', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link',
      'image'
    ];

    return (
      <div>
        {touched && error && (
          <span className={s.errorMessage}>{formatMessage(error)}</span>
        )}
        <ReactQuill
          ref={(el) => this.quillRef = el}
          {...input}
          onChange={async (newValue, delta, source) => {
            if (source === 'user') {
              input.onChange(newValue);
              await this.handleAccommodationChange('description', newValue);
            }
          }}
          onBlur={(range, source, quill) => {
            if (quill.getHTML() == '<p><br></p>') {
              input.onBlur('');
            }
            else {
              input.onBlur(quill.getHTML());
            }
          }}
          placeholder={label}
          modules={modules}
          formats={formats}
          theme="snow"
        />
      </div>
    );
  };

  async onFocus(name) {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', true));
    await dispatch(change('RetreatForm', 'tipForm', name));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  render() {
    const { index, data } = this.props;
    const { types } = this.state;

    return (
      <Grid fluid>
        <Row className={s.accommodationContainer}>

          <Col className={s.space3} xs={12}>
            <h4 className={s.landingContentTitle}>Accommodation option #{index + 1}</h4>
          </Col>

          <Col xs={12} onMouseEnter={() => {this.onFocus('AccommodationType')}} onMouseLeave={() => this.onBlur()}>
            <h4 className={s.landingContentTitle}>Type</h4>

            <FormGroup>
              {types.map((each, ii) => (
                <Radio
                  key={ii}
                  id={each.id}
                  name={'accommodation_type_' + index}
                  inline
                  onChange={async (e) => {
                    if (e.target.checked) {
                      await this.handleAccommodationChange('type', each.id)
                    }
                  }}
                  checked={data && data.type == each.id}
                >
                  {each.itemName}
                </Radio>
              ))}
            </FormGroup>
          </Col>

          <Col xs={12} onMouseEnter={() => {this.onFocus('AccommodationFullPrice')}} onMouseLeave={() => this.onBlur()}>
            <h4 className={s.landingContentTitle}>Full Price</h4>

            <FormGroup>
              <Field type="number"
                     name={'accommo_price_' + index}
                     component={this.renderFormInput}
                     className={cx(s.formControlInput, s.jumboInput)}
                     onChange={async (e) => {await this.handleInputChange(e, "price")}}
              />
            </FormGroup>
          </Col>

          <Col xs={12}>
            <h4 className={s.landingContentTitle}>Deposit Percentage</h4>
            <p>Cannot set deposit for less than 15% (our service fee)</p>

            <FormGroup>
              <Field type="number"
                     name={'accommo_percent_' + index}
                     component={this.renderFormInput}
                     className={cx(s.formControlInput, s.jumboInput)}
                     onChange={async (e) => {await this.handleInputChange(e, "deposit_percent")}}
              />
            </FormGroup>
          </Col>

          <Col xs={12} onMouseEnter={() => {this.onFocus('AccommodationDescription')}} onMouseLeave={() => this.onBlur()}>
            <h4 className={s.landingContentTitle}>About this accommodation</h4>
            <p>Describes everything about this room and what features it offers for guests</p>

            <FormGroup>
              <Field
                name={'accommo_description_' + index}
                component={this.renderFormControlTextArea}
                className={s.newInput}
              />
            </FormGroup>
          </Col>

          <AccommodationPhotos index={index} />
        </Row>
      </Grid>
    );
  }
}

AccommodationItem = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(AccommodationItem);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
  listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(AccommodationItem)));
