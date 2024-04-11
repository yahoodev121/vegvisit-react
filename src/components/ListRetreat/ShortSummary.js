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
  FormControl,
} from "react-bootstrap";
import s from "./ListRetreat.css";

// Helpers
import submit from "./submit";
import validate from "./validate";


const minLength = value =>
  value && value.length < 100 ? `Must have at least 100 characters` : undefined

class ShortSummary extends Component {
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
    };

    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill');
      this.Quill = require('quill');
    }
    this.quillRef = React.createRef();
  }

  componentDidMount() {
    if (this.quillRef.current) {
      console.log('short-summary-quill-ref:', this.quillRef.current.getEditor()); // Access the Quill instance
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { valid } = props;
    if (!valid !== state.isDisabled) {
      return { isDisabled: !valid };
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
              console.log('short-summary-change:', newValue);
              let realStr = newValue.replace(/<[^>]*>/g, '');
              let remains = 700 - realStr.length;
              if (remains >= 0) {
                input.onChange(newValue);
                this.setState({remain: 700 - realStr.length});
              }
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
          onKeyDown={this.checkCharacterCount}
          placeholder={label}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          theme="snow"
        />
      </div>
    );
  };

  async onFocus() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', true));
    await dispatch(change('RetreatForm', 'tipForm', 'ShortSummary'));
  }

  async onBlur() {
    const {dispatch} = this.props;
    await dispatch(change('RetreatForm', 'showTip', false));
  }

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      dispatch,
      nextPage,
      previousPage,
    } = this.props;
    const { formatMessage } = this.props.intl;
    const { isDisabled, limit, remain } = this.state;

    return (
      <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.shortSummary} />
              </h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={s.formGroup}>
                    <Field
                      name="summary"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                      validate={minLength}
                    />
                    <div>
                      Limit: {limit}, Remain: {remain}
                    </div>
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

ShortSummary = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validate,
  onSubmit: submit,
})(ShortSummary);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
});

const mapDispatch = {};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(ShortSummary))
);
