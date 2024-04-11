// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import {Field, reduxForm, formValueSelector, change} from 'redux-form';

// Redux
import { connect } from 'react-redux';

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
  FormControl
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Internal Component
import PhotosUpload from '../PhotosUpload';

import submit from './submit';

class Photos extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
    photosCount: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { photosCount } = props;
    if (photosCount > 0) {
      this.state = {
        isAvailable: true
      };
    } else {
      this.state = {
        isAvailable: false
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { photosCount } = props;

    if (photosCount > 0 && !state.isAvailable) {
      return { isAvailable: true };
    } else if (!photosCount && state.isAvailable) {
      return { isAvailable: false };
    } else {
      return null;
    }
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
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { isAvailable } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <Grid fluid>
        <Row className={s.landingContainer}>
          <Col xs={12}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.photos} /></h3>
              <p>
                Require a bare minimum of 10 retreat photos and 5 food photos (not including pictures of individual accommodations above)<br/>
                Upload photos and videos and drag and drop to set photos for the home listing page<br/>
                Instagram URL (not to be displayed, but to be featured)
              </p>
              <form>
                <div className={s.landingMainContent}>
                  <FormGroup className={s.formGroup}>
                    <PhotosUpload field={'photos'} placeholder={formatMessage(messages.photosPlaceholder)} />
                  </FormGroup>
                </div>
              </form>
            </div>
          </Col>
          <Col xs={12} onMouseEnter={() => {this.onFocus('MediaInstaUrl')}} onMouseLeave={() => this.onBlur()}>
            <div>
              <h4>Instagram URL(Optional)</h4>
              <FormGroup>
                <Field type="text"
                       name="instagram_url"
                       component={this.renderFormInput}
                       className={cx(s.formControlInput)}
                />
              </FormGroup>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Photos = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  onSubmit: submit
})(Photos);

const mapState = (state) => ({
  photosCount: state.location.photosCount
});
const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Photos)));







