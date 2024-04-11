// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

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
import PhotosUpload from "../PhotosUpload";

import submit from './submit';

class AccommodationPhotos extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { index } = this.props;

    return (
      <Col xs={12}>
        <div>
          <h3 className={s.landingContentTitle}>
            Add photos
          </h3>
          <p>
            Upload at least 5 photos of your accommodation
          </p>
          <form>
            <div className={s.landingMainContent}>
              <FormGroup className={s.formGroup}>
                <PhotosUpload listId={index} field={'accommodations'} placeholder={formatMessage(messages.photosPlaceholder)} />
              </FormGroup>
            </div>
          </form>
        </div>
      </Col>
    );
  }
}

AccommodationPhotos = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  onSubmit: submit
})(AccommodationPhotos);

const mapState = (state) => ({
  photosCount: state.location.photosCount
});
const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(AccommodationPhotos)));







