// General
import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux Form
import {change, Field, reduxForm} from "redux-form";

// Redux
import { connect } from "react-redux";

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
  FormControl, Radio,
} from 'react-bootstrap';
import s from "./ListRetreat.css";

// Helpers
import submit from "./submit";
import validate from "./validate";

class Reviews extends Component {
  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
  };

  constructor(props) {
    super(props);

    const { valid } = props;
    this.state = {
      isDisabled: !valid,
      limit: 700,
      remain: 0,
      readOnly: false,
      showType: 1,
      showTypes: [{
        id: 1,
        name: 'Show Benefits'
      }, {
        id: 2,
        name: 'Show Reviews'
      }]
    };

    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill');
      this.Quill = require('quill');
    }
    this.quillRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    const { valid, formData, dispatch } = props;
    if (formData.values && !formData.values.showType) {
      dispatch(change('RetreatForm', 'showType', 1));
    }

    let data = {};

    if (formData.values && formData.values.showType) {
      data = {showType: formData.values.showType};
    }

    if (!valid !== state.isDisabled) {
      return { ...data, isDisabled: !valid };
    } else {
      return null;
    }
  }

  checkCharacterCount = (event) => {
    let editor = this.quillRef.current.getEditor();
    const {limit} = this.state;
    if (editor) {
      if (editor.getText().replace(/\n/g, '').length > limit && event.key !== 'Backspace') {
        event.preventDefault();
      }
    }
  }

  renderFormControlTextArea = ({
    input,
    label,
    meta: { touched, error },
    children,
    className,
  }) => {
    const ReactQuill = this.ReactQuill;
    const Quill = this.Quill;
    const { formatMessage } = this.props.intl;
    const {readOnly} = this.state;

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
          <span className={s.errorMessage}>{error}</span>
        )}
        <ReactQuill
          ref={this.quillRef}
          {...input}
          onChange={(newValue, delta, source) => {
            if (source === 'user') {
              input.onChange(newValue);
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
          readOnly={readOnly}
          theme="snow"
        />
      </div>
    );
  };

  renderFormControlRadioButton = ({
    input: { value, onChange },
    id,
    label,
    checked,
    meta: { touched, error },
    children,
    className,
  }) => {
    return (
      <Radio
        id={id}
        name="showType"
        inline
        onChange={(e) => {
          onChange(id);
        }}
        checked={checked}
      >
        {label}
      </Radio>
    );
  };

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      dispatch,
      nextPage,
      previousPage,
      formData,
    } = this.props;
    const { formatMessage } = this.props.intl;
    const { showTypes, showType } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.reviews} />
              </h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={s.formGroup}>
                    <Field
                      name="reviews"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    />
                  </FormGroup>
                </div>
              </form>
            </div>
          </Col>
        </Row>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  {showTypes.map((each, index) => (
                    <Field
                      id={each.id}
                      key={index}
                      name="showType"
                      component={this.renderFormControlRadioButton}
                      label={each.name}
                      checked = {formData.values && formData.values.showType == each.id}
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

Reviews = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validate,
  onSubmit: submit,
})(Reviews);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
  formData: state.form.RetreatForm,
});

const mapDispatch = {};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(Reviews))
);
