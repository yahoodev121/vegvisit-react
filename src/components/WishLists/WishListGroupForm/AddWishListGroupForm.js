// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';


// Redux Form
import { Field, reduxForm, reset } from 'redux-form';
import validate from './validate';

// Translation
import { injectIntl } from 'react-intl';
import messages from '../../../locale/messages';

// Redux
import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './WishListGroupForm.css';
import {
  Button,
  FormGroup,
  Col,
  Row,
  ControlLabel,
  FormControl } from 'react-bootstrap';

import { graphql, gql, compose } from 'react-apollo';

import { closeWishListGroupModal } from '../../../actions/WishList/modalActions';

// GraphQL
import getAllWishListGroupQuery from '../getAllWishListGroup.graphql';

class AddWishListGroupForm extends Component {

  static propTypes = {
    fieldType: PropTypes.string,
    formatMessage: PropTypes.any
  };

  constructor(props){
    super(props);

    const { fieldType } = this.props;
    this.state = {
      fieldType: fieldType != undefined ? fieldType : null,
      wishListLabel: null,
      wishListSuccessLabel: null,
      wishListErrorLabel: null,
      isDisabled: true
    }
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount(){
    const { valid } = this.props;
    
    if(valid){
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { fieldType, valid } = props;
    const { formatMessage } = props.intl;
    const { wishListLabel } = state;
    const returnObj = {};
    if (fieldType != undefined && fieldType !== state.fieldType) {
      returnObj.fieldType = fieldType;
    }
    if (wishListLabel == null) {
      Object.assign(returnObj, {
        wishListLabel: formatMessage(messages.wishList),
        wishListSuccessLabel: formatMessage(messages.wishListAdded),
        wishListErrorLabel: formatMessage(messages.somethingWentWrong),
      });
    }
    if (valid && state.isDisabled) {
      returnObj.isDisabled = false;
    } else if (!valid && !state.isDisabled) {
      returnObj.isDisabled = true;
    }
    if (Object.getOwnPropertyNames(returnObj).length > 0) {
      return returnObj;
    } else {
      return null;
    }
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className, placeholder }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cx(s.formGroup, 'row')}>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          <label className={s.labelText} >{label}</label>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
          <FormControl {...input} placeholder={placeholder} type={type} className={className} />
        </Col>
      </FormGroup>
    );
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cx(s.formGroup, 'row')}>
        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
          <label className={s.labelText} >{label}</label>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
          <div className={s.select}>
            <FormControl componentClass="select" {...input} className={className} >
              {children}
            </FormControl>
          </div>
        </Col>
      </FormGroup>
    )
  }

  async submitForm(values, dispatch) {
    const { mutate, profileId, closeWishListGroupModal } = this.props;
    const { wishListLabel, wishListSuccessLabel, wishListErrorLabel } = this.state;

    const { data } = await mutate({ 
      variables: values, 
      refetchQueries: [{
        query: getAllWishListGroupQuery,
        variables: {
          profileId
        }
      }]
    });
    if (data && data.CreateWishListGroup) {
      if (data.CreateWishListGroup.status === 'success') {
        dispatch(reset('AddWishListGroupForm'));
        dispatch(closeWishListGroupModal);
        toastr.success(wishListLabel, wishListSuccessLabel);
      } else {
        toastr.error(wishListLabel, wishListErrorLabel);
      }
    }
  }

  render () {
    const { error, handleSubmit, submitting, dispatch, initialValues } = this.props;
    const {formatMessage} = this.props.intl;
    const { fieldType, isDisabled } = this.state;
    
    return (
      <div className={'inputFocusColor'}>
      <form onSubmit={handleSubmit(this.submitForm)}>
        {error && <strong>{formatMessage(error)}</strong>}
        
        <Field
          name="name"
          type="text"
          component={this.renderFormControl}
          label={formatMessage(messages.name)}
          placeholder={formatMessage(messages.name)}
          className={cx(s.formControlInput, s.space1, s.commonBorder)}
          />

        {/* <Field
          name="isPublic"
          type="select"
          component={this.renderFormControlSelect}
          label={formatMessage(messages.privacySettings)}
          className={cx(s.formControlInput, s.space1)}
        >
          <option value="1">{formatMessage(messages.public)}</option>
          <option value="0">{formatMessage(messages.private)}</option>
        </Field>   */}

        <FormGroup className={s.formGroup}>
          <Button className={cx(s.button, s.btnSuccess)} bsSize="large" block type="submit" disabled={isDisabled}>
            {formatMessage(messages.save)}
          </Button>
        </FormGroup>
      </form>
      </div>
    )
  }

}

AddWishListGroupForm = reduxForm({
  form: "AddWishListGroupForm", // a unique name for this form
  validate,
})(AddWishListGroupForm);

const mapState = (state) => ({
  profileId: state.account.data.profileId
});

const mapDispatch = {
  closeWishListGroupModal
};

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(gql `
    mutation CreateWishListGroup(
      $name: String!,
      $isPublic: String,
    ){
        CreateWishListGroup(
          name: $name,
          isPublic: $isPublic
        ) {
            status
        }
    }
  `)
)(AddWishListGroupForm);
