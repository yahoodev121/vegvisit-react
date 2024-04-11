// General
import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux Form
import { Field, reduxForm } from "redux-form";

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

class RetreatMenu extends Component {
  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
  };

  constructor(props) {
    super(props);

    const { valid } = props;
    this.state = {
      isDisabled: !valid,
    };

    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill');
    }
    this.quillRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    const { valid } = props;
    if (!valid !== state.isDisabled) {
      return { isDisabled: !valid };
    } else {
      return null;
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
          theme="snow"
        />
      </div>
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
    } = this.props;
    const { formatMessage } = this.props.intl;
    const { isDisabled } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.retreatMenu} />
              </h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormGroup className={s.formGroup}>
                    <Field
                      name="retreat_menu"
                      component={this.renderFormControlTextArea}
                      className={s.newInput}
                    />
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

RetreatMenu = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validate,
  onSubmit: submit,
})(RetreatMenu);

const mapState = (state) => ({
  listingFields: state.listingFields.data,
});

const mapDispatch = {};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(RetreatMenu))
);
