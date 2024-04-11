// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, reset } from 'redux-form';
import validate from './validate';

// Translation
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import messages from '../../../../locale/messages';

// Redux
import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ImportReviewsForm.css';

import {
  Button,
  FormGroup,
  Col,
  Row,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import Loader from '../../../Loader/Loader';

import { graphql, gql, compose } from 'react-apollo';

import { closeImportReviewsModal } from '../../../../actions/ImportReviews/modalActions';
import { getListingSteps } from '../../../../actions/getListingSteps';

import log from '../../../../helpers/clientLog';

class ImportReviewsForm extends Component {
  static propTypes = {
    listId: PropTypes.number.isRequired,
    importUrl: PropTypes.string,
    actionType: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isDisabled: true,
      isImporting: false
    };
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const { valid, importUrl, initialize } = this.props;

    if (valid) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }

    if (importUrl) {
      initialize({ url: importUrl });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { valid } = props;
    if (valid && state.isDisabled) {
      return {isDisabled: false};
    } else if (!valid && !state.isDisabled) {
      return {isDisabled: true};
    } else {
      return null;
    }
  }

  renderFormControl = ({
    input,
    label,
    type,
    meta: { touched, error },
    className,
    placeholder,
    readonly
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cx(s.formGroup, 'row')}>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          <label className={s.labelText}>{label}</label>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          {touched && error && (
            <span className={s.errorMessage}>{formatMessage(error)}</span>
          )}
          <FormControl
            {...input}
            placeholder={placeholder}
            type={type}
            className={className}
            readOnly={readonly}
          />
        </Col>
      </FormGroup>
    );
  };

  async submitForm(values, dispatch) {
    const { mutate, listId, closeImportReviewsModal, actionType } = this.props;
    const { formatMessage } = this.props.intl;

    try {
      this.setState({
        isImporting: true
      });
      // validation of the url is already done, here we can concentrate on unifying the url
      let a = document.createElement('a');
      a.href = values.url;
      a.search = '';
      a.pathname = a.pathname.match(/\/rooms\/[0-9]+/)[0] + '/reviews';
  
      const { data } = await mutate({
        variables: {
          url: a.href,
          listId,
          actionType
        },
      });
      this.setState({
        isImporting: false
      });
      if (data && data.importReviews && data.importReviews.status == '201') {
        // make sure information about imported reviews is updated in our store 
        dispatch(getListingSteps(listId));
        dispatch(reset('ImportReviewsForm'));
        dispatch(closeImportReviewsModal);
        toastr.success(
          formatMessage(messages.importReviews),
          formatMessage(messages.importReviewsSuccess, {count: data.importReviews.count})
        );
      } else if (data && data.importReviews && data.importReviews.status == '200' && data.importReviews.count == 0) {
        toastr.warning(formatMessage(messages.importReviews), formatMessage(messages.importReviewsNoReviews));
      } else {
        toastr.error(formatMessage(messages.importReviews), formatMessage(messages.importReviewsError));
        log.error(`components.ListPlaceStep1.ImportReviews.ImportReviewsForm.ImportReviewsForm.submitForm: The result of the mutation was: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      this.setState({
        isImporting: false
      });
      toastr.error(formatMessage(messages.importReviews), formatMessage(messages.importReviewsError2));
      log.error(`components.ListPlaceStep1.ImportReviews.ImportReviewsForm.ImportReviewsForm.submitForm: An error occurred when trying to import reviews from url ${values.url}. Message: ${error.message}. Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    }
  }

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      dispatch,
      initialValues,
      listId,
      importUrl,
      actionType
    } = this.props;
    const { formatMessage } = this.props.intl;
    const { isDisabled, isImporting } = this.state;
    const urlIsReadonly = actionType === 'update' ? true : false;

    return (
      <div className={'inputFocusColor'}>
        <form onSubmit={handleSubmit(this.submitForm)}>
          {error && <strong>{formatMessage(error)}</strong>}

          <Field
            name="url"
            type="text"
            component={this.renderFormControl}
            label={importUrl ? formatMessage(messages.refreshAirbnbReviewsLabel) : formatMessage(messages.importAirbnbReviewsLabel)}
            placeholder={formatMessage(messages.importAirbnbReviewsPlaceholder)}
            className={cx(s.formControlInput, s.space1, s.commonBorder)}
            readonly={urlIsReadonly}
          />
          <div className={cx(s.labelText, s.space2)}>
            <FormattedMessage {...messages.importReviewsDuration} />
          </div>
          <div className={cx(s.labelText, s.space3)}>
            <FormattedMessage {...messages.importReviewsRetry} />
          </div>

          <FormGroup className={s.formGroup}>
            <Loader
                type={"button"}
                buttonType={"submit"}
                className={cx(s.button, s.btnSuccess)}
                disabled={isDisabled}
                show={isImporting}
                label={importUrl ? formatMessage(messages.refresh) : formatMessage(messages.save)}
            />
          </FormGroup>
        </form>
      </div>
    );
  }
}

ImportReviewsForm = reduxForm({
  form: 'ImportReviewsForm', // a unique name for this form
  validate,
})(ImportReviewsForm);

const mapState = (state) => ({
  profileId: state.account.data.profileId,
});

const mapDispatch = {
  closeImportReviewsModal,
};

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(gql`
    mutation importReviews($url: String!, $listId: Int!, $actionType: String!) {
      importReviews(url: $url, listId: $listId, actionType: $actionType) {
        status
        count
      }
    }
  `)
)(ImportReviewsForm);
