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
import TeacherLocation from "./TeacherLocation";
import TeacherPhoto from "./TeacherPhoto";

import submit from './submit';

class TeacherItem extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill');
    }
    this.quillRef = React.createRef();
  }

  componentDidMount() {
    const {index, data, dispatch} = this.props;
    if (data.name) {
      dispatch(change('RetreatForm', `teacher_name_${index}`, data.name));
    }

    if (data.email) {
      dispatch(change('RetreatForm', `teacher_email_${index}`, data.email));
    }

    if (data.about) {
      dispatch(change('RetreatForm', `teacher_about_${index}`, data.about));
    }

  }

  async handleTeacherChange(name, value) {
    const { formData, index, dispatch } = this.props;
    let formTeachers = formData.values.teachers;
    let data = formTeachers[index];
    data = {
      ...data,
      [name]: value
    }
    formTeachers[index] = data;
    await dispatch(change('RetreatForm', 'teachers', formTeachers));
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

  renderFormControlCheckbox = ({ input: { value, onChange }, label, meta: { touched, error }, children, className }) => {
    return (
        <Col xs={12} md={3}>
          <Checkbox inline onChange={e => {
            onChange(e.target.checked)
          }}>{label}</Checkbox>
        </Col>
    )
  }

  async handleInputChange(event, name) {
    let input = event.target.value;
    await this.handleTeacherChange(name, input);
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
              await this.handleTeacherChange('about', newValue);
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
    const { index } = this.props;

    return (
      <Grid fluid>
        <Row className={s.accommodationContainer}>

          <Col className={s.space3} xs={12}>
            <h4 className={s.landingContentTitle}>Teacher #{index + 1}</h4>
          </Col>


          <Col xs={12}>
            <h4 className={s.landingContentTitle}>Name</h4>

            <FormGroup>
              <Field type="text"
                     name={'teacher_name_' + index}
                     component={this.renderFormInput}
                     className={cx(s.formControlInput)}
                     onChange={async (e) => {await this.handleInputChange(e, "name")}}
              />
            </FormGroup>
          </Col>

          <Col xs={12}>
            <h4 className={s.landingContentTitle}>Email</h4>

            <FormGroup>
              <Field type="text"
                     name={'teacher_email_' + index}
                     component={this.renderFormInput}
                     className={cx(s.formControlInput)}
                     onChange={async (e) => {await this.handleInputChange(e, "email")}}
              />
            </FormGroup>
          </Col>

          <TeacherLocation index={index} />

          <Col xs={12}>
            <FormGroup>
              <Grid>
                <Row className="show-grid">
                  <Field name={`teachers.${index}.is_yoga_alliance`} component={this.renderFormControlCheckbox} label="Yoga Alliance Teacher" />
                </Row>
              </Grid>
            </FormGroup>
          </Col>

          <Col xs={12}>
            <h4 className={s.landingContentTitle}>About</h4>

            <FormGroup>
              <Field
                name={'teacher_about_' + index}
                component={this.renderFormControlTextArea}
                className={s.newInput}
              />
            </FormGroup>
          </Col>

          <TeacherPhoto index={index} />
        </Row>
      </Grid>
    );
  }
}

TeacherItem = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(TeacherItem);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(TeacherItem)));
