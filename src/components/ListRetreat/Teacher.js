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
import TeacherItem from "./TeacherItem";

import submit from './submit';

class Teacher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teachers: []
    };
  }

  componentDidMount() {
    const { formData, dispatch } = this.props;
    if (formData.values && formData.values.teachers) {

    } else {
      this.addTeacherItem()
    }
  }


  static getDerivedStateFromProps(props, state) {
    const { formData } = props;
    if (formData.values && formData.values.teachers) {
      return {
        teachers: formData.values.teachers
      }
    } else {
      return null;
    }
  }

  async addTeacherItem() {
    const { formData, dispatch } = this.props;

    let formTeachers = [];
    if (formData && formData.values && formData.values.teachers) {
      formTeachers = formData.values.teachers;
    }

    formTeachers.push({
      name: '',
      email: '',
      is_yoga_alliance: false,
      about: '',
      photos: [],
      location: {
        country: '',
        street: '',
        buildingName: '',
        city: '',
        state: '',
        zipCode: ''
      }
    })

    this.setState({teachers: formTeachers});
    await dispatch(change('RetreatForm', 'teachers', formTeachers));
  }

  render() {
    const { handleSubmit } = this.props;
    const { teachers } = this.state;

    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}>Teachers</h3>

              {
                teachers.map((item, index) => (
                    <TeacherItem key={'teacher-' + index} index={index} data={item}/>
                ))
              }

              <Button bsStyle="link" className={s.btnAdd} onClick={() => {this.addTeacherItem()}}>+ Add New Teacher</Button>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Teacher = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(Teacher);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Teacher)));
